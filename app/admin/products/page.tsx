'use client';
import Sidebar from "../components/sideBar";
import Header from "../components/header";

import { Pencil, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const router = useRouter();
  
  const products = [
    {
      id: 1,
      name: "Chelsea Home Jersey 2025",
      category: "Football Jerseys",
      price: 79,
      stock: 45,
      image: "/images/chelsea-jersey.png",
    },
    {
      id: 2,
      name: "Liverpool Away Jersey 2025",
      category: "Football Jerseys",
      price: 69,
      stock: 30,
      image: "/images/liverpool-jersey.png",
    },
    {
      id: 3,
      name: "Man United Home Jersey 2025",
      category: "Football Jerseys",
      price: 75,
      stock: 20,
      image: "/images/manutd-jersey.png",
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
        <Header />

        <section className="p-8">
          {/* Top Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Manage Products</h1>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-[#2A2A2A] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-accentTeal focus:border-accentTeal outline-none"
              />
              <select
                className="bg-[#2A2A2A] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-accentTeal focus:border-accentTeal outline-none"
                defaultValue="all"
              >
                <option value="all">All Categories</option>
                <option value="football">Football Jerseys</option>
                <option value="basketball">Basketball Jerseys</option>
                <option value="training">Training Kits</option>
              </select>
              <Link href='/admin/products/add'>
              <button className="flex items-center gap-2 bg-accentTeal hover:bg-teal-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition">
                <PlusCircle className="w-5 h-5" /> Add Product
              </button>
              </Link>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-6 overflow-x-auto">
            <table className="min-w-full text-gray-300 text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                  <th className="py-3 text-left">Image</th>
                  <th className="py-3 text-left">Product Name</th>
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Stock</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-700 hover:bg-[#2A2A2A] transition"
                  >
                    <td className="py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>
                      {product.stock > 10 ? (
                        <span className="text-green-400 font-medium">{product.stock} in stock</span>
                      ) : (
                        <span className="text-red-400 font-medium">Low ({product.stock})</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                          className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-blue-600/30 transition"
                          title="Edit Product"
                        >
                          <Pencil className="w-5 h-5 text-blue-400" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-red-600/30 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
