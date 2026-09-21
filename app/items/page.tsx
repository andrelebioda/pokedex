import { Backpack, Boxes, CircleDot, Dumbbell, HeartPulse, Music, Sparkles, Swords, Trophy, UtensilsCrossed, LucideIcon } from "lucide-react";
import Link from "next/link";

import { getItemGroupOverview } from "@/server/item/item.service";

export const dynamic = "force-dynamic";

const groupIcons: Record<string, LucideIcon> = {
  balls: CircleDot,
  healing: HeartPulse,
  training: Dumbbell,
  "battle-items": Swords,
  evolution: Sparkles,
  flutes: Music,
  "held-items": Backpack,
  picnic: UtensilsCrossed,
  collectibles: Trophy,
  other: Boxes,
};

export default async function ItemsPage() {
  const groups = await getItemGroupOverview();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Items</h1>

        <p className="text-md text-slate-400">Wähle eine Kategorie, um die enthaltenen Items zu sehen.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const Icon = groupIcons[group.slug] ?? CircleDot;

          return (
            <Link
              key={group.slug}
              href={`/items/${group.slug}`}
              className="
                group
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
                shadow-lg
                transition-all
                hover:-translate-y-1
                hover:border-slate-700
                hover:shadow-xl
                hover:shadow-red-500/10
              "
            >
              <div className="flex items-center justify-between">
                <div
                  className="
                    rounded-xl
                    bg-red-500/10
                    p-3
                    text-red-400
                  "
                >
                  <Icon size={28} />
                </div>

                <span className="text-2xl font-bold text-white">{group.itemCount}</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">{group.name}</h3>

              <p className="mt-1 text-sm text-slate-400">
                {group.categoryCount === 1 ? "1 Kategorie" : `${group.categoryCount} Kategorien`}
              </p>

              <p className="mt-3 text-xs text-slate-500">{group.categories.map((category) => category.name).join(" · ")}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
