"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutAnayaSection() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const text =
    "Anaya is an autonomous sales intelligence platform that instantly crawls your website, understands your entire product and service catalog, and engages visitors in real time. It answers complex queries, qualifies high-intent leads, and converts traffic into customers 24/7 without requiring manual intervention.";

  const words = text.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress between when section enters viewport to when it reaches upper area
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.2;

      const rawProgress = (start - rect.top) / (start - end);
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      setProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-16 py-8 sm:py-12 text-left border-y border-stone-200/70 bg-white transition-colors duration-300"
    >
      <div className="w-full">
        <p className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-serif font-medium leading-[1.38] tracking-tight flex flex-wrap gap-x-2.5 sm:gap-x-3.5 gap-y-1">
          {words.map((word, index) => {
            // Word reveal threshold based on total word count
            const wordThreshold = index / words.length;
            const isRevealed = progress >= wordThreshold;

            return (
              <span
                key={index}
                className="transition-colors duration-300 select-none inline-block"
                style={{
                  color: isRevealed ? "#0c0a09" : "#d6d3d1",
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
