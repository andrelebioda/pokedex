export const pokemonTypeClasses = {
  normal: "bg-pokemon-normal",
  fire: "bg-pokemon-fire",
  water: "bg-pokemon-water",
  electric: "bg-pokemon-electric",
  grass: "bg-pokemon-grass",
  ice: "bg-pokemon-ice",

  fighting: "bg-pokemon-fighting",
  poison: "bg-pokemon-poison",
  ground: "bg-pokemon-ground",
  flying: "bg-pokemon-flying",

  psychic: "bg-pokemon-psychic",
  bug: "bg-pokemon-bug",
  rock: "bg-pokemon-rock",
  ghost: "bg-pokemon-ghost",

  dragon: "bg-pokemon-dragon",
  dark: "bg-pokemon-dark",
  steel: "bg-pokemon-steel",
  fairy: "bg-pokemon-fairy",
};

export function getPokemonTypeClass(type: string) {
  return pokemonTypeClasses[type.toLowerCase() as keyof typeof pokemonTypeClasses] ?? "bg-gray-400";
}

export function getPokemonTypeIconPath(type: string) {
  return `/${type.toLowerCase()}.svg`;
}

export function getPokemonTypeColorVar(type?: string) {
  if (!type || !(type.toLowerCase() in pokemonTypeClasses)) {
    return "#64748b";
  }

  return `var(--color-pokemon-${type.toLowerCase()})`;
}
