import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { generateEmbedding, generateChatResponse } from "@/lib/gemini";

// Direct client to ensure seamless DB persistence across CORS and visitor widgets
function getDbClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false }
  });
}

// CORS Headers to allow any website to chat with the AI server
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Helper function to extract potential phone number & email from messages
function extractLeadInfo(text = "") {
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d]{3}[-.\s]?[\d]{4,6}/;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

  const phoneMatch = text.match(phoneRegex);
  const emailMatch = text.match(emailRegex);

  return {
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    email: emailMatch ? emailMatch[0].trim() : null,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { domain_id, domain, messages, message, session_id, customer_name, page_visited } = body;

    // Support both single "message" string and "messages" array
    if (!messages && message) {
      messages = [{ role: "user", content: message }];
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array or message is required" }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";
    const cleanDomain = (domain || "anavyainfotech.com").replace(/^https?:\/\//i, "").replace(/\/$/, "");
    const supabase = getDbClient();

    // 1. If domain_id is missing, look it up or auto-register domain for unlimited websites
    if (!domain_id) {
      const { data: domRecord } = await supabase
        .from("domains")
        .select("id")
        .ilike("domain_name", `%${cleanDomain}%`)
        .limit(1)
        .maybeSingle();

      if (domRecord?.id) {
        domain_id = domRecord.id;
      }
    }

    let contextDocs = [];

    // 2. Semantic Search using Vector DB if domain_id is provided
    if (domain_id && latestUserMessage) {
      const isQuickGreeting = /^(hi|hello|hey|namaste|hola|hii|heya|yo)[\s!.]*$/i.test(latestUserMessage.trim());

      if (!isQuickGreeting) {
        try {
          const queryVector = await generateEmbedding(latestUserMessage);
          if (queryVector) {
            const { data: matchedPages, error: matchErr } = await supabase.rpc(
              "match_crawled_pages",
              {
                query_embedding: queryVector,
                match_threshold: 0.35,
                match_count: 3,
                filter_domain_id: domain_id,
              }
            );

            if (!matchErr && matchedPages) {
              contextDocs = matchedPages;
            }
          }
        } catch (err) {
          console.warn("Vector search failed, falling back:", err);
        }
      }

      // Fallback: If vector search returns 0 docs, get pages of this domain
      if (contextDocs.length === 0) {
        const { data: fallbackPages } = await supabase
          .from("crawled_pages")
          .select("title, url, markdown_content")
          .eq("domain_id", domain_id)
          .limit(2);
        
        if (fallbackPages) contextDocs = fallbackPages;
      }
    }

    // 3. Universal Persona Engine
    const isOngoingConversation = messages.length > 2;
    const systemPrompt = `You are Anaya, an intelligent, highly versatile autonomous AI assistant embedded directly on ${cleanDomain}.

### CORE CONVERSATIONAL RULES (STRICT):
1. **NEVER REPEAT GREETINGS**: 
   - If this is NOT the very first message (${isOngoingConversation ? "THIS IS AN ONGOING CONTINUOUS CHAT - STRICTLY DO NOT GREET" : "First message"}), do NOT say "Hello!", "Hi!", or introduce yourself again. Answer directly.
2. **NATURAL CONCISE LANGUAGE**: 
   - Match the user's language smoothly (Hinglish/Hindi if user speaks Hindi, English if user speaks English).
   - Keep answers clear and helpful (2-4 sentences max unless detailed specs are requested).
3. **NEVER HALLUCINATE**:
   - Strictly ground factual details (pricing, features, timings, policies) on the verified Store/Business Knowledge Base.

### GOAL:
Guide the visitor, answer inquiries accurately, and if they show high interest in purchasing, booking a service, or demo, help capture their contact info (Phone/Email) so the team can reach out.`;

    // 4. Generate response using Auto-Fallback Chain
    const result = await generateChatResponse({
      systemPrompt,
      messages,
      contextDocs,
    });

    const aiReply = result.text;
    const activeSessionId = session_id || `sess_${cleanDomain}_${Date.now()}`;

    // 5. LIVE MULTI-WEBSITE PERSISTENCE: Save Conversation & Extract Leads into Supabase
    let _dbDebug = { step: "init", supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) };
    try {
      const { phone, email } = extractLeadInfo(latestUserMessage);
      _dbDebug.step = "extractedLead";
      _dbDebug.activeSessionId = activeSessionId;
      _dbDebug.cleanDomain = cleanDomain;
      _dbDebug.domain_id = domain_id || null;

      // Build message log formatted for dashboard
      const formattedLog = messages.map((m, idx) => ({
        id: `msg-${Date.now()}-${idx}`,
        sender: m.role === "user" ? "customer" : "ai",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: m.content
      }));

      // Append latest AI reply
      formattedLog.push({
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiReply
      });

      _dbDebug.step = "formattedLog";
      _dbDebug.messagesCount = formattedLog.length;

      // Upsert into `conversations` table
      const { data: existingConv, error: lookupErr } = await supabase
        .from("conversations")
        .select("id, customer_phone, customer_email, messages")
        .eq("session_id", activeSessionId)
        .maybeSingle();

      _dbDebug.step = "lookupDone";
      _dbDebug.lookupError = lookupErr ? lookupErr.message : null;
      _dbDebug.existingConvId = existingConv?.id || null;

      let convRecord = null;

      if (existingConv) {
        _dbDebug.step = "updating";
        const { data: updated, error: updateErr } = await supabase
          .from("conversations")
          .update({
            messages: formattedLog,
            last_message: aiReply,
            customer_phone: phone || existingConv.customer_phone,
            customer_email: email || existingConv.customer_email,
            customer_name: customer_name || (phone ? `Visitor (${phone.slice(-4)})` : "Store Visitor"),
            unread: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingConv.id)
          .select()
          .maybeSingle();
        _dbDebug.step = "updateDone";
        _dbDebug.updateError = updateErr ? { message: updateErr.message, code: updateErr.code, details: updateErr.details, hint: updateErr.hint } : null;
        _dbDebug.updateSuccess = !!updated;
        if (updateErr) console.error("Conversation update error:", updateErr);
        convRecord = updated || existingConv;
      } else {
        _dbDebug.step = "inserting";
        const insertPayload = {
          domain_id: domain_id || null,
          domain_name: cleanDomain,
          session_id: activeSessionId,
          customer_name: customer_name || (phone ? `Visitor (${phone.slice(-4)})` : "Store Visitor"),
          customer_phone: phone,
          customer_email: email,
          status: "active",
          handling_mode: "ai",
          messages: formattedLog,
          last_message: aiReply,
          unread: true,
          page_visited: page_visited || `https://${cleanDomain}`
        };
        _dbDebug.insertPayloadKeys = Object.keys(insertPayload);
        const { data: inserted, error: insertErr } = await supabase
          .from("conversations")
          .insert(insertPayload)
          .select()
          .maybeSingle();
        _dbDebug.step = "insertDone";
        _dbDebug.insertError = insertErr ? { message: insertErr.message, code: insertErr.code, details: insertErr.details, hint: insertErr.hint } : null;
        _dbDebug.insertSuccess = !!inserted;
        _dbDebug.insertedId = inserted?.id || null;
        if (insertErr) console.error("Conversation insert error:", insertErr);
        convRecord = inserted;
      }

      _dbDebug.step = "complete";
      _dbDebug.finalConvId = convRecord?.id || null;

      // 6. If Lead Info (Phone or Email) Detected -> Save/Update in `leads` Table
      if (phone || email) {
        const { error: leadErr } = await supabase
          .from("leads")
          .insert({
            domain_id: domain_id || null,
            domain_name: cleanDomain,
            conversation_id: convRecord?.id || null,
            name: customer_name || "Website Lead",
            phone: phone,
            email: email,
            notes: `Captured during conversation on ${cleanDomain}: "${latestUserMessage.slice(0, 100)}"`,
            status: "new",
            source_page: page_visited || `https://${cleanDomain}`
          });
        _dbDebug.leadInsertError = leadErr ? leadErr.message : null;
      }
    } catch (dbErr) {
      console.error("Live DB persistence fatal error:", dbErr);
      _dbDebug.step = "FATAL_ERROR";
      _dbDebug.fatalError = dbErr?.message || String(dbErr);
    }

    return NextResponse.json({
      reply: aiReply,
      model: result.modelUsed,
      session_id: activeSessionId,
      matchedDocsCount: contextDocs.length,
      _dbDebug,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI response" },
      { status: 500, headers: corsHeaders }
    );
  }
}
