"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <a href="#home" className="font-display text-lg font-bold text-ink">
          {PORTFOLIO_DATA.profile.name}
        </a>

        <ul className="hidden gap-8 md:flex">
          {PORTFOLIO_DATA.navigation.map((item) => (
            <li key={item.target}>
              <a
                href={`#${item.target}`}
                className="text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
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
                  className="block px-4 py-3 text-sm font-medium text-muted hover:text-ink"
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
