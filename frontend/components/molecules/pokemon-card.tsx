/**
 * Pokemon Card component (Molecule)
 * @module components/molecules/pokemon-card
 * @description A card component displaying Pokemon preview with image, name, and number
 */

import Image from "next/image";
import Link from "next/link";

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
}

export function PokemonCard({ id, name, image }: PokemonCardProps) {
  const formattedId = `#${id.toString().padStart(3, "0")}`;

  return (
    <Link href={`/pokemon/${id}`} className="block">
      <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-shadow cursor-pointer">
        <span className="text-[#666666] text-[12px] leading-[16px] font-bold self-end">
          {formattedId}
        </span>
        <div className="w-[120px] h-[120px] relative">
          <Image
            src={image || "/placeholder.png"}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-[#212121] text-[14px] leading-[16px] font-bold text-center">
          {name}
        </h3>
      </div>
    </Link>
  );
}
