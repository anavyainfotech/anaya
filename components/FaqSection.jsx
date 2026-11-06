"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "How does Anaya learn about my website?",
    a: "You simply paste your website URL. Our autonomous crawler instantly indexes your pages, product catalog, pricing, FAQs, and shipping policies. Within 60 seconds, Anaya is trained strictly on your verified content with zero manual prompt engineering.",
  },
  {
    q: "Will this slow down my website or affect Core Web Vitals?",
    a: "Not at all. Anaya’s widget is an ultra-lightweight script (under 14KB) loaded asynchronously via a global edge CDN. It does not block rendering, does not degrade Google PageSpeed scores, and runs in isolated shadow DOM.",
  },
  {
    q: "How does Anaya capture qualified sales leads?",
    a: "Unlike dumb chatbots that force rigid popup forms, Anaya engages in natural consultative conversation first. Once the visitor shows buying intent (asking for pricing, shipping time, or custom quotes), she seamlessly collects their WhatsApp, Phone, or Email and alerts your team instantly.",
  },
  {
    q: "What happens if I update my website or add new products?",
    a: "Anaya automatically detects updates or you can trigger an instant 1-click re-crawl from your dashboard. She immediately syncs new products, discounts, and inventory changes so she never gives outdated answers.",
  },
  {
    q: "Can I customize Anaya's tone, avatar, and brand colors?",
    a: "Yes! You have full control over Anaya's visual appearance and sales persona. Match her colors to your exact hex code, customize her avatar, and tune her voice to be professional, playful, or direct consultative.",
  },
  {
    q: "Which platforms does Anaya support?",
    a: "Anaya integrates with 1 line of embed code on Shopify, WordPress, WooCommerce, Webflow, Squarespace, Wix, Framer, and custom frameworks like Next.js and React. If you can paste HTML, Anaya will work.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 py-6 sm:py-8 border-t border-stone-200/60 bg-white flex flex-col items-start">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-6 sm:mb-8 text-left">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
          Everything you need to know about deploying Anaya on your storefront or web application.
        </p>
      </div>

      {/* Full-Width Accordion Grid */}
      <div className="w-full space-y-3.5 sm:space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-md border transition-all duration-200 overflow-hidden text-left ${
                isOpen
                  ? "bg-white border-stone-300 shadow-sm"
                  : "bg-white/70 border-stone-200/80 hover:border-stone-300 hover:bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-hidden"
              >
                <span className="text-base sm:text-lg font-serif font-medium text-stone-950 pr-2">
                  {faq.q}
                </span>
                <span
                  className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 ${
                    isOpen ? "bg-[#0ca656]/15 text-[#0ca656] rotate-180" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-stone-100 text-stone-600 font-sans text-sm sm:text-[15px] leading-relaxed">
                  <p className="pt-3.5">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}
