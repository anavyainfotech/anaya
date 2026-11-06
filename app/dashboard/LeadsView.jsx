"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Download, 
  Phone, 
  Mail, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  RefreshCw,
  X,
  Trash2,
  ChevronDown
} from "lucide-react";

// Baseline leads data (Empty by default until real visitor contacts are captured)
const getBaseLeads = (domainName = "anavyainfotech.com") => [];

export default function LeadsView({ 
  agentName = "Anaya", 
  brandColor = "#0ca656", 
  connectedDomain = "anavyainfotech.com" 
}) {
  const [leads, setLeads] = useState(() => []);

  // Sync live leads directly from Supabase with realtime subscription
  useEffect(() => {
    let channel = null;

    async function loadLiveLeads() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        
        let query = supabase
          .from("leads")
          .select("*")
          .order("captured_at", { ascending: false });

        if (connectedDomain) {
          const clean = connectedDomain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
          query = query.ilike("domain_name", `%${clean}%`);
        }

        const { data: leadData, error } = await query;
        if (!error && Array.isArray(leadData) && leadData.length > 0) {
          const formatted = leadData.map(l => ({
            id: l.id,
            name: l.name,
            phone: l.phone || "Not provided",
            email: l.email || "Not provided",
            company: l.company || "Website Visitor",
            status: l.status || "new",
            estimatedValue: l.estimated_value || "₹0",
            sourcePage: l.source_page || `https://${connectedDomain}`,
            notes: l.notes || "Captured via Anaya AI widget.",
            capturedAt: new Date(l.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

          setLeads(formatted);
        }

        // Realtime listener for incoming leads
        channel = supabase
          .channel("realtime-leads")
          .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
            loadLiveLeads();
          })
          .subscribe();

      } catch (err) {
        console.warn("Supabase realtime lead load note:", err);
      }
    }

    loadLiveLeads();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [connectedDomain]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("new"); // "new" | "old"
  const [copiedId, setCopiedId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for manual lead modal
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadValue, setNewLeadValue] = useState("");
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "new") return 0;
        return -1;
      });
  }, [leads, searchQuery, sortOrder]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const handleDeleteLead = (leadId) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleResetData = () => {
    setLeads(getBaseLeads(connectedDomain));
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    const newLead = {
      id: `lead-${Date.now()}`,
      name: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      email: newLeadEmail.trim() || "not_provided@client.com",
      company: newLeadCompany.trim() || "Direct Customer",
      status: "new",
      estimatedValue: newLeadValue.trim() ? `₹${newLeadValue.trim().replace(/^₹/, "")}` : "₹2,500",
      sourcePage: `https://${connectedDomain}/manual`,
      notes: newLeadNotes.trim() || "Added via dashboard.",
      capturedAt: "Just now"
    };

    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewLeadName("");
    setNewLeadPhone("");
    setNewLeadEmail("");
    setNewLeadCompany("");
    setNewLeadValue("");
    setNewLeadNotes("");
  };

  const handleExportCSV = () => {
    const headers = ["Name,Phone,Email,Company,Status,Value,Source,Date"];
    const rows = leads.map(
      (l) => `"${l.name}","${l.phone}","${l.email}","${l.company}","${l.status}","${l.estimatedValue}","${l.sourcePage}","${l.capturedAt}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anaya_leads_${connectedDomain}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4.5rem)] font-poppins overflow-hidden bg-white border-t border-stone-200/80">
      
      {/* Top Action & Filter Bar */}
      <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Left: Search Bar (h-9 rounded-md) + New/Old Sort Tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64 sm:w-72 h-9 flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full h-full pl-8 pr-3 rounded-md bg-stone-100/70 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] h-9">
            <button
              type="button"
              onClick={() => setSortOrder("new")}
              className={`h-9 px-3.5 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center ${
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
              className={`h-9 px-3.5 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center ${
                sortOrder === "old"
                  ? "bg-[#0ca656] text-white shadow-xs"
                  : "text-stone-600 hover:text-[#0ca656] hover:bg-emerald-50"
              }`}
            >
              Old
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            title="Reset leads list"
            className="w-9 h-9 rounded-md text-stone-400 hover:text-[#0ca656] hover:bg-emerald-50 transition-colors cursor-pointer flex items-center justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Export CSV & Add Lead (Matching h-9 & rounded-md) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-9 inline-flex items-center gap-1.5 px-3.5 rounded-md border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 inline-flex items-center gap-1.5 px-4 rounded-md bg-[#0ca656] hover:bg-[#098b48] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Row-Wise Table Header (Clean, borderless, transparent background) */}
      <div className="grid grid-cols-12 px-6 py-2.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider select-none shrink-0">
        <div className="col-span-3">Customer</div>
        <div className="col-span-3">Contact</div>
        <div className="col-span-2 hidden md:block">Company</div>
        <div className="col-span-2 hidden sm:block">Value</div>
        <div className="col-span-1">Stage</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Row-Wise Leads List with 4-side margin on each card */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="text-sm font-medium text-stone-600">No leads found</p>
            <p className="text-xs text-stone-400">Try adjusting your search query.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const initial = lead.name.charAt(0).toUpperCase();

            return (
              <div
                key={lead.id}
                className="grid grid-cols-12 items-center px-5 py-3 rounded-md bg-stone-50/70 hover:bg-stone-100 transition-colors text-xs text-stone-800"
              >
                {/* 1. Customer Column (Col 3) */}
                <div className="col-span-3 flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-stone-900 truncate">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      {lead.capturedAt}
                    </div>
                  </div>
                </div>

                {/* 2. Contact Column (Col 3) */}
                <div className="col-span-3 min-w-0 pr-2 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-stone-800 text-[11px] truncate">
                    <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{lead.phone}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(lead.phone, `phone-${lead.id}`)}
                      className="text-stone-400 hover:text-[#0ca656] cursor-pointer"
                      title="Copy phone"
                    >
                      {copiedId === `phone-${lead.id}` ? (
                        <Check className="w-3 h-3 text-[#0ca656]" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-stone-500 text-[10.5px] truncate">
                    <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                </div>

                {/* 3. Company Column (Col 2) */}
                <div className="col-span-2 hidden md:block min-w-0 pr-2">
                  <span className="font-medium text-stone-700 truncate block">
                    {lead.company}
                  </span>
                  <a
                    href={lead.sourcePage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10.5px] font-mono text-[#0ca656] hover:underline truncate block"
                  >
                    {lead.sourcePage.replace(/^https?:\/\//, "")}
                  </a>
                </div>

                {/* 4. Estimated Pipeline Value (Col 2) */}
                <div className="col-span-2 hidden sm:block">
                  <span className="text-sm font-bold font-poppins text-stone-900">
                    {lead.estimatedValue}
                  </span>
                </div>

                {/* 5. Stage Dropdown (Col 1) */}
                <div className="col-span-1">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="h-8 px-2 rounded-md bg-white hover:bg-stone-50 border border-stone-200 text-[11px] font-medium text-stone-800 capitalize outline-hidden cursor-pointer transition-colors shadow-2xs"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* 6. Action Icons (Col 1) */}
                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  {/* Call Button */}
                  <a
                    href={`tel:${lead.phone}`}
                    title="Call customer"
                    className="w-8 h-8 rounded-md bg-white hover:bg-[#0ca656] text-stone-600 hover:text-white border border-stone-200/80 flex items-center justify-center transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Open WhatsApp chat"
                    className="w-8 h-8 rounded-md bg-white hover:bg-[#0ca656] text-stone-600 hover:text-white border border-stone-200/80 flex items-center justify-center transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteLead(lead.id)}
                    title="Delete lead"
                    className="w-8 h-8 rounded-md hover:bg-stone-200/60 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 space-y-5 relative font-poppins">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-900">
                Add New Lead
              </h3>
              <p className="text-xs text-stone-500">
                Record a customer contact and pipeline value.
              </p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 border border-transparent focus:border-stone-300 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 border border-transparent focus:border-stone-300 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Estimated Value
                  </label>
                  <input
                    type="text"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(e.target.value)}
                    placeholder="₹5,000"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 border border-transparent focus:border-stone-300 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 border border-transparent focus:border-stone-300 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="e.g. Retail Studio"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 border border-transparent focus:border-stone-300 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0ca656] hover:bg-[#098b48] text-white text-xs font-medium shadow-xs cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
