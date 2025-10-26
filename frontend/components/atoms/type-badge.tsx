/**
 * Type Badge component (Atom)
 * @module components/atoms/type-badge
 * @description A badge component displaying Pokemon type with type-specific colors
 */

interface TypeBadgeProps {
  type: string
}

const typeColors: Record<string, string> = {
  bug: "#A7B723",
  dark: "#75574C",
  dragon: "#7037FF",
  electric: "#F9CF30",
  fairy: "#E69EAC",
  fighting: "#C12239",
  fire: "#F57D31",
  flying: "#A891EC",
  ghost: "#70559B",
  normal: "#AAA67F",
  grass: "#74CB48",
  ground: "#DEC16B",
  ice: "#9AD6DF",
  poison: "#A43E9E",
  psychic: "#FB5584",
  rock: "#B69E31",
  steel: "#B7B9D0",
  water: "#6493EB",
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const bgColor = typeColors[type.toLowerCase()] || "#AAA67F"

  return (
    <span
      className="px-4 py-1 rounded-full text-white text-[12px] leading-[16px] font-bold capitalize"
      style={{ backgroundColor: bgColor }}
    >
      {type}
    </span>
  )
}
