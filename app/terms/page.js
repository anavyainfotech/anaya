import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Anaya",
  description: "Terms and conditions for deploying Anaya autonomous conversational sales agents.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col selection:bg-[#0ca656] selection:text-white relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-10 pt-28 sm:pt-36 pb-16 text-left">
        <h1 className="text-4xl sm:text-5xl font-serif font-medium text-stone-950 mb-3 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-8">
          Last Updated: November 2026
        </p>

        <div className="space-y-6 text-stone-700 text-sm sm:text-base font-sans leading-relaxed">
          <section>
            <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
              1. Permitted Website Crawling
            </h2>
            <p>
              By submitting a website URL to Anaya, you represent and warrant that you own or have explicit authorization to index the target website and deploy customer-facing sales agents on its domain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
              2. Agent Service Availability & SLA
            </h2>
            <p>
              Anaya provides 99.9% uptime for client embed scripts delivered via global edge CDN networks. Planned maintenance is announced in advance on your client dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
              3. Service Provider Identity
            </h2>
            <p>
              Anaya is an autonomous AI product engineered and maintained by Anavya Infotech.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
