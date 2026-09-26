import { AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

/** Seitengröße für die erste, serverseitig geladene Fähigkeiten-Seite. */
export const LIMIT = 50;

/** Whitelist gegen die der `?sort=`-URL-Parameter geprüft wird, bevor er an die DB-Query geht. */
export const VALID_SORTS: AbilitySort[] = ["name-asc", "name-desc", "count-asc", "count-desc"];

/** Whitelist gegen die der `?hidden=`-URL-Parameter geprüft wird. */
export const VALID_HIDDEN: AbilityHiddenFilter[] = ["hidden", "visible"];

export interface AbilitiesPageProps {
  searchParams: Promise<{ search?: string; hidden?: string; sort?: string }>;
}
