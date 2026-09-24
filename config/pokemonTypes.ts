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

// Gleiche Werte wie --color-pokemon-* in globals.css, für Stellen ohne CSS-Variablen (z. B. Chart.js)
export const pokemonTypeHexColors: Record<keyof typeof pokemonTypeClasses, string> = {
  normal: "#a8a77a",
  fire: "#e8612c",
  water: "#6390f0",
  electric: "#f7d02c",
  grass: "#7ac74c",
  ice: "#96d9d6",
  fighting: "#a8533a",
  poison: "#a33ea1",
  ground: "#e2bf65",
  flying: "#a98ff3",
  psychic: "#f95587",
  bug: "#a6b91a",
  rock: "#b6a136",
  ghost: "#735797",
  dragon: "#6f35fc",
  dark: "#705746",
  steel: "#b7b7ce",
  fairy: "#d685ad",
};

export function getPokemonTypeHexColor(type?: string) {
  return pokemonTypeHexColors[type?.toLowerCase() as keyof typeof pokemonTypeHexColors] ?? "#ef4444";
}

export function getPokemonTypeColorVar(type?: string) {
  if (!type || !(type.toLowerCase() in pokemonTypeClasses)) {
    return "#64748b";
  }

  return `var(--color-pokemon-${type.toLowerCase()})`;
}
