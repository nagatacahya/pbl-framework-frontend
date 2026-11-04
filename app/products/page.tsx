// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { tokenStorage } from "@/lib/api";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // State Modal Hapus (Poin 16)
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  // State Modal Update Stok Massal (Poin 7)
  const [isBulkStockModalOpen, setIsBulkStockModalOpen] = useState(false);
  const [bulkUpdates, setBulkUpdates] = useState<Record<string, number>>({});
  const [isStockSuccess, setIsStockSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    const json = await res.json();
    if (json.success) setProducts(json.data);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = tokenStorage.getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsDeleteSuccess(true); // Tampilkan pop-up berhasil
      } else {
        alert("Gagal menghapus");
      }
    } catch (e) {
      alert("Koneksi gagal");
    }
  };

  const openBulkStock = () => {
    if (selectedIds.length === 0) {
      alert("Pilih minimal satu produk untuk diatur stoknya!"); // Poin 7
      return;
    }
    const initialUpdates: Record<string, number> = {};
    selectedIds.forEach(id => {
      const p = products.find(prod => prod.id === id);
      initialUpdates[id] = p.stock;
    });
    setBulkUpdates(initialUpdates);
    setIsBulkStockModalOpen(true);
  };

  const handleSaveBulkStock = async () => {
    const token = tokenStorage.getToken();
    const updates = selectedIds.map(id => ({ id, newStock: bulkUpdates[id] }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/bulk-update-stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ updates }),
      });
      if (res.ok) {
        setIsBulkStockModalOpen(false);
        setIsStockSuccess(true);
        setSelectedIds([]);
        fetchProducts();
      }
    } catch (e) {
      alert("Gagal update stok");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produk & Stok</h1>
            <p className="text-sm text-gray-500">Kelola semua produk frozen food</p>
          </div>
          <div className="flex gap-3">
            <button onClick={openBulkStock} className="bg-white border border-gray-200 text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">
              Atur Stok Cepat
            </button>
            <Link href="/products/add" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">
              + Tambah Produk
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F0F3FF] text-gray-500 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4 w-10"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? products.map(p => p.id) : [])} /></th>
                <th className="p-4">Produk</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sku}</p>
                  </td>
                  <td className="p-4 font-semibold">Rp {p.price.toLocaleString("id-ID")}</td>
                  <td className="p-4 font-bold">{p.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock > 10 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock > 10 ? "Tersedia" : p.stock > 0 ? "Stok Menipis" : "Habis"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setDeleteTarget(p)} className="text-red-600 text-xs font-bold hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Pop-up Konfirmasi Hapus (Poin 16) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] shadow-2xl p-6 w-[338px] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">!</div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Pemberitahuan</h2>
            <p className="text-[13px] text-gray-500 mb-6">Apakah Anda yakin ingin Menghapus Item ini?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-lg">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg">Iya</button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Berhasil Hapus (Poin 16) */}
      {isDeleteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Item Berhasil Dihapus</h2>
            <button onClick={() => { setIsDeleteSuccess(false); setDeleteTarget(null); fetchProducts(); }} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-4">Kembali</button>
          </div>
        </div>
      )}

      {/* Pop-up Bulk Update Stok (Poin 7 & 12) */}
      {isBulkStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[576px] max-h-[80vh] overflow-y-auto">
             <div className="bg-[#F0F3FF] p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-gray-900">Atur Stok Cepat</h2>
              <button onClick={() => setIsBulkStockModalOpen(false)} className="text-gray-400 font-bold">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {selectedIds.map(id => {
                const p = products.find(prod => prod.id === id);
                return (
                  <div key={id} className="bg-[#F0F3FF] p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Stok Awal: {p.stock}</p>
                    </div>
                    <input
                      type="number"
                      className="w-24 p-2 rounded-lg border border-gray-200 text-center font-bold"
                      value={bulkUpdates[id] || 0}
                      onChange={(e) => setBulkUpdates({ ...bulkUpdates, [id]: Number(e.target.value) })}
                    />
                  </div>
                )
              })}
            </div>
            <div className="bg-[#F0F3FF] p-6 flex justify-end gap-3">
              <button onClick={handleSaveBulkStock} className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg">Simpan Update Stok</button>
              <button onClick={() => setIsBulkStockModalOpen(false)} className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Berhasil Update Stok */}
      {isStockSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Update Berhasil!</h2>
            <div className="w-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold py-2 rounded-lg mb-6">● Selamat datang di IKOBANA FROZEENFOOD</div>
            <button onClick={() => setIsStockSuccess(false)} className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl">Kembali</button>
          </div>
        </div>
      )}
    </div>
  );
}