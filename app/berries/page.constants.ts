import { BerrySort } from "@/server/berry/berry.service";

/** Whitelist gegen die der `?sort=`-URL-Parameter geprüft wird, bevor er an die DB-Query geht. */
export const VALID_SORTS: BerrySort[] = ["name-asc", "name-desc", "growth-asc", "growth-desc", "power-asc", "power-desc"];

export interface BerriesPageProps {
  searchParams: Promise<{ search?: string; types?: string; sort?: string; minPower?: string; maxPower?: string }>;
}
