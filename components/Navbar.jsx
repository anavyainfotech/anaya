"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import AnayaLogo from "@/components/AnayaLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-none outline-hidden ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between">
        {/* Brand Logo with Custom Starburst AI Icon */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <AnayaLogo className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-105 transition-transform origin-center" color="#0ca656" />
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#0ca656] hover:opacity-90 transition-opacity">
            Anaya
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-medium text-stone-600">
          <Link
            href="#features"
            className="hover:text-stone-950 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-stone-950 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#integrations"
            className="hover:text-stone-950 transition-colors"
          >
            Integrations
          </Link>
          <Link
            href="#pricing"
            className="hover:text-stone-950 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-stone-950 hover:bg-stone-900 text-white text-[13.5px] font-medium transition-all shadow-xs hover:shadow-md border border-stone-800 hover:border-stone-700"
          >
            Create Agent
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-700 hover:text-stone-950 focus:outline-hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-stone-200 px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-4 text-base font-medium text-stone-700">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              How it Works
            </Link>
            <Link
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              Integrations
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-stone-950"
            >
              Pricing
            </Link>
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-full bg-stone-950 text-white font-medium border border-stone-800"
              >
                Create Agent
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
