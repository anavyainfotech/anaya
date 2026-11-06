import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Anaya",
  description: "Anaya autonomous AI sales agent privacy & data isolation policy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-10 pt-28 sm:pt-36 pb-16 text-left">
        <h1 className="text-4xl sm:text-5xl font-serif font-medium text-stone-950 mb-3 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-8">
          Last Updated: November 2026
        </p>

        <div className="space-y-6 text-stone-700 text-sm sm:text-base font-sans leading-relaxed">
          <section>
            <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
              1. Multi-Tenant Knowledge Isolation
            </h2>
            <p>
              Anaya crawls your target website exclusively to serve your authorized visitors. All vector embeddings, catalog information, and conversations are partitioned into isolated client namespaces. Your data is never mixed with other stores or used to train third-party foundation models.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
              2. Visitor Data & Lead Collection
            </h2>
            <p>
              When a visitor voluntarily submits their Name, WhatsApp number, or Email during an active consultation session, that information is routed directly and securely to your connected dashboard, webhook, or email alerts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
              3. Script Security & Sandboxing
            </h2>
            <p>
              Our client embed script operates inside an isolated shadow DOM container and does not access sensitive host page cookies, authentication tokens, or payment gateways.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
