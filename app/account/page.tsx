'use client';

import React, { useState } from 'react';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { UserCircleIcon, ShoppingBagIcon, HeartIcon, MapPinIcon, LockClosedIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

// --- 1. Define Section Key Type ---
type SectionKey = 'Dashboard' | 'Orders' | 'Wishlist' | 'Addresses' | 'Security' | 'SignOut';

// --- 2. Define the Type for Navigation Items ---
interface AccountSection {
    name: string;
    // Simplified icon type using React.ComponentType
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    component: SectionKey; // Use the strict literal type here
}

// Define the navigation items
const accountSections: AccountSection[] = [
    { name: 'Dashboard', icon: UserCircleIcon, component: 'Dashboard' },
    { name: 'Order History', icon: ShoppingBagIcon, component: 'Orders' },
    { name: 'Saved Items', icon: HeartIcon, component: 'Wishlist' },
    { name: 'Shipping Addresses', icon: MapPinIcon, component: 'Addresses' },
    { name: 'Security & Privacy', icon: LockClosedIcon, component: 'Security' },
    { name: 'Sign Out', icon: ArrowLeftOnRectangleIcon, component: 'SignOut' },
];

// Reusable dummy components for content
const DashboardContent = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Welcome Back, User!</h3>
        <p className="text-gray-400">Quick links to manage your account details and view recent activity.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quick Stats/Actions */}
            <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Recent Orders</p>
                <p className="text-2xl font-bold text-teal-400">3</p>
            </div>
            <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Saved Items</p>
                <p className="text-2xl font-bold text-teal-400">12</p>
            </div>
        </div>
        <button className="text-sm font-medium text-teal-400 hover:text-white transition-colors pt-2">
            View Order History &rarr;
        </button>
    </div>
);

const OrdersContent = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Your Orders</h3>
        <div className="bg-[#1E1E1E] p-4 rounded-lg">
            <p className="font-semibold">Order #20251021</p>
            <p className="text-sm text-gray-400">Date: Oct 21, 2025 | Total: $169.00</p>
            <span className="text-xs font-medium text-teal-400 bg-teal-900/30 px-2 py-1 rounded mt-2 inline-block">Shipped</span>
        </div>
        <p className="text-gray-500 text-sm">No older orders found.</p>
    </div>
);

const SecurityContent = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Security Settings</h3>
        <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">Change Password</label>
            <input type="password" placeholder="New Password" className="w-full bg-[#2A2A2A] border border-gray-700 text-white rounded-md py-2 px-3 text-sm focus:ring-teal-400 focus:border-teal-400" />
            <button className="bg-teal-400 hover:bg-teal-500 text-[#141313] font-semibold py-2 px-4 rounded-md text-sm mt-3 transition">
                Update Password
            </button>
        </div>
        <p className="text-gray-500 text-sm">Two-factor authentication is currently disabled.</p>
    </div>
);

const ContentMap: Record<SectionKey, () => React.JSX.Element> = {
    Dashboard: DashboardContent,
    Orders: OrdersContent,
    Wishlist: () => <h3 className="text-xl font-semibold text-white">Your Wishlist (3 Items)</h3>,
    Addresses: () => <h3 className="text-xl font-semibold text-white">Manage Addresses</h3>,
    Security: SecurityContent,
    SignOut: () => <h3 className="text-xl font-semibold text-red-500">Signing Out...</h3>,
};

export default function AccountPage() {
    // --- 3. Initial State is correctly typed ---
    const [activeSection, setActiveSection] = useState<SectionKey>('Dashboard');
    const ActiveComponent = ContentMap[activeSection];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="bg-[#141313] text-white py-10 px-4 sm:px-6 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-3">My Account</h1>

                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* 1. Sidebar Navigation (Compact and Sticky) */}
                            <nav className="lg:w-60 flex-shrink-0">
                                {/* Navigation for small screens (scrollable pills) */}
                                <div className="lg:hidden flex space-x-2 overflow-x-auto pb-4 -mx-4 px-4 border-b border-gray-800">
                                    {/* --- FIX APPLIED HERE --- */}
                                    {accountSections.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => setActiveSection(item.component)} // item.component is already SectionKey
                                            className={`
                                                flex items-center text-sm font-medium py-2 px-4 rounded-full whitespace-nowrap transition-colors duration-200
                                                ${activeSection === item.component
                                                    ? 'bg-teal-400 text-[#141313] font-bold shadow-md'
                                                    : 'bg-[#1E1E1E] text-gray-300 hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            <item.icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Navigation for large screens (vertical menu) */}
                                <div className="hidden lg:block bg-[#1E1E1E] rounded-xl shadow-lg p-3 space-y-1 sticky top-4">
                                    {/* --- FIX APPLIED HERE --- */}
                                    {accountSections.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => setActiveSection(item.component)} // item.component is already SectionKey
                                            className={`
                                                w-full flex items-center text-left text-sm py-2 px-3 rounded-lg transition-colors duration-200
                                                ${activeSection === item.component
                                                    ? 'bg-teal-400 text-[#141313] font-bold'
                                                    : 'text-gray-300 hover:bg-[#2A2A2A]'
                                                }
                                                ${item.component === 'SignOut' ? 'text-red-400 hover:bg-red-900/20' : ''}
                                            `}
                                        >
                                            <item.icon className="w-5 h-5 mr-3" />
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            {/* 2. Main Content Area */}
                            <div className="flex-1 bg-[#1E1E1E] rounded-xl shadow-lg p-6 lg:p-8 border border-gray-800">
                                {ActiveComponent && <ActiveComponent />}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}