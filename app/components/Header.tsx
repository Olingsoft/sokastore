"use client";
import { useState, Fragment } from "react";
import { Menu, X, ShoppingBag, User, LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    // Redirect to login or home page after logout
    router.push('/login');
  };

  return (
    <header className="bg-[#0a0f0a] text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-green-400">
          Jersey<span className="text-white">Hub</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="hover:text-green-400 transition">Home</Link>
          <Link href="/shop" className="hover:text-green-400 transition">Collections</Link>
          <Link href="/shop" className="hover:text-green-400 transition">Football</Link>
          <Link href="/shop" className="hover:text-green-400 transition">Rugby</Link>
          <Link href="/shop" className="hover:text-green-400 transition">Basketball</Link>
          <Link href="/shop" className="hover:text-green-400 transition">Volleyball</Link>
        </nav>

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
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-[#1e1e1e] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-700">
                <div className="px-1 py-1">
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
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link href="/" className="hover:text-green-400" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/collections" className="hover:text-green-400" onClick={() => setOpen(false)}>Collections</Link>
            <Link href="/about" className="hover:text-green-400" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="hover:text-green-400" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

