'use client';

import { useState, useEffect } from 'react';

import Sidebar from "../components/sideBar";
import Header from "../components/header";
import { Pencil, Trash2, PlusCircle, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        console.log('Fetching products from:', `${apiUrl}/products`);
        
        const response = await fetch(`${apiUrl}/products`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('Products data received:', responseData);

        // Extract the products array from the response data
        const productsData = responseData.data || [];
        console.log('Extracted products:', productsData);
        
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        const list = Array.isArray((data as any)?.data) ? (data as any).data : [];
        setCategories(list);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError('Failed to load categories');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  // Helper function to get the primary image or first image
  const getPrimaryImage = (images: ProductImage[]): string => {
    if (!images || images.length === 0) return '';
    // Prefer primary images, pick the one with the lowest position
    const primaries = images.filter(img => img.isPrimary === true);
    if (primaries.length > 0) {
      const chosen = [...primaries].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
      return (chosen?.url || '').trim();
    }
    // Else pick by position
    const sortedImages = [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    return (sortedImages[0]?.url || '').trim();
  };

  // Helper function to construct full image URL
  const getFullImageUrl = (imagePath: string): string => {
    if (!imagePath) {
      return ''; // Return a default placeholder image URL if you have one
    }

    // If the path is already an absolute URL, return it directly.
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');

    // Normalize path to remove leading slashes or 'public/' prefix.
    let normalizedPath = imagePath.replace(/^\/|\/public\//, '');

    // Construct the full URL.
    const fullUrl = `${baseUrl}/${normalizedPath}`;

    console.log(`[Image Debug] Path: ${imagePath}, Base: ${baseUrl}, Full: ${fullUrl}`);

    return fullUrl;
  };

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header />

        <div className="p-8">
          {/* Top Controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Products</h1>
              {/* categories fetch from database */}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm">
                  All Categories
                </button>
                {categoriesLoading ? (
                  <span className="text-sm text-gray-400 px-2 py-2">Loading categories...</span>
                ) : categoriesError ? (
                  <span className="text-sm text-red-400 px-2 py-2">{categoriesError}</span>
                ) : categories.length === 0 ? (
                  <span className="text-sm text-gray-400 px-2 py-2">No categories</span>
                ) : (
                  categories.map((cat) => (
                    <button key={cat.id} className="px-4 py-2 bg-[#2A2A2A] rounded-lg text-sm hover:bg-[#3A3A3A]">
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <Link href="/admin/products/add">
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                <PlusCircle size={20} />
                Add Product
              </button>
            </Link>
          </div>

          {/* Products Table */}
          <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1A1A1A]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-400">Loading products...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-red-500 mb-4">{error}</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : !Array.isArray(products) || products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-gray-400 mb-4">No products found. Add your first product to get started.</p>
                      <Link href="/admin/products/new">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                          Add Product
                        </button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const primaryImageUrl = getPrimaryImage(product.images);
                    const fullImageUrl = getFullImageUrl(primaryImageUrl);
                    console.log(fullImageUrl);
                    return (
                      <tr key={product.id} className="border-t border-[#3A3A3A] hover:bg-[#3A3A3A] transition">
                        <td className="px-6 py-4">
                          {fullImageUrl ? (
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
                              <img
                                src={fullImageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.error('Error loading image:', fullImageUrl);
                                  target.src = 'https://placehold.co/56/1f2937/ffffff?text=No+Image';
                                  target.onerror = null;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-xs text-gray-500">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{product.name}</p>
                          {product.size && (
                            <p className="text-sm text-gray-400">Size: {product.size}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">${product.price}</td>
                        <td className="px-6 py-4">
                          {(!product.stock || product.stock > 10) ? (
                            <span className="text-green-400">
                              {product.stock || 'N/A'} in stock
                            </span>
                          ) : (
                            <span className="text-yellow-400">
                              Low ({product.stock})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/admin/products/${product.id}/details`)}
                              className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-blue-600/30 transition"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                              className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-blue-600/30 transition"
                              title="Edit Product"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  // Add delete logic here
                                  console.log('Delete product:', product.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-red-600/30 transition"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}