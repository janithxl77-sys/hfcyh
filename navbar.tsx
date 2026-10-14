"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteContent } from "@/data/content";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="#home" className="text-sm font-semibold tracking-[0.25em] text-[var(--text)]">
          {siteContent.brand}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteContent.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-[var(--text)]/85 transition hover:text-[var(--text)]">
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="text-[var(--text)]" /> : <Menu className="text-[var(--text)]" />}
        </button>
      </div>

      {open && (
        <div className="mx-4 rounded-2xl border border-white/20 bg-black/70 p-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {siteContent.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
