import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const flow = searchParams.get("flow");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const user = data?.user;
      const userMetadata = user?.user_metadata || {};

      // If user came via signup or hasn't finished onboarding yet
      if (flow === "signup" || userMetadata.onboarded === false) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
