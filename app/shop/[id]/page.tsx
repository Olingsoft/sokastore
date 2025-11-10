'use client';

import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

// --- TYPE DEFINITIONS & MOCK DATA (KEPT AS IS) ---
interface Product {
  id: string;
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

const mockProduct: Product = {
  id: '1',
  name: 'Premium Football Jersey',
  description: 'High-quality football jersey made with breathable fabric for maximum comfort during games. Features moisture-wicking technology to keep you dry.',
  types: ['Home', 'Away', 'Third'],
  sizes: ['S', 'M', 'L', 'XL'],
  price: 89.99,
  image: '/images/Jersey1.jpg',
  gallery: [
    '/images/Jersey1.jpg',
    '/images/Jersey2.webp',
    '/images/ads1.jpg',
  ],
  availableBadges: [
    'Premier League',
    'La Liga',
    'Champions League',
    'Europa League',
    'International',
    'Custom'
  ],
  pricePerCustomization: 15.00,
};

const mockRelatedProducts: Product[] = [
  {
    id: '2',
    name: 'Training Jersey',
    description: 'Lightweight training jersey for optimal performance',
    types: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: 69.99,
    image: '/images/Jersey2.webp',
    availableBadges: [],
  },
  {
    id: '3',
    name: 'Goalkeeper Jersey',
    description: 'Professional goalkeeper jersey with enhanced durability',
    types: ['Home', 'Away'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 94.99,
    image: '/images/ads1.jpg',
    availableBadges: [],
  },
  {
    id: '4',
    name: 'Vintage Retro Jersey',
    description: 'Classic retro design for the ultimate fan',
    types: ['Retro'],
    sizes: ['S', 'M', 'L'],
    price: 79.99,
    image: '/images/Jersey1.jpg',
    availableBadges: [],
  },
];
// --- END MOCK DATA ---

// Helper component for cleaner option selection (Segmented Control)
const OptionPill = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`
            text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200
            ${isSelected 
                ? 'bg-teal-400 text-[#141313] font-bold' // Accent color for selected
                : 'bg-[#2A2A2A] text-gray-300 hover:bg-gray-600' // Dark background for unselected
            }
        `}
    >
        {label}
    </button>
);


const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-xl border border-gray-800 hover:border-teal-400 transition-all duration-300">
    <Link href={`/product/${product.id}`}>
        <div className="relative pb-[100%] bg-gray-800">
            <img 
                src={product.image} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
        </div>
    </Link>
    <div className="p-3">
      <h3 className="font-semibold text-white mb-1 text-base line-clamp-1">{product.name}</h3>
      <div className="flex justify-between items-center pt-2">
        <span className="text-teal-400 font-bold text-lg">${product.price.toFixed(2)}</span>
        <button className="text-xs bg-gray-700 hover:bg-teal-400 hover:text-[#141313] text-white py-1 px-3 rounded-full transition">
          View
        </button>
      </div>
    </div>
  </div>
);

