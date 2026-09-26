"use server";

import {
  AbilityListFilters,
  AbilityListResult,
  AbilityPokemon,
  getAbilityList,
  getPokemonForAbility,
} from "@/server/ability/ability.service";

export async function getAbilityListAction(page: number, limit: number, filters: AbilityListFilters): Promise<AbilityListResult> {
  return getAbilityList(page, limit, filters);
}

export async function getPokemonForAbilityAction(abilityId: number): Promise<AbilityPokemon[]> {
  return getPokemonForAbility(abilityId);
}
