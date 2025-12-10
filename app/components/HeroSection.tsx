"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const searchParams = useSearchParams();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch(`${apiUrl}/categories?limit=20`);
        if (!response.ok) throw new Error('Failed to fetch categories');

        const data = await response.json();
        const categoriesList = Array.isArray(data?.data) ? data.data : [];
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories on error
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [apiUrl]);

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
    { id: 1, title: 'Free Shipping', description: 'On orders over $100', image: '/images/heroimg.png' },
    { id: 2, title: 'New Arrivals', description: 'Check out our latest collection', image: '/images/jersey2.webp' },
    { id: 3, title: 'Ads', description: 'Special offers', image: '/images/ads1.jpg' },
  ];

  const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="bg-gradient-to-b from-[#0a0f0a] to-[#1a1f1a] text-white py-1">
      <div className="container mx-auto px-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories */}
          <div className="w-full lg:w-1/5 bg-gray-900/50 rounded-lg p-4 lg:p-6">
            <h2 className="text-sm font-bold mb-4">Categories</h2>
            {isLoadingCategories ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {categories.map(cat => {
                  const isActive = searchParams.get('category') === cat.slug;
                  return (
                    <li key={cat._id}>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className={`block whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${isActive
                          ? 'bg-gradient-to-r from-green-600 to-teal-600 border-transparent text-white shadow-lg shadow-green-900/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                          }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  );
                })}
                {categories.length === 0 && !isLoadingCategories && (
                  <li className="text-gray-400 text-sm">No categories available</li>
                )}
              </ul>
            )}
          </div>

          {/* Main Slider */}
          <div className="w-full lg:w-3/5 relative">
            <div className="relative h-64 sm:h-80 md:h-96 bg-gray-800 rounded-lg overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10 p-6 sm:p-8 flex flex-col justify-center">
                    <div className="max-w-md">
                      <span className="text-green-400 font-medium">{slide.subtitle}</span>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-2">{slide.title}</h2>
                      <p className="text-gray-300 mb-4">{slide.description}</p>
                      <button className="bg-white text-gray-900 px-4 sm:px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base">
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                  <Image src={slide.image} alt={slide.title} fill className="object-cover" priority />
                </div>
              ))}
              <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full z-20">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full z-20">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Ads / Free Shipping / New Arrivals */}
          <div className="w-full lg:w-1/5 flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible scrollbar-hide">
            {ads.map(ad => (
              <div key={ad.id} className="flex-shrink-0 lg:flex-shrink-1 min-w-[140px] lg:min-w-full bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="relative h-28 sm:h-32">
                  <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 p-2 sm:p-4 flex flex-col justify-end">
                    <h3 className="font-bold text-sm sm:text-base">{ad.title}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">{ad.description}</p>
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
