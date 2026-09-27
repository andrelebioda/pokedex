"use client";

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { getFavoriteIdsAction, toggleFavoriteAction } from "@/server/pokemon/favorites.actions";

interface FavoritesContextValue {
  favoriteIds: Set<number>;
  isFavorite: (pokemonId: number) => boolean;
  toggleFavorite: (pokemonId: number) => Promise<{ error?: string }>;
  isAuthenticated: boolean;
  // true, sobald favoriteIds für den aktuellen Login-Status feststeht (verhindert ein kurzes Aufblitzen
  // "keine Favoriten", solange der initiale Abruf nach dem Anmelden noch läuft).
  ready: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  // Beim Ab-/Anmelden sofort zurücksetzen, ohne auf den nächsten Effekt-Durchlauf zu warten.
  const [prevStatus, setPrevStatus] = useState(status);
  if (status !== prevStatus) {
    setPrevStatus(status);
    if (status !== "authenticated") {
      setFavoriteIds(new Set());
      setReady(status !== "loading");
    }
  }

  useEffect(() => {
    if (status !== "authenticated") return;

    getFavoriteIdsAction().then((ids) => {
      setFavoriteIds(new Set(ids));
      setReady(true);
    });
  }, [status, session?.user?.id]);

  async function toggleFavorite(pokemonId: number) {
    const wasFavorited = favoriteIds.has(pokemonId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) next.delete(pokemonId);
      else next.add(pokemonId);
      return next;
    });

    const result = await toggleFavoriteAction(pokemonId);

    if ("error" in result) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.add(pokemonId);
        else next.delete(pokemonId);
        return next;
      });
      return { error: result.error };
    }

    return {};
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite: (pokemonId) => favoriteIds.has(pokemonId),
        toggleFavorite,
        isAuthenticated: status === "authenticated",
        ready,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites muss innerhalb von FavoritesProvider verwendet werden.");
  return context;
}
