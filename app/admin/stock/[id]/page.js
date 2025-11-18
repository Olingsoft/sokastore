"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/admin/components/sideBar";
import { toast } from "sonner";
import { ArrowLeft, Package, Plus } from "lucide-react";

export default function StockManagePage() {
  const { id } = useParams();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    type: "in",
    quantity: "",
    unitPrice: "",
    reference: "",
    notes: "",
  });

  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}` }),
    []
  );

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, { headers: authHeader });
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);
      return data;
    } catch (e) {
      console.error(e);
      toast.error("Failed to load product");
      return null;
    }
  };

  const fetchHistory = async (targetPage = page) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/stock/product/${id}/history?page=${targetPage}&limit=10`, { headers: authHeader });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setHistory(list);
      setTotalPages(data?.totalPages || 1);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load history");
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProduct();
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, apiUrl]);

  const submitAdd = async (e) => {
    e.preventDefault();
    if (!form.quantity || !form.type) {
      toast.error("Quantity and type are required");
      return;
    }
    try {
      setAdding(true);
      const payload = {
        productId: Number(id),
        quantity: Number(form.quantity),
        type: form.type,
        reference: form.reference || undefined,
        notes: form.notes || undefined,
        unitPrice: form.unitPrice === "" ? undefined : Number(form.unitPrice),
      };
      const res = await fetch(`${apiUrl}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to add movement");
      }
      setForm({ type: "in", quantity: "", unitPrice: "", reference: "", notes: "" });
      const updated = await fetchProduct();
      const qty = updated && typeof updated.stockQuantity !== 'undefined' ? updated.stockQuantity : undefined;
      toast.success(qty !== undefined ? `Movement added. Current stock: ${qty}` : 'Movement added');
      fetchHistory(1);
      setPage(1);
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "Failed to add movement");
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (s) => new Date(s).toLocaleString();

  return (
    <div className="flex min-h-screen w-full bg-[#141313]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto ml-64">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/admin/stock')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft size={18} /> Back to Stock
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Package className="text-teal-400" size={24} />
                Manage Stock
              </h1>
              <p className="text-gray-400">{product ? `${product.name}${product.sku ? ` (${product.sku})` : ''}` : 'Loading product...'}</p>
            </div>
          </div>

          <div className="bg-[#1E1E1E] rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Add Movement</h2>
            <form onSubmit={submitAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type *</label>
                <select
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white"
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                <input
                  type="number"
                  min={1}
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white"
                  value={form.quantity}
                  onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white"
                  value={form.unitPrice}
                  onChange={(e) => setForm((p) => ({ ...p, unitPrice: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Reference</label>
                <input
                  type="text"
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white"
                  value={form.reference}
                  onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
                  placeholder="e.g., PO-0001 or SO-0004"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black font-medium rounded-lg"
                  disabled={adding}
                >
                  {adding ? 'Saving...' : 'Add Movement'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#1E1E1E] rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#2A2A2A]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1E1E1E] divide-y divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-gray-400">Loading history...</td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No history found</td>
                    </tr>
                  ) : (
                    history.map((m) => (
                      <tr key={m.id} className="hover:bg-[#2A2A2A]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(m.date)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${m.type === 'in' ? 'text-green-400' : 'text-red-400'}`}>{m.type?.toUpperCase?.() || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{m.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{m.reference || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{m.notes || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{m.runningBalance ?? '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 text-gray-300">
              <button
                onClick={() => { if (page > 1) { const p = page - 1; setPage(p); fetchHistory(p); } }}
                disabled={page <= 1}
                className="px-3 py-1 bg-[#2A2A2A] rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => { if (page < totalPages) { const p = page + 1; setPage(p); fetchHistory(p); } }}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-[#2A2A2A] rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

