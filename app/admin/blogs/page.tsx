'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/sideBar';
import AdminHeader from '../components/header';
import { Plus, Edit2, Trash2, ExternalLink, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    author: string;
    createdAt: string;
    isActive: boolean;
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${apiUrl}/blogs`);
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
            toast.error('Failed to load blogs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [apiUrl]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Blog post deleted');
                fetchBlogs();
            } else {
                toast.error(data.message || 'Failed to delete blog post');
            }
        } catch (err) {
            console.error('Error deleting blog:', err);
            toast.error('Error deleting blog post');
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen w-full bg-[#141313]">
            <Sidebar />
            <div className="flex-1 ml-64 w-full">
                <AdminHeader />

                <main className="p-8 ">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Manage Blogs</h1>
                            <p className="text-gray-400">Create and edit articles for your customers</p>
                        </div>
                        <Link href="/admin/blogs/new" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                            <Plus size={20} /> New Post
                        </Link>
                    </div>

                    {/* Search & Stats */}
                    <div className="bg-[#1E1E1E]  p-6 rounded-xl border border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-teal-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-gray-400 text-sm">
                            Total: <span className="text-white font-bold">{filteredBlogs.length}</span> Posts
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-[#1E1E1E] rounded-xl border border-gray-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#2A2A2A] text-gray-400 text-sm uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading blogs...</td>
                                    </tr>
                                ) : filteredBlogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No blog posts found.</td>
                                    </tr>
                                ) : (
                                    filteredBlogs.map((blog) => (
                                        <tr key={blog._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{blog.title}</td>
                                            <td className="px-6 py-4 text-gray-400">{blog.author}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${blog.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {blog.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link href={`/blogs/${blog.slug}`} target="_blank" className="p-2 hover:text-blue-400 transition" title="View in live site">
                                                        <ExternalLink size={18} />
                                                    </Link>
                                                    <Link href={`/admin/blogs/edit/${blog._id}`} className="p-2 hover:text-teal-400 transition" title="Edit">
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(blog._id)} className="p-2 hover:text-red-400 transition" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
