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
      <div className="relative bg-white rounded-lg p-2 flex flex-col items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-shadow cursor-pointer overflow-hidden">
        {/* Half gray background (bottom half) */}
        <div className="absolute bottom-0 left-0 w-full h-2/5 bg-[#EFEFEF] z-0 rounded-t-lg"></div>

        {/* Content */}
        <span className="text-[#666666] text-[12px] leading-[16px]  self-end z-10">
          {formattedId}
        </span>
        <div className="w-20 h-20 md:w-50 md:h-50 relative z-10">
          <Image
            src={image || "/placeholder.png"}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-[#212121] text-[14px] leading-[16px]  text-center z-10 capitalize">
          {name}
        </h3>
      </div>
    </Link>
  );
}
