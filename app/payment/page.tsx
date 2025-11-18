"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const ACCENT_COLOR_CLASS = "bg-teal-400 hover:bg-teal-500";
const TEXT_ACCENT_COLOR_CLASS = "text-teal-400";

export default function PaymentPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col bg-[#141313] text-white">
            <Header />

            <main className="flex-grow py-12 px-4 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* TITLE */}
                    <h2 className="text-3xl font-bold tracking-wide">
                        Secure Payment
                    </h2>

                    {/* SHIPPING SECTION */}
                    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A]">
                        <h3 className="text-xl font-semibold mb-4">
                            Delivery Options
                        </h3>

                        {/* PICKUP / DELIVERY TOGGLE */}
                        <div className="flex items-center gap-4 mb-6">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="deliveryType" className="accent-teal-400" />
                                Pick Up (Free)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="deliveryType" className="accent-teal-400" />
                                Delivery
                            </label>
                        </div>

                        {/* SHIPPING ADDRESS */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full space-y-4">
                                <div>
                                    <label className="text-sm text-gray-300">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300">Phone Number</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                        placeholder="0712 345 678"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                    placeholder="0712 345 678"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">Delivery Zone</label>
                                <select className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none">
                                    <option value="nairobi">Nairobi — KES 250</option>
                                    <option value="kiambu">Kiambu — KES 350</option>
                                    <option value="thika">Thika — KES 400</option>
                                    <option value="machakos">Machakos — KES 450</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">Exact Address</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                    placeholder="Estate / Apartment / House No."
                                />
                            </div>
                        </div>
                    </div>

                    {/* PAYMENT OPTIONS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* M-PESA CARD */}
                        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A] hover:border-teal-400 transition">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/M-PESA_logo.png/512px-M-PESA_logo.png"
                                    alt="mpesa"
                                    className="w-8 h-8 object-contain"
                                />
                                Lipa na M-Pesa
                            </h3>

                            <p className="text-gray-400 text-sm mb-5">
                                Pay securely using M-Pesa STK Push.
                            </p>

                            <label className="text-sm text-gray-300">Phone Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 0712 345 678"
                                className="w-full mt-1 mb-4 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                            />

                            <button className={`w-full ${ACCENT_COLOR_CLASS} text-[#141313] font-bold py-3 rounded-lg shadow-md`}>
                                Pay with M-Pesa
                            </button>
                        </div>

                        {/* VISA / CARD PAYMENT */}
                        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-[#2A2A2A] hover:border-teal-400 transition">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                                    alt="visa"
                                    className="w-10 h-10 object-contain"
                                />
                                Visa / Card Payment
                            </h3>

                            <p className="text-gray-400 text-sm mb-5">
                                Use your Visa or Mastercard to complete your purchase.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-300">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-300">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300">CVV</label>
                                        <input
                                            type="password"
                                            placeholder="***"
                                            className="w-full mt-1 px-3 py-3 rounded-lg bg-[#141313] border border-gray-700 text-white focus:border-teal-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className={`w-full mt-6 ${ACCENT_COLOR_CLASS} text-[#141313] font-bold py-3 rounded-lg shadow-md`}>
                                Pay with Card
                            </button>
                        </div>
                    </div>

                    {/* SAFE PAYMENT MESSAGE */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        Payments are encrypted & secure.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
