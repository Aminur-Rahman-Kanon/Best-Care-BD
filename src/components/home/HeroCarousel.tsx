"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import Image from "next/image";

// Custom CSS animations
const customStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 1.8s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 1.8s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 1.0s ease-out forwards;
  }
`;

// Slide 1: Summer Sale - Fade-in animation
function Slide1({ isActive }: { isActive: boolean }) {
  return (
    <>
      <style>{customStyles}</style>
      <div className="relative w-full h-full bg-gradient-to-r from-amber-50 to-orange-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-2 md:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs sm:text-sm md:text-base text-amber-700 font-semibold mb-2 tracking-wider uppercase">
                Summer Collection 2024
              </p>
              <h1
                className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 ${
                  isActive ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: '100ms' }}
              >
                Up to 50% Off
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-6 max-w-md">
                Discover our exclusive summer collection with amazing discounts on all items.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="w-full sm:w-[200px] h-[40px] bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-xs md:text-base font-medium flex justify-center items-center">
                  Shop Now
                </button>
                <button className="w-full sm:w-[200px] h-[40px] border border-gray-900 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors text-xs md:text-base font-medium flex justify-center items-center">
                  View Catalog
                </button>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="hidden md:block flex-1 relative">
              <div
                className={`transition-all duration-700 ease-out ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="max-w-[550px] mx-auto relative aspect-[3/2.5] bg-white rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8">
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                    SALE
                  </div>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl">
                    <Image src={'/images/hero/banner_1_1.jpg'}
                           alt="football jersey"
                           width={100}
                           height={100}
                           className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Slide 2: New Arrivals - Typing animation
