import { TypeOption } from "@/components/pokemon/PokemonFilters.constants";
import { BerrySort } from "@/server/berry/berry.service";

/** Sortier-Optionen im Filter-Dropdown der Beeren-Seite. */
export const SORT_GROUPS: { value: BerrySort; label: string }[][] = [
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
  [
    { value: "growth-asc", label: "Wachstum (↑)" },
    { value: "growth-desc", label: "Wachstum (↓)" },
  ],
  [
    { value: "power-asc", label: "Stärke (↑)" },
    { value: "power-desc", label: "Stärke (↓)" },
  ],
];

export interface BerryFiltersProps {
  types: TypeOption[];
  search: string;
  selectedTypes: string[];
  sort: BerrySort;
  minPower?: number;
  maxPower?: number;
}
