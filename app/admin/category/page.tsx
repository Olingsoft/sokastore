"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Tag, Check, X } from 'lucide-react';
import Sidebar from '@/app/admin/components/sideBar';

interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | number | null>(null);
  const [editCategory, setEditCategory] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      console.log('[Categories] raw response data:', data);
      const list = Array.isArray((data as any)?.data) ? (data as any).data : [];
      if (!Array.isArray((data as any)?.data)) {
        console.warn('Unexpected categories response shape, expected { data: [...] }:', data);
      }
      console.log('[Categories] normalized list:', list);
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show success toast after creation and clean URL
  useEffect(() => {
    const created = searchParams?.get('created');
    if (created === '1') {
      toast.success('Category created');
      router.replace('/admin/category');
    }
  }, [searchParams, router]);

  // Handle input changes for edit category
  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditCategory(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {})
    }));
  };

  // Start editing a category
  const startEditing = (category: Category) => {
    setEditCategory({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setIsEditing(category.id);
  };

  // Save edited category
  const saveEdit = async (id: string | number) => {
    if (!editCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/categories/${String(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editCategory)
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      toast.success('Category updated successfully');
      setIsEditing(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Delete category
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      const response = await fetch(`${apiUrl}/categories/${categoryToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      toast.success('Category deleted successfully');
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-[#141313]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Tag className="text-teal-400" size={28} />
                Categories
              </h1>
              <p className="text-gray-400">Manage your product categories</p>
            </div>
            <button
              onClick={() => router.push('/admin/category/add')}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>

          {/* Categories Table */}
          <div className="bg-[#1E1E1E] rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#2A2A2A]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Slug
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1E1E1E] divide-y divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                        Loading categories...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        <Tag className="mx-auto mb-2 text-gray-600" size={32} />
                        <p>No categories found</p>
                        <button
                          onClick={() => router.push('/admin/category/add')}
                          className="mt-2 text-teal-400 hover:text-teal-300 font-medium"
                        >
                          Add your first category
                        </button>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-[#2A2A2A]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing === category.id ? (
                            <input
                              type="text"
                              name="name"
                              value={editCategory.name}
                              onChange={handleEditCategoryChange}
                              className="w-full p-2 bg-[#2A2A2A] border border-gray-600 rounded text-white focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <div className="text-sm font-medium text-white">{category.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing === category.id ? (
                            <input
                              type="text"
                              name="slug"
                              value={editCategory.slug}
                              onChange={handleEditCategoryChange}
                              className="w-full p-2 bg-[#2A2A2A] border border-gray-600 rounded text-white focus:ring-teal-500 focus:border-teal-500"
                            />
                          ) : (
                            <div className="text-sm text-gray-400">{category.slug}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {/* Replace with actual product count when available */}
                          0
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(category.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isEditing === category.id ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setIsEditing(null)}
                                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-700"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() => saveEdit(category.id)}
                                className="text-teal-400 hover:text-teal-300 p-1.5 rounded-full hover:bg-gray-700"
                                title="Save"
                              >
                                <Check size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => startEditing(category)}
                                className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-gray-700"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => setCategoryToDelete(category.id)}
                                className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-gray-700"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Delete Category</h3>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}