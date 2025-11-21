"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryType: string;
    deliveryAddress: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    items: Array<{
        id: number;
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
}

function OrderSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                router.push('/');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }

                const data = await response.json();
                setOrder(data.order);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#141313]">
                <div className="text-white">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col bg-[#141313] text-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                        <Link href="/" className="text-teal-400 hover:underline">
                            Return to Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#141313] text-white">
            <Header />

            <main className="flex-grow py-12 px-4 sm:px-6 md:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
                        <p className="text-gray-400">Thank you for your purchase</p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A] mb-6">
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Order #{order.orderNumber}</h2>
                                <p className="text-sm text-gray-400">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-teal-400">
                                    ${Number(order.totalAmount).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {order.paymentMethod.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'paid'
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                Payment: {order.paymentStatus}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-500">
                                Status: {order.orderStatus}
                            </span>
                        </div>

                        {/* Customer & Delivery Info */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Customer Details
                                </h3>
                                <div className="text-sm space-y-1">
                                    <p className="text-white">{order.customerName}</p>
                                    <p className="text-gray-400">{order.customerPhone}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                                    {order.deliveryType === 'delivery' ? (
                                        <Truck className="w-4 h-4" />
                                    ) : (
                                        <MapPin className="w-4 h-4" />
                                    )}
                                    {order.deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                                </h3>
                                <div className="text-sm">
                                    {order.deliveryType === 'delivery' ? (
                                        <p className="text-gray-300">{order.deliveryAddress}</p>
                                    ) : (
                                        <p className="text-gray-300">Store Pickup - Free</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{item.productName}</p>
                                            <p className="text-xs text-gray-400">
                                                Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-teal-400 font-semibold">
                                            ${Number(item.subtotal).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A] mb-6">
                        <h3 className="text-lg font-semibold mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>You will receive an order confirmation via SMS/Email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>We'll notify you when your order is being prepared</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>
                                    {order.deliveryType === 'delivery'
                                        ? 'Track your delivery status in real-time'
                                        : 'You will be notified when your order is ready for pickup'}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 text-center bg-teal-400 hover:bg-teal-500 text-[#141313] font-bold py-3 rounded-lg shadow-md transition"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/orders"
                            className="flex-1 text-center bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-gray-700 text-white font-bold py-3 rounded-lg shadow-md transition"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#141313]">
                <div className="text-white">Loading...</div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
