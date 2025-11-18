'use client';
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import { Eye, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// --- UPDATED INTERFACES ---

interface Customization {
  name?: string;
  number?: string;
  // Add other potential customization fields here (e.g., "color", "logo_placement")
}

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  img: string;
  customization?: Customization; // Added customization field
}

interface Order {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: 'Completed' | 'Pending' | 'Shipped' | 'Cancelled'; // Use literal types for status
  items: OrderItem[];
  pickupAddress?: string;
}

// --- Status Styling Map ---
const statusStyles: Record<Order['status'], string> = {
    'Completed': 'bg-green-600/30 text-green-400',
    'Pending': 'bg-yellow-600/30 text-yellow-400',
    'Shipped': 'bg-blue-600/30 text-blue-400',
    'Cancelled': 'bg-red-600/30 text-red-400',
};


export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#ORD-101",
      customer: "John Doe",
      date: "2025-11-05",
      total: "$150",
      status: "Completed",
      items: [
        { 
            name: "Red Hoodie", 
            price: 50, 
            qty: 1, 
            img: "/products/hoodie.jpg",
            customization: { name: "JDoe", number: "10" } // Customization added
        },
        { 
            name: "Black Sneakers", 
            price: 100, 
            qty: 1, 
            img: "/products/sneakers.jpg" 
        },
      ],
      pickupAddress: "123 Main St, New York, NY 10001",
    },
    {
      id: "#ORD-102",
      customer: "Jane Smith",
      date: "2025-11-06",
      total: "$89",
      status: "Pending",
      items: [
        { 
            name: "Blue Dress", 
            price: 89, 
            qty: 1, 
            img: "/products/dress.jpg",
            customization: { name: "Jane" } // Only name customization
        },
      ],
      pickupAddress: "456 Oak Ave, Los Angeles, CA 90001",
    },
    {
        id: "#ORD-103",
        customer: "Alice Johnson",
        date: "2025-11-07",
        total: "$220",
        status: "Shipped",
        items: [
          { 
              name: "Team Jersey", 
              price: 110, 
              qty: 2, 
              img: "/products/jersey.jpg",
              customization: { name: "Alice", number: "7" } // Name and Number
          },
        ],
        pickupAddress: "789 Pine Ln, Chicago, IL 60601",
    },
    {
        id: "#ORD-104",
        customer: "Bob Brown",
        date: "2025-11-08",
        total: "$35",
        status: "Cancelled",
        items: [
          { 
              name: "Plain T-Shirt", 
              price: 35, 
              qty: 1, 
              img: "/products/tshirt.jpg",
          }, // No customization
        ],
        pickupAddress: "999 Elm Rd, Houston, TX 77001",
    },
  ]);

  const handleView = (order: Order) => {
    // Remove # from order ID for URL
    const orderId = order.id.replace('#', '');
    router.push(`/admin/orders/${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
  );

  // --- Utility Component for Status Badge ---
  const StatusBadge = ({ status }: { status: Order['status'] }) => {
    return (
        <span 
            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
  };


  return (
    <div className="flex w-full">
      {/* ... (Sidebar and Header remain the same) ... */}
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
        <Header />

        <section className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Manage Orders</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#1E1E1E] border border-gray-700 text-sm text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-400 w-64"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-[#2A2A2A] text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-[#2A2A2A] transition">
                    <td className="px-6 py-3 font-medium">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{order.total}</td>
                    <td className="py-3">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(order)}
                          className="p-1.5 rounded-lg hover:bg-blue-600/30 transition"
                          title="View Order"
                        >
                          <Eye size={18} className="text-blue-400" />
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 rounded-lg hover:bg-red-600/30 transition"
                          title="Delete Order"
                        >
                          <Trash2 size={18} className="text-red-500" />
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