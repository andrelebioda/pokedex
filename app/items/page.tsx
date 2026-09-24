import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { accentCard, accentGradient, accentIconBox } from "@/components/layout/cardStyles";
import PageHeader from "@/components/layout/PageHeader";
import { getItemGroupStyle } from "@/config/itemCategories";
import { sections } from "@/config/sections";
import { getItemGroupOverview } from "@/server/item/item.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Items",
  description: "Alle Items im Überblick, gruppiert nach Kategorien wie Bälle, Heilung, Kampfitems und mehr.",
  alternates: { canonical: "/items" },
};

export default async function ItemsPage() {
  const groups = await getItemGroupOverview();

  return (
    <div>
      <PageHeader section={sections.items} />

      <div className="grid gap-4 px-4 py-6 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {groups.map((group) => {
          const { icon: Icon, accent } = getItemGroupStyle(group.slug);

          return (
            <Link
              key={group.slug}
              href={`/items/${group.slug}`}
              style={{ "--accent": accent } as CSSProperties}
              className={`${accentCard} ${accentGradient} p-5 hover:-translate-y-1 md:p-6`}
            >
              {/* Icon als Wasserzeichen */}
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className="pointer-events-none absolute -right-4 -bottom-4 -z-10 size-28 text-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              />

              <div className="flex items-start justify-between gap-2">
                <div className={`${accentIconBox} p-3`}>
                  <Icon size={26} />
                </div>

                <ArrowRight size={18} className="text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-(--accent)" />
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-bold text-white">{group.name}</h2>

                <span className="text-2xl font-bold text-white">{group.itemCount.toLocaleString("de-DE")}</span>
              </div>

              <p className="mt-1 text-sm text-slate-400">{group.categoryCount === 1 ? "1 Kategorie" : `${group.categoryCount} Kategorien`}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {group.categories.map((category) => (
                  <span key={category.slug} className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-400">
                    {category.name}
                  </span>
                ))}
              </div>

              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-(--accent) opacity-70" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
