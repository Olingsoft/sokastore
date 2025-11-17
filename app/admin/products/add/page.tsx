'use client';
import Sidebar from "../../components/sideBar";
import Header from "../../components/header";
import { ArrowLeft, Package, DollarSign, Tag, Text, Image as ImageIcon, Zap, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// --- Form Interfaces ---
interface ProductFormData {
  name: string;
  price: number | string;
  category: string;
  description: string;
  imageFile: File | null;
  hasCustomization: boolean;
  customizationDetails: string;
}

// Mock Categories for the dropdown
const categories = [
    { value: 'apparel', label: 'Apparel' },
    { value: 'footwear', label: 'Footwear' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'equipment', label: 'Equipment' },
];

export default function AddProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: '',
        category: categories[0].value,
        description: '',
        imageFile: null,
        hasCustomization: false,
        customizationDetails: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                imageFile: e.target.files![0],
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // In a real application, you would send formData to an API endpoint here
        console.log("Submitting Product Data:", formData);
        
        setTimeout(() => {
            setIsLoading(false);
            alert("Product added successfully! (Simulated)");
            // Optional: Redirect to the product list page
            // router.push('/admin/products'); 
        }, 1500);
    };

    const InputField = ({ label, name, icon: Icon, type = 'text', placeholder, value, children }: any) => (
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    step={type === 'number' ? "0.01" : undefined}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    className="p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                />
            )}
        </div>
    );


    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
                <Header />

                <section className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/admin/products')} // Assuming you have a product list page
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

                    {/* Product Form Container */}
                    <form onSubmit={handleSubmit} className="bg-[#1E1E1E] w-full rounded-xl p-8 border border-gray-700 shadow-2xl">
                        
                        {/* 1. Basic Information Section */}
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6 text-gray-300">Basic Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            
                            {/* Product Name */}
                            <InputField
                                label="Product Name"
                                name="name"
                                icon={Text}
                                placeholder="e.g., Team Jersey 2025"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                            />

                            {/* Category */}
                            <InputField
                                label="Category"
                                name="category"
                                icon={Tag}
                                value={formData.category}
                                onChange={handleChange}
                                type="select"
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
                                value={formData.price}
                                onChange={handleChange}
                                type="number"
                            />

                        </div>

                        {/* Description */}
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


                        {/* 2. Media & Customization Section */}
                        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-3 mb-6 text-gray-300">Media & Options</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                            {/* Image Upload */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                                    <ImageIcon size={16} className="text-teal-400" />
                                    Product Image
                                </label>
                                <div className="p-6 bg-[#2A2A2A] border border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-teal-500 transition duration-150">
                                    <input
                                        type="file"
                                        id="imageFile"
                                        name="imageFile"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="imageFile" className="block cursor-pointer">
                                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-400">
                                            {formData.imageFile ? 
                                                <span className="text-white font-medium">{formData.imageFile.name}</span>
                                                : 
                                                'Drag & drop or click to upload image'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, up to 5MB</p>
                                    </label>
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-black py-3 rounded-xl font-bold text-lg transition duration-200 shadow-lg shadow-teal-500/30 disabled:bg-gray-500 disabled:shadow-none"
                            disabled={isLoading || !formData.name || !formData.price || !formData.description}
                        >
                            {isLoading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}