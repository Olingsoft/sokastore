"use client";

import { useEffect, useState } from "react";
import Header from '../components/Header';
import { ArrowRight, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import Footer from '../components/Footer';
import Link from 'next/link';

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
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
  let normalizedPath = imagePath.replace(/^\/|\/public\//, '');
  const fullUrl = `${baseUrl}/${normalizedPath}`;
  return fullUrl;
};

interface ProductCardProps {
  product: ShopProduct;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

// ------------------ SMALLER PRODUCT CARD ------------------
const ProductCard = ({ product, isWishlisted, onToggleWishlist }: ProductCardProps) => {
  const safeImage = product.image || "/images/jersey1.jpg";

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div
        className={`group bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${product.accentColor}`}
      >
        <div className="relative aspect-[2/2] overflow-hidden">
          {safeImage ? (
            <img
              src={safeImage}
              alt={product.name}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/jersey1.jpg";
                target.onerror = null;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}

          <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-bold bg-gray-900 text-white rounded-full uppercase tracking-wider">
            {product.category}
          </span>

          <button
            className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white shadow"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist();
            }}
          >
            <Heart
              size={13}
              className={isWishlisted ? "text-red-500" : "text-gray-500"}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="p-2 text-center">
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
            {product.team}
            <span className="text-[9px] font-medium text-gray-500 block">
              {product.name}
            </span>
          </h3>

          <p className="text-[12px] font-bold text-green-600 mt-1 mb-1">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex items-center justify-center w-full px-2 py-1 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300 text-[9px]">
            View Details <ArrowRight className="ml-1" size={11} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
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

        {/* Filters Section (unchanged) */}
        <section
          className={`bg-[#141313] text-white py-4 px-4 sm:px-6 md:px-12 transition-all duration-300 ${
            showFilters ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {/* You can place your filter controls here */}
        </section>

        {/* Products Grid */}
        <section className="px-4 py-2 sm:px-6 md:px-12 -mt-2">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                  Loading products...
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-8 text-red-500 text-sm">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                  No products available.
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                  />
                ))
              )}
            </div>

            {/* Pagination (unchanged) */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
