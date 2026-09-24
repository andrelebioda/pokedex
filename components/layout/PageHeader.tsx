import type { ReactNode } from "react";
import { ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";

import HeaderBackdrop from "@/components/layout/HeaderBackdrop";
import { Section } from "@/config/sections";

interface PageHeaderProps {
  section: Section;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: string;
  icon?: LucideIcon;
  count?: number;
  backLink?: { href: string; label: string };
  children?: ReactNode;
}

// Die Farben kommen aus --accent und --accent-2 der umgebenden SectionTheme.
export default function PageHeader({
  section,
  eyebrow,
  title = section.name,
  description = section.description,
  icon: Icon = section.icon,
  count,
  backLink,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden md:-mx-6">
      <HeaderBackdrop />

      {/* Icon als Wasserzeichen */}
      <Icon aria-hidden strokeWidth={1.25} className="pointer-events-none absolute -top-6 right-2 -z-10 size-44 text-white/10 mask-[linear-gradient(to_bottom,black_30%,transparent_90%)] md:right-10 md:size-60" />

      <div className="px-4 pt-6 pb-8 md:px-10 md:pt-10 md:pb-12">
        {backLink && (
          <Link
            href={backLink.href}
            className="
              mb-6
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/10
              bg-white/10
              px-3
              py-1.5
              text-sm
              text-white/80
              backdrop-blur-md
              transition
              hover:bg-white/20
              hover:text-white
            "
          >
            <ArrowLeft size={16} />
            {backLink.label}
          </Link>
        )}

        <div className="flex items-center gap-4 md:gap-6">
          <div
            className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-white/20
              bg-[linear-gradient(135deg,var(--accent),var(--accent-2,var(--accent)))]
              text-white
              shadow-[0_10px_30px_-8px_var(--accent),inset_0_1px_0_rgb(255_255_255/0.3)]
              md:size-18
            "
          >
            <Icon className="size-7 md:size-9" />
          </div>

          <div className="min-w-0">
            {eyebrow}

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-balance text-white md:text-5xl">{title}</h1>

              {count != null && (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-sm font-semibold text-white backdrop-blur-md">
                  {count.toLocaleString("de-DE")}
                </span>
              )}
            </div>

            {description && <p className="mt-1.5 text-sm text-white/70 md:text-lg">{description}</p>}
          </div>
        </div>

        {children}
      </div>
    </header>
  );
}
