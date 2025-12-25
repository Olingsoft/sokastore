'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowLeft, Share2, Tag } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    imageUrl: string;
    createdAt: string;
    tags: string[];
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${apiUrl}/blogs/${slug}`);
                const data = await response.json();

                if (data.success) {
                    setBlog(data.data);
                } else {
                    setError(data.message || 'Blog post not found');
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Failed to load blog post.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [apiUrl, slug]);

    const getFullImageUrl = (imagePath: string): string => {
        if (!imagePath) return '/images/jersey1.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = apiUrl.replace(/\/api\/?$/, '');
        return `${baseUrl}${imagePath}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0f0a] text-gray-100">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
                    <div className="h-4 bg-white/5 rounded w-24 mb-6" />
                    <div className="h-12 bg-white/5 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-white/5 rounded w-1/2 mb-12" />
                    <div className="h-[400px] bg-white/5 rounded-2xl mb-12" />
                    <div className="space-y-4">
                        <div className="h-4 bg-white/5 rounded w-full" />
                        <div className="h-4 bg-white/5 rounded w-full" />
                        <div className="h-4 bg-white/5 rounded w-2/3" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-[#0a0f0a] text-gray-100">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">{error || 'Blog post not found'}</h1>
                    <Link href="/blogs" className="inline-flex items-center text-green-400 hover:underline">
                        <ArrowLeft size={16} className="mr-2" /> Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Breadcrumbs */}
                <Link href="/blogs" className="inline-flex items-center text-gray-500 hover:text-green-400 mb-8 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} className="mr-2" /> Back to Blog
                </Link>

                <article>
                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex flex-wrap gap-4 items-center text-xs md:text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-green-500" />
                                {new Date(blog.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="flex items-center gap-2">
                                <User size={16} className="text-green-500" />
                                By {blog.author}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight text-white">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {blog.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-2">
                                    <Tag size={12} /> {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Hero Image */}
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 mb-16 group">
                        <img
                            src={getFullImageUrl(blog.imageUrl)}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-transparent to-transparent opacity-40" />
                    </div>

                    {/* Share Section */}
                    <div className="flex justify-end mb-8">
                        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm transition-colors border border-white/10">
                            <Share2 size={16} /> Share
                        </button>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-green max-w-none">
                        <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </div>

                    {/* Footer of article */}
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                                {blog.author.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Author</p>
                                <p className="text-xl font-bold text-white">{blog.author}</p>
                            </div>
                        </div>

                        <Link href="/shop" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                            Shop Latest Jerseys
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
