"use client";
import { useState, Fragment } from "react";
import { Menu, X, ShoppingBag, User, LogOut, Settings, UserCircle, Search, Grid3x3, Shirt, Loader, Activity, Sparkles } from "lucide-react";
import Link from "next/link";
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    // Redirect to login or home page after logout
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-[#0a0f0a] text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full flex justify-center text-center gap-5 p-2 bg-green-800">
        <span className="text-sm">tell : +25769210601</span>
        <span className="text-white text-sm">whatsapp: +254769210601</span>
      </div>
      <div className="container mx-auto flex justify-between items-center p-4 gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-green-400 whitespace-nowrap">
          Soka<span className="text-white">Store<span className="text-sm">.ke</span></span>
        </Link>

        {/* Desktop Menu - Reduced to just Home */}
        <nav className="hidden lg:flex gap-6">
          <Link href="/" className="hover:text-green-400 transition whitespace-nowrap">Home</Link>
        </nav>

        {/* Search Bar - Centered */}
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

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 hover:text-green-400 cursor-pointer transition" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
          </Link>
          
          {/* User Dropdown */}
          <HeadlessMenu as="div" className="relative">
            <div>
              <HeadlessMenu.Button className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-[#0a0f0a]">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <span className="hidden md:inline text-gray-300 hover:text-white">My Account</span>
              </HeadlessMenu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-700 rounded-md bg-[#1e1e1e] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-700">
                {/* Categories Section */}
                <div className="px-1 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</div>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/shop?category=collections"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Grid3x3 className="mr-2 h-5 w-5" aria-hidden="true" />
                        Collections
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/shop?category=football"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Activity className="mr-2 h-5 w-5" aria-hidden="true" />
                        Football
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/shop?category=rugby"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Shirt className="mr-2 h-5 w-5" aria-hidden="true" />
                        Rugby
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/shop?category=basketball"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                        Basketball
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/shop?category=volleyball"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Loader className="mr-2 h-5 w-5" aria-hidden="true" />
                        Volleyball
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                </div>
                
                {/* Account Section */}
                <div className="px-1 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/account/"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <UserCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                        Profile
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/account/"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
                        My Orders
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/account/"
                        className={`${
                          active ? 'bg-gray-800 text-white' : 'text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <Settings className="mr-2 h-5 w-5" aria-hidden="true" />
                        Settings
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                </div>
                <div className="px-1 py-1">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-red-600 text-white' : 'text-red-500'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                        Logout
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
          
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0f1410] border-t border-gray-800">
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
            <Link href="/" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/shop?category=collections" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>Collections</Link>
            <Link href="/shop?category=football" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>Football</Link>
            <Link href="/shop?category=rugby" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>Rugby</Link>
            <Link href="/shop?category=basketball" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>Basketball</Link>
            <Link href="/shop?category=volleyball" className="px-4 py-2 hover:bg-gray-800 hover:text-green-400 transition" onClick={() => setOpen(false)}>Volleyball</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

