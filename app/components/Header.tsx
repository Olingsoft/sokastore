'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Search, Menu as MenuIcon, X, User, ShoppingCart, LogOut, UserCircle, Package } from 'lucide-react';
import { useCart } from "../context/CartContext";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { cartCount, refreshCart } = useCart();

  useEffect(() => {
    // Check if user is logged in
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        refreshCart();
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
    setOpen(false);
    refreshCart();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  return (
    <header className="bg-[#0a0f0a] text-white border-b border-gray-800 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="w-full flex justify-center text-center gap-5 p-2 bg-green-800">
        <span className="text-sm">tell : +25769210601</span>
        <span className="text-white text-sm">whatsapp: +254769210601</span>
      </div>

      {/* Main Header */}
      <div className="container mx-auto flex justify-between items-center p-4 gap-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden text-white hover:text-green-400"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-green-400 whitespace-nowrap">
          Soka<span className="text-white">Store<span className="text-sm">.ke</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6">
          <Link href="/" className="hover:text-green-400 transition">Home</Link>
          <Link href="/shop" className="hover:text-green-400 transition">Shop</Link>
          <Link href="/collections" className="hover:text-green-400 transition">Collections</Link>
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1e1e1e] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </form>

        {/* Auth & Cart - Desktop */}
        <div className="flex items-center space-x-4">
          {user ? (
            <HeadlessMenu as="div" className="relative">
              <HeadlessMenu.Button className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors">
                <UserCircle className="w-6 h-6" />
                <span className="hidden sm:inline">Account</span>
              </HeadlessMenu.Button>
              <Transition
                as="div"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] rounded-md shadow-lg py-1 z-50 border border-gray-700">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/account"
                        className={`${active ? 'bg-gray-800' : ''
                          } flex items-center px-4 py-2 text-sm text-white`}
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/orders"
                        className={`${active ? 'bg-gray-800' : ''
                          } flex items-center px-4 py-2 text-sm text-white`}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-gray-800' : ''
                          } w-full text-left px-4 py-2 text-sm text-white flex items-center`}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </HeadlessMenu.Items>
              </Transition>
            </HeadlessMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white hover:text-green-400 transition-colors whitespace-nowrap hidden sm:inline"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap hidden sm:inline-flex items-center"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/cart"
            className="text-white hover:text-green-400 transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#0a0f0a] border-t border-gray-800">
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-800">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#1e1e1e] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col py-4 space-y-1">
            <Link href="/" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/shop" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>
              Shop
            </Link>
            <Link href="/collections" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>
              Collections
            </Link>

            {user ? (
              <>
                <Link href="/account" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition flex items-center" onClick={() => setOpen(false)}>
                  <UserCircle className="w-5 h-5 mr-2" /> My Account
                </Link>
                <Link href="/orders" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition flex items-center" onClick={() => setOpen(false)}>
                  <Package className="w-5 h-5 mr-2" /> My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:text-red-400 transition flex items-center"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}