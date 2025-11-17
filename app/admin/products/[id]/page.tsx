'use client';
import Sidebar from "../../components/sideBar";
import Header from "../../components/header";
import { ArrowLeft, Package, DollarSign, Tag, Text, Image as ImageIcon, Zap, Upload, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// --- Form Interfaces ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string; // Existing image URL
  hasCustomization: boolean;
  customizationDetails: string;
}

// Mock Product Data (Simulates fetching from API)
const mockProduct: Product = {
    id: 'prod_123',
    name: "Red Signature Hoodie",
    price: 65.00,
    category: 'apparel',
    description: "Our limited edition signature hoodie, made from organic cotton and featuring an athletic fit. Perfect for layering.",
    imageUrl: "/products/hoodie.jpg", 
    hasCustomization: true,
    customizationDetails: "Max 10 characters for name, two numbers. Print on the back.",
};

// Mock Categories for the dropdown
const categories = [
    { value: 'apparel', label: 'Apparel' },
    { value: 'footwear', label: 'Footwear' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'equipment', label: 'Equipment' },
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
    // In a real app, you would use this ID to fetch the specific product
    const productId = params.id as string || mockProduct.id; 

    const [product, setProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Product | Partial<Product>>({});
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Fetch data on load
    useEffect(() => {
        setIsLoading(true);
        // Simulate API fetch delay
        setTimeout(() => {
            // Check if product ID matches the mock (or handle 404)
            if (productId) {
                setProduct(mockProduct);
                setFormData(mockProduct);
            } else {
                 setProduct(null); // Handle case where product isn't found
            }
            setIsLoading(false);
        }, 500);
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            } as Product));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            } as Product));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        console.log(`Submitting changes for Product ${productId}:`, formData);
        if (newImageFile) {
            console.log("New image file pending upload:", newImageFile.name);
        }

        setTimeout(() => {
            setIsLoading(false);
            alert(`Product ${productId} updated successfully! (Simulated)`);
            // router.push('/admin/products'); 
        }, 1500);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete product ${product?.name} (${productId})? This cannot be undone.`)) {
            setIsLoading(true);
            console.log(`Deleting Product ${productId}`);
            setTimeout(() => {
                setIsLoading(false);
                alert(`Product ${productId} deleted successfully! (Simulated)`);
                router.push('/admin/products');
            }, 1500);
        }
    };

    if (isLoading && !product) {
        return (
            <div className="flex">
                <Sidebar />
                <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white p-8">
                    <Header />
                    <div className="text-center py-12 text-gray-400">Loading Product Details...</div>
                </main>
            </div>
        );
    }
    
    if (!product || !formData) {
        return (
             <div className="flex">
                <Sidebar />
                <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white p-8">
                    <Header />
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                        <button
                            onClick={() => router.push('/admin/products')}
                            className="bg-teal-500 hover:bg-teal-600 text-black px-6 py-3 rounded-lg font-bold"
                        >
                            Back to Products
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const { name, price, category, description, hasCustomization, customizationDetails } = formData as Product;


    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
                <Header />

                <section className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/admin/products')} 
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                        disabled={isLoading}
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Products</span>
                    </button>

                    <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
                        <Package size={30} className="text-teal-400" />
                        Edit Product: **{product.name}**
                    </h1>
                    <p className="text-gray-400 mb-8">Product ID: **{product.id}**. Make changes and save.</p>

                    {/* Product Form Container */}
                    <form onSubmit={handleSaveChanges} className="bg-[#1E1E1E] w-full rounded-xl p-8 border border-gray-700 shadow-2xl">
                        
                        {/* 1. Basic Information Section */}
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6 text-gray-300">Basic Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            
                            {/* Product Name */}
                            <InputField
                                label="Product Name"
                                name="name"
                                icon={Text}
                                placeholder="e.g., Team Jersey 2025"
                                value={name}
                                onChange={handleChange}
                                type="text"
                                disabled={isLoading}
                            />

                            {/* Category */}
                            <InputField
                                label="Category"
                                name="category"
                                icon={Tag}
                                value={category}
                                onChange={handleChange}
                                type="select"
                                disabled={isLoading}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value} className="bg-[#2A2A2A]">{cat.label}</option>
                                ))}
                            </InputField>
                            
                            {/* Price */}
                            <InputField
                                label="Price ($)"
                                name="price"
                                icon={DollarSign}
                                placeholder="e.g., 59.99"
                                value={price}
                                onChange={handleChange}
                                type="number"
                                disabled={isLoading}
                            />

                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <InputField
                                label="Description"
                                name="description"
                                icon={Text}
                                placeholder="A brief but compelling description of the product..."
                                value={description}
                                onChange={handleChange}
                                type="textarea"
                                disabled={isLoading}
                            />
                        </div>


                        {/* 2. Media & Customization Section */}
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6 text-gray-300">Media & Options</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                            {/* Image Management */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                                    <ImageIcon size={16} className="text-teal-400" />
                                    Current Image
                                </label>
                                <div className="p-4 bg-[#2A2A2A] border border-gray-600 rounded-lg">
                                    <div className="flex items-center gap-4 mb-3">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            className="w-16 h-16 object-cover rounded-md border border-gray-500"
                                        />
                                        <p className="text-sm text-gray-400">File: **{product.imageUrl.split('/').pop()}**</p>
                                    </div>
                                    <div className="border-t border-gray-700 pt-3">
                                        <label htmlFor="imageFile" className="block text-sm text-white font-medium mb-1">
                                            {newImageFile ? 'New File Selected' : 'Replace Image'}
                                        </label>
                                        <div className="flex items-center gap-2">
                                             <input
                                                type="file"
                                                id="imageFile"
                                                name="imageFile"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                disabled={isLoading}
                                                className="block w-full text-sm text-gray-400
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-teal-500 file:text-black
                                                        hover:file:bg-teal-600"
                                            />
                                            {newImageFile && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setNewImageFile(null)}
                                                    className="text-red-400 hover:text-red-500 transition"
                                                    title="Cancel new upload"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Customization Options */}
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
                                            checked={hasCustomization}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-500 rounded focus:ring-teal-500"
                                        />
                                        <label htmlFor="hasCustomization" className="text-white text-base">
                                            Allow customer customization
                                        </label>
                                    </div>
                                </div>

                                {hasCustomization && (
                                    <InputField
                                        label="Customization Details/Instructions"
                                        name="customizationDetails"
                                        icon={Text}
                                        placeholder="Max characters, placement info, extra cost..."
                                        value={customizationDetails}
                                        onChange={handleChange}
                                        type="textarea"
                                        disabled={isLoading}
                                    />
                                )}
                            </div>

                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center border-t border-gray-700 pt-6 mt-4">
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

                    </form>
                </section>
            </main>
        </div>
    );
}