import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.trim().split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabase = createClient(
  env["NEXT_PUBLIC_SUPABASE_URL"],
  env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
);

async function checkSavedData() {
  const { data: domains, error: domErr } = await supabase.from("domains").select("*");
  const { data: pages, error: pageErr } = await supabase
    .from("crawled_pages")
    .select("id, domain_id, url, title, char_count, created_at");

  console.log("DOMAINS COUNT:", domains?.length || 0);
  console.log("DOMAINS:", JSON.stringify(domains, null, 2));

  console.log("PAGES COUNT:", pages?.length || 0);
  console.log("PAGES:", JSON.stringify(pages, null, 2));
}

checkSavedData();
