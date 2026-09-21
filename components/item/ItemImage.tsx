"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ItemImageProps {
  src?: string | null;
  alt: string;
  size?: number;
}

export default function ItemImage({ src, alt, size = 48 }: ItemImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-800 text-slate-500"
        style={{ height: size, width: size }}
      >
        <Package size={Math.round(size * 0.5)} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => {
        setError(true);
      }}
      className="object-contain"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
