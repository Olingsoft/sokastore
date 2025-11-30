'use client';
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import { Eye, Trash2, Search, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- UPDATED INTERFACES ---

interface Customization {
  name?: string;
  number?: string;
}

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  img: string;
  customization?: Customization;
}

interface Order {
  internalId: number; // Added for API operations
  id: string; // Display ID (Order Number)
  customer: string;
  date: string;
  total: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  pickupAddress?: string;
  email?: string;
  phone?: string;
}

// --- Status Styling Map ---
const statusStyles: Record<Order['status'], string> = {
  'pending': 'bg-yellow-600/30 text-yellow-400',
  'confirmed': 'bg-blue-600/30 text-blue-400',
  'processing': 'bg-purple-600/30 text-purple-400',
  'shipped': 'bg-cyan-600/30 text-cyan-400',
  'delivered': 'bg-green-600/30 text-green-400',
  'cancelled': 'bg-red-600/30 text-red-400',
};


export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();

        // Map API response to component format
        const mappedOrders: Order[] = (data.orders || []).map((order: any) => ({
          internalId: order.id, // Database ID
          id: order.orderNumber, // Display ID
          customer: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          date: new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          total: `$${Number(order.totalAmount).toFixed(2)}`,
          status: order.orderStatus,
          pickupAddress: order.deliveryType === 'delivery'
            ? order.deliveryAddress
            : 'Pickup',
          items: (order.items || []).map((item: any) => {
            const customization: Customization = {};
            if (item.customization) {
              try {
                const parsed = typeof item.customization === 'string'
                  ? JSON.parse(item.customization)
                  : item.customization;

                // Handle both formats
                if (parsed.playerName) customization.name = parsed.playerName;
                if (parsed.playerNumber) customization.number = parsed.playerNumber;
                if (parsed.name) customization.name = parsed.name;
                if (parsed.number) customization.number = parsed.number;
              } catch (e) {
                console.error('Error parsing customization:', e);
              }
            }

            return {
              name: item.productName,
              price: Number(item.price),
              qty: item.quantity,
              img: item.productImage || '/images/jersey1.jpg',
              customization: Object.keys(customization).length > 0 ? customization : undefined
            };
          })
        }));

        setOrders(mappedOrders);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleView = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleDeleteOrder = async (internalId: number) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${internalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.internalId !== internalId));
        alert('Order deleted successfully');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete order');
      }
    } catch (error: any) {
      console.error('Error deleting order:', error);
      alert(error.message || 'Failed to delete order');
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex w-full">
        <Sidebar />
        <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
          <Header />
          <section className="p-8">
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="w-12 h-12 text-teal-400 animate-spin" />
                <p className="text-gray-400">Loading orders...</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full">
        <Sidebar />
        <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
          <Header />
          <section className="p-8">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Error Loading Orders</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex w-full">
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
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-[#2A2A2A] transition">
                      <td className="px-6 py-3 font-medium">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.total}</td>
                      <td className="py-3">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(order)}
                            className="p-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-600/30 transition"
                            title="View Order"
                          >
                             <Eye size={18} className="text-blue-400" /> Open
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}