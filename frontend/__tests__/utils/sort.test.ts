/**
 * Tests for sort utility functions
 * @module __tests__/utils/sort
 */

import { sortPokemon, filterPokemon } from '@/utils/sort';
import { SortField, SortOrder } from '@/enums/sort';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon[] = [
  { id: 25, name: 'pikachu', url: 'test', image: 'test.png' },
  { id: 1, name: 'bulbasaur', url: 'test', image: 'test.png' },
  { id: 150, name: 'mewtwo', url: 'test', image: 'test.png' },
  { id: 6, name: 'charizard', url: 'test', image: 'test.png' },
];

describe('sortPokemon', () => {
  it('should sort by number ascending', () => {
    const result = sortPokemon(mockPokemon, SortField.NUMBER, SortOrder.ASC);
    expect(result[0].id).toBe(1);
    expect(result[result.length - 1].id).toBe(150);
  });

  it('should sort by number descending', () => {
    const result = sortPokemon(mockPokemon, SortField.NUMBER, SortOrder.DESC);
    expect(result[0].id).toBe(150);
    expect(result[result.length - 1].id).toBe(1);
  });

  it('should sort by name ascending', () => {
    const result = sortPokemon(mockPokemon, SortField.NAME, SortOrder.ASC);
    expect(result[0].name).toBe('bulbasaur');
    expect(result[result.length - 1].name).toBe('pikachu');
  });

  it('should sort by name descending', () => {
    const result = sortPokemon(mockPokemon, SortField.NAME, SortOrder.DESC);
    expect(result[0].name).toBe('pikachu');
    expect(result[result.length - 1].name).toBe('bulbasaur');
  });

  it('should not mutate original array', () => {
    const original = [...mockPokemon];
    sortPokemon(mockPokemon, SortField.NAME, SortOrder.ASC);
    expect(mockPokemon).toEqual(original);
  });
});

describe('filterPokemon', () => {
  it('should filter by name', () => {
    const result = filterPokemon(mockPokemon, 'pika');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('pikachu');
  });

  it('should filter by number', () => {
    const result = filterPokemon(mockPokemon, '25');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(25);
  });

  it('should be case insensitive', () => {
    const result = filterPokemon(mockPokemon, 'PIKA');
    expect(result).toHaveLength(1);
  });

  it('should return all pokemon for empty query', () => {
    const result = filterPokemon(mockPokemon, '');
    expect(result).toHaveLength(mockPokemon.length);
  });

  it('should handle whitespace', () => {
    const result = filterPokemon(mockPokemon, '   ');
    expect(result).toHaveLength(mockPokemon.length);
  });

  it('should return empty array for no matches', () => {
    const result = filterPokemon(mockPokemon, 'nonexistent');
    expect(result).toHaveLength(0);
  });
});
