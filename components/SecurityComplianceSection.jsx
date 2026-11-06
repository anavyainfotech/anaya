import Image from "next/image";

const COMPLIANCE_ITEMS = [
  {
    name: "DPDP Certified",
    label: "DPDP (India)",
    image: "/logos/dpdp-certified.png",
    isCircle: true,
  },
  {
    name: "AWS Cloud",
    label: "AWS ap-south-1",
    image: "/logos/aws-official.png",
    isCircle: false,
    invert: true,
  },
  {
    name: "256-Bit TLS",
    label: "256-Bit SSL",
    svg: (
      <svg className="w-14 h-14 sm:w-20 sm:h-20" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#71717a" strokeWidth="2" />
        <rect x="22" y="28" width="20" height="18" rx="3" stroke="#e4e4e7" strokeWidth="2.5" />
        <path d="M26 28V22C26 18.6863 28.6863 16 32 16C35.3137 16 38 18.6863 38 22V28" stroke="#e4e4e7" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="37" r="2.5" fill="#10e57a" />
      </svg>
    ),
  },
  {
    name: "GST Invoiced",
    label: "GST Registered",
    svg: (
      <svg className="w-14 h-14 sm:w-20 sm:h-20" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#71717a" strokeWidth="2" />
        <text x="32" y="38" textAnchor="middle" fill="#e4e4e7" fontSize="13" fontWeight="bold" fontFamily="monospace">GST</text>
      </svg>
    ),
  },
  {
    name: "CERT-In Aligned",
    label: "CERT-In Aligned",
    svg: (
      <svg className="w-14 h-14 sm:w-20 sm:h-20" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#71717a" strokeWidth="2" />
        <path d="M32 18L44 23V33C44 40.5 38.8 47.4 32 50C25.2 47.4 20 40.5 20 33V23L32 18Z" stroke="#e4e4e7" strokeWidth="2" />
        <path d="M28 33L31 36L37 30" stroke="#10e57a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function SecurityComplianceSection() {
  return (
    <section className="w-full bg-stone-950 text-white py-14 sm:py-20 border-t border-stone-900 relative overflow-hidden">
      
      {/* Subtle top spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#0ca656]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16">
        
        {/* Left-Aligned Editorial H1 Headline & Supporting Paragraph */}
        <div className="max-w-3xl mb-10 sm:mb-14 text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium text-white tracking-tight leading-[1.15]">
            Built for Indian enterprises. <br />
            <span className="text-stone-400">Protected by law.</span>
          </h1>
          <p className="mt-3 text-stone-400 text-sm sm:text-base font-sans font-normal leading-relaxed">
            Anaya adheres strictly to national data protection mandates, local cloud residency, and cryptographic security standards.
          </p>
        </div>

        {/* Responsive Grid: 2 columns on mobile, flex on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center justify-start gap-y-8 gap-x-6 sm:gap-12 lg:gap-16">
          {COMPLIANCE_ITEMS.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left group cursor-default">
              
              {/* Borderless Emblem with responsive size */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300">
                {item.image ? (
                  item.isCircle ? (
                    <div className="w-full h-full relative rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center invert">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={45}
                        className="h-10 sm:h-12 w-auto object-contain"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {item.svg}
                  </div>
                )}
              </div>

              {/* Responsive Bottom Label */}
              <span className="mt-2.5 sm:mt-3 text-[11.5px] sm:text-xs font-sans font-medium text-stone-400 group-hover:text-stone-200 tracking-wide transition-colors">
                {item.label}
              </span>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
