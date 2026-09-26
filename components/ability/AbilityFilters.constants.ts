import { AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

/** Sortier-Optionen im Filter-Dropdown der Fähigkeiten-Seite. */
export const SORT_GROUPS: { value: AbilitySort; label: string }[][] = [
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
  [
    { value: "count-asc", label: "Anzahl Pokémon (↑)" },
    { value: "count-desc", label: "Anzahl Pokémon (↓)" },
  ],
];

/** Sichtbarkeits-Checkboxen im Filter-Modal (versteckt möglich / nicht versteckt). */
export const HIDDEN_OPTIONS: { value: AbilityHiddenFilter; label: string }[] = [
  { value: "hidden", label: "Versteckt möglich" },
  { value: "visible", label: "Nicht versteckt" },
];

export interface AbilityFiltersProps {
  search: string;
  selectedHidden: AbilityHiddenFilter[];
  sort: AbilitySort;
}
