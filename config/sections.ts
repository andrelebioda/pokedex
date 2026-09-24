import { Cherry, Dna, Home, LucideIcon, Package, Search, Swords } from "lucide-react";

export interface Section {
  name: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  description?: string;
}

export const sections = {
  home: {
    name: "Übersicht",
    href: "/",
    icon: Home,
    accent: "#ef4444",
  },
  pokemon: {
    name: "Pokémon",
    href: "/pokemon",
    icon: Search,
    accent: "#ef4444",
    description: "Alle Pokémon mit Typen, Werten, Attacken und Fähigkeiten.",
  },
  items: {
    name: "Items",
    href: "/items",
    icon: Package,
    accent: "var(--color-pokemon-water)",
    description: "Wähle eine Kategorie, um die enthaltenen Items zu sehen.",
  },
  berries: {
    name: "Beeren",
    href: "/berries",
    icon: Cherry,
    accent: "var(--color-pokemon-grass)",
    description: "Alle Beeren mit Beerenkräften und Wachstumszeit.",
  },
  moves: {
    name: "Attacken",
    href: "/moves",
    icon: Swords,
    accent: "var(--color-pokemon-fire)",
    description: "Alle Attacken mit Stärke, Genauigkeit und AP.",
  },
  abilities: {
    name: "Fähigkeiten",
    href: "/abilities",
    icon: Dna,
    accent: "var(--color-pokemon-psychic)",
    description: "Alle Fähigkeiten und die Pokémon, die sie besitzen können.",
  },
} satisfies Record<string, Section>;

export const navigationSections: Section[] = [sections.home, sections.pokemon, sections.items, sections.berries, sections.moves, sections.abilities];
