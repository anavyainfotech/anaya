import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const USE_CASES = [
  {
    title: "Anaya for E-Commerce",
    subtitle: "Turn window shoppers into paying customers 24/7.",
    image: "/anaya-ecommerce.jpg",
    href: "/ecommerce",
  },
  {
    title: "Anaya for Automation",
    subtitle: "Qualify high-intent leads and trigger workflows on autopilot.",
    image: "/anaya-automation.jpg",
    href: "/automation",
  },
  {
    title: "Anaya for Business",
    subtitle: "Close enterprise deals & book qualified consultation calls.",
    image: "/anaya-business.jpg",
    href: "/business",
  },
];

export default function UseCasesSection() {
  return (
    <section id="features" className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 pt-4 sm:pt-6 pb-4 sm:pb-6">
      
      {/* Section Header with H1 */}
      <div className="max-w-3xl mb-8 sm:mb-10 text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12]">
          Built for every stage of your business
        </h1>
        <p className="mt-3 text-stone-600 text-base sm:text-lg font-sans font-normal leading-relaxed">
          Tailored sales agents designed to understand your specific customer journey.
        </p>
      </div>

      {/* 3 Full-Card Clickable Image Overlay Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {USE_CASES.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative h-[440px] sm:h-[500px] w-full overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-md bg-stone-950 flex flex-col justify-end p-7 sm:p-9 cursor-pointer block"
          >
            {/* Background Image with hover zoom */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
            />

            {/* Dark Gradient Overlay for clean readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/20 pointer-events-none" />

            {/* Content Placed Directly Over the Image */}
            <div className="relative z-10 text-left">
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight leading-snug group-hover:text-[#10e57a] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-stone-300 font-sans font-normal leading-relaxed max-w-sm">
                {item.subtitle}
              </p>

              {/* Sleek Button that triggers on card hover */}
              <div className="mt-6">
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/95 group-hover:bg-white text-stone-950 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md shadow-sm group-hover:shadow-md group-hover:ring-2 group-hover:ring-[#0ca656]">
                  <span>Explore Solution</span>
                  <ArrowUpRight className="h-4 w-4 text-stone-700 group-hover:text-[#0ca656] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>

          </Link>
        ))}
      </div>

    </section>
  );
}
