'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/HeroSection';
import { ArrowRight } from 'lucide-react';
import Footer from './components/Footer';
import { ProductCardSkeleton } from './components/SkeletonLoader';
import Link from 'next/link';

// --- INTERFACES ---
interface ShopProduct {
  id: number;
  name: string;
  team: string;
  price: number;
  image: string;
  category: string;
  accentColor: string;
}

interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  position: number;
}

// --- HELPER FUNCTIONS ---
const getPrimaryImage = (images: ProductImage[] = []): string => {
  if (!images || images.length === 0) return '';

  const primaries = images.filter(img => img.isPrimary);
  if (primaries.length > 0) {
    const chosen = [...primaries].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
    return (chosen?.url || '').trim();
  }

  const sortedImages = [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  return (sortedImages[0]?.url || '').trim();
};

const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Get base URL and remove /api suffix if present
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');

  // Normalize the path: remove leading slash and /public/ prefix
  let normalizedPath = imagePath.trim();
  normalizedPath = normalizedPath.replace(/^\/+/, ''); // Remove leading slashes
  normalizedPath = normalizedPath.replace(/^public\//, ''); // Remove /public/ prefix

  // Construct full URL
  const fullUrl = `${baseUrl}/${normalizedPath}`;

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Image URL construction:', { imagePath, baseUrl, normalizedPath, fullUrl });
  }

  return fullUrl;
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }: { product: ShopProduct }) => {
  const safeImage = product.image || "/images/jersey1.jpg";

  return (
    <Link href={`/shop/${product.id}`} className="block group h-[250px] w-full">
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-400/20 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#2A2A2A]">
          {safeImage ? (
            <img
              src={safeImage}
              alt={product.name}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/jersey1.jpg";
                target.onerror = null;
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-teal-400 text-[#141313] rounded-full uppercase tracking-wider">
            {product.category}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-2.5 flex flex-col flex-grow">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 mb-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1 mb-2">{product.team}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-teal-400">Ksh. {product.price.toFixed(2)}</span>
            <div className="flex items-center text-xs text-gray-400 group-hover:text-teal-400 transition-colors">
              View <ArrowRight className="ml-0.5" size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function LandingPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/products`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);

        const data = await response.json();
        const productsData = Array.isArray((data as any)?.data) ? (data as any).data : [];

        const mapped: ShopProduct[] = productsData.map((p: any) => {
          const primary = getPrimaryImage(p.images || []);
          const full = getFullImageUrl(primary);

          return {
            id: p.id,
            name: p.name || "Jersey",
            team: p.name || "Jersey",
            price: Number(p.price) || 0,
            image: full || "/images/jersey1.jpg",
            category: p.category || "Uncategorized", // Fallback for reliable categorization
            accentColor: "border-green-600",
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  // Extract unique categories from products
  const categoriesList = ['All', ...Array.from(new Set(products.map(p => p.category))).sort()];

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.slice(0, 8); // Just grab first 8 as featured/new

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans relative selection:bg-green-500/30">
      <Header />
      <main>
        <Hero />

        {/* Search & Filter Section (Compact & Modern) */}
        <section className="sticky top-0 z-30 bg-[#0a0f0a]/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 md:px-12 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search jerseys, teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide mask-linear-fade">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 border-transparent text-white shadow-lg shadow-green-900/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Content Section */}
        <section className="py-8 px-4 sm:px-6 md:px-12 min-h-[600px]">
          <div className="max-w-7xl mx-auto">

            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {searchTerm || selectedCategory !== 'All' ? 'Search Results' : 'Trendy Collections'}
              </h2>
              <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                {filteredProducts.length} Items
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-red-900/10 rounded-2xl border border-red-900/20">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-900/20 rounded-full text-xs hover:bg-red-900/40 transition">Retry</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>No matches found for "{searchTerm}"</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 text-green-400 text-sm hover:underline">Clear filters</button>
              </div>
            ) : (
              // Compact Grid: 5 columns on large screens, smaller gaps
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />

      {/* Floating WhatsApp Icon - Smaller & cleaner */}
      <a
        href="https://wa.me/254769210601"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg shadow-green-500/20 flex items-center justify-center z-50 transition-all hover:scale-110 hover:-translate-y-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48a11.85 11.85 0 00-16.76 0 11.84 11.84 0 000 16.75l-1.71 4.19 4.32-1.71a11.84 11.84 0 0016.75-16.75zM12 21.5a9.52 9.52 0 01-5.05-1.38l-.36-.22-3.05 1.21 1.22-3.03-.23-.36A9.52 9.52 0 1121.5 12a9.48 9.48 0 01-9.5 9.5zm5.32-7.53c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.74.91-.91 1.1-.17.19-.34.21-.62.07-.28-.14-1.18-.44-2.25-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.34.42-.51.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16 0-.35-.01-.54-.01s-.49.07-.74.35c-.24.28-.92.9-.92 2.19s.94 2.55 1.07 2.73c.14.19 1.87 2.85 4.54 3.99.63.27 1.12.43 1.5.55.63.19 1.21.16 1.66.1.51-.06 1.66-.68 1.9-1.34.24-.65.24-1.21.17-1.33-.07-.13-.26-.19-.54-.33z" />
        </svg>
      </a>
    </div>
  );
}
