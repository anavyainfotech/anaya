import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarCheck, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Anaya for Business | B2B & Enterprise Sales Agent",
  description: "Anaya qualifies high-value corporate buyers, books executive consultation calls, and syncs enterprise deals.",
};

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      
      <Navbar />

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/90 text-stone-700 text-[12px] font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-pulse"></span>
              <span>Enterprise & High-Ticket B2B</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium text-stone-950 leading-[1.12] tracking-tight">
              Close high-value deals on autopilot
            </h1>

            <p className="mt-4 text-stone-600 text-base sm:text-lg lg:text-xl font-sans max-w-xl font-normal leading-relaxed">
              Anaya handles enterprise discovery, qualifies prospect budget and authority, and schedules confirmed sales calls directly on your team's calendar.
            </p>

            {/* URL input */}
            <div className="mt-8 w-full max-w-xl p-1.5 sm:p-2 bg-white border border-stone-200/90 rounded-2xl sm:rounded-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center flex-1 min-w-0 pl-3 sm:pl-4">
                <span className="text-xs sm:text-sm font-mono text-stone-400 select-none">https://</span>
                <input
                  type="text"
                  placeholder="yourcompany.com"
                  className="flex-1 px-2.5 py-2 text-sm outline-hidden text-stone-900 placeholder:text-stone-400 bg-transparent font-sans"
                />
              </div>
              <button className="px-6 py-3 rounded-xl sm:rounded-full bg-stone-950 hover:bg-stone-900 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0">
                <span>Deploy for Business</span>
                <ArrowRight className="h-4 w-4 text-[#0ca656]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden shadow-xl bg-stone-900">
              <Image
                src="/anaya-business.jpg"
                alt="Anaya for Business"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>

        {/* Business Capabilities Grid */}
        <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <CalendarCheck className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Calendly & Cal.com Booking
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Books qualified discovery meetings directly inside the chat window without redirects.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <Briefcase className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              BANT Lead Qualification
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Evaluates Budget, Authority, Need, and Timeline before notifying your account executive.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Enterprise SOC2 Data Privacy
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Isolated enterprise vector partitions with zero cross-client knowledge leakage.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
