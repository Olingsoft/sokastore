"use client";

import Header from '../components/Header';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

// --- DUMMY DATA ---
const products = [
  {
    id: 1,
    name: "New Jersey",
    team: "Team Jersey 1",
    price: 19.99,
    image: "/images/jersey1.jpg",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 2,
    name: "New Jersey",
    team: "Team Jersey 2",
    price: 19.99,
    image: "/images/jersey2.webp",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 3,
    name: "New Jersey",
    team: "Team Jersey 3",
    price: 19.99,
    image: "/images/jersey3.webp",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 4,
    name: "New Jersey",
    team: "Team Jersey 4",
    price: 19.99,
    image: "/images/jersey1.jpg",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 5,
    name: "New Jersey",
    team: "Team Jersey 5",
    price: 19.99,
    image: "/images/jersey2.webp",
    category: "New Jersey",
    accentColor: "border-green-600",
  },
  {
    id: 6,
    name: "New Jersey",
    team: "Team Jersey 6",
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

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main>
       {/* Shop Header */}
        <section className="bg-[#141313] text-white py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8 flex flex-col gap-8 md:gap-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Filter Products
                </h2>
                <button className="bg-accentTeal hover:bg-teal-700 transition-all text-white font-semibold py-2 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 7v5l-4 2v-7L3 6V4z" />
                  </svg>
                  Apply Filters
                </button>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Search */}
                <div>
                  <label
                    htmlFor="team-search"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Search Team
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="team-search"
                      placeholder="Enter team name..."
                      className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-accentTeal focus:border-accentTeal text-white placeholder-gray-400"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* League Filter */}
                <div>
                  <label
                    htmlFor="league-filter"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    League
                  </label>
                  <div className="relative">
                    <select
                      id="league-filter"
                      className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:ring-2 focus:ring-accentTeal focus:border-accentTeal text-white"
                    >
                      <option value="all">All Leagues</option>
                      <option value="premier-league">Premier League</option>
                      <option value="la-liga">La Liga</option>
                      <option value="mls">MLS</option>
                      <option value="ligue-1">Ligue 1</option>
                      <option value="bundesliga">Bundesliga</option>
                      <option value="serie-a">Serie A</option>
                      <option value="kpl">KPL</option>
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range ($)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-24 pl-3 pr-2 py-2 text-sm bg-[#2A2A2A] border border-gray-700 rounded-lg focus:ring-accentTeal focus:border-accentTeal text-white placeholder-gray-400"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-24 pl-3 pr-2 py-2 text-sm bg-[#2A2A2A] border border-gray-700 rounded-lg focus:ring-accentTeal focus:border-accentTeal text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Action */}
                <div className="flex md:items-end">
                  <button className="w-full bg-accentTeal hover:bg-teal-700 transition-all text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Products Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Filter/Sort Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold">All Jerseys</h2>
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-md bg-white">
                  <option>Sort by</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-1">
                <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700">
                  &laquo;
                </button>
                <button className="px-3 py-1 rounded-md bg-gray-900 text-white font-medium">
                  1
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700">
                  2
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700">
                  3
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700">
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}