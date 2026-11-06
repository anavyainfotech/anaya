import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const STACKS = [
  { 
    name: "Shopify", 
    category: "E-Commerce",
    logo: "/logos/shopify.svg", 
    href: "https://shopify.com", 
    color: "#96bf48",
  },
  { 
    name: "WordPress", 
    category: "CMS Platform",
    logo: "/logos/wordpress.svg", 
    href: "https://wordpress.org", 
    color: "#21759b",
  },
  { 
    name: "WooCommerce", 
    category: "Online Store",
    logo: "/logos/woocommerce.svg", 
    href: "https://woocommerce.com", 
    color: "#96588a",
  },
  { 
    name: "Webflow", 
    category: "Visual Design",
    logo: "/logos/webflow.svg", 
    href: "https://webflow.com", 
    color: "#146ef5",
  },
  { 
    name: "Squarespace", 
    category: "Site Builder",
    logo: "/logos/squarespace.svg", 
    href: "https://squarespace.com", 
    color: "#111111",
  },
  { 
    name: "Wix", 
    category: "No-Code Builder",
    logo: "/logos/wix.svg", 
    href: "https://wix.com", 
    color: "#0c0c0c",
  },
  { 
    name: "Next.js", 
    category: "React Framework",
    logo: "/logos/nextjs.svg", 
    href: "https://nextjs.org", 
    color: "#000000",
  },
  { 
    name: "React / HTML", 
    category: "Custom Build",
    logo: "/logos/react.svg", 
    href: "https://react.dev", 
    color: "#149eca",
  },
];

export default function IntegrationsSection() {
  return (
    <section id="integrations" className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 py-6 sm:py-8 border-t border-stone-200/60 bg-white">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-6 sm:mb-8 text-left">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
          Integrates seamlessly with your current store stack
        </h2>
        <p className="mt-4 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
          No engineering needed. Paste one line of script or connect via official plugin to go live in 60 seconds.
        </p>
      </div>

      {/* Modern 8-Platform Minimal Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
        {STACKS.map((stack, idx) => (
          <div
            key={idx}
            className="group relative rounded-md border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-stone-400 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-stone-50 border border-stone-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={stack.logo}
                    alt={stack.name}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0ca656] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-900 group-hover:text-[#0ca656] transition-colors">
                {stack.name}
              </h3>
              <p className="text-xs text-stone-400 font-sans mt-0.5">
                {stack.category}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>Ready to embed</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#0ca656] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
