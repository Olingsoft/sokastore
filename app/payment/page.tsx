"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useCart } from '../context/CartContext';

const ACCENT_COLOR_CLASS = "bg-teal-400 hover:bg-teal-500";

interface OrderFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryType: 'pickup' | 'delivery';
    deliveryZone: string;
    deliveryAddress: string;
    paymentMethod: 'mpesa' | 'card' | 'cash';
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
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        // Redirect if cart is empty
        if (!cartLoading && cartItems.length === 0) {
            router.push('/cart');
        }
    }, [router, cartItems, cartLoading]);

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        return acc + (price * item.quantity);
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

    const handlePaymentMethodChange = (method: 'mpesa' | 'card' | 'cash') => {
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

    // Simulate payment processing delay
    const simulatePayment = (method: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Simulated ${method} payment successful`);
                resolve();
            }, 2000); // 2 second delay to simulate payment processing
        });
    };

    if (cartLoading) {
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
                                        onClick={() => handlePaymentMethodChange('card')}
                                        className={`p-4 rounded-lg border-2 transition ${formData.paymentMethod === 'card'
                                                ? 'border-teal-400 bg-teal-400/10'
                                                : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">Card</div>
                                            <div className="text-xs text-gray-400">Visa/Mastercard</div>
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
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 text-sm">
                                            <div className="w-12 h-12 bg-[#2A2A2A] rounded flex-shrink-0">
                                                {/* You can add product image here */}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-white line-clamp-1">
                                                    {item.product?.name || 'Product'}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-teal-400 font-semibold">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Delivery Fee</span>
                                        <span>${deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Tax (8%)</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-gray-700">
                                        <span>Total</span>
                                        <span className="text-teal-400">${totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handleSubmitOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className={`w-full mt-6 ${ACCENT_COLOR_CLASS} text-[#141313] font-bold py-3 rounded-lg shadow-md transition ${isProcessing || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </button>

                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Demo Mode: Payment will be simulated
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
