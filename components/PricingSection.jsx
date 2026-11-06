"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    description: "Perfect for single websites & early stage stores testing autonomous sales.",
    monthlyPrice: 0,
    annualPrice: 0,
    priceLabel: "Free Forever",
    highlight: false,
    badge: null,
    features: [
      "1 Website crawled & indexed",
      "Up to 100 autonomous sales chats / mo",
      "Standard crawler (up to 25 pages)",
      "Standard lead capture (Name, Email)",
      "Anaya badge on widget",
      "Community support",
    ],
    ctaText: "Start Free",
    ctaHref: "/builder",
  },
  {
    name: "Growth",
    description: "For growing e-commerce & businesses who want dedicated 24/7 sales closers.",
    monthlyPrice: 29,
    annualPrice: 24,
    priceLabel: "/ month",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 3 Websites crawled",
      "Unlimited autonomous sales conversations",
      "Deep crawler (up to 500 pages + PDF catalogs)",
      "Instant WhatsApp & Email lead alerts",
      "Custom branding & agent avatar",
      "Remove Anaya badge",
      "Priority email & chat support",
    ],
    ctaText: "Claim 14-Day Free Trial",
    ctaHref: "/builder?plan=growth",
  },
  {
    name: "Scale Agency",
    description: "For high-volume merchants, agencies, & brands managing multiple client storefronts.",
    monthlyPrice: 79,
    annualPrice: 65,
    priceLabel: "/ month",
    highlight: false,
    badge: "Best for Scale",
    features: [
      "Up to 10 Websites crawled",
      "Unlimited conversations & lead captures",
      "Daily auto-recrawler (keeps products in sync)",
      "Native Webhooks, HubSpot & CRM sync",
      "Multi-tenant team management",
      "Dedicated account manager & SLA",
      "Custom AI fine-tuning for brand voice",
    ],
    ctaText: "Get Started",
    ctaHref: "/builder?plan=agency",
  },
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 py-14 sm:py-20 border-t border-stone-200/60 bg-[#fafaf9]">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="max-w-3xl text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
            Simple pricing that pays for itself
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
            Every plan includes our autonomous web crawler, intent engine, and instant 1-line script embed.
          </p>
        </div>

        {/* Monthly / Annual Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-stone-100 p-1 rounded-full self-start lg:self-end">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              !isAnnual ? "bg-white text-stone-950 shadow-xs" : "text-stone-500 hover:text-stone-950"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              isAnnual ? "bg-stone-950 text-white shadow-xs" : "text-stone-500 hover:text-stone-950"
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#0ca656] text-white font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {PLANS.map((plan, idx) => {
          const price = plan.monthlyPrice === 0 
            ? 0 
            : (isAnnual ? plan.annualPrice : plan.monthlyPrice);

          return (
            <div
              key={idx}
              className={`rounded-md p-7 sm:p-9 flex flex-col justify-between text-left transition-all duration-300 relative ${
                plan.highlight
                  ? "bg-stone-950 text-white shadow-2xl scale-[1.02] z-10"
                  : "bg-white text-stone-950 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl"
              }`}
            >
              {/* Highlight Background Glow */}
              {plan.highlight && (
                <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-gradient-to-br from-[#0ca656]/25 to-transparent blur-3xl pointer-events-none -z-0" />
              )}

              <div className="relative z-10">
                
                {/* Header & Optional Badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold ${
                      plan.highlight
                        ? "bg-[#0ca656] text-white"
                        : "bg-stone-100 text-stone-700"
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className={`text-xs sm:text-sm font-sans mb-6 leading-relaxed ${
                  plan.highlight ? "text-stone-400" : "text-stone-500"
                }`}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-8">
                  {plan.monthlyPrice === 0 ? (
                    <span className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">
                        ${price}
                      </span>
                      <span className={`text-sm font-sans ${
                        plan.highlight ? "text-stone-400" : "text-stone-500"
                      }`}>
                        {plan.priceLabel}
                      </span>
                    </>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold block ${
                    plan.highlight ? "text-stone-400" : "text-stone-400"
                  }`}>
                    What is included
                  </span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.highlight ? "text-[#0ca656]" : "text-[#0ca656]"
                      }`} />
                      <span className={`text-xs sm:text-sm font-sans ${
                        plan.highlight ? "text-stone-200" : "text-stone-700"
                      }`}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="relative z-10 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3.5 px-6 rounded-md font-medium text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? "bg-[#0ca656] hover:bg-[#0ca656]/90 text-white shadow-lg"
                      : "bg-stone-950 hover:bg-stone-900 text-white"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
