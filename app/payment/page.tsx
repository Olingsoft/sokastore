"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useCart } from '../context/CartContext';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const ACCENT_COLOR_CLASS = "bg-teal-400 hover:bg-teal-500";

interface OrderFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryType: 'pickup' | 'delivery';
    deliveryZone: string;
    deliveryAddress: string;
    paymentMethod: 'mpesa' | 'cash' | 'whatsapp';
    paymentPhone: string;
    notes: string;
}

const deliveryZones = [
    { name: 'Nairobi', fee: 250 },
    { name: 'Kiambu', fee: 350 },
    { name: 'Thika', fee: 400 },
    { name: 'Machakos', fee: 450 },
];

export default function PaymentPage() {
    const router = useRouter();
    const { cartItems, isLoading: cartLoading, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false); // Track if order was successfully placed
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


    const [formData, setFormData] = useState<OrderFormData>({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryType: 'delivery',
        deliveryZone: 'Nairobi',
        deliveryAddress: '',
        paymentMethod: 'mpesa',
        paymentPhone: '',
        notes: ''
    });

    // Fetch user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Get user data from localStorage
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    router.push('/login');
                    return;
                }

                const userData = JSON.parse(storedUser);
                const userId = userData.id;

                // Fetch detailed user data from API
                const response = await fetch(`${BASE_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser(data);

                // Populate form with user data
                setFormData(prev => ({
                    ...prev,
                    customerName: data.name || '',
                    customerPhone: data.phone || '',
                    customerEmail: data.email || ''
                }));
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data');
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserData();
    }, []); // Only run once on mount

    // Handle cart empty redirect separately
    useEffect(() => {
        // Redirect if cart is empty (but not if order was just completed)
        if (!cartLoading && cartItems.length === 0 && !orderCompleted) {
            router.push('/cart');
        }
    }, [cartItems.length, cartLoading, orderCompleted, router]); // Use length instead of array to prevent reference changes

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const customizationFee = Number(item.customizationFee) || 0;
        return acc + ((price + customizationFee) * item.quantity);
    }, 0);

    const selectedZone = deliveryZones.find(z => z.name === formData.deliveryZone);
    const deliveryFee = formData.deliveryType === 'delivery' ? (selectedZone?.fee || 0) : 0;
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + deliveryFee + taxAmount;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeliveryTypeChange = (type: 'pickup' | 'delivery') => {
        setFormData(prev => ({ ...prev, deliveryType: type }));
    };

    const handlePaymentMethodChange = (method: 'mpesa' | 'cash' | 'whatsapp') => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const validateForm = (): boolean => {
        if (!formData.customerName.trim()) {
            setError('Please enter your full name');
            return false;
        }
        if (!formData.customerPhone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        if (formData.deliveryType === 'delivery' && !formData.deliveryAddress.trim()) {
            setError('Please enter your delivery address');
            return false;
        }
        if (formData.paymentMethod === 'mpesa' && !formData.paymentPhone.trim()) {
            setError('Please enter M-Pesa phone number');
            return false;
        }
        return true;
    };

    const handleSubmitOrder = async () => {
        setError(null);

        if (!validateForm()) {
            return;
        }

        // Handle WhatsApp checkout separately
        if (formData.paymentMethod === 'whatsapp') {
            await handleWhatsAppCheckout();
            return;
        }

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Create order
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    deliveryFee
                    // Backend fetches items from the database cart, so we don't need to send them here
                    // preventing 413 Payload Too Large errors if images are large
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            const data = await response.json();
            const orderId = data.order.id;

            // Simulate payment processing (dummy)
            await simulatePayment(formData.paymentMethod);

            // Update payment status to paid (dummy success)
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/payment-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentStatus: 'paid',
                    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                })
            });

            // Clear cart
            setOrderCompleted(true); // Mark order as completed before clearing cart
            await clearCart();

            // Redirect to success page
            router.push(`/order-success?orderId=${orderId}`);

        } catch (err: any) {
            console.error('Error creating order:', err);
            setError(err.message || 'Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWhatsAppCheckout = async () => {
        console.log('Starting WhatsApp checkout...');

        // Format order items
        const itemsList = cartItems.map((item, index) => {
            const price = Number(item.price) || 0;
            const customizationFee = Number(item.customizationFee) || 0;
            const itemTotal = (price + customizationFee) * item.quantity;

            let details = `${index + 1}. ${item.product?.name || 'Product'} - Qty: ${item.quantity} × Ksh. ${(price + customizationFee).toFixed(2)} = Ksh. ${itemTotal.toFixed(2)}`;

            if (item.customization) {
                details += `\n   Customization: ${item.customization.playerName || ''} ${item.customization.playerNumber || ''} ${item.customization.selectedBadge ? `(${item.customization.selectedBadge})` : ''}`;
            }

            return details;
        }).join('\n');

        // Build WhatsApp message
        const message = `*🛍️ NEW ORDER REQUEST*\n\n` +
            `*Customer Details:*\n` +
            `👤 Name: ${formData.customerName}\n` +
            `📱 Phone: ${formData.customerPhone}\n` +
            `📧 Email: ${formData.customerEmail || 'Not provided'}\n\n` +
            `*Delivery Information:*\n` +
            `🚚 Type: ${formData.deliveryType === 'delivery' ? 'Delivery' : 'Pick Up'}\n` +
            (formData.deliveryType === 'delivery' ?
                `📍 Zone: ${formData.deliveryZone}\n` +
                `🏠 Address: ${formData.deliveryAddress}\n\n` : '\n') +
            `*Order Summary:*\n` +
            `${itemsList}\n\n` +
            `*Order Totals:*\n` +
            `Subtotal: Ksh. ${subtotal.toFixed(2)}\n` +
            `Delivery Fee: Ksh. ${deliveryFee.toFixed(2)}\n` +
            `Tax (8%): Ksh. ${taxAmount.toFixed(2)}\n` +
            `*TOTAL: Ksh. ${totalAmount.toFixed(2)}*\n\n` +
            (formData.notes ? `*Additional Notes:*\n${formData.notes}\n\n` : '') +
            `Thank you for your order! 🙏`;

        // WhatsApp business number
        const whatsappNumber = '254759221095';

        // Clear cart and prevent redirect
        setOrderCompleted(true);
        await clearCart();

        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        console.log('Opening WhatsApp URL:', whatsappUrl);

        // Try opening in new tab first
        const newWindow = window.open(whatsappUrl, '_blank');

        // Fallback if popup blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            console.log('Popup blocked, trying current window');
            window.location.href = whatsappUrl;
        }
    };

    // Simulate payment processing delay
    const simulatePayment = (method: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Simulated ${method} payment successful`);
                resolve();
            }, 2000); // 2 second delay to simulate payment processing
        });
    };

    if (cartLoading || isLoadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#141313]">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#141313] text-white">
            <Header />

            <main className="flex-grow py-12 px-4 sm:px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Order Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-3xl font-bold tracking-wide">
                                Checkout
                            </h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Customer Information */}
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A]">
                                <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-300 block mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300 block mb-1">Phone Number *</label>
                                        <input
                                            type="text"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                            placeholder="0712 345 678"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-gray-300 block mb-1">Email (Optional)</label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A]">
                                <h3 className="text-xl font-semibold mb-4">Delivery Options</h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.deliveryType === 'pickup'}
                                            onChange={() => handleDeliveryTypeChange('pickup')}
                                            className="accent-teal-400"
                                        />
                                        <span>Pick Up (Free)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.deliveryType === 'delivery'}
                                            onChange={() => handleDeliveryTypeChange('delivery')}
                                            className="accent-teal-400"
                                        />
                                        <span>Delivery</span>
                                    </label>
                                </div>

                                {formData.deliveryType === 'delivery' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-300 block mb-1">Delivery Zone *</label>
                                            <select
                                                name="deliveryZone"
                                                value={formData.deliveryZone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                            >
                                                {deliveryZones.map(zone => (
                                                    <option key={zone.name} value={zone.name}>
                                                        {zone.name} — KES {zone.fee}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-300 block mb-1">Delivery Address *</label>
                                            <textarea
                                                name="deliveryAddress"
                                                value={formData.deliveryAddress}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                                placeholder="Estate / Apartment / House No."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A]">
                                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <button
                                        onClick={() => handlePaymentMethodChange('mpesa')}
                                        className={`p-4 rounded-lg border-2 transition ${formData.paymentMethod === 'mpesa'
                                            ? 'border-teal-400 bg-teal-400/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">M-Pesa</div>
                                            <div className="text-xs text-gray-400">Mobile Money</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handlePaymentMethodChange('cash')}
                                        className={`p-4 rounded-lg border-2 transition ${formData.paymentMethod === 'cash'
                                            ? 'border-teal-400 bg-teal-400/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">Cash</div>
                                            <div className="text-xs text-gray-400">On Delivery</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handlePaymentMethodChange('whatsapp')}
                                        className={`p-4 rounded-lg border-2 transition ${formData.paymentMethod === 'whatsapp'
                                            ? 'border-teal-400 bg-teal-400/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-center flex flex-col items-center gap-1">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            <div className="font-semibold">WhatsApp</div>
                                            <div className="text-xs text-gray-400">Quick Checkout</div>
                                        </div>
                                    </button>
                                </div>

                                {formData.paymentMethod === 'mpesa' && (
                                    <div>
                                        <label className="text-sm text-gray-300 block mb-1">M-Pesa Phone Number *</label>
                                        <input
                                            type="text"
                                            name="paymentPhone"
                                            value={formData.paymentPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                            placeholder="0712 345 678"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            You will receive an STK push to complete payment (Demo Mode)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Notes */}
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A]">
                                <h3 className="text-xl font-semibold mb-4">Additional Notes (Optional)</h3>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A] sticky top-24">
                                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-3">Order Summary</h3>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                    {cartItems.map((item, index) => (
                                        <div key={`cart-item-${item.id}-${index}`} className="flex gap-3 text-sm">
                                            <div className="w-12 h-12 bg-[#2A2A2A] rounded flex-shrink-0">
                                                {/* You can add product image here */}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-white line-clamp-1">
                                                    {item.product?.name || 'Product'}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    Qty: {item.quantity} × Ksh. {(Number(item.price) + (Number(item.customizationFee) || 0)).toFixed(2)}
                                                </div>
                                                {item.customization && (
                                                    <div className="text-xs text-teal-400 mt-1">
                                                        + Customization
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-teal-400 font-semibold">
                                                Ksh. {((Number(item.price) + (Number(item.customizationFee) || 0)) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>Ksh. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Delivery Fee</span>
                                        <span>Ksh. {deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Tax (8%)</span>
                                        <span>Ksh. {taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-gray-700">
                                        <span>Total</span>
                                        <span className="text-teal-400">Ksh. {totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handleSubmitOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className={`w-full mt-6 ${ACCENT_COLOR_CLASS} text-[#141313] font-bold py-3 rounded-lg shadow-md transition ${isProcessing || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isProcessing
                                        ? 'Processing...'
                                        : formData.paymentMethod === 'whatsapp'
                                            ? 'Checkout via WhatsApp'
                                            : 'Place Order'}
                                </button>

                                {formData.paymentMethod !== 'whatsapp' && (
                                    <p className="text-xs text-gray-500 mt-3 text-center">
                                        Demo Mode: Payment will be simulated
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
