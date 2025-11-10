"use client";

import Header from './components/Header';
import Hero from './components/HeroSection';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Footer from './components/Footer';

// --- DUMMY DATA ---
const products = [
  {
    id: 1,
    name: "New Jersey",
    price: 19.99,
    image: "/images/jersey1.jpg",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 2,
    name: "New Jersey",
    price: 19.99,
    image: "/images/jersey2.webp",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 3,
    name: "New Jersey",
    price: 19.99,
    image: "/images/jersey3.webp",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 3,
    name: "New Jersey",
    price: 19.99,
    image: "/images/jersey3.webp",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
];

import Link from 'next/link';

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }: { product: any }) => {
  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div
        className={`group bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${product.accentColor} relative h-full`}
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={250}
            height={250}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-gray-900 text-white rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Info Section */}
        <div className="p-3 text-center">
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {product.team}
            <span className="text-xs font-medium text-gray-500 block">
              {product.name}
            </span>
          </h3>

          <p className="text-lg font-bold text-green-600 mb-2 mt-1">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex items-center justify-center w-full px-3 py-1.5 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300 text-xs">
            View Details <ArrowRight className="ml-1" size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};


export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main>
        <Hero />
        {/* new jersey latest in store  */}
        <section className="bg-[#0a0f0a] text-white py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-green-400 uppercase tracking-wide">
                New Jerseys
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Explore the latest arrivals from your favorite leagues — fresh, authentic, and ready to wear.
              </p>
            </div>
            {/* //product cards with new badge */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Categorized Jersey Rows */}
        <section className="py-12 bg-gray-50 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Premier League Row */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Premier League</h2>
                <Link href="/shop?league=premier-league" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                  View All <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={`epl-${product.id}`} product={{
                    ...product,
                    team: 'Man Utd',
                    name: 'Home Kit 2024',
                    price: 89.99,
                    accentColor: 'border-red-600',
                    category: 'EPL'
                  }} />
                ))}
              </div>
            </div>

            {/* La Liga Row */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">La Liga</h2>
                <Link href="/shop?league=la-liga" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                  View All <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.slice(0, 4).map((product, index) => (
                  <ProductCard key={`laliga-${index}`} product={{
                    ...product,
                    team: index % 2 === 0 ? 'Barcelona' : 'Real Madrid',
                    name: index % 2 === 0 ? 'Home Kit 2024' : 'Away Kit 2024',
                    price: [95.99, 89.99, 85.99, 92.99][index],
                    accentColor: index % 2 === 0 ? 'border-blue-600' : 'border-white',
                    category: 'La Liga'
                  }} />
                ))}
              </div>
            </div>

            {/* Serie A Row */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Serie A</h2>
                <Link href="/shop?league=serie-a" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                  View All <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.slice(0, 4).map((product, index) => {
                  const teams = ['AC Milan', 'Inter Milan', 'Juventus', 'Napoli'];
                  const prices = [85.99, 87.99, 89.99, 83.99];
                  const accentColors = ['border-red-800', 'border-blue-800', 'border-black', 'border-blue-400'];
                  
                  return (
                    <ProductCard 
                      key={`seriea-${index}`} 
                      product={{
                        ...product,
                        team: teams[index],
                        name: 'Home Kit 2024',
                        price: prices[index],
                        accentColor: accentColors[index],
                        category: 'Serie A'
                      }} 
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
