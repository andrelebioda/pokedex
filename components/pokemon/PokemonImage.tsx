"use client";

import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";

interface PokemonImageProps {
  src?: string | null;
  alt: string;
  size?: number;
  // Füllt ein quadratisches Feld in voller Breite des Elternelements statt einer festen Höhe
  fluid?: boolean;
}

export default function PokemonImage({ src, alt, size = 150, fluid = false }: PokemonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const containerHeight = Math.round(size * 0.96);
  const skeletonSize = Math.round(size * 0.85);

  const containerClass = fluid ? "aspect-square" : "";
  const containerStyle = fluid ? undefined : { height: containerHeight };

  if (!src || error) {
    return (
      <div className={`flex w-full items-center justify-center ${containerClass}`} style={containerStyle}>
        <div
          className="
            flex
            items-center
            justify-center
            rounded-full
            bg-slate-100
            text-4xl
          "
          style={fluid ? { height: "70%", width: "70%" } : { height: skeletonSize, width: skeletonSize }}
        >
          🥚
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex w-full items-center justify-center ${containerClass}`} style={containerStyle}>
      {!loaded && (
        <Skeleton
          width={fluid ? "70%" : skeletonSize}
          height={fluid ? "70%" : skeletonSize}
          containerClassName={fluid ? "flex h-full w-full items-center justify-center" : undefined}
          borderRadius={20}
          baseColor="#1e293b"
          highlightColor="#334155"
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        onLoad={() => {
          setLoaded(true);
        }}
        onError={() => {
          setError(true);
        }}
        style={fluid ? undefined : { height: containerHeight }}
        className={`
          absolute
          ${fluid ? "h-full w-full" : "w-auto"}
          object-contain
          transition-opacity
          duration-300

          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
