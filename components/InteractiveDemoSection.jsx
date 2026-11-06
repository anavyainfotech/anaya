"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, CheckCircle2, User, Bot, RefreshCw } from "lucide-react";

const DEMO_PRESETS = [
  {
    store: "Luxe Footwear (E-Commerce)",
    url: "https://luxefootwear.store",
    initialMessage: "Hey! Looking for casual sneakers or waterproof trail runners today? I can help you find your exact fit.",
    suggestedReplies: [
      "Show me waterproof runners under $150",
      "Do you offer free exchange in India?",
      "Can I get a discount for first order?",
    ],
  },
  {
    store: "Apex SaaS (B2B Software)",
    url: "https://apexflow.io",
    initialMessage: "Welcome to Apex! Are you exploring our workflow automation for your sales team or customer support?",
    suggestedReplies: [
      "Does it integrate with HubSpot?",
      "How fast can my team deploy this?",
      "Book a live demo with the sales head",
    ],
  },
];

export default function InteractiveDemoSection() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const activePreset = DEMO_PRESETS[selectedPresetIndex];

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: activePreset.initialMessage,
      time: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Switch presets cleanly
  const handleSelectPreset = (index) => {
    setSelectedPresetIndex(index);
    setMessages([
      {
        sender: "bot",
        text: DEMO_PRESETS[index].initialMessage,
        time: "Just now",
      },
    ]);
    setInputValue("");
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text, time: "Just now" }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    // Simulate smart consultative AI response
    setTimeout(() => {
      let botReply = "";
      const lower = text.toLowerCase();

      if (lower.includes("waterproof") || lower.includes("sneakers") || lower.includes("runners")) {
        botReply = "Our Apex Trail-X is fully waterproof with Gore-Tex lining, priced at $139 (within your $150 budget). What is your shoe size so I can check live stock?";
      } else if (lower.includes("exchange") || lower.includes("return")) {
        botReply = "Yes! We provide 100% free 14-day doorstep exchange across India. No questions asked.";
      } else if (lower.includes("discount") || lower.includes("coupon")) {
        botReply = "You can use code LUXE10 for 10% off today! Would you like me to reserve your pair and text you the direct checkout link on WhatsApp?";
      } else if (lower.includes("hubspot") || lower.includes("integrate")) {
        botReply = "Yes! We have a native 1-click HubSpot integration that syncs contacts, pipeline deals, and customer activity in real time.";
      } else if (lower.includes("fast") || lower.includes("deploy")) {
        botReply = "Deployment takes under 3 minutes. Just paste your website URL, copy 1 script tag, and Anaya goes live immediately.";
      } else if (lower.includes("book") || lower.includes("demo")) {
        botReply = "I'd love to set that up! What's your WhatsApp number or email address? I'll schedule the consultation right away.";
      } else {
        botReply = `Got it! I found that in our knowledge base. Would you like me to send you the direct product link or connect you with our team?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          time: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section id="demo" className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 py-14 sm:py-20 border-t border-stone-200/60 bg-[#fafaf9]">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-10 sm:mb-14 text-left">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
          Experience Anaya in action
        </h2>
        <p className="mt-4 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
          Test her live below. See how she navigates customer queries, understands intent, and steers the chat toward closing high-value sales.
        </p>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls & Presets */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          
          <div className="p-6 rounded-md bg-white border border-stone-200/90 shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold block mb-2">
              Select Sample Live Website
            </span>
            <div className="space-y-2.5">
              {DEMO_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSelectPreset(pIdx)}
                  className={`w-full p-4 rounded-md text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedPresetIndex === pIdx
                      ? "bg-stone-950 text-white shadow-md"
                      : "bg-[#fafaf9] hover:bg-stone-100 text-stone-900 border border-stone-200/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-medium text-base sm:text-lg">
                      {preset.store}
                    </span>
                    {selectedPresetIndex === pIdx && (
                      <span className="w-2 h-2 rounded-full bg-[#0ca656] shadow-[0_0_8px_#0ca656]" />
                    )}
                  </div>
                  <span className={`text-xs font-mono truncate ${
                    selectedPresetIndex === pIdx ? "text-stone-400" : "text-stone-500"
                  }`}>
                    {preset.url}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Value callouts */}
          <div className="p-6 rounded-md bg-stone-100/60 border border-stone-200/60 space-y-3.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
              Autonomous Intelligence
            </span>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#0ca656] shrink-0 mt-0.5" />
              <span>Answers strictly from crawled website content</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#0ca656] shrink-0 mt-0.5" />
              <span>Qualifies visitor intent before asking for contact info</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#0ca656] shrink-0 mt-0.5" />
              <span>Recommends relevant products or consultation slots</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Chat Window */}
        <div className="lg:col-span-7">
          <div className="w-full bg-white rounded-md border border-stone-200/90 shadow-xl overflow-hidden flex flex-col h-[540px]">
            
            {/* Chat Top Bar */}
            <div className="p-4 sm:p-5 bg-stone-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#0ca656]/20 border border-[#0ca656]/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#0ca656]" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#0ca656] ring-2 ring-stone-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-base text-white">Anaya</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0ca656]/20 text-[#0ca656] font-semibold">
                      Live Agent
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-sans block">
                    Trained on {activePreset.url}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelectPreset(selectedPresetIndex)}
                title="Reset Conversation"
                className="p-2 rounded-md hover:bg-stone-900 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fafaf9]">
              {messages.map((msg, mIdx) => (
                <div
                  key={mIdx}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                      msg.sender === "user"
                        ? "bg-stone-900 text-white"
                        : "bg-[#0ca656] text-white"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-md px-4 py-3 text-xs sm:text-sm font-sans leading-relaxed text-left shadow-xs ${
                      msg.sender === "user"
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-900 border border-stone-200/80"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-stone-400 text-xs font-sans pl-9">
                  <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-stone-500">Anaya is looking up the knowledge base...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="px-4 py-2 bg-stone-50 border-t border-stone-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold shrink-0">
                Ask:
              </span>
              {activePreset.suggestedReplies.map((reply, rIdx) => (
                <button
                  key={rIdx}
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-stone-950 text-stone-700 hover:text-white border border-stone-200/80 text-[11.5px] font-sans whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-stone-200/80 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question or try a suggested chip above..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 rounded-md border border-stone-200 outline-hidden focus:border-stone-900 transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-2.5 rounded-md bg-[#0ca656] hover:bg-[#0ca656]/90 disabled:opacity-40 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>

      </div>

    </section>
  );
}
