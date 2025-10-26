"use client";

import { useState, useEffect } from "react";
import { PokemonCard } from "@/components/molecules/pokemon-card";
import { SortModal } from "@/components/organisms/sort-modal";
import { Search, SortAsc, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getPokemons } from "@/lib/api";

export default function PokedexPage() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"number" | "name">("number");
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * limit;
        const data = await getPokemons(limit, offset, searchQuery, sortBy);
        setPokemon(data.results);
        setTotalCount(data.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch Pokemon"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, [currentPage, isAuthenticated, searchQuery, sortBy]);

  // Removed client-side sorting - now handled by backend

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      {/* Header */}
      <header className="bg-[#DC0A2D] px-4 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#212121] rounded-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#212121]" />
              </div>
            </div>
            <h1 className="text-white text-[24px] leading-[32px] font-bold">
              Pokédex
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-full px-6 py-3 flex items-center gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
              <Search className="w-5 h-5 text-[#DC0A2D]" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[14px] leading-[16px] text-[#212121] placeholder:text-[#666666]"
              />
            </div>

            <button
              onClick={() => setSortModalOpen(true)}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-shadow"
            >
              <SortAsc className="w-6 h-6 text-[#DC0A2D]" />
            </button>
          </div>
        </div>
      </header>

      {/* Pokemon Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-[#666666] text-lg">Loading Pokemon...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {pokemon.map((p) => (
                <PokemonCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  image={p.image}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 bg-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  <ChevronLeft className="w-6 h-6 text-[#DC0A2D]" />
                </button>
                <span className="text-[#212121] font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  <ChevronRight className="w-6 h-6 text-[#DC0A2D]" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <SortModal
        isOpen={sortModalOpen}
        onClose={() => setSortModalOpen(false)}
        onSort={setSortBy}
        currentSort={sortBy}
      />
    </div>
  );
}
