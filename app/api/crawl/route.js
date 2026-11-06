import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { domain } = await request.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Call Crawl4AI local microservice
    const crawlResponse = await fetch("http://127.0.0.1:8001/crawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: domain, max_pages: 5 }),
    });

    if (!crawlResponse.ok) {
      const err = await crawlResponse.text();
      return NextResponse.json({ error: "Crawler service failed: " + err }, { status: 500 });
    }

    const crawlData = await crawlResponse.json();

    // 1. Check if domain already exists for this user (or globally)
    let domainRecord = null;
    let query = supabase.from("domains").select("*").eq("domain_name", crawlData.domain);
    if (user?.id) {
      query = query.eq("user_id", user.id);
    }
    const { data: existingDomain } = await query.maybeSingle();

    if (existingDomain) {
      // Update existing domain record
      domainRecord = existingDomain;
      await supabase
        .from("domains")
        .update({
          pages_count: crawlData.total_crawled,
          status: "crawled",
          created_at: new Date().toISOString(),
        })
        .eq("id", existingDomain.id);
      
      // Delete old crawled pages for this domain to avoid duplicate copies
      await supabase
        .from("crawled_pages")
        .delete()
        .eq("domain_id", existingDomain.id);
    } else {
      // Insert new domain record
      let insertPayload = {
        domain_name: crawlData.domain,
        full_url: "https://" + crawlData.domain,
        status: "crawled",
        pages_count: crawlData.total_crawled,
      };

      if (user?.id) {
        insertPayload.user_id = user.id;
      }

      const { data: newDomain, error: domSaveErr } = await supabase
        .from("domains")
        .insert(insertPayload)
        .select()
        .single();

      if (domSaveErr) {
        console.error("Failed to save domain in Supabase:", domSaveErr);
      }
      domainRecord = newDomain;
    }

    // 2. Insert clean crawled pages with Real Gemini Vector Embeddings
    if (domainRecord && crawlData.pages?.length > 0) {
      const pagesToInsert = await Promise.all(
        crawlData.pages.map(async (p) => {
          let vector = null;
          try {
            // Generate 768-dimension vector embedding using Google Gemini
            const textToEmbed = `Title: ${p.title || ""}\nURL: ${p.url}\nContent: ${p.markdown || ""}`;
            vector = await generateEmbedding(textToEmbed);
          } catch (embedErr) {
            console.error("Embedding generation failed for:", p.url, embedErr);
          }

          return {
            domain_id: domainRecord.id,
            url: p.url,
            title: p.title || p.url,
            markdown_content: p.markdown || "",
            char_count: p.char_count || 0,
            embedding: vector, // Vector Embedding
          };
        })
      );

      const { error: pageSaveErr } = await supabase
        .from("crawled_pages")
        .insert(pagesToInsert);

      if (pageSaveErr) {
        console.error("Failed to save crawled pages in Supabase:", pageSaveErr);
      }
    }

    return NextResponse.json({
      success: true,
      domain: crawlData.domain,
      domain_id: domainRecord?.id,
      total_crawled: crawlData.total_crawled,
      pages: crawlData.pages,
    });
  } catch (error) {
    console.error("Crawl API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
