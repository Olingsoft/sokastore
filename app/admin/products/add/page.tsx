'use client';
import { ArrowLeft, Package, DollarSign, Tag, Text, Image as ImageIcon, Zap, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/app/admin/components/sideBar";

// --- Form Interfaces ---
interface ProductFormData {
  name: string;
  price: number | string;
  category: string;
  size: string | null;
  description: string;
  imageFiles: File[];
  hasCustomization: boolean;
  customizationDetails: string;
}

// InputField Props Interface
interface InputFieldProps {
  label: string;
  name: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  type?: 'text' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  children?: React.ReactNode;
  step?: string;
}

// Moved InputField component outside to prevent re-creation on every render
const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  icon: Icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  children,
  step
}) => (
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
        className="p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150"
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
        className="p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150"
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        step={step || (type === 'number' ? "0.01" : undefined)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150"
      />
    )}
  </div>
);

export default function AddProductPage() {
  const router = useRouter();
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const [categoriesDb, setCategoriesDb] = useState<{ id: string | number; name: string; slug: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    category: '',
    size: null,
    description: '',
    imageFiles: [],
    hasCustomization: false,
    customizationDetails: '',
  });
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        const list = Array.isArray((data as any)?.data) ? (data as any).data : [];
        setCategoriesDb(list);
        // Initialize selected category to first item if empty
        if (list.length > 0) {
          setFormData(prev => ({ ...prev, category: prev.category || list[0].name }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError('Failed to load categories');
        setCategoriesDb([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
      
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...newFiles].slice(0, 5) // Limit to 5 files
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    
    // Format category by matching fetched category names
    const formatCategory = (category: string): string => {
      const found = categoriesDb.find(
        cat => cat.name.toUpperCase() === (category || '').toUpperCase()
      )?.name;
      if (!found) {
        console.warn(`Invalid category: ${category}. Defaulting to first available category.`);
        return categoriesDb[0]?.name || '';
      }
      return found;
    };

    // Add text fields to FormData
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price.toString());
    formDataToSend.append('category', formatCategory(formData.category));
    formDataToSend.append('size', formData.size || '');
    formDataToSend.append('description', formData.description);
    formDataToSend.append('hasCustomization', formData.hasCustomization.toString());
    formDataToSend.append('customizationDetails', formData.customizationDetails);
    
    // Add image files to FormData
    formData.imageFiles.forEach(file => {
      formDataToSend.append('images', file);
    });
    
    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend,
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Server returned invalid JSON response');
      }
      
      if (!response.ok) {
        console.error('Server error response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
      }
      
      // Set success message and show modal
      setSuccessMessage(`${formData.name} has been added to your store.`);
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        category: categoriesDb[0]?.name || '',
        size: null,
        description: '',
        imageFiles: [],
        hasCustomization: false,
        customizationDetails: '',
      });
      
      // Show success toast
      toast.success('Product created successfully!');
      
    } catch (error: unknown) {
      console.error('Error adding product:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#141313]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto ml-64">
        <section className="p-8">
          <button
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </button>

          <h1 className="text-4xl font-extrabold text-white mb-6 flex items-center gap-3">
            <Package size={30} className="text-teal-400" />
            Add New Product
          </h1>
          <p className="text-gray-400 mb-8">Fill out the details below to list a new item on your store.</p>

          <form onSubmit={handleSubmit} className="bg-[#1E1E1E] w-full rounded-xl p-8 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6 text-gray-300">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InputField
                label="Product Name"
                name="name"
                icon={Text}
                placeholder="e.g., Team Jersey 2025"
                value={formData.name}
                onChange={handleChange}
                type="text"
              />

              <InputField
                label="Category"
                name="category"
                icon={Tag}
                value={formData.category}
                onChange={handleChange}
                type="select"
              >
                {categoriesLoading && (
                  <option value="" className="bg-[#2A2A2A]">Loading categories...</option>
                )}
                {!categoriesLoading && categoriesError && (
                  <option value="" className="bg-[#2A2A2A]">Failed to load categories</option>
                )}
                {!categoriesLoading && !categoriesError && categoriesDb.length === 0 && (
                  <option value="" className="bg-[#2A2A2A]">No categories available</option>
                )}
                {!categoriesLoading && !categoriesError && categoriesDb.map(cat => (
                  <option key={cat.id} value={cat.name} className="bg-[#2A2A2A]">
                    {cat.name}
                  </option>
                ))}
              </InputField>
              
              <InputField
                label="Price ($)"
                name="price"
                icon={DollarSign}
                placeholder="e.g., 59.99"
                value={formData.price}
                onChange={handleChange}
                type="number"
                step="0.01"
              />

              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-4 h-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
                      <path d="M4 20h16"/>
                      <path d="M4 4h16"/>
                      <path d="M12 4v16"/>
                    </svg>
                  </span>
                  Size
                </label>
                <select
                  name="size"
                  value={formData.size || ''}
                  onChange={handleChange}
                  className="p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150 w-full"
                >
                  <option value="">Select a size</option>
                  {sizes.map(size => (
                    <option key={size} value={size} className="bg-[#2A2A2A]">
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <InputField
                label="Description"
                name="description"
                icon={Text}
                placeholder="A brief but compelling description of the product..."
                value={formData.description}
                onChange={handleChange}
                type="textarea"
              />
            </div>

            <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6 text-gray-300">Media & Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                  <ImageIcon size={16} className="text-teal-400" />
                  Product Images (Max 5)
                </label>
                <div className="space-y-4">
                  <div className="p-6 bg-[#2A2A2A] border border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-teal-500 transition duration-150">
                    <input
                      type="file"
                      id="imageFiles"
                      name="imageFiles"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      disabled={formData.imageFiles.length >= 5}
                    />
                    <label 
                      htmlFor="imageFiles" 
                      className={`block cursor-pointer ${formData.imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">
                        {formData.imageFiles.length > 0 
                          ? `Add more images (${formData.imageFiles.length}/5)`
                          : 'Drag & drop or click to upload images'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, up to 5MB each (Max 5 images)</p>
                    </label>
                  </div>
                  
                  {formData.imageFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {formData.imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {file.name.length > 15 
                              ? `${file.name.substring(0, 12)}...${file.name.split('.').pop()}` 
                              : file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-teal-400" />
                    Customization
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg">
                    <input
                      id="hasCustomization"
                      name="hasCustomization"
                      type="checkbox"
                      checked={formData.hasCustomization}
                      onChange={handleChange}
                      className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-500 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="hasCustomization" className="text-white text-base">
                      Allow customer customization (e.g., Name/Number printing)
                    </label>
                  </div>
                </div>

                {formData.hasCustomization && (
                  <InputField
                    label="Customization Details/Instructions"
                    name="customizationDetails"
                    icon={Text}
                    placeholder="Max characters, placement info, extra cost..."
                    value={formData.customizationDetails}
                    onChange={handleChange}
                    type="textarea"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-black py-3 rounded-xl font-bold text-lg transition duration-200 shadow-lg shadow-teal-500/30 disabled:bg-gray-500 disabled:shadow-none"
              disabled={isLoading || !formData.name || !formData.price || !formData.description}
            >
              {isLoading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}