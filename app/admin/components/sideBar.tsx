'use client'
import { LayoutDashboard, ShoppingBag, Tag, Users, ClipboardList, LogOut, Package, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // remove user
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="bg-[#1E1E1E] text-white w-64 min-h-screen flex flex-col shadow-xl fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-accentTeal">Admin Panel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <ShoppingBag size={20} /> Products
        </Link>
          <Link href="/admin/stock" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <Package size={20} /> Stock Management
        </Link>
        <Link href="/admin/category" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <Tag size={20} /> Categories
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <ClipboardList size={20} /> Orders
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <Users size={20} /> Users
        </Link>
        <Link href="/admin/whishlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2A2A] transition">
          <Heart size={20} /> Wishlist
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
