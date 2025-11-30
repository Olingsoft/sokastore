'use client';
import Sidebar from "../../components/sideBar";
import Header from "../../components/header";
import { Zap, CheckCircle, XCircle, ArrowLeft, Save, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Helper function to construct full image URLs
const getFullImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/images/jersey1.jpg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
  const normalizedPath = imagePath.replace(/^\/|\/public\//, '');
  return `${baseUrl}/${normalizedPath}`;
};

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
  internalId: number; // Added for API operations
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  date: string;
  total: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  pickupAddress?: string;
  deliveryType?: string;
  deliveryZone?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionId?: string;
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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Try to find order by orderNumber
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        const foundOrder = data.orders?.find((o: any) => o.orderNumber === orderId);

        if (foundOrder) {
          const mappedOrder: Order = {
            internalId: foundOrder.id, // Database ID
            id: foundOrder.orderNumber,
            customer: foundOrder.customerName,
            email: foundOrder.customerEmail,
            phone: foundOrder.customerPhone,
            date: new Date(foundOrder.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            total: `$${Number(foundOrder.totalAmount).toFixed(2)}`,
            status: foundOrder.orderStatus,
            deliveryType: foundOrder.deliveryType,
            deliveryZone: foundOrder.deliveryZone,
            pickupAddress: foundOrder.deliveryType === 'delivery'
              ? foundOrder.deliveryAddress
              : 'Pickup',
            paymentMethod: foundOrder.paymentMethod,
            paymentStatus: foundOrder.paymentStatus,
            transactionId: foundOrder.transactionId,
            items: (foundOrder.items || []).map((item: any) => {
              const itemCustomization: Customization = {};
              if (item.customization) {
                try {
                  const parsed = typeof item.customization === 'string'
                    ? JSON.parse(item.customization)
                    : item.customization;

                  // Handle both formats (playerName/playerNumber vs name/number)
                  if (parsed.playerName) itemCustomization.name = parsed.playerName;
                  if (parsed.playerNumber) itemCustomization.number = parsed.playerNumber;
                  if (parsed.name) itemCustomization.name = parsed.name;
                  if (parsed.number) itemCustomization.number = parsed.number;
                } catch (e) {
                  console.error('Error parsing customization:', e);
                }
              }

              return {
                name: item.productName,
                price: Number(item.price),
                qty: item.quantity,
                img: getFullImageUrl(item.productImage),
                customization: Object.keys(itemCustomization).length > 0 ? itemCustomization : undefined
              };
            })
          };

          setOrder(mappedOrder);
          setSelectedStatus(mappedOrder.status);
        } else {
          setError('Order not found');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order');
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handleStatusChange = (newStatus: Order['status']) => {
    setSelectedStatus(newStatus);
  };

  const handleSaveStatus = async () => {
    if (!order || !selectedStatus) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');

      // Update order status via API using internalId
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.internalId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentStatus: selectedStatus === 'delivered' ? 'paid' : 'pending',
          orderStatus: selectedStatus
        })
      });

      if (response.ok) {
        setOrder({ ...order, status: selectedStatus });
        alert('Order status updated successfully!');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setIsSaving(false);
    }
  };

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
                <p className="text-gray-400">Loading order...</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!order || error) {
    return (
      <div className="flex w-full ">
        <Sidebar />
        <main className="ml-64 flex-1 w-full min-h-screen bg-[#141313] text-white">
          <Header />
          <section className="p-8 w-full">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-gray-400 mb-6">{error || "The order you're looking for doesn't exist."}</p>
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
    <div className="flex w-full">
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
                {order.email && <p className="text-sm text-gray-400">{order.email}</p>}
                {order.phone && <p className="text-sm text-gray-400">{order.phone}</p>}
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
                <StatusBadge status={order.status} />
              </div>
              <div className="text-sm">
                <p className="text-gray-400 font-medium">Payment Method</p>
                <p className="text-lg font-semibold capitalize">{order.paymentMethod || 'N/A'}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 font-medium">Payment Status</p>
                <p className="text-lg font-semibold capitalize">{order.paymentStatus || 'N/A'}</p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-300">Delivery Details</h3>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Delivery Type</p>
                    <p className="font-medium capitalize">{order.deliveryType || 'N/A'}</p>
                  </div>
                  {order.deliveryZone && (
                    <div>
                      <p className="text-gray-400 text-sm">Delivery Zone</p>
                      <p className="font-medium">{order.deliveryZone}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="font-medium">{order.pickupAddress || "N/A"}</p>
                  </div>
                  {order.transactionId && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Transaction ID</p>
                      <p className="font-medium font-mono text-teal-400">{order.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Section */}
            <h3 className="text-xl font-semibold mb-3 text-gray-300">Ordered Items ({order.items.length})</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/jersey1.jpg';
                    }}
                  />

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
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✓ Confirmed</option>
                      <option value="processing">⚙️ Processing</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">✅ Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
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
