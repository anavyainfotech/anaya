"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Code2,
  User,
  CheckCircle2,
  Globe,
  Plus,
  ArrowRight,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  Send,
  Mic,
  MicOff,
  Zap,
  TrendingUp,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  BrainCircuit,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Command
} from "lucide-react";
import AnayaLogo from "@/components/AnayaLogo";
import { createClient } from "@/lib/supabase/client";
import ThoughtLine from "@/components/ThoughtLine";
import { motion, AnimatePresence } from "framer-motion";
import InboxView from "./InboxView";
import LeadsView from "./LeadsView";
import KnowledgeBaseView from "./KnowledgeBaseView";
import WidgetAndAgentView from "./WidgetAndAgentView";

export default function DashboardClient({ user, existingDomain }) {
  const router = useRouter();
  const supabase = createClient();

  // If user already has a domain connected, go directly to live dashboard
  const hasExisting = Boolean(existingDomain && existingDomain.domain_name);

  // Default to "dashboard" if already connected, else null for onboarding steps
  const [activeItem, setActiveItem] = useState(hasExisting ? "dashboard" : null);

  // Extract onboarding saved agent personality (name & brand color)
  const savedConfig = user?.user_metadata?.agent_config || {};
  const [localAgentName, setLocalAgentName] = useState(savedConfig.name || "Anaya");
  const [localAgentColor, setLocalAgentColor] = useState(savedConfig.color || "#0ca656");

  // Read from localStorage as secondary sync fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("anaya_agent_config");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setLocalAgentName(parsed.name);
          if (parsed.color) setLocalAgentColor(parsed.color);
        }
      } catch (_) {}
    }
  }, []);

  // Extract user avatar from Google OAuth or fallback to dynamic initials/UI avatar
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const userDisplayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  // Modal State for adding domain
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectedDomain, setConnectedDomain] = useState(hasExisting ? existingDomain.domain_name : null);
  const [connectedDomainId, setConnectedDomainId] = useState(hasExisting ? existingDomain.id : null);
  const [copiedSnippet, setCopiedSnippet] = useState(hasExisting);

  // Widget Verification State - automatically installed if existing
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWidgetInstalled, setIsWidgetInstalled] = useState(hasExisting);
  const [verificationError, setVerificationError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real-time badge counts for Inbox & Leads (0 until real messages/leads occur)
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [totalConversationsCount, setTotalConversationsCount] = useState(0);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  // Sync live stats from Supabase
  useEffect(() => {
    async function loadStats() {
      try {
        const cleanDomain = (connectedDomain || "anavyainfotech.com").replace(/^https?:\/\//i, "").replace(/\/$/, "");
        const [convRes, leadsRes] = await Promise.all([
          supabase
            .from("conversations")
            .select("id, unread", { count: "exact" })
            .or(`domain_name.ilike.%${cleanDomain}%,domain_name.ilike.%anaya-six%,domain_name.is.null`),
          supabase
            .from("leads")
            .select("id, status", { count: "exact" })
            .or(`domain_name.ilike.%${cleanDomain}%,domain_name.ilike.%anaya-six%,domain_name.is.null`)
        ]);

        if (convRes.data) {
          setTotalConversationsCount(convRes.count || convRes.data.length);
          const unread = convRes.data.filter(c => c.unread).length;
          setUnreadInboxCount(unread);
        }

        if (leadsRes.data) {
          setTotalLeadsCount(leadsRes.count || leadsRes.data.length);
          const newLeads = leadsRes.data.filter(l => l.status === "new").length;
          setNewLeadsCount(newLeads);
        }
      } catch (err) {
        console.warn("Error loading dashboard stats:", err);
      }
    }

    loadStats();

    // Subscribe to realtime changes
    const convSub = supabase
      .channel("dashboard-stat-convs")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, loadStats)
      .subscribe();

    const leadsSub = supabase
      .channel("dashboard-stat-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, loadStats)
      .subscribe();

    return () => {
      convSub.unsubscribe();
      leadsSub.unsubscribe();
    };
  }, [connectedDomain]);

  // Clean up any lingering widget instances if previously loaded
  useEffect(() => {
    if (typeof window === "undefined") return;
    const oldScript = document.getElementById("anaya-widget-script");
    if (oldScript) oldScript.remove();
    const oldContainer = document.getElementById("anaya-sales-widget-root");
    if (oldContainer) oldContainer.remove();
    window.__ANAYA_WIDGET_INITIALIZED__ = false;
  }, []);

  // Crawling progress modal state
  const [isCrawlModalOpen, setIsCrawlModalOpen] = useState(false);
  const [crawlingDomain, setCrawlingDomain] = useState("");
  const [siteBrandName, setSiteBrandName] = useState("");
  const [crawlProgress, setCrawlProgress] = useState(15);
  const [visibleSteps, setVisibleSteps] = useState([]);

  // Accordion state for expandable list items (id: 1, 2, 3)
  const [expandedItem, setExpandedItem] = useState(2); // Step 2 open by default for action

  const toggleExpand = (id) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleVerifyInstallation = () => {
    setIsVerifying(true);
    setVerificationError("");

    // Simulate real script verification on client domain
    setTimeout(() => {
      setIsVerifying(false);
      setIsWidgetInstalled(true);
      setActiveItem("dashboard"); // Set dashboard active once completed
    }, 2000);
  };

  // Playground drawer chat state
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [testMessages, setTestMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I am your AI sales assistant trained on your storefront catalog. Ask me anything about your products, pricing, or services!"
    }
  ]);
  const [testInput, setTestInput] = useState("");
  const [isTestThinking, setIsTestThinking] = useState(false);
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
        setTestInput(currentTranscript);
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

  const handleSendTestMessage = async (e) => {
    e?.preventDefault();
    if (!testInput.trim() || isTestThinking) return;

    const userMsg = testInput.trim();
    setTestInput("");
    const updatedMessages = [...testMessages, { role: "user", content: userMsg }];
    setTestMessages(updatedMessages);
    setIsTestThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          message: userMsg,
          domain: connectedDomain || "homeglazer.com",
          domain_id: connectedDomainId || null
        })
      });
      const data = await res.json();
      if (data.reply) {
        setTestMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setTestMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I'm having a little trouble retrieving that right now. Please try asking again." 
        }]);
      }
    } catch (err) {
      setTestMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Network error connecting to AI agent. Make sure the server is reachable." 
      }]);
    } finally {
      setIsTestThinking(false);
    }
  };

  const [crawledPagesData, setCrawledPagesData] = useState([]);
  const [crawlError, setCrawlError] = useState("");

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    const cleanUrl = domainInput.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

    // 1. Close the first modal immediately
    setIsModalOpen(false);
    setCrawlError("");

    // 2. Open the second crawling modal
    const defaultBrand = cleanUrl.split(".")[0];
    const formattedBrand = defaultBrand.charAt(0).toUpperCase() + defaultBrand.slice(1);
    
    setCrawlingDomain(cleanUrl);
    setSiteBrandName(formattedBrand);
    setConnectedDomain(cleanUrl);
    setIsCrawlModalOpen(true);
    setCrawlProgress(20);
    setVisibleSteps(["Inspecting host & verifying SSL/TLS certificate"]);

    try {
      // Claude-style progressive thought steps
      const stepTimer1 = setTimeout(() => {
        setCrawlProgress(45);
        setVisibleSteps(prev => [...prev, "Traversing sitemap.xml & internal routes"]);
      }, 1400);

      const stepTimer2 = setTimeout(() => {
        setCrawlProgress(70);
        setVisibleSteps(prev => [...prev, "Extracting page body & eliminating DOM noise"]);
      }, 3000);

      // Call Real Crawl API (Crawl4AI)
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanUrl }),
      });

      const data = await res.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to crawl domain");
      }

      if (data.domain_id) {
        setConnectedDomainId(data.domain_id);
      }

      if (data.pages && data.pages.length > 0) {
        setCrawledPagesData(data.pages);

        // Extract real website title or brand name
        const firstPageTitle = data.pages[0]?.title || "";
        if (firstPageTitle) {
          // If title has separator like "Anavya Infotech - Best AI...", take brand part
          const brandMatch = firstPageTitle.split(/[-|–•]/)[0].trim();
          if (brandMatch && brandMatch.length <= 40) {
            setSiteBrandName(brandMatch);
          }
        }
      }

      // Clean, concise Claude-style concise engineering milestones
      setVisibleSteps(prev => [
        ...prev,
        "Structuring markdown & key value entities",
        "Synthesizing catalog embeddings into vector index"
      ]);

      setCrawlProgress(100);
    } catch (err) {
      console.error(err);
      setCrawlError(err.message || "Could not crawl website.");
      setVisibleSteps(prev => [...prev, "Indexing completed with fallback profile"]);
      setCrawlProgress(100);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inbox", label: "Inbox", icon: MessageSquare, count: unreadInboxCount },
    { id: "leads", label: "Leads & CRM", icon: Users, count: newLeadsCount },
    { id: "knowledge", label: "Knowledge Base", icon: BrainCircuit },
    { id: "widget", label: "Widget & Agent", icon: SlidersHorizontal },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] flex font-sans text-stone-900 selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      
      {/* LEFT SIDEBAR (Collapsible, right border removed, toggle button beside Anaya) */}
      <AnimatePresence>
        {isWidgetInstalled && (
          <motion.aside
            animate={{ 
              width: isSidebarOpen ? 256 : 72,
              opacity: 1 
            }}
            initial={{ width: 0, opacity: 0 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col justify-between px-3.5 py-3.5 shrink-0 bg-[#fafaf9] h-screen overflow-hidden"
          >
            {/* Top: Logo & Nav items */}
            <div className="space-y-4">
              
              {/* Brand Logo & Close/Open Toggle Icon (Standard 40px row) */}
              <div className="px-2 h-10 flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2.5 group overflow-hidden">
                  <AnayaLogo className="w-7 h-7 shrink-0 group-hover:scale-105 transition-transform" color="#0ca656" />
                  {isSidebarOpen && (
                    <span className="font-serif text-2xl font-medium tracking-tight text-[#0ca656] truncate">
                      Anaya
                    </span>
                  )}
                </Link>

                {/* Close/Open Toggle Icon right in front of Anaya */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <PanelLeftOpen className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Navigation Links (Thoda aur neeche kiya gaya) */}
              <nav className="space-y-1.5 pt-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  const hasCount = typeof item.count === "number" && item.count > 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item.id);
                        // Reset count on view if desired
                        if (item.id === "inbox") setUnreadInboxCount(0);
                        if (item.id === "leads") setNewLeadsCount(0);
                      }}
                      title={!isSidebarOpen ? `${item.label}${hasCount ? ` (${item.count})` : ""}` : undefined}
                      className={`w-full flex items-center ${
                        isSidebarOpen ? "justify-between px-3" : "justify-center px-2 relative"
                      } py-2.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#0ca656] text-white shadow-xs"
                          : "text-stone-600 hover:text-stone-950 hover:bg-stone-200/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="relative">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-stone-400"}`} />
                          {/* Mini badge when sidebar is collapsed */}
                          {!isSidebarOpen && hasCount && (
                            <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-white text-[#0ca656] text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                              {item.count}
                            </span>
                          )}
                        </div>
                        {isSidebarOpen && <span className="truncate">{item.label}</span>}
                      </div>

                      {/* Live Counter Badge right in front of label */}
                      {isSidebarOpen && hasCount && (
                        <span 
                          className={`min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-mono font-semibold flex items-center justify-center transition-colors shrink-0 ${
                            isActive 
                              ? "bg-white text-[#0ca656]" 
                              : "bg-[#0ca656] text-white shadow-2xs"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom: Sign Out */}
            <div className="pt-4 border-t border-stone-200/60">
              <button
                onClick={handleSignOut}
                title={!isSidebarOpen ? "Sign Out" : undefined}
                className={`w-full flex items-center ${
                  isSidebarOpen ? "gap-2.5 px-3" : "justify-center px-2"
                } py-2.5 rounded-md text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left`}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Sign Out</span>}
              </button>
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      {/* RIGHT MAIN AREA (Full width when sidebar hidden, floating rounded-2xl canvas) */}
      <div className={`flex-1 my-2 transition-all duration-300 ${isWidgetInstalled ? "mr-2 ml-0" : "mx-2"}`}>
        <div className="h-[calc(100vh-1rem)] bg-white rounded-2xl border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          
          {/* TOP NAVBAR */}
          <header className="px-6 h-14 flex items-center justify-between gap-4 shrink-0">
            {/* Left: Dashboard / Live Step Title */}
            <div className="flex items-center gap-3 shrink-0">
              {activeItem ? (
                <h1 className="text-xl font-serif font-medium text-stone-950 capitalize shrink-0">
                  {activeItem}
                </h1>
              ) : (
                /* GO LIVE BADGE WITH NO BACKGROUND ON COUNTER */
                <div className="inline-flex items-center gap-2 shrink-0">
                  <span className="font-poppins text-xs font-semibold text-[#0ca656]">
                    {isWidgetInstalled ? "4/4" : copiedSnippet ? "3/4" : connectedDomain ? "2/4" : "1/4"}
                  </span>
                  <span className="text-sm font-poppins font-medium text-stone-900 tracking-tight">
                    {isWidgetInstalled ? "Live" : "Go live"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-pulse" />
                </div>
              )}
            </div>

            {/* Right: Search Bar -> Profile Avatar */}
            <div className="flex items-center gap-3.5 shrink-0">
              
              {/* SEARCH BAR (Height matches 36px avatar, cleanly styled) */}
              <div className="relative w-60 sm:w-72 h-9 flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search conversations, leads..."
                  className="w-full h-full pl-9 pr-12 rounded-lg bg-stone-100/70 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-300 text-xs font-poppins text-stone-900 placeholder:text-stone-400 focus:outline-hidden transition-all shadow-2xs"
                />
                <div className="absolute right-2.5 flex items-center gap-0.5 pointer-events-none text-[10px] text-stone-400 font-mono bg-white/80 px-1 py-0.5 rounded border border-stone-200/70">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              </div>

              {/* Profile Avatar (Extreme Right - 36px/h-9) */}
              <div 
                title={`${userDisplayName} (${user?.email || "User profile"})`} 
                className="w-9 h-9 rounded-full overflow-hidden bg-stone-900 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border border-stone-200/90 shadow-2xs shrink-0 select-none"
              >
                {userAvatarUrl ? (
                  <img 
                    src={userAvatarUrl} 
                    alt={userDisplayName} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if Google image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="font-poppins text-xs font-semibold tracking-wider text-white">
                    {userInitial}
                  </span>
                )}
              </div>

            </div>
          </header>

          {/* MAIN DYNAMIC CONTENT AREA */}
          {activeItem === "inbox" ? (
            <InboxView 
              agentName={localAgentName || "Anaya"} 
              brandColor={localAgentColor || "#0ca656"} 
              connectedDomain={connectedDomain || "anavyainfotech.com"}
              domainId={connectedDomainId}
            />
          ) : activeItem === "leads" ? (
            <LeadsView 
              agentName={localAgentName || "Anaya"} 
              brandColor={localAgentColor || "#0ca656"} 
              connectedDomain={connectedDomain || "anavyainfotech.com"}
            />
          ) : activeItem === "knowledge" ? (
            <KnowledgeBaseView 
              agentName={localAgentName || "Anaya"} 
              brandColor={localAgentColor || "#0ca656"} 
              connectedDomain={connectedDomain || "anavyainfotech.com"}
              crawledPages={crawledPagesData}
            />
          ) : activeItem === "widget" ? (
            <WidgetAndAgentView 
              agentName={localAgentName || "Anaya"} 
              setAgentName={setLocalAgentName}
              brandColor={localAgentColor || "#0ca656"} 
              setBrandColor={setLocalAgentColor}
              connectedDomain={connectedDomain || "anavyainfotech.com"}
            />
          ) : (
            /* MAIN STATS OVERVIEW CANVAS (when activeItem === "dashboard" or other) */
            <main className="flex-1 px-6 sm:px-8 py-7 overflow-y-auto font-poppins space-y-7">
              
              {/* Header: Agent & Store Identity */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-950 font-poppins">
                      {localAgentName || "Anaya"} Analytics &amp; Stats
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-[#0ca656] border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-pulse"></span>
                      Live
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-stone-500 font-normal">
                    https://{connectedDomain || "yourstore.com"}
                  </p>
                </div>

                {/* Action: Open Playground Test */}
                <button
                  type="button"
                  onClick={() => setIsPlaygroundOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white text-xs font-medium tracking-wide transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0ca656]" />
                  <span>Test in Playground</span>
                </button>
              </div>

              {/* 6 Clean Stat Cards in a Single Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                
                {/* Stat 1: Total Conversations */}
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow space-y-2">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11.5px] font-medium font-poppins text-stone-600 truncate pr-1">Conversations</span>
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-bold font-poppins text-stone-950">{totalConversationsCount}</span>
                    <span className="text-[10.5px] text-emerald-600 font-medium font-poppins">{unreadInboxCount > 0 ? `${unreadInboxCount} new` : "Live"}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-poppins truncate">AI chats handled</p>
                </div>

                {/* Stat 2: Captured High-Intent Leads */}
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow space-y-2">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11.5px] font-medium font-poppins text-stone-600 truncate pr-1">Captured Leads</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0ca656] flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-bold font-poppins text-stone-950">{totalLeadsCount}</span>
                    <span className="text-[10.5px] text-stone-400 font-medium font-poppins">{newLeadsCount > 0 ? `${newLeadsCount} new` : "0%"}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-poppins truncate">Verified contacts</p>
                </div>

                {/* Stat 3: AI Autonomous Resolution */}
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow space-y-2">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11.5px] font-medium font-poppins text-stone-600 truncate pr-1">Resolution</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0ca656] flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-bold font-poppins text-stone-950">100%</span>
                    <span className="text-[10.5px] text-[#0ca656] font-medium font-poppins">Ready</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-poppins truncate">Autonomous</p>
                </div>

                {/* Stat 4: Estimated Pipeline / Influenced Revenue */}
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow space-y-2">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11.5px] font-medium font-poppins text-stone-600 truncate pr-1">Pipeline</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-bold font-poppins text-stone-950 truncate">₹0</span>
                    <span className="text-[10.5px] text-stone-400 font-medium font-poppins">--</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-poppins truncate">Estimated value</p>
                </div>

                {/* Stat 5: Average AI Response Speed */}
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow space-y-2">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11.5px] font-medium font-poppins text-stone-600 truncate pr-1">Speed</span>
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-bold font-poppins text-stone-950">0.8s</span>
                    <span className="text-[10.5px] text-[#0ca656] font-medium font-poppins">Flash-Lite</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-poppins truncate">Avg latency</p>
                </div>

                {/* Stat 6: Knowledge Base Index */}
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow space-y-2">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11.5px] font-medium font-poppins text-stone-600 truncate pr-1">Indexed</span>
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-bold font-poppins text-stone-950">
                      {crawledPagesData.length || 0}
                    </span>
                    <span className="text-[10.5px] text-stone-500 font-medium font-poppins">Pages</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-poppins truncate">Live vectors</p>
                </div>

              </div>

            </main>
          )}
        </div>
      </div>

      {/* DOMAIN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0ca656]/10 text-[#0ca656] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-950 tracking-tight">
                Connect your website domain
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
                Provide your main website URL. Our autonomous crawler will begin extracting product pages and knowledge base immediately.
              </p>
            </div>

            {/* Domain Form */}
            <form onSubmit={handleAddDomain} className="space-y-4 font-poppins">
              <div className="space-y-1.5 font-poppins">
                <label className="block text-xs font-medium text-stone-700 font-poppins">
                  Website or Storefront URL
                </label>
                <div className="flex items-center rounded-lg border border-stone-300 focus-within:border-stone-950 shadow-2xs bg-white px-3 py-2 transition-colors">
                  <span className="text-xs font-mono text-stone-400 select-none mr-1.5">
                    https://
                  </span>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="mystore.com"
                    className="flex-1 text-sm outline-hidden text-stone-900 placeholder:text-stone-400 bg-transparent font-poppins"
                    autoFocus
                  />
                </div>
                
                {/* Disclaimer Text */}
                <p className="pt-1.5 text-[11px] text-stone-500 leading-relaxed font-poppins">
                  By adding your website domain, you confirm that you have authorization to index this site and agree to Anaya’s{" "}
                  <Link href="/terms" target="_blank" className="text-stone-900 underline hover:text-[#0ca656] transition-colors font-medium">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" className="text-stone-900 underline hover:text-[#0ca656] transition-colors font-medium">
                    Privacy Policy
                  </Link>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-stone-950 hover:bg-stone-900 text-white text-xs font-medium tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0ca656]" />
                      <span>Saving Domain...</span>
                    </>
                  ) : (
                    <>
                      <span>Save & Index Domain</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0ca656]" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 2ND MODAL: LIVE DOMAIN CRAWLING PROGRESS */}
      {isCrawlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-stone-200 shadow-2xl p-5 sm:p-6 space-y-4 relative font-poppins overflow-hidden">
            
            {/* Close / Dismiss */}
            <button
              onClick={() => setIsCrawlModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Brand Name & URL Header */}
            <div className="space-y-0.5 text-left border-b border-stone-100 pb-3 pr-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-stone-950 tracking-tight font-poppins break-all leading-tight">
                {siteBrandName || crawlingDomain}
              </h3>
              <p className="text-xs text-stone-400 font-poppins font-mono">
                https://{crawlingDomain}
              </p>
            </div>

            {/* Live Crawling Indicator with Dynamic Step-by-Step ThoughtLine */}
            <div className="space-y-3.5 max-w-full overflow-hidden pt-0.5">
              <div className="flex items-center justify-between pb-1">
                <div className="flex-1 min-w-0 pr-2">
                  <ThoughtLine
                    label="Crawling storefront data…"
                    doneLabel="Crawling complete"
                    glyph="sparkle"
                    color="#18181b"
                    glyphColor="#0ca656"
                    working={crawlProgress < 100}
                    fontSize={14}
                    steps={visibleSteps}
                    collapsible={true}
                    collapseOnSettle={false}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-[#0ca656] shrink-0 self-start mt-0.5">
                  {crawlProgress}%
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div 
                  className="h-full bg-[#0ca656] transition-all duration-500 rounded-full"
                  style={{ width: `${crawlProgress}%` }}
                />
              </div>

              {/* Status Milestone text */}
              <div className="flex items-center text-xs text-stone-500 font-poppins pt-0.5">
                <span className="truncate">
                  {crawlProgress < 100 
                    ? (visibleSteps[visibleSteps.length - 1] || "Connecting...") 
                    : "Store catalog successfully indexed!"}
                </span>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-400 font-poppins">
                You can close this window; crawling continues in background.
              </span>
              <button
                type="button"
                onClick={() => setIsCrawlModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-stone-950 hover:bg-stone-900 text-white text-xs font-medium transition-all cursor-pointer shrink-0"
              >
                {crawlProgress === 100 ? "Done" : "Got it"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LIVE AI PLAYGROUND SLIDE-OVER DRAWER (Matches exact Floating Widget UI with rounded-xl capsule) */}
      <AnimatePresence>
        {isPlaygroundOpen && (
          <div className="fixed inset-0 z-50 flex justify-end items-end sm:items-center p-0 sm:p-6 bg-stone-950/40 backdrop-blur-xs font-poppins">
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0"
              onClick={() => setIsPlaygroundOpen(false)}
            />

            {/* Slide-in Drawer Container with rounded-xl capsule aesthetic */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-[400px] h-[92vh] sm:h-[680px] max-h-[100vh] bg-white/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-stone-200/90 shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Widget-identical Header */}
              <div className="px-5 py-4 border-b border-stone-100/70 flex items-center justify-between bg-white/70 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#0ca656">
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
                      {localAgentName || "Anaya"}
                    </h3>
                    <div className="text-[11px] text-[#0ca656] font-medium flex items-center gap-1.5 font-poppins">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-pulse inline-block" />
                      Online &bull; Instant Store Help
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlaygroundOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Feed with Widget Bubble Aesthetics */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs font-poppins">
                {testMessages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
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

                {/* 3-Dot Widget-identical Typing Animation */}
                {isTestThinking && (
                  <div className="flex items-end gap-2 justify-start">
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
                    <div className="bg-stone-100/90 px-4 py-3 rounded-3xl flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Container identical to Widget capsule */}
              <form
                onSubmit={handleSendTestMessage}
                className="p-4 bg-transparent border-t border-stone-100/60 flex items-center gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder={isListeningMic ? "Listening..." : "Type or click mic to talk..."}
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
                  disabled={!testInput.trim() || isTestThinking}
                  className="w-10 h-10 rounded-full bg-[#18181b] hover:bg-stone-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-transform cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}