"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(PORTFOLIO_DATA.navigation[0]?.target);

  useEffect(() => {
    const sections = PORTFOLIO_DATA.navigation
      .map((item) => document.getElementById(item.target))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActive(topMost.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <a href="#home" className="font-display text-lg font-bold text-ink">
          {PORTFOLIO_DATA.profile.name}
        </a>

        <ul className="hidden gap-1 md:flex">
          {PORTFOLIO_DATA.navigation.map((item) => (
            <li key={item.target} className="relative">
              <a
                href={`#${item.target}`}
                className={`relative z-10 block px-3 py-1.5 text-sm font-medium transition-colors ${
                  active === item.target ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </a>
              {active === item.target && (
                <motion.span
                  layoutId="nav-active-pill"
                  transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.6 }}
                  className="absolute inset-0 rounded-full bg-white/10"
                />
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ink md:hidden"
        >
          <span aria-hidden>{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            {PORTFOLIO_DATA.navigation.map((item) => (
              <li key={item.target}>
                <a
                  href={`#${item.target}`}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium ${
                    active === item.target ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
