/**
 * Tests for Pokemon controller
 * @module controllers/__tests__/pokemon.controller.test
 */

import { jest } from '@jest/globals';

// Create mock functions
const mockGetPokemonList = jest.fn();
const mockSearchPokemonByName = jest.fn();
const mockGetSortedPokemonList = jest.fn();
const mockGetPokemonDetails = jest.fn();

// Mock the pokeapi service module
jest.unstable_mockModule('../../services/pokeapi.service.js', () => ({
  getPokemonList: mockGetPokemonList,
  searchPokemonByName: mockSearchPokemonByName,
  getSortedPokemonList: mockGetSortedPokemonList,
  getPokemonDetails: mockGetPokemonDetails
}));

// Import after mocking
const { getPokemons, getPokemonById } = await import('../pokemon.controller.js');
const { HTTP_STATUS } = await import('../../config/constants.js');

describe('Pokemon Controller', () => {
  let req, res;

  beforeEach(() => {
    // Setup mock request and response objects
    req = {
      query: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('getPokemons', () => {
    it('should return paginated Pokemon list with default parameters', async () => {
      const mockData = {
        count: 1302,
        next: 'next-url',
        previous: null,
        results: [
          { id: 1, name: 'bulbasaur', url: 'url1', image: 'image1.png' },
          { id: 2, name: 'ivysaur', url: 'url2', image: 'image2.png' }
        ]
      };

      mockGetPokemonList.mockResolvedValue(mockData);

      await getPokemons(req, res);

      expect(mockGetPokemonList).toHaveBeenCalledWith(20, 0);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle custom limit and offset parameters', async () => {
      req.query = { limit: '50', offset: '100' };

      const mockData = {
        count: 1302,
        next: 'next-url',
        previous: 'prev-url',
        results: []
      };

      mockGetPokemonList.mockResolvedValue(mockData);

      await getPokemons(req, res);

      expect(mockGetPokemonList).toHaveBeenCalledWith(50, 100);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it('should reject invalid limit parameter', async () => {
      req.query = { limit: '150' };

      await getPokemons(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Limit must be between 1 and 100'
      });
    });

    it('should reject negative offset parameter', async () => {
      req.query = { offset: '-5' };

      await getPokemons(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Offset must be non-negative'
      });
    });

    it('should reject invalid sort parameter', async () => {
      req.query = { sort: 'invalid' };

      await getPokemons(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Sort must be either "number" or "name"'
      });
    });

    it('should handle search queries', async () => {
      req.query = { search: 'pikachu' };

      const mockSearchResult = {
        count: 2,
        results: [
          { id: 25, name: 'pikachu', url: 'url1', image: 'image1.png' },
          { id: 731, name: 'pikipek', url: 'url2', image: 'image2.png' }
        ]
      };

      mockSearchPokemonByName.mockResolvedValue(mockSearchResult);

      await getPokemons(req, res);

      expect(mockSearchPokemonByName).toHaveBeenCalledWith('pikachu', 20, 0);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        next: null,
        previous: null,
        results: mockSearchResult.results
      });
    });

    it('should handle search with no results', async () => {
      req.query = { search: 'nonexistent' };

      mockSearchPokemonByName.mockRejectedValue(new Error('Pokemon "nonexistent" not found'));

      await getPokemons(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Pokemon "nonexistent" not found'
      });
    });

    it('should sort Pokemon by number', async () => {
      req.query = { sort: 'number' };

      const mockSortedData = {
        count: 1302,
        results: [
          { id: 1, name: 'bulbasaur', url: 'url1', image: 'image1.png' },
          { id: 2, name: 'ivysaur', url: 'url2', image: 'image2.png' },
          { id: 3, name: 'venusaur', url: 'url3', image: 'image3.png' }
        ]
      };

      mockGetSortedPokemonList.mockResolvedValue(mockSortedData);

      await getPokemons(req, res);

      expect(mockGetSortedPokemonList).toHaveBeenCalledWith(20, 0, 'number');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(mockSortedData);
    });

    it('should sort Pokemon by name', async () => {
      req.query = { sort: 'name' };

      const mockSortedData = {
        count: 1302,
        results: [
          { id: 359, name: 'absol', url: 'url1', image: 'image1.png' },
          { id: 63, name: 'abra', url: 'url2', image: 'image2.png' },
          { id: 142, name: 'aerodactyl', url: 'url3', image: 'image3.png' }
        ]
      };

      mockGetSortedPokemonList.mockResolvedValue(mockSortedData);

      await getPokemons(req, res);

      expect(mockGetSortedPokemonList).toHaveBeenCalledWith(20, 0, 'name');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(mockSortedData);
    });

    it('should handle errors gracefully', async () => {
      mockGetPokemonList.mockRejectedValue(new Error('API Error'));

      await getPokemons(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch Pokemon list'
      });
    });
  });

  describe('getPokemonById', () => {
    it('should return Pokemon details for valid ID', async () => {
      req.params = { id: '25' };

      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [{ slot: 1, name: 'electric' }],
        abilities: [{ name: 'static', is_hidden: false, slot: 1 }]
      };

      mockGetPokemonDetails.mockResolvedValue(mockPokemon);

      await getPokemonById(req, res);

      expect(mockGetPokemonDetails).toHaveBeenCalledWith('25');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(mockPokemon);
    });

    it('should return Pokemon details for valid name', async () => {
      req.params = { id: 'pikachu' };

      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60
      };

      mockGetPokemonDetails.mockResolvedValue(mockPokemon);

      await getPokemonById(req, res);

      expect(mockGetPokemonDetails).toHaveBeenCalledWith('pikachu');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it('should return 400 for missing ID', async () => {
      req.params = {};

      await getPokemonById(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Pokemon ID is required'
      });
    });

    it('should return 404 for non-existent Pokemon', async () => {
      req.params = { id: '99999' };

      mockGetPokemonDetails.mockRejectedValue(
        new Error('Pokemon with ID 99999 not found')
      );

      await getPokemonById(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Pokemon with ID 99999 not found'
      });
    });

    it('should handle server errors gracefully', async () => {
      req.params = { id: '25' };

      mockGetPokemonDetails.mockRejectedValue(new Error('Server error'));

      await getPokemonById(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch Pokemon details'
      });
    });
  });
});
