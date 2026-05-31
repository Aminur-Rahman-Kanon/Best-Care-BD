"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import type { BannerDTO } from "@/types/server";

const defaultBanners: BannerDTO[] = [
  {
    _id: "1",
    title: "Welcome to Mela",
    subtitle: "Discover our latest collection",
    ctaText: "Shop Now",
    ctaLink: "/",
    imageUrl: "/images/hero/banner-1.png",
    order: 0,
    active: true,
  },
  {
    _id: "2",
    title: "Big Sale",
    subtitle: "Selected items — limited time",
    ctaText: "Shop Now",
    ctaLink: "/",
    imageUrl: "/images/hero/banner-2.png",
    order: 1,
    active: true,
  },
  {
    _id: "3",
    title: "Treat Yourself",
    subtitle: "Up to 20% off selected products",
    ctaText: "Shop Now",
    ctaLink: "/",
    imageUrl: "/images/hero/banner-3.png",
    order: 2,
    active: true,
  },
];

export default function HeroCarousel({
  banners = defaultBanners,
}: {
  banners?: BannerDTO[];
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  const slides = banners.length ? banners : defaultBanners;

  return (
    <section
      className="embla w-full"
      aria-label="Promotional banners"
    >
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((banner) => (
            <div
              key={banner._id}
              className="embla__slide min-w-0 flex-[0_0_100%]"
            >
              <div className="relative w-full aspect-[3/2] sm:aspect-[3/1]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title || "Promotional banner"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1400px"
                  className="object-cover"
                  priority={banner.order === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
