'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, CheckCircle, Clock, XCircle, Truck, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type OrderStatus = 'delivered' | 'processing' | 'cancelled' | 'shipped';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        
        // Mock data for demonstration
        setTimeout(() => {
          setOrders([
            {
              id: 'ORD-12345',
              date: '2023-11-15',
              status: 'delivered',
              total: 89.97,
              trackingNumber: '1Z999AA1234567890',
              items: [
                {
                  id: '1',
                  name: 'Premium Football Jersey',
                  image: '/images/Jersey1.jpg',
                  price: 29.99,
                  quantity: 1,
                  size: 'M'
                },
                {
                  id: '2',
                  name: 'Training Shorts',
                  image: '/images/Jersey2.webp',
                  price: 24.99,
                  quantity: 2,
                  size: 'L'
                }
              ]
            },
            {
              id: 'ORD-12344',
              date: '2023-11-10',
              status: 'shipped',
              total: 54.98,
              trackingNumber: '1Z999BB1234567890',
              items: [
                {
                  id: '3',
                  name: 'Goalkeeper Gloves',
                  image: '/images/ads1.jpg',
                  price: 54.98,
                  quantity: 1,
                  size: 'M'
                }
              ]
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0f0a] text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => router.back()} 
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">My Orders</h1>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center space-y-4">
                <RefreshCw className="w-12 h-12 text-teal-400 animate-spin" />
                <p className="text-gray-400">Loading your orders...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0f0a] text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => router.back()} 
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">My Orders</h1>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f0a] text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center space-x-4 mb-8">
            <button 
              onClick={() => router.back()} 
              className="text-gray-300 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>

          {/* Order status tabs */}
          <div className="flex overflow-x-auto pb-2 mb-6 space-x-2">
            {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-teal-500 text-white'
                    : 'bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2a2a]'
                }`}
              >
                {tab === 'all' ? 'All Orders' : getStatusText(tab)}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-[#1e1e1e] rounded-lg p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${activeTab} orders.`}
              </p>
              <Link 
                href="/shop" 
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800">
                  {/* Order header */}
                  <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Order #{order.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="text-lg font-bold text-teal-400">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-gray-800">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.id}`} className="p-4 flex">
                        <div className="w-20 h-20 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-400">Size: {item.size}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-400">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="p-4 bg-[#252525] flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div className="flex items-center">
                      {order.trackingNumber && (
                        <div className="text-sm">
                          <span className="text-gray-400">Tracking #: </span>
                          <span className="font-medium">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors">
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors">
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}