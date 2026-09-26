import { prisma } from "@/server/db/prisma";
import { findByLanguage, fetchJson, PokeApiList, POKEAPI_BASE } from "@/scripts/lib/pokeapi";

interface PokeApiType {
  id: number;
  name: string;
  names: { language: { name: string }; name: string }[];
}

async function syncTypes() {
  const data = await fetchJson<PokeApiList>(`${POKEAPI_BASE}/type`);

  for (const entry of data.results) {
    const detail = await fetchJson<PokeApiType>(entry.url);

    const germanName = findByLanguage(detail.names, "de")?.name ?? detail.name;

    await prisma.type.upsert({
      where: { id: detail.id },
      update: { apiName: detail.name },
      create: { id: detail.id, apiName: detail.name },
    });

    await prisma.typeTranslation.upsert({
      where: { typeId_language: { typeId: detail.id, language: "de" } },
      update: { name: germanName },
      create: { typeId: detail.id, language: "de", name: germanName },
    });

    console.log(`✅ ${germanName}`);
  }
}

syncTypes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
