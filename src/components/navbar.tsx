"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Work", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      // Offset for sticky navbar
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${
          scrolled 
            ? "py-4 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800 shadow-lg shadow-black/20" 
            : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#home" 
              onClick={(e) => scrollToSection(e, "#home")}
              className="z-50 relative flex items-center gap-2"
            >
              <div className="relative w-10 h-10 overflow-hidden will-change-transform">
                <img 
                  src="/logonobg.png" 
                  alt="Sunkye Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold font-heading tracking-tighter text-white hover:text-primary-400 transition-colors hidden sm:block">
                Sunkye<span className="text-primary-500">.</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                </a>
              ))}
              <a 
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
              >
                Hire Me
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white z-50 relative p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center pt-20"
          >
            <nav className="flex flex-col items-center gap-8 w-full px-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-3xl font-bold text-white hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="mt-4 px-8 py-4 rounded-full w-full max-w-xs text-center bg-primary-600 hover:bg-primary-500 text-white text-xl font-bold transition-colors"
              >
                Hire Me
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
