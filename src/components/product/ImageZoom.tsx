"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

export default function ImageZoom({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }, []);

  return (
    <div
      className="relative aspect-square w-full max-w-[500px] cursor-crosshair overflow-hidden rounded-lg border border-gray-200"
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 500px"
        className="object-cover transition-transform duration-300 ease-out"
        style={{
          transform: zoom ? "scale(2.25)" : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        priority
      />
    </div>
  );
}
