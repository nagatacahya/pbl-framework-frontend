// app/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { tokenStorage } from "@/lib/api";
import { deleteTransactionAction } from "@/actions/transaction";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = tokenStorage.getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.success) setTransactions(json.data);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = tokenStorage.getToken() || "";
    const result = await deleteTransactionAction(deleteTarget.id, token);
    if (result.success) {
      setIsDeleteSuccess(true);
      setDeleteTarget(null);
      fetchTransactions();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monitoring Transaksi</h1>
            <p className="text-sm text-gray-500">Pantau seluruh transaksi yang masuk ke Ikobana Frozen Food</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F0F3FF] text-gray-500 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">ID Transaksi</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Total Bayar</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-bold text-blue-600">{trx.orderId}</td>
                  <td className="p-4 text-gray-600">{new Date(trx.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{trx.customerName}</p>
                    <p className="text-xs text-gray-500">{trx.customerPhone}</p>
                  </td>
                  <td className="p-4 font-bold text-gray-900">Rp {trx.totalPrice.toLocaleString("id-ID")}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${trx.status === "Berhasil" ? "bg-green-100 text-green-700" : trx.status === "Dibatalkan" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setDeleteTarget(trx)} className="text-red-600 text-xs font-bold hover:underline">Hapus</button>
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
            <button onClick={() => setIsDeleteSuccess(false)} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-4">Kembali</button>
          </div>
        </div>
      )}
    </div>
  );
}