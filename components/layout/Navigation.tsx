"use client";

import { Home, Search, Package, Cherry, Swords, Layers, Dna, Menu, X, CircleDot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  {
    name: "Übersicht",
    href: "/",
    icon: Home,
  },
  {
    name: "Pokémon",
    href: "/pokemon",
    icon: Search,
  },
  {
    name: "Items",
    href: "/items",
    icon: Package,
  },
  {
    name: "Beeren",
    href: "/berries",
    icon: Cherry,
  },
  {
    name: "Attacken",
    href: "/moves",
    icon: Swords,
  },
  // {
  //   name: "Typen",
  //   href: "/types",
  //   icon: Layers,
  // },
  {
    name: "Fähigkeiten",
    href: "/abilities",
    icon: Dna,
  },
];

// const secondaryNavigation = [
//   {
//     name: "Einstellungen",
//     href: "/settings",
//     icon: Settings,
//   },
// ];

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
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white min-[1200px]:h-12 min-[1200px]:w-12">
          <div className="absolute top-0 left-0 h-1/2 w-full bg-red-600" />
          <div className="absolute h-10 w-10 rounded-full border-4 border-slate-900 min-[1200px]:h-12 min-[1200px]:w-12" />
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
      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                  flex items-center gap-3 rounded-xl px-4 py-3
                  transition-all
                  ${active ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-300 hover:bg-slate-800 hover:text-white"}
                `}
            >
              <Icon size={20} />

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
      <aside className="sticky top-0 hidden h-screen flex-col bg-slate-900 text-white min-[1200px]:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">{logo}</div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Datenbank</p>

          <NavLinks />
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div
            className="
            flex items-center gap-3 rounded-xl
            bg-slate-900 px-4 py-3
          "
          >
            <CircleDot className="text-red-500" />

            <div>
              <p className="text-sm font-semibold">Pokédex v1.0</p>

              <p className="text-xs text-slate-500">Pokémon Research Lab</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900 text-white min-[1200px]:hidden">
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
          <nav className="border-t border-slate-800 px-4 py-4">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </nav>
        )}
      </div>
    </>
  );
}