const ProductDetail = ({ product: propProduct }: { product?: Product }) => {
  const product = propProduct || mockProduct;
  const [selectedType, setSelectedType] = useState<string>(product.types?.[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  const [customization, setCustomization] = useState<CustomizationOptions>({
    playerName: '',
    playerNumber: '',
    selectedBadge: '',
  });
  
  const isCustomized = !!(customization.playerName || customization.playerNumber || customization.selectedBadge);
  const customizationFee = isCustomized ? (product.pricePerCustomization || 0) : 0;
  const totalPrice = (product.price + customizationFee) * quantity;

  useEffect(() => {
    setSelectedType(product.types?.[0] || '');
    setSelectedSize(product.sizes?.[0] || '');
    setMainImage(product.image);
  }, [product]);

  const handleAddToCart = () => {
    console.log('Adding to cart:', { product, selectedType, selectedSize, quantity, customization });
    alert('Customized item added to bag!');
  };

  const inputClass = "w-full bg-[#2A2A2A] border border-gray-700 text-white rounded-md py-2 px-3 text-sm focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-all";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1 tracking-wider uppercase";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-[#1E1E1E] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <Link 
              href="/shop" 
              className="inline-flex items-center text-gray-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              <span>Shop All Jerseys</span>
            </Link>
          </div>
        </div>

        <section className="bg-[#141313] text-white py-8 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            
            {/* 1. Product Images - Adjusted max-h */}
            <div className="flex flex-col gap-3 sticky top-4 self-start">
              <img
                src={mainImage}
                alt={product.name || 'Product image'}
                className="rounded-lg shadow-2xl object-cover w-full h-auto **max-h-[400px]** border border-gray-800" // Reduced from max-h-[500px]
              />
              
              {/* Gallery Thumbnails - Slightly smaller */}
              <div className="flex gap-2 overflow-x-auto p-1">
                {product.gallery?.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`w-14 h-14 object-cover rounded-md cursor-pointer transition ring-2 ${ // Reduced from w-16 h-16
                        img === mainImage ? 'ring-teal-400 scale-105' : 'ring-transparent hover:ring-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 2. Product Info & Options */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-4 lg:h-fit">
              
              <div>
                <h1 className="text-3xl font-extrabold mb-1">{product.name}</h1>
                <p className="text-xl font-semibold text-teal-400 mb-3">${product.price.toFixed(2)}</p>
                <p className="text-gray-300 text-sm">{product.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-800">
                <label className={labelClass}>Type</label>
                <div className="flex flex-wrap gap-2">
                    {product.types.map((type: string, idx: number) => (
                        <OptionPill 
                            key={idx} 
                            label={type} 
                            isSelected={selectedType === type}
                            onClick={() => setSelectedType(type)}
                        />
                    ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Size</label>
                <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((size: string, idx: number) => (
                        <OptionPill 
                            key={idx} 
                            label={size} 
                            isSelected={selectedSize === size}
                            onClick={() => setSelectedSize(size)}
                        />
                    ))}
                </div>
              </div>

              <Disclosure as="div" className="border-y border-gray-800 my-2">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between items-center py-3 text-left">
                      <h3 className="text-base font-semibold text-white">
                        Customization ({isCustomized ? 'Applied' : 'Optional'})
                        {isCustomized && (
                            <span className='ml-2 text-teal-400 text-sm'>
                                (+${product.pricePerCustomization?.toFixed(2)})
                            </span>
                        )}
                      </h3>
                      <ChevronDownIcon 
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-400 transition-transform`}
                        aria-hidden="true"
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="pb-4 space-y-3">
                      
                      <div>
                        <label className={labelClass}>Player Name</label>
                        <input
                          type="text"
                          maxLength={15}
                          value={customization.playerName}
                          onChange={(e) => setCustomization({...customization, playerName: e.target.value})}
                          placeholder="Enter name (e.g., FANTASY)"
                          className={inputClass}
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 15 characters</p>
                      </div>
                      
                      <div>
                        <label className={labelClass}>Player Number</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={customization.playerNumber}
                          onChange={(e) => setCustomization({...customization, playerNumber: e.target.value.replace(/[^0-9]/g, '')})}
                          placeholder="Enter number (e.g., 10)"
                          className={inputClass}
                        />
                      </div>
                      
                      <div>
                        <label className={labelClass}>Select Badge</label>
                        <select
                          value={customization.selectedBadge}
                          onChange={(e) => setCustomization({...customization, selectedBadge: e.target.value})}
                          className={inputClass}
                        >
                          <option value="">No badge</option>
                          {product.availableBadges?.map((badge, idx) => (
                            <option key={idx} value={badge}>{badge}</option>
                          ))}
                        </select>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

              <div className="lg:static sticky bottom-0 bg-[#1E1E1E] lg:bg-transparent p-4 lg:p-0 border-t border-gray-700 lg:border-none shadow-2xl lg:shadow-none z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-300 flex items-center">
                      <span className='mr-4'>Quantity:</span>
                      <div className="flex items-center bg-[#2A2A2A] rounded-full border border-gray-700">
                          <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="px-2 py-0.5 text-base hover:text-teal-400 rounded-l-full transition"
                          >-</button>
                          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                          <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="px-2 py-0.5 text-base hover:text-teal-400 rounded-r-full transition"
                          >+</button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                        <span className="text-sm text-gray-400 block">Total Price</span>
                        <div className="text-2xl font-bold text-teal-400">${totalPrice.toFixed(2)}</div>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-teal-400 hover:bg-teal-500 text-[#141313] font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                    <ShoppingBagIcon className='w-5 h-5'/>
                    Add to Bag
                </button>
              </div>

            </div>
          </div>
        </section>
        
        <section className="bg-[#141313] py-10 px-4 sm:px-6 md:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {mockRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;