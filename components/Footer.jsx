import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AnayaLogo from "@/components/AnayaLogo";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-stone-950 text-white relative overflow-hidden">
      
      {/* Massive Full-Height Luxury Watermark Background Text (Anchored to Bottom) */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none select-none overflow-hidden z-0"
      >
        <span className="font-serif font-bold text-[30vw] leading-none text-white/[0.04] tracking-tighter whitespace-nowrap translate-y-[18%]">
          ANAYA
        </span>
      </div>

      {/* Main Footer Container */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 pt-14 sm:pt-16 pb-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 pb-12 sm:pb-16">
          
          {/* Brand & Mission Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
              <AnayaLogo className="w-8 h-8 group-hover:scale-105 transition-transform origin-center" color="#0ca656" />
              <span className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#0ca656] group-hover:opacity-90 transition-opacity">
                Anaya
              </span>
            </Link>

            <p className="text-stone-400 text-sm sm:text-base font-sans font-normal leading-relaxed max-w-sm">
              Autonomous conversational sales agents that turn casual website visitors into qualified paying customers on autopilot.
            </p>
          </div>

          {/* Links Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">
            
            {/* Column 1: Product */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block mb-4">
                Product
              </span>
              <ul className="space-y-3 text-sm font-sans text-stone-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#comparison" className="hover:text-white transition-colors">
                    Comparison
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Integrations */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block mb-4">
                Platforms
              </span>
              <ul className="space-y-3 text-sm font-sans text-stone-400">
                <li>
                  <a href="https://shopify.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>Shopify</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-600" />
                  </a>
                </li>
                <li>
                  <a href="https://wordpress.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>WordPress</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-600" />
                  </a>
                </li>
                <li>
                  <a href="https://woocommerce.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>WooCommerce</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-600" />
                  </a>
                </li>
                <li>
                  <a href="https://webflow.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>Webflow</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-600" />
                  </a>
                </li>
                <li>
                  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>Next.js & React</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-600" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block mb-4">
                Company
              </span>
              <ul className="space-y-3 text-sm font-sans text-stone-400">
                <li>
                  <a href="https://anavyainfotech.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>Anavya Infotech</span>
                    <ArrowUpRight className="w-3 h-3 text-[#0ca656]" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="mailto:contact@anavyainfotech.com" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Anavya Infotech badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-500">
          <div>
            © {currentYear} Anaya. Powered by{" "}
            <a 
              href="https://anavyainfotech.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-300 hover:text-white font-medium underline underline-offset-4 transition-colors"
            >
              Anavya Infotech
            </a>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Terms
            </Link>
            <Link href="#cta" className="hover:text-stone-300 transition-colors">
              Back to top ↑
            </Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
