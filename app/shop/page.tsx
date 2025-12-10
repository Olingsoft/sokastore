"use client";

import { useEffect, useState } from "react";
import Header from '../components/Header';
import { ArrowRight, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

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

// ------------------ FIX #1: PRIMARY IMAGE SELECTION ------------------
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

// ------------------ FIX #2: IMPROVED URL NORMALIZATION ------------------
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

interface ProductCardProps {
  product: ShopProduct;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

// ------------------ PRODUCT CARD ------------------
const ProductCard = ({ product, isWishlisted, onToggleWishlist }: ProductCardProps) => {
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

          {/* Category Badge */}
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-teal-400 text-[#141313] rounded-full uppercase tracking-wider">
            {product.category}
          </span>

          {/* Wishlist Button */}
          <button
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist();
            }}
          >
            <Heart
              size={14}
              className={isWishlisted ? "text-red-500" : "text-white"}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-2.5 flex flex-col flex-grow">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 mb-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1 mb-2">{product.team}</p>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-teal-400">${product.price.toFixed(2)}</span>
            <div className="flex items-center text-xs text-gray-400 group-hover:text-teal-400 transition-colors">
              View <ArrowRight className="ml-0.5" size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ShopContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

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
            category: p.category || "Jersey",
            accentColor: "border-green-600",
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching shop products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const toggleWishlist = (productId: number) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    if (!categoryParam) return true;
    const productCat = (product.category || '').toLowerCase().replace(/\s+/g, '-');
    return productCat === categoryParam;
  });

  // Get category display name
  const getCategoryDisplayName = () => {
    if (!categoryParam) return null;
    return categoryParam.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <Header />

      <main>
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 py-16 px-4 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              {categoryParam ? getCategoryDisplayName() : 'All Products'}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {categoryParam
                ? `Explore our collection of ${getCategoryDisplayName()} jerseys`
                : 'Discover premium jerseys from your favorite teams and leagues'
              }
            </p>
          </div>
        </section>

        {/* Breadcrumb & Filter Section */}
        <section className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                <Link href="/" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Home
                </Link>
                <span className="text-gray-600">/</span>
                <Link href="/shop" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Shop
                </Link>
                {categoryParam && (
                  <>
                    <span className="text-gray-600">/</span>
                    <span className="text-teal-400 font-semibold">{getCategoryDisplayName()}</span>
                  </>
                )}
              </nav>

              {/* Product Count & Filter Button */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  <span className="font-semibold text-teal-400">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-700 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-teal-500/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Panel */}
        <section
          className={`bg-gray-800 border-b border-gray-700 transition-all duration-300 overflow-hidden ${showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filter options can be added here */}
              <div className="space-y-2">
                <h3 className="font-semibold text-teal-400 text-sm uppercase tracking-wider">Price Range</h3>
                <div className="text-gray-400 text-sm">Coming soon...</div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-teal-400 text-sm uppercase tracking-wider">Size</h3>
                <div className="text-gray-400 text-sm">Coming soon...</div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-teal-400 text-sm uppercase tracking-wider">League</h3>
                <div className="text-gray-400 text-sm">Coming soon...</div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-4 py-8 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {categoryParam && (
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {getCategoryDisplayName()} Collection
                </h2>
                <Link
                  href="/shop"
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
                >
                  View All Products
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </>
              ) : error ? (
                <div className="col-span-full text-center py-16">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Products Found</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {categoryParam
                        ? `We couldn't find any products in "${getCategoryDisplayName()}"`
                        : "No products available at the moment"
                      }
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
