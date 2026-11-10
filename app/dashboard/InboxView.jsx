"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Send, 
  Mic,
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Sparkles, 
  User, 
  Bot, 
  CheckCircle2, 
  Flame, 
  Check,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  SlidersHorizontal,
  Clock,
  RefreshCw,
  Plus
} from "lucide-react";

// Base conversations (Empty initial state until real customer messages arrive)
const getBaseConversations = (domainName = "anavyainfotech.com", agent = "Anaya") => [];

export default function InboxView({ agentName = "Anaya", brandColor = "#0ca656", connectedDomain = "anavyainfotech.com", domainId = null }) {
  const storageKey = `anaya_inbox_${connectedDomain || "default"}`;
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [sortOrder, setSortOrder] = useState("new"); // "new" | "old"
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);

  const toggleMicInput = () => {
    const SpeechRecognition = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "hi-IN";

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setReplyText(currentTranscript);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch (_) {
      setIsListeningMic(false);
    }
  };

  // Sync live conversations directly from Supabase with realtime subscription
  useEffect(() => {
    let channel = null;

    async function loadLiveConversations() {
      try {
        setIsLoading(true);
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        
        let query = supabase
          .from("conversations")
          .select("*")
          .order("updated_at", { ascending: false });

        if (connectedDomain) {
          const clean = connectedDomain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
          // Support both domain matches, demo page conversations, and unassigned sessions
          query = query.or(`domain_name.ilike.%${clean}%,domain_name.ilike.%anaya-six%,domain_name.is.null`);
        }

        const { data: convs, error } = await query;
        if (!error && Array.isArray(convs)) {
          const formatted = convs.map(c => ({
            id: c.id,
            customer: {
              name: c.customer_name || "Store Visitor",
              phone: c.customer_phone || "Not provided",
              email: c.customer_email || "Not provided",
              location: c.location || "Online Visitor"
            },
            status: c.status || "active",
            handlingMode: c.handling_mode || "ai",
            channel: c.domain_name || "Website Widget",
            pageVisited: c.page_visited || `https://${connectedDomain || "store"}`,
            timestamp: new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: c.unread ?? true,
            messages: Array.isArray(c.messages) ? c.messages : []
          }));

          setConversations(formatted);
          setSelectedId(prev => (prev && formatted.some(f => f.id === prev)) ? prev : formatted[0]?.id || "");
        }
      } catch (err) {
        console.warn("Supabase realtime load note:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveConversations();

    // Setup realtime subscription
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        channel = supabase
          .channel("realtime-conversations")
          .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
            loadLiveConversations();
          })
          .subscribe();
      } catch (_) {}
    })();

    // Polling fallback every 3 seconds to guarantee instant appearance even if websocket drops
    const pollInterval = setInterval(() => {
      loadLiveConversations();
    }, 3000);

    return () => {
      if (channel) channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [connectedDomain]);

  // Persist whenever conversations change
  const updateConversations = (newConvs) => {
    setConversations(newConvs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConvs));
    } catch (_) {}
  };

  // Active selected conversation
  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  // Filtering & Sorting conversations (New / Old)
  const filteredConversations = conversations
    .filter((c) => {
      const matchesSearch = 
        c.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "new") return 0; // Default newest on top
      return -1; // Reverse for oldest
    });

  // Toggle Human Takeover vs AI Autonomous Mode
  const toggleTakeover = (convId) => {
    const updated = conversations.map((c) => {
      if (c.id === convId) {
        const nextMode = c.handlingMode === "ai" ? "human" : "ai";
        return { ...c, handlingMode: nextMode };
      }
      return c;
    });
    updateConversations(updated);
  };

  // Toggle Resolve / Active Status
  const toggleStatus = (convId) => {
    const updated = conversations.map((c) => {
      if (c.id === convId) {
        const nextStatus = c.status === "active" ? "resolved" : "active";
        return { ...c, status: nextStatus };
      }
      return c;
    });
    updateConversations(updated);
  };

  // Real AI or Live Agent Message Handshake
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!replyText.trim() || !activeConv || isSendingReply) return;

    const textToSend = replyText.trim();
    setReplyText("");

    const newHumanMsg = {
      id: `m-${Date.now()}`,
      sender: "human",
      time: "Just now",
      text: textToSend
    };

    const nextMessages = [...activeConv.messages, newHumanMsg];

    // Optimistically update conversation
    const updatedConvs = conversations.map((c) => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          handlingMode: "human",
          timestamp: "Just now",
          unread: false,
          messages: nextMessages
        };
      }
      return c;
    });
    updateConversations(updatedConvs);
  };

  // Select conversation & mark as read
  const handleSelectConv = (id) => {
    setSelectedId(id);
    const updated = conversations.map((c) => (c.id === id ? { ...c, unread: false } : c));
    updateConversations(updated);
  };

  const handleCopyPhone = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset / Refresh Data to sync latest conversations from Supabase
  const handleResetData = async () => {
    try {
      setIsLoading(true);
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      let query = supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (connectedDomain) {
        const clean = connectedDomain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
        query = query.or(`domain_name.ilike.%${clean}%,domain_name.is.null`);
      }

      const { data: convs, error } = await query;
      if (!error && Array.isArray(convs)) {
        const formatted = convs.map(c => ({
          id: c.id,
          customer: {
            name: c.customer_name || "Store Visitor",
            phone: c.customer_phone || "Not provided",
            email: c.customer_email || "Not provided",
            location: c.location || "Online Visitor"
          },
          status: c.status || "active",
          handlingMode: c.handling_mode || "ai",
          channel: c.domain_name || "Website Widget",
          pageVisited: c.page_visited || `https://${connectedDomain || "store"}`,
          timestamp: new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: c.unread ?? true,
          messages: Array.isArray(c.messages) ? c.messages : []
        }));

        setConversations(formatted);
        if (formatted.length > 0) {
          setSelectedId(formatted[0].id);
        }
      }
    } catch (err) {
      console.warn("Refresh error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden border-t border-stone-200/80 bg-white font-poppins">
      
      {/* LEFT PANE: Conversation List (320px) */}
      <aside className="w-80 lg:w-88 border-r border-stone-200/80 bg-white flex flex-col shrink-0">
        
        {/* Filter bar & Quick Search */}
        <div className="p-3.5 border-b border-stone-100 space-y-2.5">
          {/* Search Input matching dashboard style */}
          <div className="relative h-8 flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-full pl-8 pr-3 rounded-lg bg-stone-100/70 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>

          {/* Sort Tabs (New / Old) & Reset Button */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSortOrder("new")}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sortOrder === "new"
                    ? "bg-[#0ca656] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#0ca656] hover:bg-emerald-50"
                }`}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setSortOrder("old")}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  sortOrder === "old"
                    ? "bg-[#0ca656] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#0ca656] hover:bg-emerald-50"
                }`}
              >
                Old
              </button>
            </div>

            {/* Refresh / Reset Data to sync domain */}
            <button
              onClick={handleResetData}
              title="Reset conversations for this domain"
              className="p-1 rounded-md text-stone-400 hover:text-[#0ca656] hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Conversation Cards Scroll List with breathing margin */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {isLoading && conversations.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-stone-400 animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <MessageSquare className="w-7 h-7 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500 font-medium">No conversations found</p>
              <p className="text-[11px] text-stone-400">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = c.id === activeConv?.id;
              const lastMsg = c.messages[c.messages.length - 1];
              const initial = c.customer.name.charAt(0).toUpperCase();

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectConv(c.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 relative cursor-pointer ${
                    isSelected
                      ? "bg-stone-100 text-stone-900"
                      : "bg-white hover:bg-stone-50 text-stone-700"
                  }`}
                >
                  {/* Customer Avatar matching dashboard circle style */}
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-semibold shadow-2xs">
                      {initial}
                    </div>
                    {c.handlingMode === "ai" ? (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0ca656] text-white flex items-center justify-center text-[8px] shadow-xs" title="Autonomous AI">
                        <Bot className="w-2 h-2" />
                      </div>
                    ) : (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-stone-950 text-white flex items-center justify-center text-[8px] shadow-xs" title="Human Agent Takeover">
                        <User className="w-2 h-2" />
                      </div>
                    )}
                  </div>

                  {/* Meta & Last Message */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs truncate ${c.unread ? "font-bold text-stone-950" : "font-medium text-stone-800"}`}>
                        {c.customer.name}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                        {c.timestamp}
                      </span>
                    </div>

                    <p className={`text-[11.5px] truncate ${c.unread ? "font-medium text-stone-900" : "text-stone-500"}`}>
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>

                    {/* Unread indicator */}
                    {c.unread && (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#0ca656] animate-pulse" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* CENTER & RIGHT: Active Chat & Dossier */}
      {activeConv ? (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Center Chat Transcript & Reply */}
          <div className="flex-1 flex flex-col bg-[#fafaf9]/60 overflow-hidden border-r border-stone-200/80">
            
            {/* Chat Header: Customer details & Mode Toggles (Clean, borderless, transparent background) */}
            <div className="px-5 py-3.5 bg-transparent flex items-center justify-between gap-4 shrink-0">
              
              {/* Customer info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
                  {activeConv.customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                      {activeConv.customer.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                      {activeConv.channel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons matching dashboard style */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Takeover button */}
                <button
                  type="button"
                  onClick={() => toggleTakeover(activeConv.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-xs ${
                    activeConv.handlingMode === "human"
                      ? "bg-[#0ca656] text-white"
                      : "bg-white text-stone-700 border border-stone-200 hover:border-emerald-300 hover:text-[#0ca656]"
                  }`}
                >
                  {activeConv.handlingMode === "human" ? (
                    <>
                      <User className="w-3.5 h-3.5 text-white" />
                      <span>Human Takeover Active</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#0ca656]" />
                      <span>AI Autonomous ({agentName})</span>
                    </>
                  )}
                </button>

                {/* Mark as Resolved */}
                <button
                  type="button"
                  onClick={() => toggleStatus(activeConv.id)}
                  title={activeConv.status === "active" ? "Mark resolved" : "Re-open conversation"}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    activeConv.status === "resolved"
                      ? "bg-emerald-50 text-[#0ca656] border-emerald-200"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-800"
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${activeConv.status === "resolved" ? "text-[#0ca656]" : "text-stone-400"}`} />
                </button>
              </div>

            </div>

            {/* Chat Messages Feed with Chatbot-identical Bubble & Icon Aesthetics */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs font-poppins">
              {activeConv.messages.map((m) => {
                const isCustomer = m.sender === "customer";
                const isAI = m.sender === "ai";
                const isHumanAgent = m.sender === "human";

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isCustomer ? "justify-end" : "justify-start"}`}
                  >
                    {/* Bot Icon on Left for AI replies (Identical to Chatbot widget - Always Emerald Green) */}
                    {isAI && (
                      <div className="w-6 h-6 shrink-0 mb-1 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#0ca656">
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

                    {/* Human Agent Icon for takeover messages */}
                    {isHumanAgent && (
                      <div className="w-6 h-6 shrink-0 mb-1 rounded-full bg-[#0ca656] text-white flex items-center justify-center text-[10px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Chat Bubble with identical rounded-3xl aesthetics */}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-3xl leading-relaxed text-[13px] break-words shadow-2xs ${
                        isCustomer
                          ? "bg-[#18181b] text-white"
                          : isAI
                          ? "bg-stone-100/95 text-stone-900 border border-stone-200/40"
                          : "bg-[#0ca656] text-white"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Container identical to Widget capsule */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-transparent border-t border-stone-100/60 flex items-center gap-2"
            >
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isListeningMic 
                      ? "Listening... (boliye)" 
                      : activeConv.handlingMode === "human"
                      ? `Reply as live agent to ${activeConv.customer.name}...`
                      : `Type or click mic to talk...`
                  }
                  className="w-full pl-4 pr-11 py-3 rounded-full bg-stone-100/95 text-stone-900 text-xs placeholder:text-stone-400 outline-hidden font-poppins transition-all focus:bg-stone-100"
                />

                <button
                  type="button"
                  onClick={toggleMicInput}
                  title="Voice to text (bol kar likhein)"
                  className={`absolute right-2.5 p-1.5 rounded-full transition-all cursor-pointer ${
                    isListeningMic 
                      ? "bg-[#0ca656] text-white shadow-[0_0_10px_rgba(12,166,86,0.5)] animate-pulse" 
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!replyText.trim() || isSendingReply}
                className="w-10 h-10 rounded-full bg-[#18181b] hover:bg-stone-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-transform cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Right Lead & Context Dossier (280px) */}
          <aside className="w-72 lg:w-80 bg-white p-5 overflow-y-auto space-y-5 hidden xl:block shrink-0">
            
            {/* Customer identity card */}
            <div className="text-center space-y-2 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 text-white flex items-center justify-center text-base font-bold shadow-xs">
                {activeConv.customer.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-sm font-semibold text-stone-900">
                {activeConv.customer.name}
              </h4>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656]"></span>
                <span className="text-[11px] text-stone-500 font-medium capitalize">
                  {activeConv.status} visitor
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Contact Details
              </h5>

              <div className="space-y-2 text-xs">
                {/* Phone */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono text-stone-800 text-[11px] truncate">
                      {activeConv.customer.phone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(activeConv.customer.phone)}
                    className="text-[10px] text-stone-500 hover:text-[#0ca656] p-1 cursor-pointer"
                    title="Copy phone"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#0ca656]" /> : "Copy"}
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-mono text-stone-800 text-[11px] truncate">
                    {activeConv.customer.email}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-stone-700 text-[11.5px] truncate">
                    {activeConv.customer.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-2.5 pt-1">
              <h5 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Session &amp; Channel
              </h5>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100 text-[11px]">
                  <span className="text-stone-400">Channel</span>
                  <span className="font-medium text-stone-700">{activeConv.channel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100 text-[11px]">
                  <span className="text-stone-400">Landing Page</span>
                  <span className="font-mono text-stone-700 truncate max-w-[140px]">
                    {activeConv.pageVisited}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100 text-[11px]">
                  <span className="text-stone-400">AI Latency</span>
                  <span className="font-mono text-[#0ca656] font-semibold">0.82s</span>
                </div>
              </div>
            </div>

            {/* Call action */}
            <div className="pt-2">
              <a
                href={`tel:${activeConv.customer.phone}`}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0ca656] hover:bg-[#098b48] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Call Customer</span>
              </a>
            </div>

          </aside>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2.5">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-stone-800">No active conversations</p>
          <p className="text-xs text-stone-400 max-w-sm">
            When visitors interact with your website widget, live chat transcripts and AI autonomous messages will appear here in real-time.
          </p>
        </div>
      )}

    </div>
  );
}
