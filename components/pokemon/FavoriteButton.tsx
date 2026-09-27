"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { useFavorites } from "@/components/providers/FavoritesProvider";

interface FavoriteButtonProps {
  pokemonId: number;
  className?: string;
}

export default function FavoriteButton({ pokemonId, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();

  const favorited = isFavorite(pokemonId);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    void toggleFavorite(pokemonId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorited}
      aria-label={favorited ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      className={`
        z-10
        flex
        size-8
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-white/15
        bg-black/30
        text-white/80
        backdrop-blur-md
        transition
        hover:bg-black/50
        hover:text-white
        ${className}
      `}
    >
      <Heart size={16} className={favorited ? "fill-red-500 text-red-500" : ""} />
    </button>
  );
}
