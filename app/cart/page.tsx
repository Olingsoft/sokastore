"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Note: I'm defining a placeholder for your accentTeal color for the redesign
// In a real project, this would be in your Tailwind config or passed as a prop.
// I'll assume 'teal-400' is a close representation for demonstration.
const ACCENT_COLOR_CLASS = "bg-teal-400 hover:bg-teal-500";
const TEXT_ACCENT_COLOR_CLASS = "text-teal-400 hover:text-teal-300";

export default function CartPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Reduced vertical padding (py-12 instead of py-16) and tightened horizontal padding */}
                <section className="bg-[#141313] text-white py-12 px-4 sm:px-6 md:px-8">
                    {/* Max width and tighter grid spacing (gap-8 instead of gap-10) */}
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* CART ITEMS */}
                        <div className="lg:col-span-2 space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
                            <h2 className="text-2xl font-bold tracking-wide border-b border-[#1E1E1E] pb-3 mb-4">Shopping Bag (2 Items)</h2> {/* Smaller heading, added subtle separator */}

                            {/* Example Cart Item (More compact, simplified layout) */}
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start bg-[#1E1E1E] rounded-lg p-3 sm:p-4 gap-4 transition duration-200" // Reduced padding and gap
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2A2A2A] rounded-md flex-shrink-0"> {/* Smaller image container */}
                                        <img
                                            src="https://via.placeholder.com/120"
                                            alt="Product"
                                            className="object-cover w-full h-full rounded-md"
                                        />
                                    </div>

                                    {/* Info, Quantity, Price - Organized in a flex column for better responsiveness */}
                                    <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                                        
                                        {/* Product Details (left side) */}
                                        <div className="flex-1 space-y-1 mb-2 sm:mb-0">
                                            <h3 className="text-base font-semibold text-white truncate">Team Jersey 2025 - Product Name</h3> {/* Smaller font */}
                                            <p className="text-xs text-gray-400">Size: <span className="text-gray-300">Large</span></p>
                                            <p className="text-xs text-gray-400">Color: <span className="text-gray-300">Black/Red</span></p>
                                            
                                            {/* Remove Button for mobile/compact view */}
                                            <button className="text-xs text-gray-500 hover:text-red-500 mt-1 flex items-center gap-1 transition sm:hidden">
                                                Remove
                                            </button>
                                        </div>

                                        {/* Quantity and Price (right side) */}
                                        <div className="flex items-center space-x-6 sm:space-x-8">
                                            
                                            {/* Quantity Controls (smaller, more integrated look) */}
                                            <div className="flex items-center bg-[#2A2A2A] rounded-full border border-gray-700">
                                                <button className="px-2 py-0.5 text-sm hover:text-teal-400 rounded-l-full">-</button>
                                                <input
                                                    type="text"
                                                    value="1"
                                                    readOnly
                                                    className="w-6 text-center text-sm bg-transparent text-white focus:outline-none"
                                                />
                                                <button className="px-2 py-0.5 text-sm hover:text-teal-400 rounded-r-full">+</button>
                                            </div>

                                            {/* Price */}
                                            <p className={`font-semibold text-base w-16 text-right ${TEXT_ACCENT_COLOR_CLASS}`}>$75.00</p>
                                            
                                            {/* Remove Button for desktop view */}
                                            <button className="hidden sm:block text-gray-500 hover:text-red-500 p-1 rounded-full transition flex-shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5" // Thinner stroke for a lighter look
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SUMMARY */}
                        <div className="lg:col-span-1">
                            {/* Sticking to top, rounded corners, reduced padding */}
                            <div className="bg-[#1E1E1E] rounded-xl shadow-2xl p-5 sticky top-4">
                                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Order Summary</h3>

                                <div className="space-y-3 pb-4"> {/* Reduced spacing */}
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Subtotal (2 Items)</span>
                                        <span>$150.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Shipping Estimate</span>
                                        <span>$7.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Taxes (Estimated)</span>
                                        <span>$12.00</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-gray-700">
                                    <span>Order Total</span>
                                    <span>$169.00</span>
                                </div>

                                {/* Checkout Button using the accent color */}
                                <button className={`w-full ${ACCENT_COLOR_CLASS} transition-all text-[#141313] font-bold py-3 px-4 rounded-lg mt-6 shadow-md`}>
                                    Secure Checkout
                                </button>

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