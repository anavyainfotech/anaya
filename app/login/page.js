"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import AnayaLogo from "@/components/AnayaLogo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fafaf9] grid grid-cols-1 lg:grid-cols-12 selection:bg-[#0ca656] selection:text-white">
      
      {/* LEFT COLUMN: HERO IMAGE (reduced width with margin m-2 and rounded-md) */}
      <div className="hidden lg:block lg:col-span-3 p-2">
        <div className="relative h-[calc(100vh-1rem)] rounded-md overflow-hidden shadow-md">
          {/* Full Image background */}
          <Image
            src="/auth-founder.jpg"
            alt="Anaya Customer Experience"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Ambient Dark Gradient Overlays for Luxury Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/35 to-stone-950/60" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#0ca656]/15 blur-3xl pointer-events-none" />

          {/* Top: Brand Header on Image */}
          <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <AnayaLogo className="w-7 h-7 group-hover:scale-105 transition-transform" color="#0ca656" />
              <span className="font-serif text-2xl font-medium tracking-tight text-[#0ca656] group-hover:opacity-90 transition-opacity drop-shadow-md">
                Anaya
              </span>
            </Link>
          </div>

          {/* Bottom Content on Image */}
          <div className="absolute bottom-8 left-6 right-6 z-10 text-left">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#0ca656] font-semibold block mb-2">
              Live Platform
            </span>

            <p className="text-white text-lg xl:text-xl font-serif font-medium leading-snug drop-shadow-md">
              &ldquo;Anaya turns casual visitors into high-intent buyers around the clock.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Full Height Login Form (9 cols on desktop) */}
      <div className="col-span-1 lg:col-span-9 flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-[#fafaf9] min-h-screen relative overflow-hidden">
        
        {/* Mobile Header only */}
        <div className="flex lg:hidden items-center justify-between mb-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-medium tracking-tight text-[#0ca656]">
            <AnayaLogo className="w-6 h-6" color="#0ca656" />
            <span>Anaya</span>
          </Link>
          <Link href="/" className="text-xs font-sans text-stone-500 hover:text-stone-900">
            ← Back to Home
          </Link>
        </div>

        {/* Form Container (Vertically centered) */}
        <div className="my-auto w-full max-w-sm mx-auto text-left relative z-10">
          
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 tracking-tight mb-2">
            Sign in to Anaya
          </h1>
          <p className="text-stone-500 text-sm font-sans mb-6">
            Access your live agent analytics, crawled knowledge base, and lead pipelines.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans">
              {errorMsg}
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-md bg-white border border-stone-200/90 hover:bg-stone-50 hover:border-stone-300 text-stone-800 font-medium text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xs mb-5 disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-sans font-medium text-stone-700">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="w-full border-t border-stone-200" />
            <span className="bg-[#fafaf9] px-3 text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold absolute">
              or
            </span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-md bg-white border border-stone-200/90 text-sm text-stone-900 outline-hidden focus:border-stone-950 transition-colors font-sans shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
                  Password
                </label>
                <a href="#" className="text-xs text-[#0ca656] hover:underline font-sans">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-md bg-white border border-stone-200/90 text-sm text-stone-900 outline-hidden focus:border-stone-950 transition-colors font-sans shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-md bg-stone-950 hover:bg-stone-900 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0ca656]" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#0ca656]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-200/60 text-center text-xs font-sans text-stone-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0ca656] font-medium hover:underline">
              Sign up
            </Link>
          </div>

        </div>

        {/* Desktop bottom utility */}
        <div className="hidden lg:flex items-center justify-between text-xs font-sans text-stone-400 pt-8 relative z-10">
          <Link href="/" className="hover:text-stone-700 transition-colors">
            ← Back to website
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-stone-700 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-stone-700 transition-colors">
              Terms
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
