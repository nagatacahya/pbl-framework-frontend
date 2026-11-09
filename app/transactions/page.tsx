// app/transactions/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useTransactions } from "@/hooks/use-transactions";
import { transactionService } from "@/services/transaction.service";

export default function TransactionsPage() {
  const { transactions, refresh } = useTransactions();
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [statusTarget, setStatusTarget] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ Helper untuk memperbaiki URL gambar (mengganti IP lama dengan IP baru dari .env.local)
  const getValidImageUrl = (url: string) => {
    if (!url) return "";
    const newApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const baseUrl = newApiUrl.replace("/api", ""); // Hapus /api di akhir
    
    // Ganti semua kemungkinan IP lama dengan IP baru
    return url
      .replace("http://localhost:5000", baseUrl)
      .replace("http://192.168.1.129:5000", baseUrl)
      .replace("http://10.200.118.253:5000", baseUrl)
      .replace("http://10.200.116.23:5000", baseUrl); // IP baru
  };

  const handleUpdateStatus = async () => {
    if (!statusTarget) return;
    await transactionService.updateStatus(statusTarget.id, newStatus);
    setStatusTarget(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await transactionService.delete(deleteTarget.id);
    setIsDeleteSuccess(true);
    setDeleteTarget(null);
    refresh();
  };

  const getStatusStyle = (status: string) => {
    if (status === "Selesai") return "bg-green-100 text-green-700";
    if (status === "Diproses") return "bg-blue-100 text-blue-700";
    if (status === "Dikirim") return "bg-purple-100 text-purple-700";
    if (status === "Dibatalkan") return "bg-red-100 text-red-700";
    return "bg-orange-100 text-orange-700";
  };

  const parseItems = (itemsString: string) => {
    try { return JSON.parse(itemsString).map((i: any) => `${i.productName} (${i.qty}x)`).join(", "); }
    catch { return "-"; }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      <main className="ml-[256px] flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900">Monitoring Transaksi</h1><p className="text-sm text-gray-500">Pantau seluruh transaksi yang masuk ke Ikobana Frozen Food</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F0F3FF] text-gray-500 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">ID Transaksi</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Produk Dipesan</th>
                <th className="p-4">Total Bayar</th>
                <th className="p-4 text-center">Bukti</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada transaksi masuk.</td></tr>
              ) : (
                transactions.map((trx: any) => (
                  <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4"><p className="font-bold text-blue-600">{trx.orderId}</p><p className="text-xs text-gray-500">{new Date(trx.createdAt).toLocaleDateString("id-ID")}</p></td>
                    <td className="p-4"><p className="font-semibold text-gray-800">{trx.customerName}</p><p className="text-xs text-gray-500">{trx.customerPhone}</p></td>
                    <td className="p-4 text-xs text-gray-600 max-w-[200px] truncate" title={parseItems(trx.items)}>{parseItems(trx.items)}</td>
                    <td className="p-4 font-bold text-gray-900">Rp {trx.totalPrice.toLocaleString("id-ID")}</td>
                    
                    {/* ✅ PERBAIKAN GAMBAR: Gunakan getValidImageUrl */}
                    <td className="p-4 text-center">
                      {trx.paymentProof ? (
                        <div className="relative w-12 h-12 mx-auto cursor-pointer group" onClick={() => setImagePreview(getValidImageUrl(trx.paymentProof))}>
                          <img 
                            src={getValidImageUrl(trx.paymentProof)} 
                            alt="Bukti" 
                            className="w-full h-full object-cover rounded-md border border-gray-200 group-hover:opacity-75 transition" 
                          />
                        </div>
                      ) : (<span className="text-xs text-gray-400 italic">-</span>)}
                    </td>

                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusStyle(trx.status)}`}>{trx.status}</span></td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setStatusTarget(trx); setNewStatus(trx.status); }} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-200">Ubah Status</button>
                        <button onClick={() => setDeleteTarget(trx)} className="text-red-600 text-xs font-bold hover:underline">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Gambar */}
      {imagePreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out" onClick={() => setImagePreview(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh]">
            <img src={imagePreview} alt="Bukti Transfer" className="w-full h-full object-contain rounded-lg" />
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
          </div>
        </div>
      )}

      {/* Modal Ubah Status */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ubah Status Pesanan</h2>
            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100"><p className="text-xs font-bold text-gray-500 mb-1">ID TRANSAKSI</p><p className="font-bold text-blue-600">{statusTarget.orderId}</p><p className="text-sm text-gray-600 mt-1">{statusTarget.customerName}</p></div>
            <label className="text-xs font-bold text-gray-700 mb-1">Pilih Status Baru</label>
            <select className="w-full p-2.5 bg-gray-50 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option><option value="Diproses">Diproses</option><option value="Dikirim">Dikirim</option><option value="Selesai">Selesai</option><option value="Dibatalkan">Dibatalkan</option>
            </select>
            <div className="flex gap-3">
              <button onClick={handleUpdateStatus} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700">Simpan Status</button>
              <button onClick={() => setStatusTarget(null)} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] shadow-2xl p-6 w-[338px] flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Hapus Transaksi?</h2>
            <p className="text-[13px] text-gray-500 mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-lg">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg">Iya</button>
            </div>
          </div>
        </div>
      )}

      {/* Berhasil Hapus */}
      {isDeleteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Berhasil Dihapus</h2>
            <button onClick={() => setIsDeleteSuccess(false)} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-4">Kembali</button>
          </div>
        </div>
      )}
    </div>
  );
}