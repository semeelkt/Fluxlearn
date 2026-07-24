"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/research", label: "Research" },
  { href: "/categories", label: "Categories" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur border-b rule">
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="font-display text-2xl font-medium tracking-tight">
          Reliare
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-[13px] tracking-wide uppercase text-ink/80 dark:text-ink-dark/80 hover:text-oxblood dark:hover:text-oxblood-light transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/search" aria-label="Search" className="hover:text-oxblood transition-colors">
            <Search size={19} strokeWidth={1.5} />
          </Link>
          <button onClick={toggle} aria-label="Toggle dark mode" className="hover:text-oxblood transition-colors">
            {theme === "light" ? <Moon size={19} strokeWidth={1.5} /> : <Sun size={19} strokeWidth={1.5} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="lg:hidden hover:text-oxblood transition-colors"
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Masthead issue line — signature element echoed site-wide */}
      <div className="hidden md:block border-t rule">
        <div className="container flex items-center justify-between py-1.5">
          <span className="issue-line">Vol. I — No. 42</span>
          <span className="issue-line">Where Knowledge Meets Clarity.</span>
          <span className="issue-line">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t rule bg-paper dark:bg-paper-dark">
          <div className="container flex flex-col py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-sans text-sm tracking-wide uppercase border-b rule last:border-none"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