function Slide2({ isActive }: { isActive: boolean }) {
  const [typedText, setTypedText] = useState("");
  const fullText = "NEW ARRIVALS";

  useEffect(() => {
    if (isActive) {
      let index = 0;
      setTypedText("");
      const interval = setInterval(() => {
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isActive, fullText]);

  return (
    <>
      <style>{customStyles}</style>
      <div className="relative w-full h-full aspect-[3/2] bg-gradient-to-r from-blue-50 to-indigo-100 overflow-hidden">
        <div className="w-full h-full absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm md:text-base text-indigo-700 font-semibold mb-2 tracking-wider uppercase">
                Just Landed
              </p>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 ${
                  isActive ? 'animate-slide-in-right' : 'opacity-0'
                }`}
                style={{ animationDelay: '100ms' }}
              >
                {typedText}
                <span className="animate-pulse">|</span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-6 max-w-md">
                Be the first to shop our latest collection of trendy fashion items.
              </p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base font-medium">
                Explore Collection
              </button>
            </div>

            {/* Right Content - Product Grid */}
            <div className="hidden md:block flex-1 relative">
              <div
                className={`transition-all duration-700 ease-out ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="grid md:grid-cols-[repeat(2,110px)] lg:grid-cols-[repeat(2,150px)] xl:grid-cols-[repeat(2,225px)] gap-2 place-content-center">
                  <div className="w-full h-full bg-white rounded-xl shadow-lg p-2 flex flex-col justify-center items-center overflow-hidden">
                    <div className="aspect-square rounded-lg flex items-center justify-center mb-2">
                      <Image src="/images/hero/banner_2_1.webp"
                             alt="Formal Shirt"
                             width={100}
                             height={100}
                             className="w-full h-full rounded-lg object-cover" />
                    </div>
                    <p className="text-gray-900 font-semibold text-[10px] truncate">World Cup Cap 2026</p>
                    <p className="text-indigo-600 font-bold text-[10px]">&#2547;399</p>
                  </div>
                  <div className="w-full h-full bg-white rounded-xl shadow-lg p-2 flex flex-col justify-center items-center overflow-hidden">
                    <div className="aspect-square rounded-lg flex items-center justify-center mb-2">
                      <Image src="/images/hero/banner_2_2.webp"
                             alt="Formal Shirt"
                             width={100}
                             height={100}
                             className="w-full h-full rounded-lg object-cover" />
                    </div>
                    <p className="text-gray-900 font-semibold text-[10px]">World Cup Cap 2026</p>
                    <p className="text-indigo-600 font-bold text-[10px]">&#2547;399</p>
                  </div>
                  <div className="w-full h-full bg-white rounded-xl shadow-lg p-2 flex flex-col justify-center items-center">
                    <div className="aspect-square rounded-lg flex items-center justify-center mb-2">
                      <Image src="/images/hero/banner_2_3.webp"
                             alt="Formal Shirt"
                             width={100}
                             height={100}
                             className="w-full h-full rounded-lg object-cover" />
                    </div>
                    <p className="text-gray-900 font-semibold text-[10px] truncate">World Cup Cap 2026</p>
                    <p className="text-indigo-600 font-bold text-[10px]">&#2547;350</p>
                  </div>
                  <div className="w-full h-full bg-white rounded-xl shadow-lg p-2 flex flex-col justify-center items-center">
                    <div className="aspect-square rounded-lg flex items-center justify-center mb-2">
                      <Image src="/images/hero/banner_2_4.webp"
                             alt="Formal Shirt"
                             width={100}
                             height={100}
                             className="w-full h-full rounded-lg object-cover" />
                    </div>
                    <p className="text-gray-900 font-semibold text-[10px] truncate">World Cup Cap 2026</p>
                    <p className="text-indigo-600 font-bold text-[10px]">&#2547;350</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Slide 3: Best Sellers - Sliding animation
function Slide3({ isActive }: { isActive: boolean }) {
  return (
    <>
      <style>{customStyles}</style>
      <div className="relative w-full h-full bg-gradient-to-r from-emerald-50 to-teal-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm md:text-base text-emerald-700 font-semibold mb-2 tracking-wider uppercase">
                Top Rated
              </p>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 ${
                  isActive ? 'animate-slide-in-left' : 'opacity-0'
                }`}
                style={{ animationDelay: '100ms' }}
              >
                Best Sellers
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-6 max-w-md">
                Shop our most loved products chosen by thousands of happy customers.
              </p>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base font-medium">
                Shop Best Sellers
              </button>
            </div>

            {/* Right Content - Product List */}
            <div className="hidden md:flex flex-1 relative">
              <div
                className={`transition-all duration-700 ease-out ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <div className="w-full min-w-[350px] bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image src={'/images/hero/banner_3_1.jpg'}
                             alt="designer bag"
                             width={100}
                             height={100}
                             className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-sm md:text-base truncate">Designer Bag</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400 text-xs">★★★★★</div>
                        <span className="text-gray-500 text-xs">(129)</span>
                      </div>
                      <p className="text-emerald-600 font-bold text-sm md:text-base">&#2547;350</p>
                    </div>
                  </div>
                  <div className="w-full min-w-[350px] bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image src={'/images/hero/banner_3_2.jpg'}
                             alt="designer bag"
                             width={100}
                             height={100}
                             className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-sm md:text-base truncate">Backpack</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400 text-xs">★★★★★</div>
                        <span className="text-gray-500 text-xs">(122)</span>
                      </div>
                      <p className="text-emerald-600 font-bold text-sm md:text-base">&#2547;250</p>
                    </div>
                  </div>
                  <div className="w-full min-w-[350px] bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image src={'/images/hero/banner_3_3.jpg'}
                             alt="designer bag"
                             width={100}
                             height={100}
                             className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-sm md:text-base truncate">Totte Bag</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400 text-xs">★★★★★</div>
                        <span className="text-gray-500 text-xs">(89)</span>
                      </div>
                      <p className="text-emerald-600 font-bold text-sm md:text-base">&#2547;750</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setActiveSlide(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <section className="w-full" aria-label="Promotional banners">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="min-w-0 flex-[0_0_100%]">
            <div className="relative w-full aspect-[3/2] md:aspect-[3/1.3]">
              <Slide1 isActive={activeSlide === 0} />
            </div>
          </div>
          <div className="min-w-0 flex-[0_0_100%]">
            <div className="relative w-full aspect-[3/2] md:aspect-[3/1.3]">
              <Slide2 isActive={activeSlide === 1} />
            </div>
          </div>
          <div className="min-w-0 flex-[0_0_100%]">
            <div className="relative w-full aspect-[3/2] md:aspect-[3/1.3]">
              <Slide3 isActive={activeSlide === 2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
