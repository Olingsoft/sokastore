"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ArrowLeftIcon, ShoppingBagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

interface ProductImage {
  id?: number;
  url: string;
  isPrimary?: boolean;
  position?: number;
}

interface Product {
  id: string | number;
  name: string;
  description: string;
  types: string[];
  sizes: string[];
  price: number;
  image: string;
  gallery?: string[];
  availableBadges?: string[];
  pricePerCustomization?: number;
}

interface CustomizationOptions {
  playerName: string;
  playerNumber: string;
  selectedBadge: string;
}

// Helper function to get primary image
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

// Helper function to construct full image URL
const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    return '';
  }

  // If the path is already an absolute URL, return it directly.
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');

  // Normalize path to remove ONLY a leading slash or the "public/" prefix
  let normalizedPath = imagePath.replace(/^public\//, '').replace(/^\//, '');

  const fullUrl = `${baseUrl}/${normalizedPath}`;

  return fullUrl;
};

const OptionPill = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200 ${isSelected ? 'bg-teal-400 text-[#141313] font-bold' : 'bg-[#2A2A2A] text-gray-300 hover:bg-gray-600'}`}
  >
    {label}
  </button>
);

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-xl border border-gray-800 hover:border-teal-400 transition-all duration-300">
    <Link href={`/product/${product.id}`}>
      <div className="relative pb-[100%] bg-gray-800">
        <img
          src={product.image || '/images/jersey1.jpg'}
          alt={product.name}
          className="absolute text-white inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/jersey1.jpg';
            target.onerror = null;
          }}
        />
      </div>
    </Link>
    <div className="p-3">
      <h3 className="font-semibold text-white mb-1 text-base line-clamp-1">{product.name}</h3>
      <div className="flex justify-between items-center pt-2">
        <span className="text-teal-400 font-bold text-lg">${product.price.toFixed(2)}</span>
        <button className="text-xs bg-gray-700 hover:bg-teal-400 hover:text-[#141313] text-white py-1 px-3 rounded-full transition">View</button>
      </div>
    </div>
  </div>
);

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedType, setSelectedType] = useState('Default');
  const [mainImage, setMainImage] = useState<string>('');
  const [customization, setCustomization] = useState<CustomizationOptions>({
    playerName: '',
    playerNumber: '',
    selectedBadge: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for modal

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      console.log('[ShopPage] Fetching product with ID:', id);
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/products/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
        const json = await res.json();
        console.log('[ShopPage] Product fetch response:', json);
        // The API may return { data: product } or the product directly - handle both
        const p = (json?.data) ? json.data : json;

        // Map backend response to our Product type
        const images: ProductImage[] = Array.isArray(p.images) ? p.images : [];
        const primary = getPrimaryImage(images);
        const gallery = images.map(img => getFullImageUrl(img.url || (img as any)));

        const mapped: Product = {
          id: p.id,
          name: p.name || 'Product',
          description: p.description || '',
          types: Array.isArray(p.types) && p.types.length ? p.types : ['Default'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          price: Number(p.price) || 0,
          image: getFullImageUrl(primary) || '/images/jersey1.jpg',
          gallery: gallery.length ? gallery : [getFullImageUrl(primary) || '/images/jersey1.jpg'],
          availableBadges: Array.isArray(p.availableBadges) ? p.availableBadges : [],
          pricePerCustomization: Number(p.pricePerCustomization) || 0,
        };

        setProduct(mapped);

        // initialize UI selections based on product
        setSelectedType(mapped.types[0]);
        setSelectedSize(mapped.sizes[0]);
        setMainImage(mapped.image);

      } catch (err) {
        console.error('[ShopPage] Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, apiUrl]);

  useEffect(() => {
    if (!id) return;

    const fetchRelated = async () => {
      console.log('[ShopPage] Fetching related products for ID:', id);
      setRelatedLoading(true);
      try {
        const res = await fetch(`${apiUrl}/products/related/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch related products: ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);

        const mapped = list.map((p: any) => {
          const images: ProductImage[] = Array.isArray(p.images) ? p.images : [];
          const primary = getPrimaryImage(images);
          const gallery = images.map(img => getFullImageUrl(img.url || (img as any)));
          return {
            id: p.id,
            name: p.name || 'Product',
            description: p.description || '',
            types: Array.isArray(p.types) ? p.types : ['Default'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            price: Number(p.price) || 0,
            image: getFullImageUrl(primary) || '/images/jersey1.jpg',
            gallery: gallery.length ? gallery : [getFullImageUrl(primary) || '/images/jersey1.jpg'],
            availableBadges: Array.isArray(p.availableBadges) ? p.availableBadges : [],
            pricePerCustomization: Number(p.pricePerCustomization) || 0,
          } as Product;
        });

        setRelatedProducts(mapped);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [id, apiUrl]);

  // Keep derived UI values in sync when product state changes
  useEffect(() => {
    if (!product) return;
    setSelectedType(product.types[0]);
    setSelectedSize(product.sizes[0]);
    setMainImage(product.image);
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141313]">
        <div className="text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#141313]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <div className="text-center text-red-500">{error || 'Product not found.'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const isCustomized = !!(customization.playerName || customization.playerNumber || customization.selectedBadge);
  const customizationFee = isCustomized ? (product.pricePerCustomization || 0) : 0;
  const totalPrice = (product.price + customizationFee) * quantity;

  const inputClass = "w-full bg-[#2A2A2A] border border-gray-700 text-white rounded-md py-2 px-3 text-sm focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-all";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1 tracking-wider uppercase";

  return (
    <div className="min-h-screen flex flex-col bg-[#141313]">
      <Header />
      <main className="flex-grow">
        <div className="bg-[#1E1E1E] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <Link href="/shop" className="inline-flex items-center text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-1" /> Shop All Jerseys
            </Link>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 grid lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="flex flex-col gap-3 lg:sticky lg:top-20 self-start z-10">
            <img
              src={mainImage || '/images/jersey1.jpg'}
              alt={product.name}
              className="rounded-lg shadow-2xl object-cover w-full h-auto max-h-[500px] border border-gray-800"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/jersey1.jpg';
                target.onerror = null;
              }}
            />
            <div className="flex gap-2 overflow-x-auto p-1">
              {product.gallery?.map((img, idx) => (
                <img
                  key={idx}
                  src={img || '/images/jersey1.jpg'}
                  alt={`${product.name}-${idx}`}
                  onClick={() => setMainImage(img || '/images/jersey1.jpg')}
                  className={`w-14 h-14 object-cover rounded-md cursor-pointer transition ring-2 ${img === mainImage ? 'ring-teal-400 scale-105' : 'ring-transparent hover:ring-gray-600'}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/jersey1.jpg';
                    target.onerror = null;
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl text-white font-extrabold mb-1">{product.name}</h1>
              <p className="text-xl font-semibold text-teal-400 mb-3">${product.price.toFixed(2)}</p>
              <p className="text-gray-300 text-sm">{product.description}</p>
            </div>

            {/* Type */}
            <div className="pt-3 border-t border-gray-800">
              <label className={labelClass}>Type</label>
              <div className="flex flex-wrap gap-2">
                {product.types.map((type, idx) => (
                  <OptionPill key={idx} label={type} isSelected={selectedType === type} onClick={() => setSelectedType(type)} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className={labelClass}>Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => (
                  <OptionPill key={idx} label={size} isSelected={selectedSize === size} onClick={() => setSelectedSize(size)} />
                ))}
              </div>
            </div>

            {/* Customization */}
            <Disclosure as="div" className="border-y border-gray-800 my-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between items-center py-3 text-left">
                    <h3 className="text-base font-semibold text-white">
                      Customization ({isCustomized ? 'Applied' : 'Optional'})
                      {isCustomized && <span className='ml-2 text-teal-400 text-sm'>+${product.pricePerCustomization?.toFixed(2)}</span>}
                    </h3>
                    <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-400 transition-transform`} aria-hidden="true" />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pb-4 space-y-3">
                    <div>
                      <label className={labelClass}>Player Name</label>
                      <input type="text" maxLength={15} value={customization.playerName} onChange={(e) => setCustomization({ ...customization, playerName: e.target.value })} placeholder="Enter name (e.g., FANTASY)" className={inputClass} />
                      <p className="text-xs text-gray-500 mt-1">Max 15 characters</p>
                    </div>
                    <div>
                      <label className={labelClass}>Player Number</label>
                      <input type="text" maxLength={2} value={customization.playerNumber} onChange={(e) => setCustomization({ ...customization, playerNumber: e.target.value.replace(/[^0-9]/g, '') })} placeholder="Enter number (e.g., 10)" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Select Badge</label>
                      <select value={customization.selectedBadge} onChange={(e) => setCustomization({ ...customization, selectedBadge: e.target.value })} className={inputClass}>
                        <option value="">No badge</option>
                        {product.availableBadges?.map((badge, idx) => (<option key={idx} value={badge}>{badge}</option>))}
                      </select>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            {/* Add to Bag & Quantity */}
            <div className="sticky bottom-0 bg-[#1E1E1E] lg:bg-transparent p-4 lg:p-0 border-t border-gray-700 lg:border-none shadow-2xl lg:shadow-none z-20">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-300 flex items-center">
                  <span className='mr-4'>Quantity:</span>
                  <div className="flex items-center bg-[#2A2A2A] rounded-full border border-gray-700">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-0.5 text-base hover:text-teal-400 rounded-l-full transition">-</button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-0.5 text-base hover:text-teal-400 rounded-r-full transition">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400 block">Total Price</span>
                  <div className="text-2xl font-bold text-teal-400">${totalPrice.toFixed(2)}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
                  if (!isLoggedIn) {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    }
                    window.location.href = '/login';
                    return;
                  }

                  console.log('[ShopPage] Adding to cart:', {
                    productId: product.id,
                    quantity,
                    size: selectedSize,
                    type: selectedType,
                    customization: isCustomized ? customization : undefined
                  });

                  addToCart(product, quantity, {
                    size: selectedSize,
                    type: selectedType,
                    customization: isCustomized ? customization : undefined,
                    customizationFee: isCustomized ? customizationFee : 0
                  });

                  // Show success modal
                  setShowSuccessModal(true);
                }}
                className="w-full font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider bg-teal-400 hover:bg-teal-500 text-[#141313]"
              >
                <ShoppingBagIcon className='w-5 h-5' /> Add to Bag
              </button>
            </div>
          </div>
        </section>

        <section className="bg-[#141313] py-10 px-4 sm:px-6 md:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedLoading ? (
                <div className="col-span-full text-gray-400">Loading suggestions...</div>
              ) : relatedProducts.length === 0 ? (
                <div className="col-span-full text-gray-400">No related products found.</div>
              ) : (
                relatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-teal-400 rounded-full p-3">
                <CheckCircleIcon className="w-8 h-8 text-[#141313]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Added to Cart!
            </h3>
            <p className="text-gray-400 text-center mb-6">
              {product.name} has been added to your cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cart"
                className="flex-1 bg-teal-400 hover:bg-teal-500 text-[#141313] font-bold py-3 rounded-lg text-center transition"
              >
                Go to Cart
              </Link>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
