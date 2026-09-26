import { prisma } from "@/server/db/prisma";
import { findByLanguage, fetchJson, POKEAPI_BASE, runForEachListEntry } from "@/scripts/lib/pokeapi";

interface PokeApiAbility {
  id: number;
  name: string;
  effect_entries: { language: { name: string }; effect: string }[];
  names: { language: { name: string }; name: string }[];
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
  pokemon: { is_hidden: boolean; slot: number; pokemon: { name: string } }[];
}

async function syncAbility(id: number) {
  const ability = await fetchJson<PokeApiAbility>(`${POKEAPI_BASE}/ability/${id}`);

  const effectEntry = findByLanguage(ability.effect_entries, "en");

  const syncedAbility = await prisma.ability.upsert({
    where: { id: ability.id },
    update: { apiName: ability.name, effect: effectEntry?.effect ?? null },
    create: { id: ability.id, apiName: ability.name, effect: effectEntry?.effect ?? null },
  });

  for (const translation of ability.names) {
    const language = translation.language.name;
    const descriptionEntry = findByLanguage(ability.flavor_text_entries, language);

    await prisma.abilityTranslation.upsert({
      where: { abilityId_language: { abilityId: syncedAbility.id, language } },
      update: { name: translation.name, description: descriptionEntry?.flavor_text ?? null },
      create: { abilityId: syncedAbility.id, language, name: translation.name, description: descriptionEntry?.flavor_text ?? null },
    });
  }

  for (const entry of ability.pokemon) {
    const pokemon = await prisma.pokemon.findUnique({ where: { apiName: entry.pokemon.name } });

    if (!pokemon) {
      console.warn(`⚠️ Pokémon nicht gefunden: ${entry.pokemon.name}`);
      continue;
    }

    await prisma.pokemonAbility.upsert({
      where: { pokemonId_abilityId: { pokemonId: pokemon.id, abilityId: syncedAbility.id } },
      update: { isHidden: entry.is_hidden, slot: entry.slot },
      create: { pokemonId: pokemon.id, abilityId: syncedAbility.id, isHidden: entry.is_hidden, slot: entry.slot },
    });
  }

  console.log(`✅ ${ability.id} - ${ability.name}`);
}

runForEachListEntry("ability", syncAbility)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
