import { ArrowRight } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section id="cta" className="w-full bg-white text-stone-900 py-10 sm:py-14 border-t border-stone-200/80 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 text-center flex flex-col items-center">
        
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium text-stone-950 tracking-tight leading-[1.08] max-w-4xl">
          Start converting your visitors into customers today
        </h2>

        <p className="mt-4 sm:mt-5 text-stone-600 text-base sm:text-xl font-sans font-normal max-w-2xl leading-relaxed">
          Zero coding required. Enter your website link and have your autonomous sales agent active in under 3 minutes.
        </p>

        {/* URL Input Box (Consistent with Hero Bar in Light Theme) */}
        <div className="mt-8 sm:mt-10 w-full max-w-xl p-2 bg-white border border-stone-300 rounded-2xl sm:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-within:border-stone-950 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center flex-1 min-w-0 pl-3 sm:pl-4">
            <span className="text-xs sm:text-sm font-mono text-stone-400 select-none">https://</span>
            <input
              type="text"
              placeholder="yourwebsite.com"
              className="flex-1 px-2.5 py-2 text-sm sm:text-[15px] outline-hidden text-stone-900 placeholder:text-stone-400 bg-transparent font-sans"
            />
          </div>
          <button className="px-6 sm:px-7 py-3.5 rounded-xl sm:rounded-full bg-stone-950 hover:bg-stone-900 text-white hover:text-[#0ca656] font-medium text-xs sm:text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer">
            <span>Build My Agent</span>
            <ArrowRight className="h-4 w-4 text-[#0ca656]" />
          </button>
        </div>

        {/* Reassurance Micro-Copy */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs text-stone-500 font-medium font-sans">
          <span>Free 14-day trial</span>
          <span className="text-stone-300">•</span>
          <span>No credit card required</span>
          <span className="text-stone-300">•</span>
          <span>Cancel anytime</span>
        </div>

      </div>

    </section>
  );
}
