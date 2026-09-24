"use client";

import type { CSSProperties } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigationSections } from "@/config/sections";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const logo = (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white min-[1200px]:h-10 min-[1200px]:w-10">
          <div className="absolute top-0 left-0 h-1/2 w-full bg-red-600" />
          <div className="absolute h-8 w-8 rounded-full min-[1200px]:h-10 min-[1200px]:w-10" />
          <div className="z-10 h-4 w-4 rounded-full border-4 border-slate-900 bg-white min-[1200px]:h-5 min-[1200px]:w-5" />
          <div className="absolute top-1/2 h-1 w-full bg-slate-900" />
        </div>
        <div>
          <h1 className="text-lg font-bold min-[1200px]:text-xl">PokéLabs</h1>
          <p className="hidden text-xs text-slate-400 min-[1200px]:block">Research Database</p>
        </div>
      </div>
    </Link>
  );

  function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <div className="space-y-1">
        {navigationSections.map((item) => {
          const Icon = item.icon;

          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              style={{ "--accent": item.accent } as CSSProperties}
              className={`
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-3
                  py-2.5
                  transition-all
                  ${
                    active
                      ? "bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
            >
              {active && <span aria-hidden className="absolute top-2 bottom-2 left-0 w-1 rounded-full bg-(--accent)" />}

              <span
                className={`
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-xl
                  transition
                  ${active ? "bg-(--accent) text-white shadow-lg shadow-[color-mix(in_oklab,var(--accent)_40%,transparent)]" : "bg-slate-800/60 group-hover:text-(--accent)"}
                `}
              >
                <Icon size={18} />
              </span>

              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/5 bg-slate-900 bg-[radial-gradient(circle_at_top_left,rgb(239_68_68/0.12),transparent_45%)] text-white min-[1200px]:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/5 px-6 py-5">{logo}</div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Datenbank</p>

          <NavLinks />
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-800/40 px-4 py-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
            </span>

            <div>
              <p className="text-sm font-semibold">Pokédex v1.0</p>

              <p className="text-xs text-slate-500">Pokémon Research Lab</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-slate-900/90 text-white backdrop-blur min-[1200px]:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {logo}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-white/5 px-4 py-4">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </nav>
        )}
      </div>
    </>
  );
}
