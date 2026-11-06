import { XCircle, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

const COMPARISONS = [
  {
    feature: "Visitor Interaction",
    traditional: "Static rule-based buttons & frustrating menus ('Press 1 for Sales')",
    anaya: "Natural human-like consultative conversation tailored to visitor intent",
  },
  {
    feature: "Knowledge Base",
    traditional: "Manual Q&A forms, outdated static FAQs that break frequently",
    anaya: "Autonomous crawler indexes your entire website, pricing, & docs in 60s",
  },
  {
    feature: "Lead Capture Rate",
    traditional: "Under 1.8% — visitors bounce when faced with rigid forms",
    anaya: "Over 7.4% — captures verified WhatsApp & Email within natural context",
  },
  {
    feature: "Setup & Maintenance",
    traditional: "Weeks of flow-chart building, prompt engineering & technical setup",
    anaya: "Paste your website URL, copy 1 script line, and go live instantly",
  },
  {
    feature: "Sales Objective",
    traditional: "Passive support deflection; redirects visitors to contact us page",
    anaya: "Proactive sales closing; qualifies leads, schedules calls & recommends SKUs",
  },
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 py-6 sm:py-8 border-t border-stone-200/60 bg-white">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-6 sm:mb-8 text-left">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
          Why smart brands choose Anaya over basic chatbots
        </h2>
        <p className="mt-4 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
          Traditional chatbots frustrate visitors and deflect tickets. Anaya is built from the ground up to close deals and generate pipeline.
        </p>
      </div>

      {/* Comparison Grid Table / Cards */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        
        {/* LEFT COLUMN: Traditional Chatbots */}
        <div className="rounded-md bg-stone-100/70 p-7 sm:p-9 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-stone-200">
              <span className="font-serif text-2xl font-medium text-stone-500">
                Traditional Chatbots
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 px-2 py-0.5 rounded bg-stone-200/60 font-semibold">
                Old Way
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {COMPARISONS.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-500/80 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold mb-0.5">
                      {item.feature}
                    </div>
                    <p className="text-sm font-sans text-stone-600 leading-relaxed">
                      {item.traditional}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-stone-200 text-xs font-mono text-stone-400">
            Average conversion: ~1.2%
          </div>
        </div>

        {/* RIGHT COLUMN: Anaya Autonomous Agent */}
        <div className="rounded-md bg-stone-950 text-white p-7 sm:p-9 flex flex-col justify-between text-left relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Green Glow inside Card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0ca656]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between pb-5 border-b border-stone-800">
              <span className="font-serif text-2xl font-medium text-white flex items-center gap-2">
                <span>Anaya Autonomous Agent</span>
                <Sparkles className="h-4 w-4 text-[#0ca656]" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#0ca656] px-2.5 py-0.5 rounded bg-[#0ca656]/15 border border-[#0ca656]/30 font-semibold">
                Autonomous AI
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {COMPARISONS.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0ca656] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[#0ca656] font-semibold mb-0.5">
                      {item.feature}
                    </div>
                    <p className="text-sm font-sans text-stone-200 leading-relaxed">
                      {item.anaya}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-5 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-400">Average qualified conversion:</span>
            <span className="text-lg font-serif text-[#0ca656] font-semibold">7.4% – 12.8%</span>
          </div>
        </div>

      </div>

    </section>
  );
}
