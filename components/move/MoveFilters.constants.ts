import { TypeOption } from "@/components/pokemon/PokemonFilters.constants";
import { MoveSort } from "@/server/move/move.service";

/** Sortier-Optionen im Filter-Dropdown der Attacken-Seite. */
export const SORT_GROUPS: { value: MoveSort; label: string }[][] = [
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
  [
    { value: "type-asc", label: "Typ (A-Z)" },
    { value: "type-desc", label: "Typ (Z-A)" },
  ],
  [
    { value: "power-asc", label: "Stärke (↑)" },
    { value: "power-desc", label: "Stärke (↓)" },
  ],
];

export interface MoveFiltersProps {
  types: TypeOption[];
  search: string;
  selectedTypes: string[];
  sort: MoveSort;
  minPower?: number;
  maxPower?: number;
}
