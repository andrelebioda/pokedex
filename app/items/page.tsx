import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { glassCard, glassChip, glassIconBox, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import PageHeader from "@/components/layout/PageHeader";
import SectionTheme from "@/components/layout/SectionTheme";
import { getItemGroupStyle } from "@/config/itemCategories";
import { accentStyle, sections } from "@/config/sections";
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
    <SectionTheme accent={sections.items.accent} accent2={sections.items.accent2}>
      <PageHeader section={sections.items} />

      <div className="grid gap-4 px-4 py-6 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {groups.map((group) => {
          const { icon: Icon, accent, accent2 } = getItemGroupStyle(group.slug);

          return (
            <Link
              key={group.slug}
              href={`/items/${group.slug}`}
              style={accentStyle(accent, accent2)}
              className={`${glassCard} flex flex-col gap-3 p-3 hover:-translate-y-1`}
            >
              <GlassBlobs />

              {/* Icon als Wasserzeichen */}
              <Icon
                aria-hidden
                strokeWidth={1.25}
                className="pointer-events-none absolute -top-4 -right-4 -z-10 size-32 text-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              />

              <div className="flex items-center justify-between gap-2 px-1 pt-1">
                <div className={`${glassIconBox} p-3`}>
                  <Icon size={26} />
                </div>

                <ArrowRight size={20} className="text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
              </div>

              <div className={`${glassPanel} flex-1 p-4`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="min-w-0 text-xl font-bold text-white">{group.name}</h2>

                  <span className="shrink-0 text-2xl font-bold text-white">{group.itemCount.toLocaleString("de-DE")}</span>
                </div>

                <p className="mt-1 text-sm text-white/70">{group.categoryCount === 1 ? "1 Kategorie" : `${group.categoryCount} Kategorien`}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.categories.map((category) => (
                    <span key={category.slug} className={`${glassChip} py-0.5`}>
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionTheme>
  );
}
