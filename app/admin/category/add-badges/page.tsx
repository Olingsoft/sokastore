"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Tag, Image as ImageIcon } from 'lucide-react';
import Sidebar from '@/app/admin/components/sideBar';

export default function AddBadgePage() {
    const router = useRouter();
    const [newBadge, setNewBadge] = useState({
        name: '',
        slug: '',
        icon: '',
        description: ''
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const handleNewBadgeChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewBadge(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {})
        }));
    };

    const handleAddBadge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBadge.name.trim()) {
            toast.error('Badge name is required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/badges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
                },
                body: JSON.stringify(newBadge)
            });

            if (!response.ok) throw new Error('Failed to add badge');

            toast.success('Badge added successfully');
            router.push('/admin/category?created=badge');
        } catch (error) {
            console.error('Error adding badge:', error);
            toast.error('Failed to add badge');
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#141313]">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto ml-64">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Tag className="text-purple-400" size={28} />
                                Add Badge
                            </h1>
                            <p className="text-gray-400">Create a new product badge</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/category')}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    </div>

                    <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Add New Badge</h2>
                        <form onSubmit={handleAddBadge} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newBadge.name}
                                        onChange={handleNewBadgeChange}
                                        className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="e.g., Best Seller"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={newBadge.slug}
                                        onChange={handleNewBadgeChange}
                                        className="w-full p-3 bg-[#2A2A2A]/50 border border-gray-600 rounded-lg text-gray-400 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="best-seller"
                                        readOnly
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Icon URL (Optional)</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            name="icon"
                                            value={newBadge.icon}
                                            onChange={handleNewBadgeChange}
                                            className="w-full p-3 pl-10 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="https://example.com/icon.png"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Provide a direct link to an image icon for this badge.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        value={newBadge.description}
                                        onChange={handleNewBadgeChange}
                                        rows={3}
                                        className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Describe what this badge represents..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/category')}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Badge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
