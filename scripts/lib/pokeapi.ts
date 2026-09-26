import { prisma } from "@/server/db/prisma";

export const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export interface PokeApiListEntry {
  name: string;
  url: string;
}

export interface PokeApiList {
  results: PokeApiListEntry[];
}

export interface PokeApiLanguageRef {
  language: { name: string };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJson<T = unknown>(url: string, retries = 0): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen: ${url}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (retries > 0) {
      console.log(`⚠️ Fehler bei Request. Neuer Versuch (${retries})`);
      await sleep(2000);
      return fetchJson<T>(url, retries - 1);
    }

    throw error;
  }
}

/** Findet den Eintrag einer nach Sprache aufgeteilten PokeAPI-Liste (names, flavor_text_entries, effect_entries, genera, ...). */
export function findByLanguage<T extends PokeApiLanguageRef>(entries: T[], language: string): T | undefined {
  return entries.find((entry) => entry.language.name === language);
}

/** Extrahiert die numerische ID aus einer PokeAPI-Resource-URL wie ".../pokemon/25/". */
export function idFromUrl(url: string): number {
  return Number(url.split("/").filter(Boolean).pop());
}

/** Läuft über eine komplette PokeAPI-Listen-Ressource (z.B. "ability", "move", "item") und synct jeden Eintrag per ID. */
export async function runForEachListEntry(
  endpoint: string,
  sync: (id: number, entry: PokeApiListEntry) => Promise<void>,
) {
  const list = await fetchJson<PokeApiList>(`${POKEAPI_BASE}/${endpoint}?limit=10000`);

  for (const entry of list.results) {
    try {
      await sync(idFromUrl(entry.url), entry);
    } catch (error) {
      console.error(`❌ Fehler bei ${entry.name}`, error);
    }
  }
}

/** Läuft über alle bereits in der DB vorhandenen Pokémon und synct pro ID nach (z.B. Stats, Typen, Moves nachziehen). */
export async function runForEachPokemon(sync: (pokemonId: number) => Promise<void>) {
  const pokemonList = await prisma.pokemon.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  for (const pokemon of pokemonList) {
    try {
      await sync(pokemon.id);
    } catch (error) {
      console.error(`❌ Fehler bei Pokemon ${pokemon.id}`, error);
    }
  }
}
