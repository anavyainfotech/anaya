"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardClient from "./DashboardClient";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [initialDomain, setInitialDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) {
        router.push("/login");
      } else {
        // If user hasn't onboarded yet, redirect to onboarding wizard
        const isOnboarded = user.user_metadata?.onboarded;
        if (isOnboarded === false) {
          router.push("/onboarding");
          return;
        }

        // Check if user already has a domain connected in Supabase
        try {
          const { data: domains } = await supabase
            .from("domains")
            .select("*")
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .order("created_at", { ascending: false })
            .limit(1);

          if (domains && domains.length > 0) {
            setInitialDomain(domains[0]);
          }
        } catch (err) {
          console.error("Error fetching existing domain:", err);
        }

        setUser(user);
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ca656]" />
        <span className="mt-3 text-xs font-mono text-stone-500">Loading your Anaya agent dashboard...</span>
      </div>
    );
  }

  return <DashboardClient user={user} existingDomain={initialDomain} />;
}
