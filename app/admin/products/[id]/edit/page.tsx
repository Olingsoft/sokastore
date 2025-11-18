'use client';
import Sidebar from "../../../components/sideBar";
import Header from "../../../components/header";
import { ArrowLeft, Package, DollarSign, Tag, Text, Image as ImageIcon, Zap, Upload, Trash2, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// --- Form Interfaces ---
interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  position: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: ProductImage[];
  stock: number;
  size: string;
  hasCustomization: boolean;
  customizationDetails: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Categories for the dropdown
const categories = [
  { value: 'jerseys', label: 'Jerseys' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'tracksuits', label: 'Tracksuits' },
  { value: 'training', label: 'Training Gear' },
  { value: 'accessories', label: 'Accessories' },
];

// Sizes for the dropdown
const sizes = [
  { value: 'S', label: 'Small' },
  { value: 'M', label: 'Medium' },
  { value: 'L', label: 'Large' },
  { value: 'XL', label: 'Extra Large' },
  { value: 'XXL', label: '2X Large' },
];

// --- Utility Input Component (Reused) ---
const InputField = ({ label, name, icon: Icon, type = 'text', placeholder, value, children, onChange, disabled }: any) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-300 flex items-center gap-2">
      <Icon size={16} className="text-teal-400" />
      {label}
    </label>
    {type === 'select' ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        step={type === 'number' ? "0.01" : undefined}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    )}
  </div>
);

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data.data);
        setFormData(data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (imageId: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img.id !== imageId)
    }));
  };

  const handleSetPrimaryImage = (imageId: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      // Append new images
      newImages.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      // Redirect to product details page on success
      router.push(`/admin/products/${productId}/details`);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete product ${product?.name} (${productId})? This cannot be undone.`)) {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete product');
        }

        // Redirect to products list on success
        router.push('/admin/products');
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-3/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-24 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Products
          </button>
          <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                disabled={isLoading}
              >
                <ArrowLeft size={20} />
                Back to Products
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-black font-medium rounded-lg flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <h1 className="text-3xl font-bold mb-2">Edit Product: {product.name}</h1>
            <p className="text-gray-400 mb-8">Product ID: {productId}</p>

            <div className="bg-[#1A1A1A] rounded-xl p-6 space-y-8">
              {/* Basic Information Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Product Name"
                    name="name"
                    icon={Text}
                    placeholder="e.g., Team Jersey 2025"
                    value={formData.name || ''}
                    onChange={handleChange}
                    type="text"
                    required
                    disabled={isLoading}
                  />

                  <InputField
                    label="Price ($)"
                    name="price"
                    icon={DollarSign}
                    placeholder="0.00"
                    value={formData.price || ''}
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    disabled={isLoading}
                  />

                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Tag size={16} className="text-teal-400" />
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
                      disabled={isLoading}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Stock Quantity"
                    name="stock"
                    icon={Package}
                    placeholder="0"
                    value={formData.stock || ''}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Description</h2>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Product Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={4}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
                      placeholder="Enter a detailed product description..."
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Product Images</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images?.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          image.isPrimary ? 'border-blue-500' : 'border-transparent'
                        }`}>
                          <img
                            src={image.url.startsWith('http') ? image.url : `${apiUrl}${image.url}`}
                            alt={`Product ${image.id}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/300x300/1f2937/ffffff?text=Image+Not+Found';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(image.id)}
                              className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                              title="Set as primary"
                            >
                              <Star className="w-4 h-4" fill={image.isPrimary ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image.id)}
                              className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                              title="Remove image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {image.isPrimary && (
                          <div className="text-xs text-center mt-1 text-blue-400">Primary</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition">
                      <Upload size={16} className="mr-2" />
                      Upload Images
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={isLoading}
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Max file size: 5MB. Allowed formats: .jpg, .jpeg, .png, .webp
                    </p>
                    {newImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          New images to upload ({newImages.length}):
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {newImages.map((file, index) => (
                            <div key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customization Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                  Customization Options
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasCustomization"
                      name="hasCustomization"
                      checked={!!formData.hasCustomization}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500 bg-gray-700"
                      disabled={isLoading}
                    />
                    <label htmlFor="hasCustomization" className="ml-2 text-sm text-gray-300">
                      This product has customization options
                    </label>
                  </div>

                  {formData.hasCustomization && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Customization Instructions
                      </label>
                      <textarea
                        name="customizationDetails"
                        value={formData.customizationDetails || ''}
                        onChange={handleChange}
                        rows={3}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
                        placeholder="Enter customization instructions..."
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={!!formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500 bg-gray-700"
                    disabled={isLoading}
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                    This product is active and visible to customers
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-700/30 hover:bg-red-700/50 text-red-400 py-3 px-6 rounded-xl font-bold transition duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Trash2 size={20} />
                  Delete Product
                </button>
                <button
                  type="submit"
                  className="w-56 bg-teal-500 hover:bg-teal-600 text-black py-3 rounded-xl font-bold text-lg transition duration-200 shadow-lg shadow-teal-500/30 disabled:bg-gray-500 disabled:shadow-none"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}