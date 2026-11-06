"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Bot, 
  Palette, 
  Sparkles, 
  Check,
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import AnayaLogo from "@/components/AnayaLogo";
import { createClient } from "@/lib/supabase/client";

const USE_GOALS = [
  {
    id: "sales",
    title: "Grow Sales & Conversions",
    desc: "Proactively engage visitors, recommend products & clear buying doubt.",
    icon: TrendingUp,
    badge: "Popular",
  },
  {
    id: "support",
    title: "24/7 Automated Support",
    desc: "Answer orders, track shipments & company FAQs around the clock.",
    icon: MessageSquare,
    badge: "Instant",
  },
  {
    id: "leads",
    title: "Capture High-Intent Leads",
    desc: "Filter casual visitors and collect verified WhatsApp & business emails.",
    icon: Zap,
    badge: "High-Ticket",
  },
  {
    id: "booking",
    title: "Book Demo & Consultation",
    desc: "Qualify prospective buyers and schedule meetings directly in chat.",
    icon: Clock,
    badge: "Pipeline",
  },
];

const PRESET_COLORS = [
  { name: "Emerald", hex: "#0ca656" },
  { name: "Obsidian", hex: "#18181b" },
  { name: "Cobalt", hex: "#2563eb" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#ea580c" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Form State
  const [selectedGoal, setSelectedGoal] = useState("sales");
  const [agentName, setAgentName] = useState("Anaya");
  const [agentColor, setAgentColor] = useState("#0ca656");
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push("/signup");
      } else {
        setLoadingAuth(false);
      }
    });
  }, [router, supabase]);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsFinishing(true);

      const agentConfig = {
        goal: selectedGoal,
        name: agentName,
        color: agentColor,
        onboarded: true,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("anaya_agent_config", JSON.stringify(agentConfig));
      }

      // Persist onboarding status in Supabase user metadata
      try {
        await supabase.auth.updateUser({
          data: {
            onboarded: true,
            agent_config: agentConfig,
          },
        });
      } catch (err) {
        console.error("Failed to update user onboarding metadata", err);
      }

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ca656]" />
        <span className="mt-3 text-xs font-mono text-stone-500">Preparing setup wizard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] p-2 flex font-sans selection:bg-[#0ca656] selection:text-white overflow-hidden">
      
      {/* 2 DISTINCT FLOATING CARDS WITH A GAP BETWEEN THEM */}
      <div className="w-full h-[calc(100vh-1rem)] grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* LEFT CARD: QUESTIONS WIZARD (7 Cols, White Floating Card) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden">
          
          {/* Top: Logo & Left-Aligned Step Indicator */}
          <div className="flex items-center justify-between pb-6 shrink-0">
            <div className="flex items-center gap-2.5">
              <AnayaLogo className="w-7 h-7" color="#0ca656" />
              <span className="font-serif text-2xl font-medium tracking-tight text-[#0ca656]">
                Anaya
              </span>
            </div>

            {/* Step Indicator on Left Card */}
            <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-full">
              <span className="text-xs font-mono text-stone-500 font-medium">Step {step} of 3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step
                        ? "w-7 bg-[#0ca656]"
                        : s < step
                        ? "w-2.5 bg-stone-900"
                        : "w-2.5 bg-stone-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center Questions Area (Nicely Arranged) */}
          <div className="flex-1 flex items-center justify-center overflow-y-auto py-4">
            <div className="w-full max-w-xl">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: GOAL */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#0ca656]/10 text-[#0ca656] text-xs font-mono font-medium mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Purpose Selection</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 tracking-tight">
                        How do you plan to use Anaya?
                      </h1>
                      <p className="mt-2 text-sm text-stone-500 leading-relaxed font-sans">
                        Select your primary commercial focus. You can adjust this anytime in settings.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {USE_GOALS.map((goal) => {
                        const Icon = goal.icon;
                        const isSelected = selectedGoal === goal.id;
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => setSelectedGoal(goal.id)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[145px] ${
                              isSelected
                                ? "bg-white border-[#0ca656] ring-2 ring-[#0ca656]/20 shadow-xs"
                                : "bg-stone-50/60 border-stone-200 hover:border-stone-300 hover:bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-3">
                              <div className={`p-2 rounded-lg ${
                                isSelected ? "bg-[#0ca656] text-white" : "bg-stone-200 text-stone-700"
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                isSelected ? "bg-[#0ca656]/15 text-[#0ca656] font-semibold" : "bg-stone-100 text-stone-500"
                              }`}>
                                {goal.badge}
                              </span>
                            </div>

                            <div>
                              <div className="font-medium text-stone-950 text-sm mb-1">
                                {goal.title}
                              </div>
                              <p className="text-xs text-stone-500 leading-relaxed">
                                {goal.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: AGENT NAME */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#0ca656]/10 text-[#0ca656] text-xs font-mono font-medium mb-3">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Agent Identity</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 tracking-tight">
                        What would you like to name your sales agent?
                      </h1>
                      <p className="mt-2 text-sm text-stone-500 leading-relaxed font-sans">
                        This name will be visible to your customers in chat conversations.
                      </p>
                    </div>

                    <div className="space-y-5 pt-2">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold mb-2">
                          Agent Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="e.g. Anaya, Sarah, Sales Concierge"
                          className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 text-stone-950 text-base font-medium outline-hidden focus:border-stone-950 focus:ring-1 focus:ring-stone-950 transition-all shadow-2xs font-sans"
                        />
                      </div>

                      <div>
                        <span className="text-xs text-stone-400 font-sans block mb-2">Suggestions:</span>
                        <div className="flex flex-wrap gap-2">
                          {["Anaya", "Aria", "Sales Copilot", "Store Concierge", "Clara"].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setAgentName(n)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                agentName === n
                                  ? "bg-stone-950 text-white border-stone-950"
                                  : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: BRAND COLOR */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#0ca656]/10 text-[#0ca656] text-xs font-mono font-medium mb-3">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Brand Styling</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 tracking-tight">
                        Choose your chatbot theme color
                      </h1>
                      <p className="mt-2 text-sm text-stone-500 leading-relaxed font-sans">
                        Match Anaya with your brand look. Used for buttons, bubbles, and accents.
                      </p>
                    </div>

                    <div className="space-y-5 pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {PRESET_COLORS.map((col) => {
                          const isSelected = agentColor.toLowerCase() === col.hex.toLowerCase();
                          return (
                            <button
                              key={col.hex}
                              type="button"
                              onClick={() => setAgentColor(col.hex)}
                              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-white border-stone-950 ring-2 ring-stone-950/10 shadow-xs"
                                  : "bg-stone-50 border-stone-200 hover:border-stone-300"
                              }`}
                            >
                              <span
                                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white"
                                style={{ backgroundColor: col.hex }}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </span>
                              <span className="text-xs font-medium text-stone-800 truncate">
                                {col.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
                        <span className="text-xs text-stone-600 font-sans">Custom Hex Color:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={agentColor}
                            onChange={(e) => setAgentColor(e.target.value)}
                            className="w-8 h-8 rounded-md border-0 cursor-pointer p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={agentColor}
                            onChange={(e) => setAgentColor(e.target.value)}
                            className="w-24 px-2 py-1 bg-white border border-stone-200 rounded-md font-mono text-xs text-stone-800 uppercase outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isFinishing}
                className="px-4 py-2.5 rounded-md hover:bg-stone-100 text-stone-600 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isFinishing}
              className="px-6 py-3 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isFinishing ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#0ca656] animate-pulse" />
                  <span>Launching Dashboard...</span>
                </>
              ) : step === 3 ? (
                <>
                  <span>Complete & Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#0ca656]" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#0ca656]" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT CARD: FULL-HEIGHT LUXURY GREEN SILK CARD (5 Cols, Rounded-2xl Floating Card) */}
        <div className="hidden lg:flex lg:col-span-5 h-full rounded-2xl overflow-hidden relative shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] border border-[#047857]/30 bg-gradient-to-br from-[#064e29] via-[#0b6e3b] to-[#042f18] flex-col justify-between p-8 xl:p-10 text-white text-left">
          
          {/* Animated Silk Mesh Waves SVG (Full Bleed across Right Card) */}
          <svg
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-85"
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="silk-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.6" />
              </linearGradient>

              <linearGradient id="silk-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#065f46" stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="silk-sheen" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#064e3b" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Silk Ribbons & Curving Folds */}
            <path
              d="M -50 150 C 250 80, 420 480, 850 220 L 850 1000 L -50 1000 Z"
              fill="url(#silk-wave-1)"
            />
            <path
              d="M -100 380 C 280 200, 520 720, 900 480 L 900 1000 L -100 1000 Z"
              fill="url(#silk-wave-2)"
            />
            <path
              d="M 0 620 C 350 480, 480 880, 850 680 L 850 1000 L 0 1000 Z"
              fill="url(#silk-sheen)"
            />

            {/* Silk hairline highlights */}
            <path
              d="M -50 150 C 250 80, 420 480, 850 220"
              stroke="#a7f3d0"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <path
              d="M -100 380 C 280 200, 520 720, 900 480"
              stroke="#6ee7b7"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
          </svg>

          {/* Glowing Ambient Highlights */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#34d399]/25 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 right-0 w-[450px] h-[450px] bg-[#0ca656]/30 blur-3xl rounded-full pointer-events-none" />

          {/* Centered White Blur Chatbot Card with High Height */}
          <div className="relative z-10 my-auto w-full max-w-md mx-auto h-[540px] xl:h-[580px] rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/60 p-6 shadow-2xl flex flex-col justify-between text-stone-900">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center shrink-0">
                  <AnayaLogo className="w-7 h-7 transition-colors duration-300" color={agentColor} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                    <span>{agentName || "Anaya"}</span>
                    <span 
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: agentColor, boxShadow: `0 0 8px ${agentColor}` }}
                    />
                  </div>
                  <div className="text-xs text-stone-500 font-mono">
                    {selectedGoal === "sales" ? "Sales Negotiator" : "Customer Concierge"}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                Online
              </span>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 font-sans text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-stone-200/80 text-stone-800 shadow-xs max-w-[85%] leading-relaxed">
                Hello! Welcome to our store. How can I help you pick the perfect product today?
              </div>

              <div 
                className="p-3.5 rounded-2xl rounded-tr-sm ml-auto text-white max-w-[80%] text-right font-medium shadow-xs transition-colors leading-relaxed"
                style={{ backgroundColor: agentColor }}
              >
                I want to understand your pricing and delivery timeframe.
              </div>

              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-stone-200/80 text-stone-800 shadow-xs max-w-[88%] leading-relaxed space-y-2">
                <p>We provide instant shipping within 24 hours with a 30-day money-back guarantee.</p>
                <div className="pt-1 flex items-center gap-2">
                  <span 
                    className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium text-white shadow-xs cursor-pointer"
                    style={{ backgroundColor: agentColor }}
                  >
                    View Catalog
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200 transition-colors cursor-pointer">
                    Ask human agent
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Chat Input */}
            <div className="pt-3 border-t border-stone-200/60">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between text-xs text-stone-400">
                <span>Ask {agentName || "Anaya"} anything...</span>
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-colors shadow-xs"
                  style={{ backgroundColor: agentColor }}
                >
                  ↑
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quote on Silk */}
          <div className="relative z-10 border-t border-white/15 pt-4">
            <p className="text-xs xl:text-sm font-serif italic text-white/90">
              &ldquo;Trained exclusively to turn casual visitors into paying customers 24/7.&rdquo;
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
