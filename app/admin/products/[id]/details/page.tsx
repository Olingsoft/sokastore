'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '../../../../admin/components/sideBar';

interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  position: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  size: string;
  stock?: number;
  images: ProductImage[];
  description?: string;
  hasCustomization?: boolean;
  customizationDetails?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const getFullImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      const cleanPath = imagePath.startsWith('/api') ? imagePath.substring(4) : imagePath;
      return `${apiUrl.replace('/api', '')}${cleanPath}`;
    }
    if (imagePath.includes('.')) {
      return `${apiUrl.replace('/api', '')}/uploads/products/${imagePath}`;
    }
    return '';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }

        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, apiUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2A2A2A] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#2A2A2A] rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-[#2A2A2A] rounded w-3/4"></div>
                <div className="h-6 bg-[#2A2A2A] rounded w-1/4"></div>
                <div className="h-6 bg-[#2A2A2A] rounded w-1/2"></div>
                <div className="h-32 bg-[#2A2A2A] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Products
          </button>
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
            <p>{error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const activeImage = primaryImage ? getFullImageUrl(primaryImage.url) : '';

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
            >
              <ArrowLeft size={20} className="mr-2" /> Back to Products
            </button>

            <div className="bg-[#2A2A2A] rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div>
                  <div className="bg-[#1A1A1A] rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x600/1f2937/ffffff?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image Available
                      </div>
                    )}
                  </div>
                  
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {product.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setActiveImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                        >
                          <img
                            src={getFullImageUrl(image.url)}
                            alt={`${product.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold">{product.name}</h1>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                          {product.category}
                        </span>
                        {product.size && (
                          <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                            Size: {product.size}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">${product.price}</div>
                      <div className={`text-sm ${product.stock && product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock && product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-gray-300">
                      {product.description || 'No description available.'}
                    </p>
                  </div>

                  {product.hasCustomization && (
                    <div className="pt-4 border-t border-gray-700">
                      <h2 className="text-lg font-semibold mb-2">Customization</h2>
                      <p className="text-gray-300">
                        {product.customizationDetails || 'Customization options available.'}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div>
                        <div className="font-medium text-gray-300">Product ID</div>
                        <div>{product.id}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-300">Status</div>
                        <div className={`inline-flex items-center ${product.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${product.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      {product.createdAt && (
                        <div>
                          <div className="font-medium text-gray-300">Created</div>
                          <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                        </div>
                      )}
                      {product.updatedAt && (
                        <div>
                          <div className="font-medium text-gray-300">Last Updated</div>
                          <div>{new Date(product.updatedAt).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700 flex space-x-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      <Pencil size={18} /> Edit Product
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          // Add delete logic here
                          console.log('Delete product:', product.id);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg transition"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}