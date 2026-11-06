"use client";

import { useState } from "react";
import { 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  SlidersHorizontal,
  Layers,
  ShoppingBag,
  Phone,
  MessageSquare,
  Check
} from "lucide-react";

export default function DomainManager() {
  const [domainUrl, setDomainUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlStep, setCrawlStep] = useState(0); // 0: Idle, 1: Crawling, 2: Done
  const [activeDomain, setActiveDomain] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("whatsapp");
  const [copied, setCopied] = useState(false);

  // Simulated Crawl Process
  const handleStartCrawl = (e) => {
    e.preventDefault();
    if (!domainUrl.trim()) return;

    setIsCrawling(true);
    setCrawlStep(1);

    // Simulate multi-step crawler progress
    setTimeout(() => {
      setIsCrawling(false);
      setCrawlStep(2);
      setActiveDomain({
        url: domainUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        addedAt: "Just now",
        productsIndexed: 48,
        pagesScanned: 16,
        status: "Active",
      });
    }, 2800);
  };

  const copyEmbedCode = () => {
    navigator.clipboard?.writeText?.(
      `<script src="https://anaya.live/widget.js" data-domain="${activeDomain?.url || 'yourstore.com'}" async></script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left">
      
      {/* 1. DOMAIN INPUT CARD */}
      <div className="rounded-md border border-stone-200 bg-white p-7 sm:p-9 shadow-xs">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0ca656]/10 text-[#0ca656] text-xs font-mono font-medium mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Storefront Synchronization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-950 tracking-tight">
            Connect your storefront or website
          </h2>
          <p className="mt-2 text-sm text-stone-500 font-sans leading-relaxed">
            Enter your website URL. Anaya’s multi-threaded crawler will immediately index your product catalog, variant pricing, FAQs, and shipping terms.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleStartCrawl} className="max-w-2xl">
          <div className="p-1.5 rounded-md bg-white border border-stone-300 shadow-2xs focus-within:border-stone-950 transition-colors flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center flex-1 min-w-0 pl-3">
              <span className="text-xs sm:text-sm font-mono text-stone-400 select-none">
                https://
              </span>
              <input
                type="text"
                required
                disabled={isCrawling}
                value={domainUrl}
                onChange={(e) => setDomainUrl(e.target.value)}
                placeholder="yourstore.com"
                className="flex-1 px-2.5 py-2.5 text-sm outline-hidden text-stone-900 placeholder:text-stone-400 bg-transparent font-sans disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isCrawling}
              className="px-6 py-3 rounded-md bg-stone-950 hover:bg-stone-900 text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
            >
              {isCrawling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0ca656]" />
                  <span>Crawling Catalog...</span>
                </>
              ) : (
                <>
                  <span>{activeDomain ? "Re-Crawl Website" : "Connect & Index"}</span>
                  <ArrowRight className="w-4 h-4 text-[#0ca656]" />
                </>
              )}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-stone-400 px-1">
            <span>Shopify, WooCommerce, Webflow, Custom React</span>
            <span className="text-[#0ca656]">Instant 60s Setup</span>
          </div>
        </form>

        {/* CRAWLING IN-PROGRESS SIMULATION */}
        {isCrawling && (
          <div className="mt-6 p-4 rounded-md bg-stone-50 border border-stone-200 animate-pulse space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-stone-600">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0ca656]" />
                Scanning sitemap and extracting product structured data...
              </span>
              <span className="text-[#0ca656] font-semibold">64%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#0ca656] h-full rounded-full w-2/3 transition-all duration-500" />
            </div>
          </div>
        )}
      </div>

      {/* 2. LIVE CONNECTED DOMAIN DETAILS & METRICS (Appears when domain is added) */}
      {activeDomain && !isCrawling && (
        <div className="space-y-6">
          
          {/* Active Domain Overview Card */}
          <div className="rounded-md border border-stone-200 bg-white p-7 sm:p-9 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#0ca656]/15 text-[#0ca656] flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-medium text-stone-950">
                      https://{activeDomain.url}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656]" />
                      Synced
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">Last crawl: {activeDomain.addedAt}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartCrawl}
                className="px-3.5 py-2 rounded-md border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                <span>Sync Delta Changes</span>
              </button>
            </div>

            {/* Ingested Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-md bg-stone-50 border border-stone-200/80">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-400">Products Assimilated</div>
                <div className="text-2xl font-serif font-medium text-stone-900 mt-1">
                  {activeDomain.productsIndexed} SKUs
                </div>
                <div className="text-[11px] text-[#0ca656] mt-0.5">Pricing & Variants Mapped</div>
              </div>

              <div className="p-4 rounded-md bg-stone-50 border border-stone-200/80">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-400">Knowledge Depth</div>
                <div className="text-2xl font-serif font-medium text-stone-900 mt-1">
                  {activeDomain.pagesScanned} Pages
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">FAQs, Shipping & Return Terms</div>
              </div>

              <div className="p-4 rounded-md bg-stone-50 border border-stone-200/80">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-400">Response Latency</div>
                <div className="text-2xl font-serif font-medium text-stone-900 mt-1">
                  &lt; 450ms
                </div>
                <div className="text-[11px] text-[#0ca656] mt-0.5">Edge-Cached Vectors</div>
              </div>
            </div>

            {/* Commercial Goal Selector */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold mb-3">
                Agent Commercial Goal for this Domain:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "whatsapp", label: "WhatsApp & Phone Leads", desc: "Collect verified numbers inside dialogue", icon: Phone },
                  { id: "checkout", label: "Direct Checkout Redirect", desc: "Guide high-intent shoppers directly to cart", icon: ShoppingBag },
                  { id: "consult", label: "Consultation Booking", desc: "Qualify B2B buyers and book demo slots", icon: MessageSquare },
                ].map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-3.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-white border-[#0ca656] ring-1 ring-[#0ca656] shadow-xs"
                          : "bg-stone-50/50 border-stone-200 hover:border-stone-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-md ${isSelected ? "bg-[#0ca656] text-white" : "bg-stone-100 text-stone-600"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#0ca656]" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-stone-900">{goal.label}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">{goal.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. EMBED SNIPPET CARD */}
          <div className="rounded-md border border-stone-200 bg-white p-7 sm:p-9 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-medium text-stone-950">
                  Deploy Anaya to your website
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Paste this single script line right before the closing &lt;/head&gt; tag of your store.
                </p>
              </div>
              <span className="text-xs font-mono text-[#0ca656] bg-[#0ca656]/10 px-2.5 py-1 rounded-md font-medium">
                4KB Lightweight
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-stone-950 text-white flex items-center justify-between gap-4 font-mono text-xs">
              <span className="truncate text-emerald-400 select-all">
                &lt;script src=&quot;https://anaya.live/widget.js&quot; data-domain=&quot;{activeDomain.url}&quot; async&gt;&lt;/script&gt;
              </span>
              <button
                type="button"
                onClick={copyEmbedCode}
                className="p-2 rounded-md bg-stone-800 hover:bg-[#0ca656] text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-sans font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
