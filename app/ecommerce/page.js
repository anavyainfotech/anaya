import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Anaya for E-Commerce | Autonomous Sales Agent",
  description: "Anaya recommends products, answers fit & inventory questions, and recovers abandoned carts on Shopify & WooCommerce.",
};

export default function EcommercePage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      
      <Navbar />

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/90 text-stone-700 text-[12px] font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-pulse"></span>
              <span>For Shopify & WooCommerce Stores</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium text-stone-950 leading-[1.12] tracking-tight">
              Turn casual browsers into repeat buyers
            </h1>

            <p className="mt-4 text-stone-600 text-base sm:text-lg lg:text-xl font-sans max-w-xl font-normal leading-relaxed">
              Anaya crawls your store catalog, knows your stock levels, recommends the right size, and sends 1-click WhatsApp checkout links.
            </p>

            {/* URL input */}
            <div className="mt-8 w-full max-w-xl p-1.5 sm:p-2 bg-white border border-stone-200/90 rounded-2xl sm:rounded-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center flex-1 min-w-0 pl-3 sm:pl-4">
                <span className="text-xs sm:text-sm font-mono text-stone-400 select-none">https://</span>
                <input
                  type="text"
                  placeholder="yourstore.com"
                  className="flex-1 px-2.5 py-2 text-sm outline-hidden text-stone-900 placeholder:text-stone-400 bg-transparent font-sans"
                />
              </div>
              <button className="px-6 py-3 rounded-xl sm:rounded-full bg-stone-950 hover:bg-stone-900 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0">
                <span>Deploy on Store</span>
                <ArrowRight className="h-4 w-4 text-[#0ca656]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden shadow-xl bg-stone-900">
              <Image
                src="/anaya-ecommerce.jpg"
                alt="Anaya for E-Commerce"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>

        {/* E-Commerce Capabilities Grid */}
        <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <ShoppingBag className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Live Catalog Discovery
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Anaya knows every SKU, variant, colorway, and discount code without manual entry.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <Zap className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Instant Fit & Policy Guidance
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Answers sizing questions, return policies, and shipping delivery dates instantly.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              WhatsApp Cart Recovery
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Captures shopper WhatsApp numbers and sends tailored discounts before they leave.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
