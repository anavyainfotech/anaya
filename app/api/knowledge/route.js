import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/gemini";

// GET: Fetch all crawled and manually added knowledge items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    const supabase = await createClient();

    let query = supabase
      .from("crawled_pages")
      .select("id, domain_id, url, title, markdown_content, char_count, created_at")
      .order("created_at", { ascending: false });

    if (domain) {
      // Find matching domain record
      const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      const { data: domRecord } = await supabase
        .from("domains")
        .select("id")
        .ilike("domain_name", `%${cleanDomain}%`)
        .maybeSingle();

      if (domRecord?.id) {
        query = query.eq("domain_id", domRecord.id);
      }
    }

    const { data: pages, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, pages: pages || [] });
  } catch (err) {
    console.error("Knowledge GET API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add new knowledge entity (Website crawl, File, FAQs, or raw Text)
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, domain, url, title, content, faqs, filename } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Locate or create domain record
    let cleanDomain = (domain || "custom-knowledge").replace(/^https?:\/\//i, "").replace(/\/$/, "");
    if (url) {
      try {
        const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
        cleanDomain = parsed.hostname;
      } catch (e) {
        // fallback
      }
    }

    let domainRecord = null;
    let query = supabase.from("domains").select("*").eq("domain_name", cleanDomain);
    if (user?.id) {
      query = query.eq("user_id", user.id);
    }
    const { data: existingDomain } = await query.maybeSingle();

    if (existingDomain) {
      domainRecord = existingDomain;
    } else {
      const insertPayload = {
        domain_name: cleanDomain,
        full_url: "https://" + cleanDomain,
        status: "crawled",
        pages_count: 1,
      };
      if (user?.id) insertPayload.user_id = user.id;

      const { data: newDom } = await supabase
        .from("domains")
        .insert(insertPayload)
        .select()
        .single();
      domainRecord = newDom;
    }

    // 2. Handle specific entity types
    let itemsToInsert = [];

    if (type === "website") {
      // Direct call to Crawl4AI service
      const targetUrl = url.trim();
      let crawlResult = null;
      try {
        const crawlResponse = await fetch("http://127.0.0.1:8001/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl, max_pages: 5 }),
        });
        if (crawlResponse.ok) {
          crawlResult = await crawlResponse.json();
        }
      } catch (crawlerErr) {
        console.warn("Crawler microservice fetch failed, creating manual indexed entry:", crawlerErr);
      }

      if (crawlResult && crawlResult.pages && crawlResult.pages.length > 0) {
        itemsToInsert = crawlResult.pages.map((p) => ({
          url: p.url,
          title: p.title || p.url,
          markdown_content: p.markdown || "",
          char_count: p.char_count || p.markdown?.length || 0,
        }));
      } else {
        // Fallback single website entry
        itemsToInsert = [{
          url: targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`,
          title: title || targetUrl,
          markdown_content: content || `Crawled data from ${targetUrl}`,
          char_count: (content || "").length,
        }];
      }
    } else if (type === "file") {
      const maxCharLimit = 50000; // ~10,000 words safety limit for AI embeddings
      const sanitizedContent = (content || "").slice(0, maxCharLimit);

      itemsToInsert = [{
        url: `file://${filename || "document.txt"}`,
        title: title || filename || "Uploaded Document",
        markdown_content: sanitizedContent,
        char_count: sanitizedContent.length,
      }];
    } else if (type === "faqs") {
      const formattedFaqContent = Array.isArray(faqs)
        ? faqs.map((f, i) => `### Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
        : content || "";

      itemsToInsert = [{
        url: `https://${cleanDomain}/faqs#${Date.now()}`,
        title: title || "Frequently Asked Questions",
        markdown_content: formattedFaqContent,
        char_count: formattedFaqContent.length,
      }];
    } else if (type === "text") {
      itemsToInsert = [{
        url: `https://${cleanDomain}/note#${Date.now()}`,
        title: title || "Custom Knowledge Note",
        markdown_content: content || "",
        char_count: (content || "").length,
      }];
    } else {
      return NextResponse.json({ error: "Invalid knowledge entity type" }, { status: 400 });
    }

    // 3. Generate Vector Embeddings and Insert into Supabase
    const insertedRecords = await Promise.all(
      itemsToInsert.map(async (item) => {
        let vector = null;
        try {
          const textToEmbed = `Title: ${item.title}\nURL: ${item.url}\nContent: ${item.markdown_content}`;
          vector = await generateEmbedding(textToEmbed);
        } catch (embedErr) {
          console.error("Vector generation failed:", embedErr);
        }

        const payload = {
          domain_id: domainRecord?.id,
          url: item.url,
          title: item.title,
          markdown_content: item.markdown_content,
          char_count: item.char_count,
        };

        // If embedding vector column is supported
        if (vector) {
          payload.embedding = vector;
        }

        const { data: savedRecord, error: saveErr } = await supabase
          .from("crawled_pages")
          .insert(payload)
          .select()
          .single();

        if (saveErr) {
          console.error("Page insert error:", saveErr);
          // Return payload with local id fallback
          return { ...payload, id: `kb-${Date.now()}` };
        }
        return savedRecord;
      })
    );

    return NextResponse.json({
      success: true,
      count: insertedRecords.length,
      records: insertedRecords,
    });
  } catch (error) {
    console.error("Knowledge POST API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove specific knowledge item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("crawled_pages")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("Knowledge DELETE API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
