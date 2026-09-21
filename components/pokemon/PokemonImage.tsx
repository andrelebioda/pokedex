"use client";

import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";

interface PokemonImageProps {
  src?: string | null;
  alt: string;
  size?: number;
}

export default function PokemonImage({ src, alt, size = 150 }: PokemonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const containerHeight = Math.round(size * 0.96);
  const skeletonSize = Math.round(size * 0.85);

  if (!src || error) {
    return (
      <div className="flex w-full items-center justify-center" style={{ height: containerHeight }}>
        <div
          className="
            flex
            items-center
            justify-center
            rounded-full
            bg-slate-100
            text-4xl
          "
          style={{ height: skeletonSize, width: skeletonSize }}
        >
          🥚
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full items-center justify-center" style={{ height: containerHeight }}>
      {!loaded && (
        <Skeleton
          width={skeletonSize}
          height={skeletonSize}
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
        style={{ height: containerHeight }}
        className={`
          absolute
          w-auto
          object-contain
          transition-opacity
          duration-300

          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
