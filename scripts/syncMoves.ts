import { prisma } from "@/server/db/prisma";
import { findByLanguage, fetchJson, POKEAPI_BASE, runForEachListEntry } from "@/scripts/lib/pokeapi";

interface PokeApiMove {
  id: number;
  name: string;
  type: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  damage_class?: { name: string };
  priority: number | null;
  effect_chance: number | null;
  effect_entries: { language: { name: string }; effect: string }[];
  names: { language: { name: string }; name: string }[];
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
}

async function syncMove(id: number) {
  const move = await fetchJson<PokeApiMove>(`${POKEAPI_BASE}/move/${id}`);

  const type = await prisma.type.findUnique({ where: { apiName: move.type.name } });

  if (!type) {
    console.warn(`⚠️ Typ nicht gefunden: ${move.type.name}`);
    return;
  }

  const effectEntry = findByLanguage(move.effect_entries, "en");

  const data = {
    apiName: move.name,
    typeId: type.id,
    power: move.power,
    accuracy: move.accuracy,
    pp: move.pp,
    damageClass: move.damage_class?.name,
    priority: move.priority,
    effectChance: move.effect_chance,
    effect: effectEntry?.effect ?? null,
  };

  const syncedMove = await prisma.move.upsert({
    where: { id: move.id },
    update: data,
    create: { id: move.id, ...data },
  });

  for (const translation of move.names) {
    const language = translation.language.name;
    const descriptionEntry = findByLanguage(move.flavor_text_entries, language);

    await prisma.moveTranslation.upsert({
      where: { moveId_language: { moveId: syncedMove.id, language } },
      update: { name: translation.name, description: descriptionEntry?.flavor_text ?? null },
      create: { moveId: syncedMove.id, language, name: translation.name, description: descriptionEntry?.flavor_text ?? null },
    });
  }

  console.log(`✅ ${move.id} - ${move.name}`);
}

runForEachListEntry("move", syncMove)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
