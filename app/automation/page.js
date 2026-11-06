import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Clock, Layers, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Anaya for Automation | Autonomous Support & Operations",
  description: "Anaya handles 80% of repetitive customer inquiries, routes tickets, and alerts your team 24/7.",
};

export default function AutomationPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      
      <Navbar />

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/90 text-stone-700 text-[12px] font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-pulse"></span>
              <span>24/7 Operational Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium text-stone-950 leading-[1.12] tracking-tight">
              Automate customer interactions with zero humans
            </h1>

            <p className="mt-4 text-stone-600 text-base sm:text-lg lg:text-xl font-sans max-w-xl font-normal leading-relaxed">
              Resolve inquiries in under 1 second, qualify leads, and push actionable summaries straight into Slack, Gmail, or your CRM.
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
                <span>Automate Now</span>
                <ArrowRight className="h-4 w-4 text-[#0ca656]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden shadow-xl bg-stone-900">
              <Image
                src="/anaya-automation.jpg"
                alt="Anaya for Automation"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>

        {/* Automation Capabilities Grid */}
        <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <Clock className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Zero Response Delay
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Responds in under 800ms 24 hours a day, 365 days a year without taking weekends off.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Smart Context Routing
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Detects complex enterprise queries and seamlessly escalates them to live agents with full chat history.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-md shadow-xs text-left">
            <div className="w-12 h-12 rounded-md bg-[#fafaf9] flex items-center justify-center mb-5">
              <Layers className="w-6 h-6 text-[#0ca656]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-950 mb-2">
              Webhook & API Hooks
            </h3>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Trigger custom API calls, update inventory databases, and create leads in HubSpot automatically.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
