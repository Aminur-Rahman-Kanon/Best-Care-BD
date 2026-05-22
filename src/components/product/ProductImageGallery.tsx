"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ImageZoom from "./ImageZoom";

type GalleryImage = { url: string; path: string };

export default function ProductImageGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const slides =
    images.length > 0
      ? images
      : [{ url: "/images/icons/placeholder.svg", path: "placeholder" }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const goToSlide = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const active = slides[selectedIndex] ?? slides[0];

  return (
    <div className="w-full">
      {/* Desktop: cursor-following zoom */}
      <div className="hidden lg:block">
        <ImageZoom src={active.url} alt={title} />
      </div>

      {/* Mobile & tablet: swipe carousel */}
      <div className="lg:hidden">
        <div className="embla overflow-hidden rounded-lg border border-gray-200" ref={emblaRef}>
          <div className="embla__container flex">
            {slides.map((img, i) => (
              <div
                key={img.path}
                className="embla__slide min-w-0 flex-[0_0_100%]"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={img.url}
                    alt={`${title} ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      {slides.length > 1 && (
        <div
          className="mt-4 flex justify-center gap-2"
          role="tablist"
          aria-label="Product images"
        >
          {slides.map((img, i) => (
            <button
              key={img.path}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`View image ${i + 1}`}
              onClick={() => goToSlide(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-6 bg-brand-dark"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
