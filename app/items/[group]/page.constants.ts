import { ItemSort } from "@/server/item/item.service";

/** Seitengröße für die erste, serverseitig geladene Item-Seite. */
export const LIMIT = 60;

/** Whitelist gegen die der `?sort=`-URL-Parameter geprüft wird, bevor er an die DB-Query geht. */
export const VALID_SORTS: ItemSort[] = ["name-asc", "name-desc"];

export interface ItemGroupPageProps {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ search?: string; categories?: string; sort?: string }>;
}
