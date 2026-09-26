import { prisma } from "@/server/db/prisma";
import { fetchJson, findByLanguage, POKEAPI_BASE, sleep } from "@/scripts/lib/pokeapi";

const MAX_POKEMON = 1025;

interface PokeApiPokemon {
  name: string;
  height: number;
  weight: number;
  species: { url: string };
  sprites: { other: { "official-artwork": { front_default: string | null } } };
}

interface PokeApiSpecies {
  name: string;
  names: { language: { name: string }; name: string }[];
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
}

function getGermanName(species: PokeApiSpecies) {
  return findByLanguage(species.names, "de")?.name ?? species.name;
}

function getGermanDescription(species: PokeApiSpecies) {
  return (
    findByLanguage(species.flavor_text_entries, "de")
      ?.flavor_text?.replace(/\n/g, " ")
      ?.replace(/\f/g, " ") ?? ""
  );
}

async function syncPokemon(id: number) {
  console.log(`🔄 Sync Pokemon ${id}`);

  const pokemon = await fetchJson<PokeApiPokemon>(`${POKEAPI_BASE}/pokemon/${id}`, 3);
  const species = await fetchJson<PokeApiSpecies>(pokemon.species.url, 3);

  const name = getGermanName(species);
  const description = getGermanDescription(species);

  const data = {
    apiName: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprite: pokemon.sprites.other["official-artwork"].front_default,
  };

  await prisma.pokemon.upsert({
    where: { id },
    update: data,
    create: { id, ...data },
  });

  await prisma.pokemonTranslation.upsert({
    where: { pokemonId_language: { pokemonId: id, language: "de" } },
    update: { name, description },
    create: { pokemonId: id, language: "de", name, description },
  });

  console.log(`✅ ${id} - ${name}`);
}

async function getStartId() {
  const last = await prisma.pokemon.findFirst({ orderBy: { id: "desc" } });
  return last?.id ?? 0;
}

async function main() {
  const start = await getStartId();

  console.log(`🚀 Starte bei Pokemon ${start + 1}`);

  for (let i = start + 1; i <= MAX_POKEMON; i++) {
    try {
      await syncPokemon(i);
    } catch (error) {
      console.error(`❌ Fehler bei Pokemon ${i}`, error);
    }

    // kleine Pause gegen Rate Limits
    await sleep(200);

    // längere Pause alle 50
    if (i % 50 === 0) {
      console.log("⏸ Pause...");
      await sleep(3000);
    }
  }

  console.log("🎉 Sync abgeschlossen");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
