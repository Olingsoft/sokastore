'use client';

import Header from './components/Header';
import Hero from './components/HeroSection';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Footer from './components/Footer';
import Link from 'next/link';

// --- DUMMY DATA ---
const products = [
  { id: 1, name: "New Jersey", price: 19.99, image: "/images/jersey1.jpg", category: "New Jersey", accentColor: "border-green-600" },
  { id: 2, name: "New Jersey", price: 19.99, image: "/images/jersey2.webp", category: "New Jersey", accentColor: "border-green-600" },
  { id: 3, name: "New Jersey", price: 19.99, image: "/images/jersey3.webp", category: "New Jersey", accentColor: "border-green-600" },
  { id: 4, name: "New Jersey", price: 19.99, image: "/images/jersey4.webp", category: "New Jersey", accentColor: "border-green-600" },
];

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }: { product: any }) => (
  <Link href={`/shop/${product.id}`} className="block">
    <div
      className={`group bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${product.accentColor} relative h-full`}
    >
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

      <div className="p-3 text-center">
        <h3 className="text-base font-bold text-gray-900 leading-tight">
          {product.team}
          <span className="text-xs font-medium text-gray-500 block">{product.name}</span>
        </h3>
        <p className="text-lg font-bold text-green-600 mb-2 mt-1">${product.price.toFixed(2)}</p>
        <div className="flex items-center justify-center w-full px-3 py-1.5 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300 text-xs">
          View Details <ArrowRight className="ml-1" size={14} />
        </div>
      </div>
    </div>
  </Link>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      <Header />
      <main>
        <Hero />

        {/* New Jersey Section */}
        <section className="bg-[#0a0f0a] text-white py-16 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-green-400 uppercase tracking-wide">
                New Jerseys
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Explore the latest arrivals from your favorite leagues — fresh, authentic, and ready to wear.
              </p>
            </div>
            {/* Product cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Categorized Jersey Rows */}
        <section className="py-12 bg-gray-50 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            {[
              { league: "Premier League", teams: ["Man Utd", "Liverpool", "Chelsea", "Arsenal"], colors: ["border-red-600","border-red-700","border-blue-600","border-red-400"], prices: [89.99, 92.99, 95.99, 87.99] },
              { league: "La Liga", teams: ["Barcelona","Real Madrid","Atletico Madrid","Sevilla"], colors: ["border-blue-600","border-white","border-red-600","border-yellow-400"], prices: [95.99, 89.99, 92.99, 85.99] },
              { league: "Serie A", teams: ["AC Milan","Inter Milan","Juventus","Napoli"], colors: ["border-red-800","border-blue-800","border-black","border-blue-400"], prices: [85.99,87.99,89.99,83.99] }
            ].map((row, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{row.league}</h2>
                  <Link href={`/shop?league=${row.league.toLowerCase().replace(' ','-')}`} className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                    View All <ArrowRight className="ml-1" size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {row.teams.map((team, i) => (
                    <ProductCard key={`${row.league}-${i}`} product={{
                      ...products[i % products.length],
                      team,
                      name: 'Home Kit 2024',
                      price: row.prices[i],
                      accentColor: row.colors[i],
                      category: row.league
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/254769210601" // Replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48a11.85 11.85 0 00-16.76 0 11.84 11.84 0 000 16.75l-1.71 4.19 4.32-1.71a11.84 11.84 0 0016.75-16.75zM12 21.5a9.52 9.52 0 01-5.05-1.38l-.36-.22-3.05 1.21 1.22-3.03-.23-.36A9.52 9.52 0 1121.5 12a9.48 9.48 0 01-9.5 9.5zm5.32-7.53c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.74.91-.91 1.1-.17.19-.34.21-.62.07-.28-.14-1.18-.44-2.25-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.34.42-.51.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16 0-.35-.01-.54-.01s-.49.07-.74.35c-.24.28-.92.9-.92 2.19s.94 2.55 1.07 2.73c.14.19 1.87 2.85 4.54 3.99.63.27 1.12.43 1.5.55.63.19 1.21.16 1.66.1.51-.06 1.66-.68 1.9-1.34.24-.65.24-1.21.17-1.33-.07-.13-.26-.19-.54-.33z"/>
        </svg>
      </a>
    </div>
  );
}
