"use client";

import { Lock, LogIn, LogOut, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { accentStyle, navigationSections } from "@/config/sections";

function AccountStatus({ variant = "full" }: { variant?: "full" | "compact" }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className={
          variant === "compact"
            ? "size-9 animate-pulse rounded-xl border border-white/10 bg-white/5"
            : "h-[60px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
        }
      />
    );
  }

  if (!session) {
    if (variant === "compact") {
      return (
        <Link
          href="/login"
          aria-label="Anmelden"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
          <LogIn size={18} />
        </Link>
      );
    }

    return (
      <Link
        href="/login"
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md transition hover:bg-white/10"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
          <LogIn size={16} />
        </span>

        <p className="text-sm font-semibold">Anmelden</p>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        aria-label="Abmelden"
        title={session.user?.name ?? session.user?.email ?? undefined}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
      >
        <LogOut size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      title={session.user?.name ?? session.user?.email ?? undefined}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md transition hover:bg-white/10"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
        <LogOut size={16} />
      </span>

      <p className="text-sm font-semibold">Abmelden</p>
    </button>
  );
}

interface NavLinksProps {
  pathname: string;
  onNavigate?: () => void;
}

function NavLinks({ pathname, onNavigate }: NavLinksProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="space-y-1">
      {navigationSections.map((item) => {
        const Icon = item.icon;

        const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <div key={item.href}>
            {item.groupLabel && <p className="mt-4 mb-1.5 px-2.5 text-xs font-semibold tracking-widest text-white/40 uppercase">{item.groupLabel}</p>}

            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              style={accentStyle(item.accent, item.accent2)}
              className={`
                group
                relative
                flex
                items-center
                gap-3
                overflow-hidden
                rounded-2xl
                border
                px-2.5
                py-2
                transition-all
                duration-300
                ${
                  active
                    ? "border-white/15 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_75%,transparent),color-mix(in_oklab,var(--accent-2)_45%,transparent))] text-white shadow-[0_10px_30px_-12px_var(--accent),inset_0_1px_0_rgb(255_255_255/0.2)]"
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span
                className={`
                relative
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                transition
                duration-300
                ${
                  active
                    ? "border-white/20 bg-white/20 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
                    : "border-white/5 bg-white/5 group-hover:border-[color-mix(in_oklab,var(--accent)_40%,transparent)] group-hover:bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] group-hover:text-(--accent)"
                }
              `}
              >
                <Icon size={18} />

                {item.authRequired && !isAuthenticated && (
                  <span
                    aria-hidden
                    className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-white/70"
                  >
                    <Lock size={10} />
                  </span>
                )}
              </span>

              <span className="font-medium">{item.name}</span>

              {active && <span aria-hidden className="ml-auto size-1.5 rounded-full bg-white shadow-[0_0_8px_white] absolute right-2.5" />}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 isolate hidden h-screen flex-col overflow-hidden border-r border-white/10  text-white backdrop-blur-xl min-[1200px]:flex">
        <div aria-hidden className="absolute -top-24 -left-20 -z-10 size-64 rounded-full bg-red-500 opacity-20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -right-24 -z-10 size-64 rounded-full bg-orange-500 opacity-10 blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/5 px-6 py-5">{logo}</div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-3 p-4">
          <AccountStatus />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/70 text-white backdrop-blur-xl min-[1200px]:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {logo}

          <div className="flex items-center gap-2">
            <AccountStatus variant="compact" />

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="absolute isolate z-50 h-screen w-full overflow-hidden border-t border-white/5 bg-slate-900/95 px-4 py-4 backdrop-blur-xl">
            <div aria-hidden className="absolute -top-24 -left-20 -z-10 size-64 rounded-full bg-red-500 opacity-20 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -right-24 -z-10 size-64 rounded-full bg-orange-500 opacity-10 blur-3xl" />

            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </nav>
        )}
      </div>
    </>
  );
}
