'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/sideBar';
import { Heart, Search, User, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

type WishlistItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        
        const data = await response.json();
        setWishlist(data.data || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [apiUrl]);

  const filteredWishlist = wishlist.filter(item => 
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-[#141313]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Heart className="text-pink-500" size={28} />
                Customer Wishlists
              </h1>
              <p className="text-gray-400">View and manage customer wishlisted products</p>
            </div>
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#1E1E1E] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Search products or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-[#1E1E1E] rounded-xl border border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                <span className="ml-2 text-gray-400">Loading wishlist...</span>
              </div>
            ) : filteredWishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-600" />
                <h3 className="mt-2 text-lg font-medium text-gray-300">No wishlist items found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Try a different search term' : 'No products have been wishlisted yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#2A2A2A]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1E1E1E] divide-y divide-gray-800">
                    {filteredWishlist.map((item) => (
                      <tr key={item.id} className="hover:bg-[#2A2A2A]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.product.image ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={item.product.image}
                                alt={item.product.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                                <Heart className="h-5 w-5 text-pink-500" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{item.product.name}</div>
                              <div className="text-xs text-gray-400">ID: {item.product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-300" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-white">{item.user.name}</div>
                              <div className="text-xs text-gray-400">{item.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {format(new Date(item.createdAt), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className="text-white">${item.product.price.toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}