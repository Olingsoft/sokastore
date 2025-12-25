'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sideBar';
import AdminHeader from '../../components/header';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewBlogPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        author: 'SokaStore Admin',
        excerpt: '',
        content: '',
        tags: '',
        image: null as File | null
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

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
        if (!formData.title || !formData.content || !formData.excerpt) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);
            data.append('tags', formData.tags);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await fetch(`${apiUrl}/blogs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Blog post created successfully');
                router.push('/admin/blogs');
            } else {
                toast.error(result.message || 'Failed to create blog post');
            }
        } catch (err) {
            console.error('Error creating blog:', err);
            toast.error('Error creating blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#141313]">
            <Sidebar />
            <div className="flex-1 ml-64 w-full">
                <AdminHeader />

                <main className="p-8">
                    <Link href="/admin/blogs" className="inline-flex items-center text-gray-500 hover:text-teal-400 mb-6 transition-colors">
                        <ArrowLeft size={18} className="mr-2" /> Back to Blogs
                    </Link>

                    <form onSubmit={handleSubmit} className="max-w-4xl bg-[#1E1E1E] rounded-2xl border border-gray-800 p-8 shadow-xl">
                        <h1 className="text-2xl font-bold text-white mb-8">Create New Blog Post</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500 transition-all font-bold text-lg"
                                    placeholder="e.g. Best 5 Football Jerseys of 2024"
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
                                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="Jerseys, News, Top10"
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                                <div className="flex gap-6 items-start">
                                    <div
                                        className="relative w-full h-64 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-white/5 transition-all overflow-hidden"
                                        onClick={() => document.getElementById('blog-image')?.click()}
                                    >
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <ImageIcon size={48} className="text-gray-600 mb-4" />
                                                <p className="text-gray-500">Click to upload image</p>
                                                <p className="text-gray-600 text-xs mt-2">Recommended size: 1200 x 630</p>
                                            </>
                                        )}
                                        <input
                                            id="blog-image"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt (Short description) *</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500 resize-none"
                                    placeholder="A brief summary that appears on the blog listing page..."
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
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500 font-serif leading-relaxed"
                                    placeholder="Write your article here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                                <p className="text-xs text-gray-600 mt-2">Note: Plain text is supported. Headings and lists will be formatted automatically.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-800">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-900/20"
                            >
                                {isSubmitting ? 'Saving...' : <><Save size={20} /> Publish Post</>}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
