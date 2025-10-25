/**
 * Tests for validation utility functions
 * @module __tests__/utils/validation
 */

import {
  validateLoginForm,
  capitalize,
  formatPokemonName,
} from '@/utils/validation';

describe('validateLoginForm', () => {
  it('should return valid for correct credentials', () => {
    const result = validateLoginForm('admin', 'admin');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return error for empty username', () => {
    const result = validateLoginForm('', 'password');
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBe('Username is required');
  });

  it('should return error for empty password', () => {
    const result = validateLoginForm('username', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe('Password is required');
  });

  it('should return errors for both empty fields', () => {
    const result = validateLoginForm('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBe('Username is required');
    expect(result.errors.password).toBe('Password is required');
  });

  it('should trim whitespace and validate', () => {
    const result = validateLoginForm('   ', '   ');
    expect(result.isValid).toBe(false);
  });
});

describe('capitalize', () => {
  it('should capitalize the first letter', () => {
    expect(capitalize('pokemon')).toBe('Pokemon');
  });

  it('should handle already capitalized strings', () => {
    expect(capitalize('Pokemon')).toBe('Pokemon');
  });

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('formatPokemonName', () => {
  it('should format single word names', () => {
    expect(formatPokemonName('pikachu')).toBe('Pikachu');
  });

  it('should format hyphenated names', () => {
    expect(formatPokemonName('mr-mime')).toBe('Mr Mime');
  });

  it('should handle multiple hyphens', () => {
    expect(formatPokemonName('tapu-koko-gx')).toBe('Tapu Koko Gx');
  });
});
