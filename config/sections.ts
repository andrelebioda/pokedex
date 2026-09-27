import type { CSSProperties } from "react";
import { Cherry, Dna, Heart, Home, LucideIcon, Package, Search, Swords } from "lucide-react";

export interface Section {
  name: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  accent2: string;
  description?: string;
  authRequired?: boolean;
  groupLabel?: string;
}

export const sections = {
  home: {
    name: "Übersicht",
    href: "/",
    icon: Home,
    accent: "#ef4444",
    accent2: "#f97316",
  },
  pokemon: {
    name: "Pokémon",
    href: "/pokemon",
    icon: Search,
    accent: "#ef4444",
    accent2: "#f97316",
    description: "Alle Pokémon mit Typen, Werten, Attacken und Fähigkeiten.",
  },
  items: {
    name: "Items",
    href: "/items",
    icon: Package,
    accent: "var(--color-pokemon-water)",
    accent2: "#22d3ee",
    description: "Wähle eine Kategorie, um die enthaltenen Items zu sehen.",
  },
  berries: {
    name: "Beeren",
    href: "/berries",
    icon: Cherry,
    accent: "var(--color-pokemon-grass)",
    accent2: "#14b8a6",
    description: "Alle Beeren mit Beerenkräften und Wachstumszeit.",
  },
  moves: {
    name: "Attacken",
    href: "/moves",
    icon: Swords,
    accent: "var(--color-pokemon-fire)",
    accent2: "var(--color-pokemon-electric)",
    description: "Alle Attacken mit Stärke, Genauigkeit und AP.",
  },
  abilities: {
    name: "Fähigkeiten",
    href: "/abilities",
    icon: Dna,
    accent: "var(--color-pokemon-psychic)",
    accent2: "#a855f7",
    description: "Alle Fähigkeiten und die Pokémon, die sie besitzen können.",
  },
  myPokemon: {
    name: "Meine Pokémon",
    href: "/meine-pokemon",
    icon: Heart,
    accent: "#ec4899",
    accent2: "#f43f5e",
    description: "Deine favorisierten Pokémon auf einen Blick.",
    authRequired: true,
    groupLabel: "Mein PokéLabs",
  },
} satisfies Record<string, Section>;

export const navigationSections: Section[] = [
  sections.home,
  sections.pokemon,
  sections.items,
  sections.berries,
  sections.moves,
  sections.abilities,
  sections.myPokemon,
];

export function accentStyle(accent: string, accent2: string = accent) {
  return { "--accent": accent, "--accent-2": accent2 } as CSSProperties;
}
