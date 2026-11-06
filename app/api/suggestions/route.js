import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let domain_id = searchParams.get("domain_id");
    let domain = searchParams.get("domain") || "";

    const supabase = await createClient();

    if (!domain_id && domain) {
      const clean = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      const { data: domRecord } = await supabase
        .from("domains")
        .select("id, domain_name")
        .ilike("domain_name", `%${clean}%`)
        .limit(1)
        .maybeSingle();

      if (domRecord?.id) {
        domain_id = domRecord.id;
      }
    }

    if (domain_id) {
      // Fetch crawled pages or product titles for this website
      const { data: pages } = await supabase
        .from("crawled_pages")
        .select("title, url")
        .eq("domain_id", domain_id)
        .limit(8);

      if (pages && pages.length > 0) {
        // Clean titles to create personalized smart suggestions
        const suggestions = [];
        pages.forEach((p) => {
          let t = (p.title || "").split("|")[0].split("-")[0].trim();
          if (t && t.length > 3 && t.length < 60 && !suggestions.includes(t)) {
            suggestions.push(t);
          }
        });

        if (suggestions.length >= 2) {
          const formatted = suggestions.slice(0, 3).map((item) => ({
            label: item,
            query: `Tell me more about your ${item} services`
          }));
          return NextResponse.json({ suggestions: formatted });
        }
      }
    }

    // Check if domain is Anavya Infotech or IT / Web agency
    const isAnavyaOrIT = /anavya|infotech|tech|software|dev/i.test(domain) || !domain || domain.includes("localhost");

    if (isAnavyaOrIT) {
      return NextResponse.json({
        suggestions: [
          { 
            label: "Website & Custom Web Application Development", 
            query: "What website and custom web development services does Anavya Infotech offer?" 
          },
          { 
            label: "AI Chatbots & Business Process Automation", 
            query: "How can Anavya Infotech integrate AI chatbots and automation for our business?" 
          },
          { 
            label: "Get a Project Estimate & Schedule IT Consultation", 
            query: "I want to discuss an IT/software project. Can we schedule a consultation and get a price estimate?" 
          }
        ]
      });
    }

    // Default high-intent fallback questions if not crawled yet
    return NextResponse.json({
      suggestions: [
        { label: "Our Core Services & Solutions", query: "Can you provide details on your core services and solutions?" },
        { label: "Pricing & Project Packages", query: "What are your pricing models and package rates?" },
        { label: "Book a Discovery Call with Our Team", query: "How can I schedule a discovery meeting or speak with an expert?" }
      ]
    });
  } catch (err) {
    return NextResponse.json({
      suggestions: [
        { label: "Website & Custom Web App Development", query: "Tell me about your web development services" },
        { label: "AI Chatbot & Workflow Automation", query: "Tell me about your AI automation solutions" },
        { label: "Get a Project Estimate & Consultation", query: "Can I get a project quote and consultation?" }
      ]
    });
  }
}
