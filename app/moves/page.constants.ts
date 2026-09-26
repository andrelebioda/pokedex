import { MoveSort } from "@/server/move/move.service";

/** Seitengröße für die erste, serverseitig geladene Attacken-Seite. */
export const LIMIT = 50;

/** Whitelist gegen die der `?sort=`-URL-Parameter geprüft wird, bevor er an die DB-Query geht. */
export const VALID_SORTS: MoveSort[] = ["name-asc", "name-desc", "type-asc", "type-desc", "power-asc", "power-desc"];

export interface MovesPageProps {
  searchParams: Promise<{ search?: string; types?: string; sort?: string; minPower?: string; maxPower?: string }>;
}
