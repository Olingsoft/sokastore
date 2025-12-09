'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/HeroSection';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Footer from './components/Footer';
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
          <Image
            src={safeImage}
            alt={product.name}
            width={290}
            height={200}
            className="w-full object-cover transition duration-500 group-hover:scale-110"
          />
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

export default function LandingPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const newArrivals = products.slice(0, 4);
  // Group products by category
  const categoriesMap = products.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, ShopProduct[]>);

  const categories = Object.entries(categoriesMap).map(([name, products]) => ({
    name,
    products
  }));

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

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading new arrivals...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newArrivals.length > 0 ? (
                  newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">No new arrivals found.</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Categorized Jersey Rows */}
        <section className="py-12 bg-gray-50 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            {categories.map((category, idx) => (
              category.products.length > 0 && (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <Link href={`/shop?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                      View All <ArrowRight className="ml-1" size={16} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.products.slice(0, 8).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            ))}

            {!isLoading && categories.every(c => c.products.length === 0) && (
              <div className="text-center text-gray-500">No categorized products found.</div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/254769210601"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48a11.85 11.85 0 00-16.76 0 11.84 11.84 0 000 16.75l-1.71 4.19 4.32-1.71a11.84 11.84 0 0016.75-16.75zM12 21.5a9.52 9.52 0 01-5.05-1.38l-.36-.22-3.05 1.21 1.22-3.03-.23-.36A9.52 9.52 0 1121.5 12a9.48 9.48 0 01-9.5 9.5zm5.32-7.53c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.74.91-.91 1.1-.17.19-.34.21-.62.07-.28-.14-1.18-.44-2.25-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.34.42-.51.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16 0-.35-.01-.54-.01s-.49.07-.74.35c-.24.28-.92.9-.92 2.19s.94 2.55 1.07 2.73c.14.19 1.87 2.85 4.54 3.99.63.27 1.12.43 1.5.55.63.19 1.21.16 1.66.1.51-.06 1.66-.68 1.9-1.34.24-.65.24-1.21.17-1.33-.07-.13-.26-.19-.54-.33z" />
        </svg>
      </a>
    </div>
  );
}
