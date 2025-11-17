'use client';
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import { Eye, Trash2, UserCheck, UserX } from "lucide-react";

export default function AdminUsers() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joined: "2025-08-21",
      status: "Active",
      orders: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joined: "2025-06-10",
      status: "Inactive",
      orders: 3,
    },
    {
      id: 3,
      name: "Ali Karim",
      email: "ali@example.com",
      joined: "2025-05-30",
      status: "Active",
      orders: 8,
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
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Manage Customers</h1>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="bg-[#2A2A2A] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-accentTeal focus:border-accentTeal outline-none"
              />
              <select
                className="bg-[#2A2A2A] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-accentTeal focus:border-accentTeal outline-none"
                defaultValue="all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-6 overflow-x-auto">
            <table className="min-w-full text-gray-300 text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                  <th className="py-3 text-left">Customer Name</th>
                  <th className="py-3 text-left">Email</th>
                  <th className="py-3 text-left">Joined</th>
                  <th className="py-3 text-left">Orders</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 hover:bg-[#2A2A2A] transition"
                  >
                    <td className="py-3 font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joined}</td>
                    <td>{user.orders}</td>
                    <td>
                      {user.status === "Active" ? (
                        <span className="flex items-center gap-1 text-green-400 font-medium">
                          <UserCheck size={16} /> {user.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 font-medium">
                          <UserX size={16} /> {user.status}
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-3">
                        <button className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-accentTeal/20 transition">
                          <Eye className="w-5 h-5 text-accentTeal" />
                        </button>
                        <button className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-red-600/30 transition">
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
