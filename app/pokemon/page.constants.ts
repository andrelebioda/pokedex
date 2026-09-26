import { PokemonSort } from "@/server/pokemon/pokemon.service";

/** Whitelist gegen die der `?sort=`-URL-Parameter geprüft wird, bevor er an die DB-Query geht. */
export const VALID_SORTS: PokemonSort[] = ["number-asc", "number-desc", "name-asc", "name-desc", "type-asc", "type-desc"];

export interface PokemonPageProps {
  searchParams: Promise<{ search?: string; types?: string; generations?: string; sort?: string }>;
}
