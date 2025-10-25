/**
 * TypeScript types for Pokemon data
 * @module types/pokemon
 */

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  image: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonType {
  slot: number;
  name: string;
}

export interface PokemonAbility {
  name: string;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  name: string;
  url: string;
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface PokemonStat {
  name: string;
  base_stat: number;
  effort: number;
}

export interface PokemonSpecies {
  name: string;
  description: string;
  genera: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  images: {
    front_default: string;
    front_shiny: string;
    official_artwork: string;
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  forms: PokemonForm[];
  stats: PokemonStat[];
  species: PokemonSpecies;
}
