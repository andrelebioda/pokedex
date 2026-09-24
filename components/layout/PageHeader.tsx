import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";

import { Section } from "@/config/sections";

interface PageHeaderProps {
  section: Section;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  accent?: string;
  count?: number;
  backLink?: { href: string; label: string };
  children?: ReactNode;
}

export default function PageHeader({
  section,
  title = section.name,
  description = section.description,
  icon: Icon = section.icon,
  accent = section.accent,
  count,
  backLink,
  children,
}: PageHeaderProps) {
  return (
    <div className="px-4 pt-6">
      {backLink && (
        <Link href={backLink.href} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft size={16} />
          {backLink.label}
        </Link>
      )}

      <header
        style={{ "--accent": accent } as CSSProperties}
        className="
          relative
          isolate
          overflow-hidden
          rounded-3xl
          border
          border-white/5
          bg-slate-900
          bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_60%)]
          p-5
          shadow-lg
          md:p-7
        "
      >
        {/* Icon als Wasserzeichen */}
        <Icon
          aria-hidden
          strokeWidth={1.5}
          className="pointer-events-none absolute -right-6 -bottom-8 -z-10 size-36 text-white/5 md:size-44"
        />

        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-2xl bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] p-3 text-(--accent)">
            <Icon className="size-6 md:size-7" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-2xl font-bold text-white md:text-4xl">{title}</h1>

              {count != null && (
                <span className="rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-(--accent)">
                  {count.toLocaleString("de-DE")}
                </span>
              )}
            </div>

            {description && <p className="mt-1 text-sm text-slate-400 md:text-base">{description}</p>}
          </div>
        </div>

        {children}

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-(--accent) opacity-70" />
      </header>
    </div>
  );
}
