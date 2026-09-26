import { PokemonSort } from "@/server/pokemon/pokemon.service";

/** Ein Pokémon-Typ zur Auswahl in Typ-Filtern (auch von Move-/BerryFilters genutzt). */
export interface TypeOption {
  slug: string;
  name: string;
}

/** Sortier-Optionen im Filter-Dropdown der Pokémon-Seite. */
export const SORT_GROUPS: { value: PokemonSort; label: string }[][] = [
  [
    { value: "number-asc", label: "Nummer (↑)" },
    { value: "number-desc", label: "Nummer (↓)" },
  ],
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
  [
    { value: "type-asc", label: "Typ (A-Z)" },
    { value: "type-desc", label: "Typ (Z-A)" },
  ],
];

/** Generationen-Checkboxen im Filter-Modal. */
export const GENERATION_OPTIONS = [
  { value: "1", label: "Gen. 1" },
  { value: "2", label: "Gen. 2" },
  { value: "3", label: "Gen. 3" },
  { value: "4", label: "Gen. 4" },
  { value: "5", label: "Gen. 5" },
  { value: "6", label: "Gen. 6" },
  { value: "7", label: "Gen. 7" },
  { value: "8", label: "Gen. 8" },
  { value: "9", label: "Gen. 9" },
];

export interface PokemonFiltersProps {
  types: TypeOption[];
  search: string;
  selectedTypes: string[];
  selectedGenerations: number[];
  sort: PokemonSort;
}
