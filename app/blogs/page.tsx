'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    imageUrl: string;
    createdAt: string;
    tags: string[];
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${apiUrl}/blogs`);
                const data = await response.json();

                if (data.success) {
                    setBlogs(data.data);
                } else {
                    setError(data.message || 'Failed to fetch blogs');
                }
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blog posts.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, [apiUrl]);

    const getFullImageUrl = (imagePath: string): string => {
        if (!imagePath) return '/images/jersey1.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = apiUrl.replace(/\/api\/?$/, '');
        return `${baseUrl}${imagePath}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 mb-4">
                        SokaStore Blog
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest trends in football jerseys, team news, and styling tips.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#141313] rounded-2xl border border-white/5 overflow-hidden animate-pulse">
                                <div className="h-56 bg-white/5" />
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-white/5 rounded w-1/4" />
                                    <div className="h-6 bg-white/5 rounded w-3/4" />
                                    <div className="h-4 bg-white/5 rounded w-full" />
                                    <div className="h-4 bg-white/5 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-900/10 rounded-3xl border border-red-900/20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-900/20 rounded-full text-sm hover:bg-red-900/40 transition">
                            Try Again
                        </button>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-500 text-lg">No blog posts found yet.</p>
                        <p className="text-gray-600 text-sm mt-2">Come back later for exciting football content!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group">
                                <article className="bg-[#141313] rounded-2xl border border-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] h-full flex flex-col">
                                    {/* Image Container */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={getFullImageUrl(blog.imageUrl)}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#141313] to-transparent opacity-60" />

                                        {/* Tags */}
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                                {blog.tags.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="px-3 py-1 bg-green-500/20 backdrop-blur-md text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-green-500" />
                                                {new Date(blog.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} className="text-green-500" />
                                                {blog.author}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>

                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                                            {blog.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center text-sm font-semibold text-green-400 group-hover:translate-x-2 transition-transform duration-300">
                                            Read Article <ArrowRight className="ml-2" size={16} />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
