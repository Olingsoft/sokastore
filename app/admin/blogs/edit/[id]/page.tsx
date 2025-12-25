'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/sideBar';
import AdminHeader from '../../../components/header';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        excerpt: '',
        content: '',
        tags: '',
        isActive: true,
        image: null as File | null
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${apiUrl}/blogs`);
                const data = await response.json();
                if (data.success) {
                    // Find the specific blog by ID (The list endpoint returns all)
                    const blog = data.data.find((b: any) => b._id === id);
                    if (blog) {
                        setFormData({
                            title: blog.title,
                            author: blog.author,
                            excerpt: blog.excerpt,
                            content: blog.content,
                            tags: blog.tags.join(', '),
                            isActive: blog.isActive,
                            image: null
                        });
                        if (blog.imageUrl) {
                            const baseUrl = apiUrl.replace(/\/api\/?$/, '');
                            setPreviewImage(blog.imageUrl.startsWith('http') ? blog.imageUrl : `${baseUrl}${blog.imageUrl}`);
                        }
                    } else {
                        toast.error('Blog not found');
                        router.push('/admin/blogs');
                    }
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                toast.error('Failed to load blog data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [apiUrl, id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);
            data.append('tags', formData.tags);
            data.append('isActive', formData.isActive.toString());
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await fetch(`${apiUrl}/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Blog post updated successfully');
                router.push('/admin/blogs');
            } else {
                toast.error(result.message || 'Failed to update blog post');
            }
        } catch (err) {
            console.error('Error updating blog:', err);
            toast.error('Error updating blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-[#141313] items-center justify-center">
                <p className="text-gray-400 animate-pulse">Loading blog data...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#141313]">
            <Sidebar />
            <div className="flex-1 ml-64">
                <AdminHeader />

                <main className="p-8">
                    <Link href="/admin/blogs" className="inline-flex items-center text-gray-500 hover:text-teal-400 mb-6 transition-colors">
                        <ArrowLeft size={18} className="mr-2" /> Back to Blogs
                    </Link>

                    <form onSubmit={handleSubmit} className="max-w-4xl bg-[#1E1E1E] rounded-2xl border border-gray-800 p-8 shadow-xl">
                        <h1 className="text-2xl font-bold text-white mb-8">Edit Blog Post</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-all font-bold text-lg"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                <select
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500"
                                    value={formData.isActive ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                >
                                    <option value="true">Active (Visible)</option>
                                    <option value="false">Inactive (Hidden)</option>
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                                <div
                                    className="relative w-full h-64 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-white/5 transition-all overflow-hidden"
                                    onClick={() => document.getElementById('blog-image-edit')?.click()}
                                >
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <ImageIcon size={48} className="text-gray-600 mb-4" />
                                            <p className="text-gray-500">Click to change image</p>
                                        </>
                                    )}
                                    <input
                                        id="blog-image-edit"
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt *</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500 resize-none"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Content *</label>
                                <textarea
                                    required
                                    rows={12}
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-800">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                            >
                                {isSubmitting ? 'Updating...' : <><Save size={20} /> Update Post</>}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
