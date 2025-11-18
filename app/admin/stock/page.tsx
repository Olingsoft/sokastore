'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/app/admin/components/sideBar';
import { toast } from 'sonner';
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StockMovement {
  id: number;
  productId: number;
  quantity: number;
  type: 'in' | 'out';
  reference?: string;
  notes?: string | null;
  unitPrice?: number | null;
  date: string;
  Product?: { id: number; name: string; sku?: string };
}

interface ProductItem {
  id: number;
  name: string;
  sku?: string;
}

export default function StockPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();

  const [products, setProducts] = useState<(ProductItem & { stockQuantity?: number })[]>([]);
  const [pLoading, setPLoading] = useState(true);

  // listing view only; per-product management lives at /admin/stock/[id]

  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` }),
    []
  );

  const fetchProducts = async () => {
    try {
      setPLoading(true);
      const res = await fetch(`${apiUrl}/products`, { headers: authHeader });
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      const list: any[] = Array.isArray(json?.data) ? json.data : [];
      // Fetch authoritative stock levels and merge
      let byId: Record<number, number> = {};
      try {
        const lvlRes = await fetch(`${apiUrl}/stock/products/levels`, { headers: authHeader });
        if (lvlRes.ok) {
          const levels = await lvlRes.json();
          if (Array.isArray(levels)) {
            for (const it of levels) {
              if (typeof it?.id !== 'undefined') byId[it.id] = Number(it.stockQuantity ?? 0);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch stock levels, will use product stockQuantity fields where present');
      }
      const mapped = list.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stockQuantity: typeof byId[p.id] !== 'undefined' ? byId[p.id] : Number(p.stockQuantity ?? 0),
      }));
      setProducts(mapped);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setPLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  return (
    <div className="flex min-h-screen w-full bg-[#141313]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Package className="text-teal-400" size={28} />
                Stock Management
              </h1>
              <p className="text-gray-400">View products and manage stock movements</p>
            </div>
          </div>
          <div className="bg-[#1E1E1E] rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#2A2A2A]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1E1E1E] divide-y divide-gray-800">
                  {pLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-gray-400">Loading products...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No products found</td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#2A2A2A]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{p.sku || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{p.stockQuantity ?? 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => router.push(`/admin/stock/${p.id}`)}
                              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-black rounded-lg"
                              title="Add Movement"
                            >
                              Manage
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
