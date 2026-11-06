"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  Search, 
  Globe, 
  FileText, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Check, 
  X,
  Database,
  ArrowUpRight,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  UploadCloud,
  HelpCircle,
  AlignLeft,
  Loader2,
  FileCode,
  FileCheck2
} from "lucide-react";

// Baseline Knowledge Pages (Empty by default until user crawls or adds pages)
const getBaseKnowledgePages = (domainName = "anavyainfotech.com") => [];

export default function KnowledgeBaseView({
  agentName = "Anaya",
  brandColor = "#0ca656",
  connectedDomain = "anavyainfotech.com",
  crawledPages = []
}) {
  const [pages, setPages] = useState(() => {
    if (crawledPages && crawledPages.length > 0) {
      return crawledPages.map((p, idx) => ({
        id: p.id || `crawl-${idx}`,
        title: p.title || p.url,
        url: p.url,
        type: "Website",
        charCount: `${p.char_count || p.markdown?.length || 1200} chars`,
        vectorsCount: Math.max(1, Math.round((p.char_count || 1200) / 700)),
        status: "Indexed",
        lastSynced: "Just now",
        summary: (p.markdown || "").slice(0, 150) + "..."
      }));
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("new"); // "new" | "old"
  const [isSyncing, setIsSyncing] = useState(false);

  // Dropdown hover & selection states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null); // 'website' | 'file' | 'faqs' | 'text' | null
  const dropdownTimeoutRef = useRef(null);

  // Form input states
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteMaxPages, setWebsiteMaxPages] = useState(5);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileError, setFileError] = useState("");
  const [faqsList, setFaqsList] = useState([{ question: "", answer: "" }]);
  const [faqTitle, setFaqTitle] = useState("Store Frequently Asked Questions");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  
  // Loading & Crawler status during submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crawlStepStatus, setCrawlStepStatus] = useState("");

  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const openModal = (type) => {
    setActiveModalType(type);
    setIsDropdownOpen(false);
    setCrawlStepStatus("");
    setFileError("");
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setActiveModalType(null);
    setCrawlStepStatus("");
  };

  // Add FAQ row
  const handleAddFaqRow = () => {
    setFaqsList((prev) => [...prev, { question: "", answer: "" }]);
  };

  // Update FAQ item
  const handleUpdateFaq = (idx, field, value) => {
    setFaqsList((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };

  // Remove FAQ item
  const handleRemoveFaq = (idx) => {
    if (faqsList.length <= 1) return;
    setFaqsList((prev) => prev.filter((_, i) => i !== idx));
  };

  // MAX FILE SIZE: 5MB (5 * 1024 * 1024 bytes)
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

  // Handle File select & reading text
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");

    // 1. Strict Size Limit Check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller file.`);
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target?.result || "";
      // Safety limit: cap preview to 30,000 characters
      setFileContent(rawText.slice(0, 30000));
    };
    reader.readAsText(file);
  };

  // Submit Handler for Crawler & Knowledge storage
  const handleSaveKnowledge = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload = {
        type: activeModalType,
        domain: connectedDomain,
      };

      if (activeModalType === "website") {
        if (!websiteUrl.trim()) return;
        setCrawlStepStatus("Launching Crawl4AI engine & traversing routes...");
        payload.url = websiteUrl.trim();
        payload.max_pages = websiteMaxPages;
      } else if (activeModalType === "file") {
        if (!fileContent.trim() && !fileName) return;
        setCrawlStepStatus("Parsing document & synthesizing embeddings...");
        payload.filename = fileName || "Document.txt";
        payload.title = fileName || "Uploaded Document";
        payload.content = fileContent;
      } else if (activeModalType === "faqs") {
        const validFaqs = faqsList.filter(f => f.question.trim() && f.answer.trim());
        if (validFaqs.length === 0) return;
        setCrawlStepStatus("Indexing FAQ questions & answer embeddings...");
        payload.title = faqTitle.trim() || "FAQs";
        payload.faqs = validFaqs;
      } else if (activeModalType === "text") {
        if (!textContent.trim()) return;
        setCrawlStepStatus("Generating 768-d Gemini vectors...");
        payload.title = textTitle.trim() || "Custom Knowledge Note";
        payload.content = textContent.trim();
      }

      // API call to backend crawl & knowledge storage
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.records && data.records.length > 0) {
        const formattedNewPages = data.records.map((r, i) => ({
          id: r.id || `kb-saved-${Date.now()}-${i}`,
          title: r.title || "Indexed Knowledge",
          url: r.url || `https://${connectedDomain}`,
          type: activeModalType === "website" ? "Website" : activeModalType === "file" ? "File" : activeModalType === "faqs" ? "FAQs" : "Text",
          charCount: `${r.char_count || r.markdown_content?.length || 1000} chars`,
          vectorsCount: Math.max(1, Math.round((r.char_count || 1000) / 600)),
          status: "Indexed",
          lastSynced: "Just now",
          summary: (r.markdown_content || "").slice(0, 150) + "..."
        }));

        setPages((prev) => [...formattedNewPages, ...prev]);
      } else {
        // Fallback optimistic card
        const optimisticCard = {
          id: `kb-${Date.now()}`,
          title: payload.title || (activeModalType === "website" ? websiteUrl : "Custom Knowledge"),
          url: payload.url || `https://${connectedDomain}`,
          type: activeModalType === "website" ? "Website" : activeModalType === "file" ? "File" : activeModalType === "faqs" ? "FAQs" : "Text",
          charCount: `${(payload.content || "").length || 1200} chars`,
          vectorsCount: Math.max(1, Math.round(((payload.content || "").length || 1200) / 500)),
          status: "Indexed",
          lastSynced: "Just now",
          summary: (payload.content || "").slice(0, 150) || "Indexed content available for autonomous answering."
        };
        setPages((prev) => [optimisticCard, ...prev]);
      }

      // Reset fields
      setWebsiteUrl("");
      setFileName("");
      setFileContent("");
      setTextTitle("");
      setTextContent("");
      setFaqsList([{ question: "", answer: "" }]);
      closeModal();
    } catch (err) {
      console.error("Save knowledge failed:", err);
      setCrawlStepStatus("Error indexing: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering & Sorting
  const filteredPages = useMemo(() => {
    return pages
      .filter((page) => {
        const matchesSearch = 
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (page.summary && page.summary.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "new") return 0;
        return -1;
      });
  }, [pages, searchQuery, sortOrder]);

  const handleDeletePage = async (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
    } catch (err) {
      // silent delete fallback
    }
  };

  const handleResetData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setPages(getBaseKnowledgePages(connectedDomain));
      setIsSyncing(false);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white font-poppins relative">
      
      {/* Top Filter & Action Bar (Matching exact h-9 & rounded-md UI) */}
      <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Left: Search Bar (h-9 rounded-md) */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64 sm:w-72 h-9 flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search indexed knowledge..."
              className="w-full h-full pl-8 pr-3 rounded-md bg-stone-100/70 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Right: Add Knowledge Hover Dropdown Button (Matching h-9 & rounded-md) */}
        <div 
          className="relative inline-block"
          onMouseEnter={handleMouseEnterDropdown}
          onMouseLeave={handleMouseLeaveDropdown}
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 inline-flex items-center gap-1.5 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] text-white text-xs font-medium transition-all shadow-xs cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Knowledge</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Hover Menu Dropdown: Website, File, FAQs, Text */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-md border border-stone-200/80 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-poppins">
              <button
                type="button"
                onClick={() => openModal("website")}
                className="w-full px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50 hover:text-[#0ca656] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-emerald-50 text-[#0ca656] flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-stone-900">Website</div>
                  <div className="text-[10px] text-stone-400">Crawl URL & pages</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => openModal("file")}
                className="w-full px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50 hover:text-[#0ca656] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-stone-900">File</div>
                  <div className="text-[10px] text-stone-400">PDF, TXT, Docs</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => openModal("faqs")}
                className="w-full px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50 hover:text-[#0ca656] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-stone-900">FAQs</div>
                  <div className="text-[10px] text-stone-400">Question & answers</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => openModal("text")}
                className="w-full px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50 hover:text-[#0ca656] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <AlignLeft className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-medium text-stone-900">Text</div>
                  <div className="text-[10px] text-stone-400">Custom context & notes</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row-Wise Table Header (Clean, borderless, transparent background) */}
      <div className="grid grid-cols-12 px-6 py-2.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider select-none shrink-0">
        <div className="col-span-4">Page / Source Document</div>
        <div className="col-span-3">URL &amp; Domain</div>
        <div className="col-span-2 hidden md:block">Vector Size</div>
        <div className="col-span-2">Sync Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Row-Wise Knowledge List (Floating Cards with 4-side margin) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredPages.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="text-sm font-medium text-stone-600">No knowledge sources found</p>
            <p className="text-xs text-stone-400">Try adjusting your search query or add a new source via the dropdown.</p>
          </div>
        ) : (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="grid grid-cols-12 items-center px-5 py-3.5 rounded-md bg-stone-50/70 hover:bg-stone-100 transition-colors group cursor-default"
            >
              {/* Col 1: Title & Preview */}
              <div className="col-span-4 flex items-center gap-3 pr-2 min-w-0">
                <div className="w-8 h-8 rounded-md bg-stone-200/70 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-2xs transition-all">
                  {page.type === "Website" ? (
                    <Globe className="w-4 h-4 text-emerald-600" />
                  ) : page.type === "File" ? (
                    <FileText className="w-4 h-4 text-stone-600" />
                  ) : page.type === "FAQs" ? (
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <AlignLeft className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-stone-900 truncate group-hover:text-stone-950">
                      {page.title}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200/60 text-stone-600 font-mono shrink-0">
                      {page.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5 font-normal">
                    {page.summary}
                  </p>
                </div>
              </div>

              {/* Col 2: URL & Domain */}
              <div className="col-span-3 min-w-0 pr-3">
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-[#0ca656] truncate max-w-full font-mono transition-colors"
                >
                  <span className="truncate">{page.url.replace(/^https?:\/\//i, "")}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                </a>
              </div>

              {/* Col 3: Vector Size & Embeddings count */}
              <div className="col-span-2 hidden md:flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span className="font-medium text-stone-700">{page.charCount}</span>
                <span className="text-[10px] text-stone-400">({page.vectorsCount} chunks)</span>
              </div>

              {/* Col 4: Sync Status with live Green Dot */}
              <div className="col-span-2 flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ca656] animate-pulse shrink-0" />
                <span className="text-stone-700 font-medium">{page.status}</span>
                <span className="text-[11px] text-stone-400 font-normal hidden lg:inline">• {page.lastSynced}</span>
              </div>

              {/* Col 5: Actions */}
              <div className="col-span-1 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => handleDeletePage(page.id)}
                  title="Remove from knowledge base"
                  className="p-1.5 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: ADD WEBSITE (CRAWL URL & INTERNAL PAGES) */}
      {activeModalType === "website" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-xl border border-stone-200 shadow-2xl p-6 space-y-4 font-poppins relative">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-emerald-50 text-[#0ca656] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">Crawl &amp; Index Website</h3>
                <p className="text-xs text-stone-400">Run Crawl4AI to scrape website pages, clean DOM and store embeddings</p>
              </div>
            </div>

            <form onSubmit={handleSaveKnowledge} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Target Website URL</label>
                <input
                  type="text"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://anavyainfotech.com or subpage"
                  className="w-full px-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Max Pages to Crawl</label>
                <div className="flex items-center gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setWebsiteMaxPages(num)}
                      className={`h-8 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        websiteMaxPages === num
                          ? "bg-[#0ca656] text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {num} Pages
                    </button>
                  ))}
                </div>
              </div>

              {crawlStepStatus && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-[#0ca656]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>{crawlStepStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !websiteUrl.trim()}
                  className="h-9 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] disabled:opacity-50 text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Crawling...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Crawling</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD FILE (PDF / TXT / DOCS) */}
      {activeModalType === "file" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-xl border border-stone-200 shadow-2xl p-6 space-y-4 font-poppins relative">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">Upload File Document</h3>
                <p className="text-xs text-stone-400">Attach product manuals, refund policy files or technical guidelines</p>
              </div>
            </div>

            <form onSubmit={handleSaveKnowledge} className="space-y-3.5 pt-2">
              <div className="border-2 border-dashed border-stone-200 rounded-md p-6 text-center hover:border-stone-300 transition-colors relative">
                <input
                  type="file"
                  accept=".txt,.md,.json,.csv,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium text-stone-800">
                    {fileName ? fileName : "Click or drag file to upload"}
                  </p>
                  <p className="text-[11px] text-stone-400">Supported: TXT, MD, CSV, JSON, PDF (Max 5MB)</p>
                </div>
              </div>

              {fileError && (
                <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-xs text-rose-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{fileError}</span>
                </div>
              )}

              {fileContent && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Content Preview ({fileContent.length} chars)</label>
                  <textarea
                    rows={4}
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden font-mono"
                  />
                </div>
              )}

              {crawlStepStatus && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-[#0ca656]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>{crawlStepStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !fileName}
                  className="h-9 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] disabled:opacity-50 text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving File...</span>
                    </>
                  ) : (
                    <span>Save &amp; Embed File</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD FAQS (QUESTION & ANSWER SETS) */}
      {activeModalType === "faqs" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[85vh] bg-white rounded-xl border border-stone-200 shadow-2xl p-6 space-y-4 font-poppins relative flex flex-col">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">Add FAQ Question &amp; Answers</h3>
                <p className="text-xs text-stone-400">Teach {agentName} standard answers to customer questions</p>
              </div>
            </div>

            <form onSubmit={handleSaveKnowledge} className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">FAQ Group Title</label>
                <input
                  type="text"
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden transition-all"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-700">Q&amp;A Pairs</label>
                  <button
                    type="button"
                    onClick={handleAddFaqRow}
                    className="text-xs text-[#0ca656] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add another FAQ
                  </button>
                </div>

                {faqsList.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-stone-50 border border-stone-200/80 space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400 font-semibold uppercase">Question #{idx + 1}</span>
                      {faqsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Do you ship all over India?"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded bg-white border border-stone-200 focus:border-[#0ca656] outline-hidden"
                    />
                    <textarea
                      rows={2}
                      placeholder="e.g. Yes! We offer free shipping across all Indian pincodes via BlueDart within 3-5 working days."
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded bg-white border border-stone-200 focus:border-[#0ca656] outline-hidden"
                    />
                  </div>
                ))}
              </div>

              {crawlStepStatus && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-[#0ca656]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>{crawlStepStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] disabled:opacity-50 text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving FAQs...</span>
                    </>
                  ) : (
                    <span>Save &amp; Embed FAQs</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TEXT (PLAIN TEXT CONTEXT / POLICIES) */}
      {activeModalType === "text" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-xl border border-stone-200 shadow-2xl p-6 space-y-4 font-poppins relative">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <AlignLeft className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">Add Custom Text Context</h3>
                <p className="text-xs text-stone-400">Paste special guidelines, doctor schedules, discounts, or terms</p>
              </div>
            </div>

            <form onSubmit={handleSaveKnowledge} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Sale 25% Off Terms"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Knowledge Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste rules, policy clauses, custom offers, or specific instructions for Anaya to follow..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#0ca656] outline-hidden font-poppins resize-none"
                />
              </div>

              {crawlStepStatus && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-[#0ca656]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>{crawlStepStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !textContent.trim()}
                  className="h-9 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] disabled:opacity-50 text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Context...</span>
                    </>
                  ) : (
                    <span>Save &amp; Embed Note</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
