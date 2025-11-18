"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Tag } from 'lucide-react';
import Sidebar from '@/app/admin/components/sideBar';

export default function AddCategoryPage() {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const handleNewCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {})
    }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) throw new Error('Failed to add category');

      toast.success('Category added successfully');
      router.push('/admin/category?created=1');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
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
                <Tag className="text-teal-400" size={28} />
                Add Category
              </h1>
              <p className="text-gray-400">Create a new product category</p>
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
            <h2 className="text-xl font-semibold text-white mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Premier League"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={newCategory.slug}
                    onChange={handleNewCategoryChange}
                    className="w-full p-3 bg-[#2A2A2A]/50 border border-gray-600 rounded-lg text-gray-400 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="premier-league"
                    readOnly
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
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black font-medium rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

