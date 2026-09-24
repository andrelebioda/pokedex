import { Backpack, Boxes, CircleDot, Dumbbell, HeartPulse, LucideIcon, Music, Sparkles, Swords, Trophy, UtensilsCrossed } from "lucide-react";

export interface ItemCategoryGroupDefinition {
  slug: string;
  name: string;
  categories: string[];
  flat?: boolean;
}

export const itemCategoryGroups: ItemCategoryGroupDefinition[] = [
  {
    slug: "balls",
    name: "Bälle & Fanghilfen",
    categories: ["apricorn-balls", "apricorn-box", "special-balls", "standard-balls", "catching-bonus", "in-a-pinch"],
  },
  {
    slug: "healing",
    name: "Heilung",
    categories: ["healing", "medicine", "picky-healing", "status-cures", "pp-recovery", "revival"],
  },
  {
    slug: "training",
    name: "Training & Statuswerte",
    categories: ["effort-drop", "effort-training", "stat-boosts", "training", "vitamins"],
  },
  {
    slug: "battle-items",
    name: "Kampfitems",
    categories: ["type-enhancement", "type-protection", "jewels", "miracle-shooter", "other", "memories", "plates", "mega-stones", "z-crystals"],
  },
  {
    slug: "evolution",
    name: "Entwicklung",
    categories: ["evolution"],
  },
  {
    slug: "flutes",
    name: "Flöten",
    categories: ["flutes"],
  },
  {
    slug: "held-items",
    name: "Getragene Items",
    categories: ["held-items", "bad-held-items", "choice", "scarves", "species-specific"],
  },
  {
    slug: "picnic",
    name: "Picknick & Kochen",
    categories: ["curry-ingredients", "sandwich-ingredients", "baking-only", "picnic", "mulch", "nature-mints"],
  },
  {
    slug: "collectibles",
    name: "Sammlerstücke",
    categories: ["collectibles", "data-cards", "dex-completion", "event-items", "all-mail"],
  },
  {
    slug: "other",
    name: "Sonstiges",
    categories: ["gameplay", "loot", "plot-advancement", "spelunking", "unused"],
  },
];

export function getItemCategoryGroupBySlug(slug: string) {
  return itemCategoryGroups.find((group) => group.slug === slug);
}

const itemCategoryLabelsDe: Record<string, string> = {
  "apricorn-balls": "Aprikoko-Bälle",
  "apricorn-box": "Aprikoko-Box",
  "special-balls": "Spezialbälle",
  "standard-balls": "Standardbälle",
  "catching-bonus": "Fangbonus",
  "in-a-pinch": "Notfall-Beeren",
  healing: "Heilung",
  medicine: "Arzneien",
  "picky-healing": "Wählerische Beeren",
  "status-cures": "Statusheilung",
  "pp-recovery": "AP-Wiederherstellung",
  revival: "Wiederbelebung",
  "effort-drop": "Fleißpunkt-Reduzierung",
  "effort-training": "Fleißpunkt-Training",
  "stat-boosts": "Statuswert-Erhöhung",
  training: "Training",
  vitamins: "Vitamine",
  "type-enhancement": "Typ-Verstärkung",
  "type-protection": "Typ-Schutz",
  jewels: "Juwelen",
  "miracle-shooter": "Kampfverstärker",
  other: "Spezialbeeren",
  memories: "Erinnerungen",
  plates: "Platten",
  "mega-stones": "Mega-Steine",
  "z-crystals": "Z-Kristalle",
  "tera-shard": "Tera-Splitter",
  evolution: "Entwicklungsitems",
  flutes: "Flöten",
  "held-items": "Trage-Items",
  "bad-held-items": "Schädliche Trage-Items",
  choice: "Choice-Items",
  scarves: "Schals",
  "species-specific": "Arten-Items",
  "curry-ingredients": "Curry-Zutaten",
  "sandwich-ingredients": "Sandwich-Zutaten",
  "baking-only": "Back-Zutaten",
  picnic: "Picknick",
  mulch: "Dünger",
  "nature-mints": "Wesens-Bonbons",
  collectibles: "Sammelobjekte",
  "data-cards": "Datenkarten",
  "dex-completion": "Fossilien",
  "event-items": "Event-Items",
  "all-mail": "Post",
  gameplay: "Werkzeuge",
  loot: "Beute",
  "plot-advancement": "Schlüsselgegenstände",
  spelunking: "Erkundungs-Items",
  unused: "Ungenutzt",
};

export function formatItemCategoryLabel(slug: string) {
  if (itemCategoryLabelsDe[slug]) return itemCategoryLabelsDe[slug];

  return slug
    .split("-")
    .map((word) => (word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

const itemGroupStyles: Record<string, { icon: LucideIcon; accent: string; accent2: string }> = {
  balls: { icon: CircleDot, accent: "#ef4444", accent2: "#f97316" },
  healing: { icon: HeartPulse, accent: "var(--color-pokemon-grass)", accent2: "#14b8a6" },
  training: { icon: Dumbbell, accent: "var(--color-pokemon-fighting)", accent2: "var(--color-pokemon-fire)" },
  "battle-items": { icon: Swords, accent: "var(--color-pokemon-fire)", accent2: "var(--color-pokemon-electric)" },
  evolution: { icon: Sparkles, accent: "var(--color-pokemon-fairy)", accent2: "#a855f7" },
  flutes: { icon: Music, accent: "var(--color-pokemon-ice)", accent2: "var(--color-pokemon-water)" },
  "held-items": { icon: Backpack, accent: "var(--color-pokemon-water)", accent2: "#22d3ee" },
  picnic: { icon: UtensilsCrossed, accent: "var(--color-pokemon-ground)", accent2: "var(--color-pokemon-fire)" },
  collectibles: { icon: Trophy, accent: "var(--color-pokemon-electric)", accent2: "var(--color-pokemon-ground)" },
  other: { icon: Boxes, accent: "var(--color-pokemon-steel)", accent2: "#64748b" },
};

export function getItemGroupStyle(slug: string) {
  return itemGroupStyles[slug] ?? { icon: CircleDot, accent: "var(--color-pokemon-water)", accent2: "#22d3ee" };
}
