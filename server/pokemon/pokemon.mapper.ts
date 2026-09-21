export interface MappedPokemonType {
  name: string;
  slug: string;
}

export interface MappedPokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface MappedPokemonMove {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  typeSlug: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  damageClass: string | null;
  priority: number | null;
  learnMethod: string | null;
  level: number | null;
}

export interface MappedPokemonAbility {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isHidden: boolean;
}

export interface MappedPokemon {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  genus: string | null;
  image: string | null;
  height: number | null;
  weight: number | null;
  types: MappedPokemonType[];
  stats: MappedPokemonStats | null;
  moves: MappedPokemonMove[] | null;
  abilities: MappedPokemonAbility[] | null;
}

interface RawTranslation {
  name: string;
  description?: string | null;
  genus?: string | null;
}

interface RawType {
  type: {
    apiName: string;
    translations?: RawTranslation[];
  };
}

interface RawMove {
  learnMethod: string | null;
  level: number | null;
  move: {
    id: number;
    apiName: string;
    power: number | null;
    accuracy: number | null;
    pp: number | null;
    damageClass: string | null;
    priority: number | null;
    translations?: RawTranslation[];
    type: {
      apiName: string;
      translations?: RawTranslation[];
    };
  };
}

interface RawAbility {
  isHidden: boolean;
  ability: {
    id: number;
    apiName: string;
    effect: string | null;
    translations?: RawTranslation[];
  };
}

interface RawPokemon {
  id: number;
  apiName?: string;
  height?: number | null;
  weight?: number | null;
  sprite?: string | null;
  translations?: RawTranslation[];
  types: RawType[];
  stats?: MappedPokemonStats | null;
  moves?: RawMove[] | null;
  abilities?: RawAbility[] | null;
}

export function mapPokemon(pokemon: RawPokemon): MappedPokemon {
  return {
    id: pokemon.id,

    name: pokemon.translations?.[0]?.name ?? pokemon.apiName ?? "",

    slug: pokemon.apiName ?? null,

    description: pokemon.translations?.[0]?.description ?? null,

    genus: pokemon.translations?.[0]?.genus ?? null,

    image: pokemon.sprite ?? null,

    height: pokemon.height ? pokemon.height / 10 : null,

    weight: pokemon.weight ? pokemon.weight / 10 : null,

    types: pokemon.types.map((item) => ({
      name: item.type.translations?.[0]?.name ?? item.type.apiName,

      slug: item.type.apiName,
    })),

    stats: pokemon.stats
      ? {
          hp: pokemon.stats.hp,

          attack: pokemon.stats.attack,

          defense: pokemon.stats.defense,

          specialAttack: pokemon.stats.specialAttack,

          specialDefense: pokemon.stats.specialDefense,

          speed: pokemon.stats.speed,
        }
      : null,

    moves: pokemon.moves
      ? pokemon.moves.map((pokemonMove) => ({
          id: pokemonMove.move.id,

          name: pokemonMove.move.translations?.[0]?.name ?? pokemonMove.move.apiName,

          slug: pokemonMove.move.apiName,

          description: pokemonMove.move.translations?.[0]?.description ?? null,

          type: pokemonMove.move.type.translations?.[0]?.name ?? pokemonMove.move.type.apiName,

          typeSlug: pokemonMove.move.type.apiName,

          power: pokemonMove.move.power,

          accuracy: pokemonMove.move.accuracy,

          pp: pokemonMove.move.pp,

          damageClass: pokemonMove.move.damageClass,

          priority: pokemonMove.move.priority,

          learnMethod: pokemonMove.learnMethod,

          level: pokemonMove.level,
        }))
      : null,

    abilities: pokemon.abilities
      ? pokemon.abilities.map((pokemonAbility) => ({
          id: pokemonAbility.ability.id,

          name: pokemonAbility.ability.translations?.[0]?.name ?? pokemonAbility.ability.apiName,

          slug: pokemonAbility.ability.apiName,

          description: pokemonAbility.ability.translations?.[0]?.description ?? pokemonAbility.ability.effect,

          isHidden: pokemonAbility.isHidden,
        }))
      : null,
  };
}
