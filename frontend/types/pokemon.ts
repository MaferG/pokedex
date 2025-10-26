/**
 * TypeScript types for Pokemon data
 * @module types/pokemon
 * @description Type definitions based on PokeAPI responses
 */

/**
 * Basic Pokemon information returned in list queries
 */
export interface Pokemon {
  /** Pokemon's unique ID number */
  id: number;
  /** Pokemon's name in lowercase */
  name: string;
  /** PokeAPI URL for this Pokemon */
  url: string;
  /** URL to Pokemon's official artwork image */
  image: string;
}

/**
 * Paginated response for Pokemon list queries
 */
export interface PokemonListResponse {
  /** Total number of Pokemon matching the query */
  count: number;
  /** URL to next page of results (null if last page) */
  next: string | null;
  /** URL to previous page of results (null if first page) */
  previous: string | null;
  /** Array of Pokemon in current page */
  results: Pokemon[];
}

/**
 * Pokemon type information (fire, water, grass, etc.)
 */
export interface PokemonType {
  /** Slot position of this type (1 or 2) */
  slot: number;
  /** Type name (e.g., "fire", "water", "grass") */
  name: string;
}

/**
 * Pokemon ability information
 */
export interface PokemonAbility {
  /** Ability name */
  name: string;
  /** Whether this is a hidden ability */
  is_hidden: boolean;
  /** Slot position of this ability */
  slot: number;
}

/**
 * Pokemon move/attack information
 */
export interface PokemonMove {
  /** Move name */
  name: string;
  /** PokeAPI URL for move details */
  url: string;
}

/**
 * Pokemon form information (normal, mega, gigantamax, etc.)
 */
export interface PokemonForm {
  /** Form name */
  name: string;
  /** PokeAPI URL for form details */
  url: string;
}

/**
 * Pokemon base stat information
 */
export interface PokemonStat {
  /** Stat name (hp, attack, defense, special-attack, special-defense, speed) */
  name: 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';
  /** Base stat value (0-255) */
  base_stat: number;
  /** Effort Value (EV) gained when defeating this Pokemon */
  effort: number;
}

/**
 * Pokemon species information
 */
export interface PokemonSpecies {
  /** Species name */
  name: string;
  /** Pokedex description/flavor text in English */
  description: string;
  /** Pokemon genus (e.g., "Seed Pokemon", "Flame Pokemon") */
  genera: string;
}

/**
 * Pokemon images from different sources
 */
export interface PokemonImages {
  /** Default front sprite */
  front_default: string;
  /** Shiny front sprite */
  front_shiny: string;
  /** Official artwork (high quality) */
  official_artwork: string;
}

/**
 * Complete Pokemon details with all information
 */
export interface PokemonDetail {
  /** Pokemon's unique ID number */
  id: number;
  /** Pokemon's name in lowercase */
  name: string;
  /** Height in decimeters (divide by 10 for meters) */
  height: number;
  /** Weight in hectograms (divide by 10 for kilograms) */
  weight: number;
  /** Base experience gained when defeating this Pokemon */
  base_experience: number;
  /** Collection of Pokemon sprite images */
  images: PokemonImages;
  /** Pokemon types (1-2 types) */
  types: PokemonType[];
  /** Pokemon abilities (typically 1-3) */
  abilities: PokemonAbility[];
  /** All moves this Pokemon can learn */
  moves: PokemonMove[];
  /** Available forms for this Pokemon */
  forms: PokemonForm[];
  /** Base stats (HP, Attack, Defense, Sp.Atk, Sp.Def, Speed) */
  stats: PokemonStat[];
  /** Species information and Pokedex entry */
  species: PokemonSpecies;
}

/**
 * Sort order options for Pokemon list
 */
export type PokemonSortOrder = 'number' | 'name';

/**
 * Pokemon type names for type checking
 */
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

/**
 * Pokemon stat names for type checking
 */
export type PokemonStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';
