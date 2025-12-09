"use client";

import { useEffect, useState } from "react";
import Header from '../components/Header';
import { ArrowRight, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
  return `${baseUrl}/${normalizedPath}`;
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

        {/* Filters Section */}
        <section
          className={`bg-[#141313] text-white py-4 px-4 sm:px-6 md:px-12 transition-all duration-300 ${showFilters ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          {/* Place your filter controls here */}
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
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                  No products available.
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
