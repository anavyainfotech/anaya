"use client";

import { useState } from "react";
import { 
  Bot, 
  Palette, 
  Sparkles, 
  Copy, 
  Check, 
  Code2, 
  Save, 
  SlidersHorizontal, 
  Mic, 
  Send, 
  X,
  Eye,
  MessageSquare
} from "lucide-react";

// Pre-curated modern accent colors
const COLOR_PRESETS = [
  { name: "Emerald", hex: "#0ca656" },
  { name: "Obsidian", hex: "#18181b" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#d97706" },
  { name: "Teal", hex: "#0d9488" }
];

// Conversational Behavior Personas
const BEHAVIOR_MODES = [
  {
    id: "sales_closer",
    label: "High-Converting Sales Closer",
    description: "Proactively suggests products, addresses price objections, highlights offers, and closes orders.",
    tag: "High Intent & Sales"
  },
  {
    id: "support_specialist",
    label: "24/7 Support & Helpdesk",
    description: "Resolves order tracking, policies, shipping questions, and escalates unresolved queries.",
    tag: "Customer Care"
  },
  {
    id: "lead_qualifier",
    label: "Consultative Lead Qualifier",
    description: "Collects prospective client budget, phone/email, and schedules consultations.",
    tag: "B2B & High-Ticket"
  }
];

export default function WidgetAndAgentView({
  agentName = "Anaya",
  setAgentName,
  brandColor = "#0ca656",
  setBrandColor,
  connectedDomain = "anavyainfotech.com"
}) {
  // Config states
  const [localName, setLocalName] = useState(agentName || "Anaya");
  const [localColor, setLocalColor] = useState(brandColor || "#0ca656");
  const [welcomeGreeting, setWelcomeGreeting] = useState(
    "Hi there! I am your AI sales assistant trained on your storefront catalog. Ask me anything about your products, pricing, or services!"
  );
  const [pillButtonText, setPillButtonText] = useState("Chat with us !");
  const [selectedPersona, setSelectedPersona] = useState("sales_closer");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [widgetPosition, setWidgetPosition] = useState("right"); // "right" | "left"
  
  // UI Tabs
  const [activeTab, setActiveTab] = useState("customization"); // "customization" | "embed_code"
  
  // Feedback
  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live preview test messages & thinking state
  const [previewMessages, setPreviewMessages] = useState([
    {
      role: "assistant",
      content: welcomeGreeting
    }
  ]);
  const [previewInput, setPreviewInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!previewInput.trim() || isThinking) return;

    const userText = previewInput.trim();
    setPreviewMessages(prev => [
      ...prev,
      { role: "user", content: userText }
    ]);
    setPreviewInput("");
    setIsThinking(true);

    // Realistic response with the exact 3-dot pulse timing
    setTimeout(() => {
      setIsThinking(false);
      setPreviewMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `I'm ${localName}, autonomous AI assistant for ${connectedDomain}! I can assist you with product specs, discounts, and order recommendations.`
        }
      ]);
    }, 900);
  };

  const handleSaveSettings = async () => {
    setIsSaved(true);
    if (setAgentName) setAgentName(localName);
    if (setBrandColor) setBrandColor(localColor);

    const configPayload = {
      name: localName,
      color: localColor,
      welcomeGreeting,
      pillButtonText,
      selectedPersona,
      isVoiceEnabled,
      widgetPosition
    };

    // 1. Client-side persistence
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("anaya_agent_config", JSON.stringify(configPayload));
      } catch (_) {}
    }

    // 2. Server & Database persistence: Live Sync with the Website Widget
    try {
      await fetch("/api/widget-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: connectedDomain,
          config: configPayload
        })
      });
    } catch (err) {
      console.warn("Widget sync warning:", err);
    }

    setTimeout(() => {
      setIsSaved(false);
    }, 1800);
  };

  // Generate clean embed code
  const currentHost = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://anaya-six.vercel.app";
  const embedCodeSnippet = `<!-- Anaya AI Autonomous Sales Widget -->
<script
  src="${currentHost}/widget.js"
  data-name="${localName}"
  data-color="${localColor}"
  data-position="${widgetPosition}"
  data-domain="${connectedDomain}"
  defer
></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white font-poppins">
      
      {/* Top Header & Tab Navigation (Matching exact h-9 & rounded-md UI) */}
      <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 h-9 bg-stone-100/70 p-1 rounded-md">
            <button
              type="button"
              onClick={() => setActiveTab("customization")}
              className={`h-7 px-3 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "customization"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Agent Customization</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("embed_code")}
              className={`h-7 px-3 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "embed_code"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Embed Code Snippet</span>
            </button>
          </div>
        </div>

        {/* Right: Save Changes Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="h-9 inline-flex items-center gap-1.5 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Split View: Config on Left, Exact Chatbot Widget Mockup on Right */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: CONTROLS & SETTINGS (Scrollable) */}
        <div className="w-full lg:w-[54%] xl:w-[52%] border-r border-stone-100 overflow-y-auto p-6 space-y-6">
          
          {activeTab === "customization" ? (
            <>
              {/* SECTION 1: AGENT IDENTITY */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-stone-900">Agent Identity &amp; Branding</h3>
                    <p className="text-xs text-stone-400">Name your agent and customize the visual appearance</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#0ca656] bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Agent Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-700">Agent Display Name</label>
                    <div className="relative">
                      <Bot className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 pointer-events-none" />
                      <input
                        type="text"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        placeholder="e.g. Anaya"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden transition-all text-stone-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Callout Pill Label */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-700">Trigger Button Pill Text</label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 pointer-events-none" />
                      <input
                        type="text"
                        value={pillButtonText}
                        onChange={(e) => setPillButtonText(e.target.value)}
                        placeholder="e.g. Chat with us !"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden transition-all text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Palette Presets */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-stone-700">Brand Primary Color</label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setLocalColor(color.hex)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer relative ${
                          localColor === color.hex ? "scale-115 ring-2 ring-stone-900 ring-offset-2" : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {localColor === color.hex && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        )}
                      </button>
                    ))}
                    
                    {/* Custom Hex Picker Input */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-[11px] font-mono text-stone-400">#</span>
                      <input
                        type="text"
                        value={localColor.replace("#", "")}
                        onChange={(e) => setLocalColor(`#${e.target.value}`)}
                        maxLength={6}
                        className="w-20 px-2 py-1 text-xs font-mono rounded bg-stone-100 border border-stone-200 text-stone-800 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100 my-4" />

              {/* SECTION 2: GREETING & BEHAVIOR */}
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-stone-900">Autonomous Behavior Persona</h3>
                  <p className="text-xs text-stone-400">Choose how {localName} conducts conversations with website visitors</p>
                </div>

                {/* Persona Cards */}
                <div className="space-y-2.5">
                  {BEHAVIOR_MODES.map((mode) => {
                    const isSelected = selectedPersona === mode.id;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => setSelectedPersona(mode.id)}
                        className={`p-3.5 rounded-md border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? "bg-emerald-50/40 border-[#0ca656] shadow-2xs"
                            : "bg-stone-50/60 border-stone-200/80 hover:bg-stone-100 hover:border-stone-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-stone-900">{mode.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-600 font-mono">
                              {mode.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
                            {mode.description}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "border-[#0ca656] bg-[#0ca656]" : "border-stone-300 bg-white"
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Welcome Greeting Text */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-medium text-stone-700">Initial Greeting Message</label>
                  <textarea
                    rows={3}
                    value={welcomeGreeting}
                    onChange={(e) => {
                      setWelcomeGreeting(e.target.value);
                      setPreviewMessages([
                        { role: "assistant", content: e.target.value }
                      ]);
                    }}
                    placeholder="Enter welcome message shown when widget opens..."
                    className="w-full px-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden transition-all text-stone-900 resize-none font-normal"
                  />
                </div>
              </div>

              <div className="border-t border-stone-100 my-4" />

              {/* SECTION 3: WIDGET CONTROLS */}
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-stone-900">Placement &amp; Voice Interaction</h3>
                  <p className="text-xs text-stone-400">Position on client storefront and multimodal voice input</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Position Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-700">Screen Position</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWidgetPosition("right")}
                        className={`flex-1 h-9 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                          widgetPosition === "right"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        Bottom Right (Standard)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWidgetPosition("left")}
                        className={`flex-1 h-9 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                          widgetPosition === "left"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        Bottom Left
                      </button>
                    </div>
                  </div>

                  {/* Voice-to-Text Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-700">Voice-to-Text Input</label>
                    <div
                      onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                      className="h-9 px-3 rounded-md bg-stone-50 border border-stone-200 flex items-center justify-between cursor-pointer hover:bg-stone-100/70"
                    >
                      <span className="text-xs text-stone-700 font-medium">Microphone Dictation</span>
                      <div className={`w-8 h-4 rounded-full transition-colors relative ${
                        isVoiceEnabled ? "bg-[#0ca656]" : "bg-stone-300"
                      }`}>
                        <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                          isVoiceEnabled ? "right-0.5" : "left-0.5"
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* EMBED CODE TAB */
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900">1-Minute Website Installation</h3>
                <p className="text-xs text-stone-400">
                  Paste this snippet right before the closing <code className="text-stone-700 font-mono">&lt;/body&gt;</code> tag of your website.
                </p>
              </div>

              {/* Code Snippet Container */}
              <div className="relative rounded-md bg-[#18181b] text-white p-4 font-mono text-xs overflow-hidden">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 h-8 px-3 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0ca656]" />
                      <span className="text-[#0ca656]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
                <pre className="overflow-x-auto pr-24 text-emerald-400/90 leading-relaxed">
                  {embedCodeSnippet}
                </pre>
              </div>

              {/* Platform Guides */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">Quick Platform Setup</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-md bg-stone-50 border border-stone-200/80 space-y-1">
                    <span className="text-xs font-semibold text-stone-900">Shopify</span>
                    <p className="text-[11px] text-stone-500 font-normal">
                      Go to Online Store &gt; Themes &gt; Edit Code &gt; theme.liquid. Paste snippet above &lt;/body&gt;.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-md bg-stone-50 border border-stone-200/80 space-y-1">
                    <span className="text-xs font-semibold text-stone-900">WordPress / Woo</span>
                    <p className="text-[11px] text-stone-500 font-normal">
                      Use WPCode plugin or Theme Settings &gt; Footer Scripts to paste the script tag.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-md bg-stone-50 border border-stone-200/80 space-y-1">
                    <span className="text-xs font-semibold text-stone-900">Custom React / Next.js</span>
                    <p className="text-[11px] text-stone-500 font-normal">
                      Add to your root <code className="text-stone-700 font-mono">layout.jsx</code> or append to public index.html.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: 100% IDENTICAL LIVE CHATBOT WIDGET FIELD PREVIEW */}
        <div className="hidden lg:flex flex-1 flex-col bg-stone-100/60 p-6 items-center justify-center relative overflow-hidden">
          
          {/* Mock Domain Header */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-stone-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="ml-2 font-mono text-[11px] text-stone-500">https://{connectedDomain}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <Eye className="w-3.5 h-3.5 text-[#0ca656]" />
              <span>Live Store Widget</span>
            </div>
          </div>

          {/* EXACT FLOATING CAPSULE WINDOW (IDENTICAL TO public/widget.js & Playground drawer) */}
          <div className="w-[380px] h-[580px] bg-white/95 backdrop-blur-2xl rounded-3xl border border-stone-200/90 shadow-2xl flex flex-col overflow-hidden relative font-poppins">
            
            {/* Widget Header - Frosted blur, exact Anaya starburst icon, status */}
            <div className="px-5 py-4 border-b border-stone-100/70 flex items-center justify-between bg-white/70 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill={localColor}>
                    <ellipse cx="50" cy="18" rx="6" ry="14" />
                    <ellipse cx="50" cy="82" rx="6" ry="14" />
                    <ellipse cx="18" cy="50" rx="14" ry="6" />
                    <ellipse cx="82" cy="50" rx="14" ry="6" />
                    <ellipse cx="27" cy="27" rx="6" ry="12" transform="rotate(-45 27 27)" />
                    <ellipse cx="73" cy="27" rx="6" ry="12" transform="rotate(45 73 27)" />
                    <ellipse cx="27" cy="73" rx="6" ry="12" transform="rotate(45 27 73)" />
                    <ellipse cx="73" cy="73" rx="6" ry="12" transform="rotate(-45 73 73)" />
                    <circle cx="50" cy="50" r="11" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 tracking-tight font-poppins">
                    {localName}
                  </h3>
                  <div className="text-[11px] font-medium flex items-center gap-1.5 font-poppins" style={{ color: localColor }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: localColor }} />
                    Online &bull; Instant Store Help
                  </div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-stone-100/80 text-stone-400 flex items-center justify-center">
                <X className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Messages Feed with Exact 3-Dot Keyframe Pulse */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs font-poppins">
              {previewMessages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 shrink-0 mb-1 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill={localColor}>
                          <ellipse cx="50" cy="18" rx="6" ry="14" />
                          <ellipse cx="50" cy="82" rx="6" ry="14" />
                          <ellipse cx="18" cy="50" rx="14" ry="6" />
                          <ellipse cx="82" cy="50" rx="14" ry="6" />
                          <ellipse cx="27" cy="27" rx="6" ry="12" transform="rotate(-45 27 27)" />
                          <ellipse cx="73" cy="27" rx="6" ry="12" transform="rotate(45 73 27)" />
                          <ellipse cx="27" cy="73" rx="6" ry="12" transform="rotate(45 27 73)" />
                          <ellipse cx="73" cy="73" rx="6" ry="12" transform="rotate(-45 73 73)" />
                          <circle cx="50" cy="50" r="11" />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-3xl leading-relaxed text-[13px] break-words ${
                        isUser
                          ? "bg-[#18181b] text-white"
                          : "bg-stone-100/90 text-stone-900 shadow-2xs"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Exact 3-Dot Thinking Animation */}
              {isThinking && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-6 h-6 shrink-0 mb-1 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill={localColor}>
                      <ellipse cx="50" cy="18" rx="6" ry="14" />
                      <ellipse cx="50" cy="82" rx="6" ry="14" />
                      <ellipse cx="18" cy="50" rx="14" ry="6" />
                      <ellipse cx="82" cy="50" rx="14" ry="6" />
                      <ellipse cx="27" cy="27" rx="6" ry="12" transform="rotate(-45 27 27)" />
                      <ellipse cx="73" cy="27" rx="6" ry="12" transform="rotate(45 73 27)" />
                      <ellipse cx="27" cy="73" rx="6" ry="12" transform="rotate(45 27 73)" />
                      <ellipse cx="73" cy="73" rx="6" ry="12" transform="rotate(-45 73 73)" />
                      <circle cx="50" cy="50" r="11" />
                    </svg>
                  </div>
                  <div className="px-4 py-3 rounded-3xl bg-stone-100/90 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: localColor }} />
                    <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: localColor }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: localColor }} />
                  </div>
                </div>
              )}
            </div>

            {/* EXACT CHATBOT INPUT FIELD (Matches widget capsule input, mic & send button) */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-transparent border-t border-stone-100/60 flex items-center gap-2 shrink-0"
            >
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  placeholder="Type or click mic to talk..."
                  className="w-full pl-4 pr-11 py-3 rounded-full bg-stone-100/95 text-stone-900 text-xs placeholder:text-stone-400 outline-hidden font-poppins transition-all focus:bg-stone-100"
                />
                <button
                  type="button"
                  title="Voice to text (bol kar likhein)"
                  className="absolute right-2.5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!previewInput.trim() || isThinking}
                className="w-10 h-10 rounded-full bg-[#18181b] hover:bg-stone-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-transform cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* EXACT FLOATING TRIGGER BUBBLE + PILL BADGE AT BOTTOM */}
          <div className="absolute bottom-4 right-6 flex items-center gap-3">
            {/* Pill Badge ("Chat with us !") - Exact 58px Capsule */}
            <div className="h-[46px] px-4 bg-white text-stone-900 rounded-full border border-stone-200/90 shadow-md flex items-center gap-2 text-xs font-semibold select-none">
              <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: localColor }} />
              <span>{pillButtonText}</span>
            </div>

            {/* 58px Bubble Trigger with Radiating Anaya Starburst */}
            <div 
              className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: localColor }}
            >
              <svg width="26" height="26" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                <ellipse cx="50" cy="18" rx="6" ry="14" />
                <ellipse cx="50" cy="82" rx="6" ry="14" />
                <ellipse cx="18" cy="50" rx="14" ry="6" />
                <ellipse cx="82" cy="50" rx="14" ry="6" />
                <ellipse cx="27" cy="27" rx="6" ry="12" transform="rotate(-45 27 27)" />
                <ellipse cx="73" cy="27" rx="6" ry="12" transform="rotate(45 73 27)" />
                <ellipse cx="27" cy="73" rx="6" ry="12" transform="rotate(45 27 73)" />
                <ellipse cx="73" cy="73" rx="6" ry="12" transform="rotate(-45 73 73)" />
                <circle cx="50" cy="50" r="11" />
              </svg>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
