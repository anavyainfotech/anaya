"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Sparkles, Phone, ShoppingBag } from "lucide-react";

export default function HowItWorksSection() {
  const [copied, setCopied] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("whatsapp");

  const copyCode = () => {
    navigator.clipboard?.writeText?.('<script src="https://anaya.live/widget.js" async></script>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="how-it-works" className="w-full bg-white text-stone-900 py-8 sm:py-12 border-t border-stone-200/80 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-8 text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
            From URL to live sales agent in 3 minutes
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed max-w-2xl">
            No technical knowledge required. No prompt engineering. Just your website link, and Anaya gets to work.
          </p>
        </div>

        {/* 3 Step Rich Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* CARD 1: Connect Domain & Live Crawl */}
          <div className="group rounded-md border border-stone-200 bg-white p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-[#0ca656]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-5 border-b border-stone-100">
                <span className="font-serif text-3xl font-bold text-stone-900 group-hover:text-[#0ca656] transition-colors">
                  01
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0ca656] font-semibold px-2 py-0.5 rounded-md bg-[#0ca656]/10 border border-[#0ca656]/20">
                  Connect Domain
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 tracking-tight mt-5">
                Paste your website link
              </h3>
              <p className="mt-2 text-sm text-stone-600 font-sans leading-relaxed">
                Enter your URL. Anaya crawls your catalog, pricing, FAQs, and returns policy in 60 seconds.
              </p>
            </div>

            {/* Visual Graphic Mockup */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="rounded-md bg-stone-50 border border-stone-200 overflow-hidden shadow-xs">
                {/* Mini Browser Bar */}
                <div className="px-3.5 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="flex-1 ml-1 bg-white rounded-md px-2.5 py-1 text-[11px] font-mono text-stone-600 border border-stone-200 flex items-center justify-between shadow-2xs">
                    <span className="truncate text-stone-500">https://yourstore.com</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-pulse"></span>
                  </div>
                </div>

                {/* Live Crawl Visual Activity */}
                <div className="p-3.5 space-y-2.5 font-sans">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-700 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0ca656]"></span>
                      Indexing Catalog
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#0ca656]">100% Complete</span>
                  </div>

                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0ca656] to-emerald-500 h-full rounded-full w-full"></div>
                  </div>

                  {/* Scanned Badges */}
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono bg-white text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs">
                      ✓ 42 Products
                    </span>
                    <span className="text-[10px] font-mono bg-white text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs">
                      ✓ FAQs
                    </span>
                    <span className="text-[10px] font-mono bg-white text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs">
                      ✓ Pricing
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CARD 2: Define Goal & Interactive Switcher */}
          <div className="group rounded-md border border-stone-200 bg-white p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-[#0ca656]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-5 border-b border-stone-100">
                <span className="font-serif text-3xl font-bold text-stone-900 group-hover:text-[#0ca656] transition-colors">
                  02
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0ca656] font-semibold px-2 py-0.5 rounded-md bg-[#0ca656]/10 border border-[#0ca656]/20">
                  Sales Goal
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 tracking-tight mt-5">
                Define her closing persona
              </h3>
              <p className="mt-2 text-sm text-stone-600 font-sans leading-relaxed">
                Choose how Anaya converts visitors: collect phone numbers, book demo calls, or direct checkout.
              </p>
            </div>

            {/* Visual Graphic Mockup */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="rounded-md bg-stone-50 border border-stone-200 p-3 space-y-2">
                <div className="text-[11px] text-stone-500 font-mono flex items-center justify-between px-1">
                  <span>Primary Conversion Target</span>
                  <span className="text-[#0ca656] font-semibold">Live Mode</span>
                </div>

                {/* Option 1: WhatsApp */}
                <button
                  type="button"
                  onClick={() => setSelectedGoal("whatsapp")}
                  className={`w-full p-2.5 rounded-md border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedGoal === "whatsapp"
                      ? "bg-white border-[#0ca656] shadow-xs text-stone-900 ring-1 ring-[#0ca656]/20"
                      : "bg-white/80 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    <div className={`p-1.5 rounded-md ${selectedGoal === "whatsapp" ? "bg-[#0ca656] text-white" : "bg-stone-100 text-stone-600"}`}>
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span>Collect WhatsApp & Phone</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedGoal === "whatsapp" ? "bg-[#0ca656] text-white font-bold" : "border border-stone-300"}`}>
                    {selectedGoal === "whatsapp" && "✓"}
                  </span>
                </button>

                {/* Option 2: Direct Checkout */}
                <button
                  type="button"
                  onClick={() => setSelectedGoal("checkout")}
                  className={`w-full p-2.5 rounded-md border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedGoal === "checkout"
                      ? "bg-white border-[#0ca656] shadow-xs text-stone-900 ring-1 ring-[#0ca656]/20"
                      : "bg-white/80 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    <div className={`p-1.5 rounded-md ${selectedGoal === "checkout" ? "bg-[#0ca656] text-white" : "bg-stone-100 text-stone-600"}`}>
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <span>Guide to Direct Checkout</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${selectedGoal === "checkout" ? "bg-[#0ca656] text-white font-bold" : "border border-stone-300"}`}>
                    {selectedGoal === "checkout" && "✓"}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* CARD 3: 1-Click Launch & Platform Logos */}
          <div className="group rounded-md border border-stone-200 bg-white p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-[#0ca656]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-5 border-b border-stone-100">
                <span className="font-serif text-3xl font-bold text-stone-900 group-hover:text-[#0ca656] transition-colors">
                  03
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0ca656] font-semibold px-2 py-0.5 rounded-md bg-[#0ca656]/10 border border-[#0ca656]/20">
                  1-Click Launch
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 tracking-tight mt-5">
                Copy 1 line of embed code
              </h3>
              <p className="mt-2 text-sm text-stone-600 font-sans leading-relaxed">
                Paste our lightweight snippet into your site header. Instant live sales agent without slowdown.
              </p>
            </div>

            {/* Visual Graphic Mockup */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="rounded-md bg-stone-50 border border-stone-200 p-3 space-y-3">
                
                {/* Code Snippet Box */}
                <div className="flex items-center justify-between bg-white border border-stone-200 rounded-md p-2 font-mono text-[11px] shadow-2xs">
                  <span className="text-emerald-700 font-medium truncate pr-2">
                    &lt;script src=&quot;anaya.live/widget.js&quot;&gt;
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="p-1.5 rounded-md bg-stone-100 hover:bg-[#0ca656] text-stone-600 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Platform Integrations Bar */}
                <div className="pt-1">
                  <div className="text-[10px] text-stone-500 font-mono mb-2 flex items-center justify-between">
                    <span>Works on all platforms</span>
                    <span className="text-[#0ca656] font-medium">Plug & Play</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-white border border-stone-200 shadow-2xs">
                    <Image src="/logos/shopify.svg" alt="Shopify" width={22} height={22} className="opacity-80 hover:opacity-100 transition-opacity" />
                    <Image src="/logos/wordpress.svg" alt="WordPress" width={22} height={22} className="opacity-80 hover:opacity-100 transition-opacity" />
                    <Image src="/logos/woocommerce.svg" alt="WooCommerce" width={22} height={22} className="opacity-80 hover:opacity-100 transition-opacity" />
                    <Image src="/logos/wix.svg" alt="Wix" width={22} height={22} className="opacity-80 hover:opacity-100 transition-opacity" />
                    <Image src="/logos/webflow.svg" alt="Webflow" width={22} height={22} className="opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
