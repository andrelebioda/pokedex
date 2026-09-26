"use server";

import {
  getMovesForPokemon,
  getPokemonList,
  PokemonListFilters,
  PokemonListResult,
  PokemonMovesResult,
} from "@/server/pokemon/pokemon.service";

export async function getPokemonListAction(page: number, limit: number, filters: PokemonListFilters): Promise<PokemonListResult> {
  return getPokemonList(page, limit, filters);
}

export async function getMovesForPokemonAction(
  pokemonId: number,
  page: number,
  limit: number,
  filters: { search?: string },
): Promise<PokemonMovesResult> {
  return getMovesForPokemon(pokemonId, page, limit, filters);
}
