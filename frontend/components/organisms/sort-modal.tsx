/**
 * Sort Modal component (Organism)
 * @module components/organisms/sort-modal
 * @description A modal dialog for selecting sort options (number or name)
 */

"use client";

import { useState } from "react";

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (sortBy: "number" | "name") => void;
  currentSort: "number" | "name";
}

export function SortModal({
  isOpen,
  onClose,
  onSort,
  currentSort,
}: SortModalProps) {
  const [selected, setSelected] = useState<"number" | "name">(currentSort);

  if (!isOpen) return null;

  const handleSelect = (value: "number" | "name") => {
    setSelected(value);
    onSort(value);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#DC0A2D] rounded-2xl p-6 w-[280px] shadow-[0_6px_12px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-[24px] leading-[32px] font-bold mb-4">
          Sort by:
        </h2>
        <div className="bg-white rounded-xl p-6 space-y-4">
          <button
            onClick={() => handleSelect("number")}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#DC0A2D] flex items-center justify-center">
              {selected === "number" && (
                <div className="w-3 h-3 rounded-full bg-[#DC0A2D]" />
              )}
            </div>
            <span className="text-[#212121] text-[14px] leading-[16px]">
              Number
            </span>
          </button>

          <button
            onClick={() => handleSelect("name")}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#DC0A2D] flex items-center justify-center">
              {selected === "name" && (
                <div className="w-3 h-3 rounded-full bg-[#DC0A2D]" />
              )}
            </div>
            <span className="text-[#212121] text-[14px] leading-[16px]">
              Name
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
