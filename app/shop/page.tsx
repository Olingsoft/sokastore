"use client";

import { useState } from "react";
import Header from '../components/Header';
import Image from 'next/image';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '../components/Footer';
import Link from 'next/link';

// --- DUMMY DATA ---
const products = [
  { id: 1, name: "New Jersey", team: "Team Jersey 1", price: 19.99, image: "/images/jersey1.jpg", category: "New Jersey", accentColor: "border-green-600" },
  { id: 2, name: "New Jersey", team: "Team Jersey 2", price: 19.99, image: "/images/jersey2.webp", category: "New Jersey", accentColor: "border-green-600" },
  { id: 3, name: "New Jersey", team: "Team Jersey 3", price: 19.99, image: "/images/jersey3.webp", category: "New Jersey", accentColor: "border-green-600" },
  { id: 4, name: "New Jersey", team: "Team Jersey 4", price: 19.99, image: "/images/jersey1.jpg", category: "New Jersey", accentColor: "border-green-600" },
  { id: 5, name: "New Jersey", team: "Team Jersey 5", price: 19.99, image: "/images/jersey2.webp", category: "New Jersey", accentColor: "border-green-600" },
  { id: 6, name: "New Jersey", team: "Team Jersey 6", price: 19.99, image: "/images/jersey3.webp", category: "New Jersey", accentColor: "border-green-600" },
];

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }: { product: any }) => (
  <Link href={`/shop/${product.id}`} className="block">
    <div className={`group bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${product.accentColor}`}>
      <div className="relative aspect-square overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name} 
          width={200} 
          height={200} 
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
        />
        <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-gray-900 text-white rounded-full uppercase tracking-wider">
          {product.category}
        </span>
      </div>
      <div className="p-2 text-center">
        <h3 className="text-sm font-bold text-gray-900 leading-tight">
          {product.team}
          <span className="text-[10px] font-medium text-gray-500 block">{product.name}</span>
        </h3>
        <p className="text-sm font-bold text-green-600 mt-1 mb-1">${product.price.toFixed(2)}</p>
        <div className="flex items-center justify-center w-full px-2 py-1 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300 text-[10px]">
          View Details <ArrowRight className="ml-1" size={12} />
        </div>
      </div>
    </div>
  </Link>
);

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main>
        {/* Filter Button */}
        <div className="px-4 sm:px-6 md:px-12 py-2 flex justify-end">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="bg-gray-900 w-full hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md"
          >
            Filter
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Shop Header / Filters */}
        <section className={`bg-[#141313] text-white py-4 px-4 sm:px-6 md:px-12 transition-all duration-300 ${showFilters ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Filter Products</h2>
                <button className="bg-accentTeal hover:bg-teal-700 text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg shadow-lg flex items-center justify-center gap-1 text-sm z-10 relative">
                  Apply Filters
                </button>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="team-search" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Search Team</label>
                  <input type="text" id="team-search" placeholder="Team..." className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-1.5 pl-8 pr-2 text-xs sm:text-sm focus:ring-2 focus:ring-accentTeal focus:border-accentTeal text-white placeholder-gray-400" />
                </div>

                <div>
                  <label htmlFor="league-filter" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">League</label>
                  <select id="league-filter" className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-1.5 pl-2 pr-8 text-xs sm:text-sm focus:ring-2 focus:ring-accentTeal focus:border-accentTeal text-white">
                    <option value="all">All Leagues</option>
                    <option value="premier-league">Premier League</option>
                    <option value="la-liga">La Liga</option>
                    <option value="mls">MLS</option>
                    <option value="ligue-1">Ligue 1</option>
                    <option value="bundesliga">Bundesliga</option>
                    <option value="serie-a">Serie A</option>
                    <option value="kpl">KPL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Price ($)</label>
                  <div className="flex items-center gap-1">
                    <input type="number" placeholder="Min" className="w-16 pl-2 pr-1 py-1 text-xs sm:text-sm bg-[#2A2A2A] border border-gray-700 rounded-lg focus:ring-accentTeal focus:border-accentTeal text-white placeholder-gray-400" />
                    <span className="text-gray-400 text-xs sm:text-sm">-</span>
                    <input type="number" placeholder="Max" className="w-16 pl-2 pr-1 py-1 text-xs sm:text-sm bg-[#2A2A2A] border border-gray-700 rounded-lg focus:ring-accentTeal focus:border-accentTeal text-white placeholder-gray-400" />
                  </div>
                </div>

                <div className="flex items-end">
                  <button className="w-full bg-accentTeal hover:bg-teal-700 transition-all text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg shadow-lg text-sm">Search</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-4 py-2 sm:px-6 md:px-12 -mt-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
              <h2 className="text-lg sm:text-2xl font-bold">All Jerseys</h2>
              <select className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md bg-white w-full sm:w-auto">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-1 flex-wrap">
              <button className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700">&laquo;</button>
              <button className="px-2 py-1 rounded-md bg-gray-900 text-white font-medium">1</button>
              <button className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700">2</button>
              <button className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700">3</button>
              <button className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700">&raquo;</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
