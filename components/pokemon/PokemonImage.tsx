"use client";

import { CSSProperties, ReactNode, useState } from "react";
import Image from "next/image";

interface PokemonImageProps {
  src?: string | null;
  alt: string;
  size?: number;
  // Füllt ein quadratisches Feld in voller Breite des Elternelements statt einer festen Höhe
  fluid?: boolean;
}

interface PlaceholderProps {
  style: CSSProperties;
  pulse?: boolean;
  children?: ReactNode;
}

// Heller Glas-Kreis mit angedeutetem Pokéball, passt auf die farbigen Karten
function Placeholder({ style, pulse = false, children }: PlaceholderProps) {
  return (
    <div
      style={style}
      className={`
        relative
        flex
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-white/20
        bg-white/10
        shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]
        backdrop-blur-md
        ${pulse ? "animate-pulse" : ""}
      `}
    >
      <div aria-hidden className="absolute inset-x-0 top-1/2 h-[6%] -translate-y-1/2 bg-white/15" />
      <div aria-hidden className="absolute top-1/2 left-1/2 size-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white/20 bg-white/10" />
      {children && <span className="relative text-4xl">{children}</span>}
    </div>
  );
}

export default function PokemonImage({ src, alt, size = 150, fluid = false }: PokemonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const containerHeight = Math.round(size * 0.96);
  const skeletonSize = Math.round(size * 0.85);

  const containerClass = fluid ? "aspect-square" : "";
  const containerStyle = fluid ? undefined : { height: containerHeight };

  // Bleibt rund und schrumpft, wenn der Platz schmaler ist als der Durchmesser
  const placeholderStyle: CSSProperties = { width: fluid ? "70%" : skeletonSize, maxWidth: "100%", aspectRatio: "1" };

  if (!src || error) {
    return (
      <div className={`flex w-full items-center justify-center ${containerClass}`} style={containerStyle}>
        <Placeholder style={placeholderStyle}>🥚</Placeholder>
      </div>
    );
  }

  return (
    <div className={`relative flex w-full items-center justify-center ${containerClass}`} style={containerStyle}>
      {!loaded && <Placeholder style={placeholderStyle} pulse />}

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
