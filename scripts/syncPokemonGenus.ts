import { prisma } from "@/server/db/prisma";
import { findByLanguage, fetchJson, POKEAPI_BASE, runForEachPokemon } from "@/scripts/lib/pokeapi";

interface PokeApiSpecies {
  name: string;
  genera: { language: { name: string }; genus: string }[];
}

async function syncGenus(pokemonId: number) {
  const species = await fetchJson<PokeApiSpecies>(`${POKEAPI_BASE}/pokemon-species/${pokemonId}`);

  for (const language of ["de", "en"]) {
    const genus = findByLanguage(species.genera, language)?.genus ?? null;

    if (!genus) continue;

    await prisma.pokemonTranslation.upsert({
      where: { pokemonId_language: { pokemonId, language } },
      update: { genus },
      create: { pokemonId, language, name: species.name, genus },
    });
  }

  console.log(`✅ Genus ${pokemonId} - ${species.name}`);
}

runForEachPokemon(syncGenus)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
