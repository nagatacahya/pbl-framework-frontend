// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { tokenStorage } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, revenue: 0 });
  
  // State untuk Modal Update Stok (Poin 6 & 12)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = tokenStorage.getToken();
    if (!token) return router.push("/login");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
        const lowStock = json.data.filter((p: any) => p.stock < 10).length;
        const totalRev = json.data.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0);
        setStats({ total: json.data.length, lowStock, revenue: totalRev });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openStockModal = (product: any) => {
    setSelectedProducts([product]);
    setStockUpdates({ [product.id]: product.stock + 10 }); // Default tambah 10
    setIsStockModalOpen(true);
  };

  const handleSaveStock = async () => {
    const token = tokenStorage.getToken();
    const updates = selectedProducts.map((p) => ({
      id: p.id,
      newStock: stockUpdates[p.id],
    }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/bulk-update-stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ updates }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsStockModalOpen(false);
        setIsSuccessModalOpen(true); // Buka pop-up berhasil
        fetchData();
      } else {
        alert(json.message);
      }
    } catch (e) {
      alert("Koneksi gagal");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Ringkasan aktivitas dan performa Ikobana Frozen Food</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-blue-600 font-bold text-lg">📅</span>
            <span className="text-sm font-semibold text-gray-700">Hari ini: {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Produk</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h2>
            <p className="text-xs text-blue-600 font-semibold mt-2">+4 produk baru</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Stok Menipis</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.lowStock}</h2>
            <p className="text-xs text-red-600 font-semibold mt-2">Perhatian Segera</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Transaksi</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">1.248</h2>
            <p className="text-xs text-blue-600 font-semibold mt-2">+18.4% Bulan ini</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Pendapatan</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Rp {stats.revenue.toLocaleString('id-ID')}</h2>
            <p className="text-xs text-blue-600 font-semibold mt-2">+12.5% Bulan ini</p>
          </div>
        </div>

        {/* Produk Stok Menipis Table (Poin 6: Tombol Update Stok) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Produk Stok Menipis</h3>
            <button onClick={() => router.push("/transactions")} className="text-sm text-blue-600 font-semibold hover:underline">
              Lihat Semua Transaksi →
            </button>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-3 rounded-l-lg">Nama Produk</th>
                <th className="p-3">Stok</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.stock < 10).map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                  <td className="p-3 font-bold text-red-600">{p.stock} box</td>
                  <td className="p-3">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">Stok Menipis</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openStockModal(p)} className="bg-white border border-gray-200 text-blue-600 font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                      Update Stok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Pop-up Update Stok (Poin 6 & 12) */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[576px] overflow-hidden">
            <div className="bg-[#F0F3FF] p-6 flex justify-between items-center border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold bg-[#DBE1FF] text-[#00174B] px-2 py-0.5 rounded">IKOBANA FROZEN FOOD INVENTORY</span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Update Stok Produk</h2>
              </div>
              <button onClick={() => setIsStockModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-[#F0F3FF] p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{selectedProducts[0]?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">SKU: {selectedProducts[0]?.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Stok Saat Ini</p>
                  <p className="text-lg font-bold text-blue-600">{selectedProducts[0]?.stock} box</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Jumlah Penyesuaian Baru</label>
                <div className="flex items-center mt-1 bg-[#F0F3FF] rounded-lg p-2">
                  <input
                    type="number"
                    className="flex-1 bg-transparent border-none focus:outline-none font-bold text-gray-900 pl-2"
                    value={stockUpdates[selectedProducts[0]?.id] || 0}
                    onChange={(e) => setStockUpdates({ ...stockUpdates, [selectedProducts[0].id]: Number(e.target.value) })}
                  />
                  <span className="text-sm font-semibold text-gray-500 pr-2">box</span>
                </div>
              </div>

              <div className="bg-[#DEE8FF]/60 p-3 rounded-lg flex items-center gap-2 text-sm text-gray-700">
                <span className="text-blue-600">📊</span> Proyeksi Total Stok Akhir: <b>{stockUpdates[selectedProducts[0]?.id] || 0} box</b>
              </div>
            </div>

            <div className="bg-[#F0F3FF] p-6 flex justify-end gap-3">
              <button onClick={handleSaveStock} className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700">Simpan Update Stok</button>
              <button onClick={() => setIsStockModalOpen(false)} className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Berhasil Update Stok (Poin 12) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Update Berhasil!</h2>
            <div className="w-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold py-2 rounded-lg mb-6">
              ● Selamat datang di IKOBANA FROZEENFOOD
            </div>
            <button onClick={() => setIsSuccessModalOpen(false)} className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}