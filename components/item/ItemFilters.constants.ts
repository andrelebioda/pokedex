import { ItemCategoryOption, ItemSort } from "@/server/item/item.service";

/** Sortier-Optionen im Filter-Dropdown der Item-Seiten (bislang nur Name, da Items keine Stärke/Wert haben). */
export const SORT_GROUPS: { value: ItemSort; label: string }[][] = [
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
];

export interface ItemFiltersProps {
  categories: ItemCategoryOption[];
  search: string;
  selectedCategories: string[];
  sort: ItemSort;
}
