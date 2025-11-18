'use client';
import Sidebar from "../../components/sideBar";
import Header from "../../components/header";
import { Zap, CheckCircle, XCircle, ArrowLeft, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// --- INTERFACES ---
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
  id: string;
  customer: string;
  date: string;
  total: string;
  status: 'Completed' | 'Pending' | 'Shipped' | 'Cancelled';
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

// Mock orders data - in production, this would come from an API
const mockOrders: Order[] = [
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
        customization: { name: "JDoe", number: "10" }
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
        customization: { name: "Jane" }
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
        customization: { name: "Alice", number: "7" }
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
      },
    ],
    pickupAddress: "999 Elm Rd, Houston, TX 77001",
  },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Find order by ID - remove # from orderId if present
    const cleanId = orderId.startsWith('#') ? orderId : `#${orderId}`;
    const foundOrder = mockOrders.find(o => o.id === cleanId || o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setSelectedStatus(foundOrder.status);
    }
  }, [orderId]);

  const handleStatusChange = (newStatus: Order['status']) => {
    setSelectedStatus(newStatus);
  };

  const handleSaveStatus = () => {
    if (!order || !selectedStatus) return;
    
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setOrder({ ...order, status: selectedStatus });
      setIsSaving(false);
      // In production, you would make an API call here to update the status
      // await updateOrderStatus(order.id, selectedStatus);
    }, 500);
  };

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

  // --- Utility Component for Customization Status ---
  const CustomizationStatus = ({ hasCustomization }: { hasCustomization: boolean }) => {
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${hasCustomization ? 'text-teal-400' : 'text-gray-400'}`}>
        {hasCustomization ? (
          <>
            <CheckCircle size={14} />
            Customized
          </>
        ) : (
          <>
            <XCircle size={14} />
            Standard
          </>
        )}
      </div>
    );
  };

  if (!order) {
    return (
      <div className="flex w-full">
        <Sidebar />
        <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
          <Header />
          <section className="p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-gray-400 mb-6">The order you're looking for doesn't exist.</p>
              <button
                onClick={() => router.push('/admin/orders')}
                className="bg-teal-500 hover:bg-teal-600 text-black px-6 py-3 rounded-lg font-bold"
              >
                Back to Orders
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
        <Header />

        <section className="p-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>

          {/* Order Details Container */}
          <div className="bg-[#1E1E1E] w-full rounded-xl p-8 border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-extrabold text-teal-400">Order {order.id}</h2>
            </div>

            {/* General Order Details - Aligned Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-b border-gray-700 pb-4 mb-6">
              <div className="text-sm">
                <p className="text-gray-400 font-medium">Customer</p>
                <p className="text-lg font-semibold">{order.customer}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 font-medium">Order Date</p>
                <p className="text-lg font-semibold">{order.date}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 font-medium">Order Total</p>
                <p className="text-2xl font-extrabold text-green-400">{order.total}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 font-medium mb-2">Status</p>
                
              </div>
            </div>
            
            {/* Pickup Address/Shipping */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-300">Location Details</h3>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Pickup/Shipping Address</p>
                <p className="font-medium">{order.pickupAddress || "N/A (Digital or Unknown)"}</p>
              </div>
            </div>

            {/* Items Section */}
            <h3 className="text-xl font-semibold mb-3 text-gray-300">Ordered Items ({order.items.length})</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
                  <img src={item.img} alt={item.name} className="w-20 h-20 rounded-lg object-cover border border-gray-600" />

                  <div className="flex-1">
                    <p className="font-bold text-lg text-white">{item.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.qty}</p>
                    <p className="text-teal-400 font-bold text-lg mt-1">${item.price}</p>
                  </div>

                  {/* Customization Details Block */}
                  <div className="w-40 ml-4 border-l border-gray-600 pl-4">
                    <div className="flex items-center gap-2 font-semibold mb-1 text-white">
                      <Zap size={16} className="text-yellow-400" />
                      Customization
                    </div>
                    <CustomizationStatus hasCustomization={!!item.customization} />

                    {item.customization && (
                      <div className="mt-2 space-y-1 text-sm">
                        {item.customization.name && (
                          <p className="text-gray-300">Name: <span className="font-medium text-white">{item.customization.name}</span></p>
                        )}
                        {item.customization.number && (
                          <p className="text-gray-300">Number: <span className="font-medium text-white">{item.customization.number}</span></p>
                        )}
                        {!item.customization.name && !item.customization.number && (
                          <p className="text-gray-500 italic">No specific details provided.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status Update Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1E1E1E] rounded-xl p-6 border border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Update Order Status</h3>
                    <p className="text-xs text-gray-400">Change the current order status</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${statusStyles[order.status]} border border-current/30`}>
                    <span className="text-xs font-semibold">Current: {order.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      New Status
                    </label>
                    <select
                      value={selectedStatus || order.status}
                      onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                      className="w-full bg-[#141313] border-2 border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none cursor-pointer font-medium transition-all hover:border-gray-500"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option 
                        value="Pending" 
                        className="bg-[#141313] text-yellow-400 py-2"
                      >
                        ⏳ Pending
                      </option>
                      <option 
                        value="Shipped" 
                        className="bg-[#141313] text-blue-400 py-2"
                      >
                        🚚 Shipped
                      </option>
                      <option 
                        value="Completed" 
                        className="bg-[#141313] text-green-400 py-2"
                      >
                        ✅ Completed
                      </option>
                      <option 
                        value="Cancelled" 
                        className="bg-[#141313] text-red-400 py-2"
                      >
                        ❌ Cancelled
                      </option>
                    </select>
                  </div>

                  {selectedStatus !== order.status && (
                    <div className="flex items-end">
                      <button
                        onClick={handleSaveStatus}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:scale-105 active:scale-95"
                      >
                        <Save size={18} className={isSaving ? 'animate-pulse' : ''} />
                        {isSaving ? 'Saving...' : 'Save Status'}
                      </button>
                    </div>
                  )}
                </div>

                {selectedStatus !== order.status && selectedStatus && (
                  <div className="mt-4 flex items-center gap-2 text-sm p-3 bg-[#141313]/50 rounded-lg border border-gray-700/50">
                    <div className={`w-2 h-2 rounded-full ${statusStyles[selectedStatus].split(' ')[0]} animate-pulse`}></div>
                    <span className="text-gray-400">
                      Status will change from <span className="font-semibold text-gray-300">{order.status}</span> to <span className={`font-semibold ${statusStyles[selectedStatus].split(' ')[1]}`}>{selectedStatus}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => router.push('/admin/orders')}
              className="w-full mt-8 bg-teal-500 hover:bg-teal-600 text-black py-3 rounded-xl font-bold text-lg transition duration-200 shadow-lg shadow-teal-500/30"
            >
              Back to Orders
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
