import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AboutAnayaSection from "@/components/AboutAnayaSection";
import UseCasesSection from "@/components/UseCasesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import ComparisonSection from "@/components/ComparisonSection";
import FaqSection from "@/components/FaqSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      
      <Navbar />

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 pb-2 sm:pb-4 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Subtle Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-stone-700 text-[12px] font-medium mb-4 sm:mb-5">
              <span className="w-2 h-2 rounded-full bg-[#0ca656] shadow-[0_0_8px_#0ca656] animate-pulse"></span>
              <span>Autonomous Sales Agent</span>
            </div>

            {/* Responsive H1 Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-[84px] font-serif font-medium text-stone-950 leading-[1.12] sm:leading-[1.08] tracking-tight">
              <span className="block">Turn visitors</span>
              <span className="block">into paying customers</span>
            </h1>

            {/* Responsive Subtitle */}
            <p className="mt-3.5 sm:mt-5 text-stone-600 text-[14.5px] sm:text-lg lg:text-xl font-sans max-w-xl font-normal leading-relaxed">
              Anaya crawls your website in seconds, learns your entire product catalog, and closes high-intent sales on autopilot.
            </p>

            {/* Responsive URL Input Bar */}
            <div className="mt-5 sm:mt-8 w-full max-w-xl p-1.5 sm:p-2 bg-white border border-stone-200/90 rounded-2xl sm:rounded-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] focus-within:border-stone-950 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center flex-1 min-w-0 pl-3 sm:pl-4">
                <span className="text-xs sm:text-sm font-mono text-stone-400 select-none">https://</span>
                <input
                  type="text"
                  placeholder="yourwebsite.com"
                  className="flex-1 px-2.5 py-2 text-sm sm:text-[15px] outline-hidden text-stone-900 placeholder:text-stone-400 bg-transparent font-sans"
                />
              </div>
              <button className="px-6 sm:px-7 py-3 rounded-xl sm:rounded-full bg-stone-950 hover:bg-stone-900 text-white hover:text-[#0ca656] font-medium text-xs sm:text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                <span>Build My Agent</span>
                <ArrowRight className="h-4 w-4 text-[#0ca656]" />
              </button>
            </div>

            {/* Dot Separated Trust Labels */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-stone-500 font-medium font-sans">
              <span>No sign up required</span>
              <span className="text-stone-300">•</span>
              <span>No coding required</span>
              <span className="text-stone-300">•</span>
              <span>WordPress, Shopify & React</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Clean Frameless Rounded-MD Image */}
          <div className="hidden lg:flex lg:col-span-5 justify-end relative">
            <div className="relative w-full max-w-[420px] xl:max-w-[460px] aspect-[4/5] rounded-md overflow-hidden shadow-lg bg-amber-100">
              <Image
                src="/hero-person.jpg"
                alt="Happy customer with Anaya"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>
      </main>

      {/* About Section */}
      <AboutAnayaSection />

      {/* 3 Dedicated Use Cases Section */}
      <UseCasesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Universal Integrations Section */}
      <IntegrationsSection />

      {/* Comparison & ROI Section */}
      <ComparisonSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* High-Impact Final CTA with Search Bar */}
      <FinalCtaSection />

      {/* Sleek Minimal Footer */}
      <Footer />

    </div>
  );
}
