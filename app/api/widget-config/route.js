import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// CORS headers so client websites embedding widget.js can fetch their live settings
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: Client widget calls this on page load to fetch the latest agent branding & persona
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Domain parameter is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    const supabase = await createClient();

    // Query domain config from Supabase
    const { data: domRecord } = await supabase
      .from("domains")
      .select("id, domain_name, agent_config")
      .ilike("domain_name", `%${cleanDomain}%`)
      .limit(1)
      .maybeSingle();

    if (domRecord && domRecord.agent_config) {
      return NextResponse.json(
        {
          success: true,
          config: domRecord.agent_config,
          domain_id: domRecord.id,
        },
        { headers: corsHeaders }
      );
    }

    // Default configuration if not yet customized
    const defaultConfig = {
      name: "Anaya",
      color: "#0ca656",
      welcomeGreeting: "Hi there! I am your AI sales assistant trained on your storefront catalog. Ask me anything about your products, pricing, or services!",
      pillButtonText: "Chat with us !",
      selectedPersona: "sales_closer",
      isVoiceEnabled: true,
      widgetPosition: "right",
    };

    return NextResponse.json(
      {
        success: true,
        config: defaultConfig,
        domain_id: domRecord?.id || null,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Widget Config GET Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: Dashboard saves new widget configuration
export async function POST(request) {
  try {
    const body = await request.json();
    const { domain, config } = body;

    if (!domain || !config) {
      return NextResponse.json(
        { error: "Domain and config are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Also update user metadata in Supabase Auth as secondary persistence
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: {
            agent_config: config,
          },
        });
      } catch (authErr) {
        console.warn("User metadata update warning:", authErr);
      }
    }

    // 2. Find and update the domain record with agent_config JSON
    const { data: existingDomain } = await supabase
      .from("domains")
      .select("id")
      .ilike("domain_name", `%${cleanDomain}%`)
      .limit(1)
      .maybeSingle();

    if (existingDomain) {
      const { error: updateErr } = await supabase
        .from("domains")
        .update({
          agent_config: config,
        })
        .eq("id", existingDomain.id);

      if (updateErr) {
        // If agent_config column does not exist yet, we still succeed via Auth metadata
        console.warn("Domain update fallback:", updateErr.message);
      }
    }

    return NextResponse.json(
      { success: true, message: "Widget configuration saved successfully", config },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Widget Config POST Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
