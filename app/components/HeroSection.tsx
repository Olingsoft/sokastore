"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const categories = [
    { id: 1, name: 'Premier League', count: 10 },
    { id: 2, name: 'La Liga', count: 8 },
    { id: 3, name: 'Serie A', count: 7 },
    { id: 4, name: 'Bundesliga', count: 6 },
    { id: 5, name: 'Ligue 1', count: 5 },
    { id: 6, name: 'National Teams', count: 12 },
  ];

  const slides = [
    {
      id: 1,
      title: 'New Season Kits',
      subtitle: 'Up to 30% OFF',
      description: 'Get your favorite team\'s latest jerseys',
      image: '/images/ads2.png',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      title: 'Limited Edition',
      subtitle: 'Exclusive Drops',
      description: 'Special edition jerseys available now',
      image: '/images/ads3.png',
      buttonText: 'View Collection',
    },
  ];

  const ads = [
    {
      id: 1,
      title: 'Free Shipping',
      description: 'On orders over $100',
      image: '/images/heroimg.png',
    },
    {
      id: 2,
      title: 'New Arrivals',
      description: 'Check out our latest collection',
      image: '/images/jersey2.webp',
    },
    {
      id: 123,
      title: 'Ads',
      description: 'Check out our latest collection',
      image: '/images/ads1.jpg',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="bg-gradient-to-b from-[#0a0f0a] to-[#1a1f1a] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <div className="w-full lg:w-1/5 bg-gray-900/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Categories</h2>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id} className="flex justify-between items-center p-2 hover:bg-gray-800/50 rounded cursor-pointer transition-colors">
                  <span>{category.name}</span>
                  <span className="text-gray-400 text-sm">({category.count})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Slider */}
          <div className="w-full lg:w-3/5 relative">
            <div className="relative h-80 md:h-96 bg-gray-800 rounded-lg overflow-hidden">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10 p-8 flex flex-col justify-center">
                    <div className="max-w-md">
                      <span className="text-green-400 font-medium">{slide.subtitle}</span>
                      <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{slide.title}</h2>
                      <p className="text-gray-300 mb-6">{slide.description}</p>
                      <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ))}
              
              {/* Slider Controls */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Right Sidebar - Ads */}
          <div className="w-full lg:w-1/5 space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="relative h-32">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                    <h3 className="font-bold">{ad.title}</h3>
                    <p className="text-sm text-gray-300">{ad.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}