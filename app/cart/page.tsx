"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useCart, CartItem } from '../context/CartContext';

const ACCENT_COLOR_CLASS = "bg-teal-400 hover:bg-teal-500";
const TEXT_ACCENT_COLOR_CLASS = "text-teal-400 hover:text-teal-300";

const getImageUrl = (item: CartItem) => {
    // Backend returns product.images array
    if (item.product && item.product.images && item.product.images.length > 0) {
        const img = item.product.images.find(i => i.isPrimary)?.url || item.product.images[0].url;
        if (img.startsWith('http')) return img;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
        return `${baseUrl}/${img.replace(/^public\//, '').replace(/^\//, '')}`;
    }
    return '/images/jersey1.jpg';
};

const getProductName = (item: CartItem) => {
    return item.product?.name || 'Unknown Product';
};

const getProductPrice = (item: CartItem) => {
    // Use the price snapshot in cart item, or current product price
    return Number(item.price) || Number(item.product?.price) || 0;
};

export default function CartPage() {
    const router = useRouter();
    const { cartItems, removeFromCart, updateQuantity, isLoading } = useCart();

    useEffect(() => {
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
    }, [router]);

    const subtotal = cartItems.reduce((acc, item) => {
        const price = getProductPrice(item);
        return acc + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 0 ? 7.00 : 0;
    const taxes = subtotal * 0.08; // Example 8% tax
    const total = subtotal + shipping + taxes;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#141313]">
                <Header />
                <main className="flex-grow flex items-center justify-center text-white">
                    Loading cart...
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#141313]">
            <Header />
            <main className="flex-grow">
                <section className="text-white py-12 px-4 sm:px-6 md:px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* CART ITEMS */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-2xl font-bold tracking-wide border-b border-[#1E1E1E] pb-3 mb-4">
                                Shopping Bag ({cartItems.length} Items)
                            </h2>

                            {cartItems.length === 0 ? (
                                <div className="text-gray-400 py-8 text-center">
                                    Your cart is empty. <Link href="/shop" className="text-teal-400 hover:underline">Go Shopping</Link>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start bg-[#1E1E1E] rounded-lg p-3 sm:p-4 gap-4 transition duration-200"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2A2A2A] rounded-md flex-shrink-0">
                                            <img
                                                src={getImageUrl(item)}
                                                alt={getProductName(item)}
                                                className="object-cover w-full h-full rounded-md"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/jersey1.jpg';
                                                }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                                            <div className="flex-1 space-y-1 mb-2 sm:mb-0">
                                                <h3 className="text-base font-semibold text-white truncate">{getProductName(item)}</h3>
                                                {item.size && <p className="text-xs text-gray-400">Size: <span className="text-gray-300">{item.size}</span></p>}
                                                {item.type && <p className="text-xs text-gray-400">Type: <span className="text-gray-300">{item.type}</span></p>}
                                                {item.customization && (item.customization.playerName || item.customization.playerNumber) && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        <p>Custom: {item.customization.playerName} {item.customization.playerNumber}</p>
                                                        {item.customization.selectedBadge && <p>Badge: {item.customization.selectedBadge}</p>}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-xs text-gray-500 hover:text-red-500 mt-1 flex items-center gap-1 transition sm:hidden"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {/* Quantity and Price */}
                                            <div className="flex items-center space-x-6 sm:space-x-8">
                                                <div className="flex items-center bg-[#2A2A2A] rounded-full border border-gray-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="px-2 py-0.5 text-sm hover:text-teal-400 rounded-l-full"
                                                    >-</button>
                                                    <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 py-0.5 text-sm hover:text-teal-400 rounded-r-full"
                                                    >+</button>
                                                </div>

                                                <p className={`font-semibold text-base w-16 text-right ${TEXT_ACCENT_COLOR_CLASS}`}>
                                                    ${(getProductPrice(item) * item.quantity).toFixed(2)}
                                                </p>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="hidden sm:block text-gray-500 hover:text-red-500 p-1 rounded-full transition flex-shrink-0"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* SUMMARY */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1E1E1E] rounded-xl shadow-2xl p-5 sticky top-24">
                                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Order Summary</h3>

                                <div className="space-y-3 pb-4">
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Subtotal ({cartItems.length} Items)</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Shipping Estimate</span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Taxes (Estimated)</span>
                                        <span>${taxes.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-gray-700">
                                    <span>Order Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Link href="/payment" className={`block mt-6 text-center ${ACCENT_COLOR_CLASS} text-[#141313] font-bold py-3 rounded-lg shadow-md ${cartItems.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                                    Proceed to Payment
                                </Link>

                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Continue shopping for more deals.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}