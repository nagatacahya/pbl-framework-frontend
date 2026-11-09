// app/transactions/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { transactionService } from "@/services/transaction.service";
import { Transaction } from "@/types";

export default function TransactionDetail() {
  const params = useParams();
  const transactionId = String(params.id);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await transactionService.getAll();
        if (res.success) {
          const found = res.data.find((t: Transaction) => t.orderId === transactionId || t.id === transactionId);
          if (found) { setTransaction(found); setStatus(found.status); }
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchDetail();
  }, [transactionId]);

  const handleUpdateStatus = async () => {
    if (!transaction) return;
    await transactionService.updateStatus(transaction.id, status);
    alert("Status transaksi berhasil diperbarui!");
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat Detail Transaksi...</div>;
  if (!transaction) return <div className="p-8"><h1 className="text-2xl font-bold">Transaksi Tidak Ditemukan</h1><Link href="/transactions" className="text-blue-600 font-semibold hover:underline mt-4 inline-block">← Kembali</Link></div>;

  let products = [];
  try { products = JSON.parse(transaction.items || "[]"); } catch (e) { products = []; }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">Detail Transaksi</h1><p className="text-sm text-gray-500">Informasi lengkap transaksi pelanggan</p></div></header>
      <Link href="/transactions" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">← Kembali ke Transaksi</Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-start mb-4"><div><h2 className="text-xl font-bold text-gray-900">{transaction.orderId}</h2><p className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleString("id-ID")}</p></div><span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">{status}</span></div>
        <div className="mt-4"><p className="text-xs font-bold text-gray-500 mb-2">BUKTI TRANSFER</p>{transaction.paymentProof ? <img src={transaction.paymentProof} alt="Bukti Transfer" className="w-full max-w-md h-64 object-contain border rounded-lg bg-gray-50" /> : <p className="text-sm text-red-500">Belum ada bukti transfer.</p>}</div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-900 mb-4">Informasi Pelanggan</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Nama</span><strong>{transaction.customerName}</strong></div><div className="flex justify-between"><span className="text-gray-500">Telepon</span><strong>{transaction.customerPhone}</strong></div></div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-900 mb-4">Alamat Pengiriman</h3><p className="text-sm text-gray-700 leading-relaxed">{transaction.customerAddress}</p></div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Update Status Transaksi</h3>
        <div className="flex gap-4 items-center">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="Menunggu Verifikasi">Menunggu Verifikasi</option><option value="Diproses">Diproses</option><option value="Dikirim">Dikirim</option><option value="Selesai">Selesai</option><option value="Dibatalkan">Dibatalkan</option></select>
          <button onClick={handleUpdateStatus} className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700">Update Status</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Produk yang Dibeli</h3>
        {products.length === 0 ? <p className="text-sm text-gray-500">Tidak ada data produk.</p> : (
          <div className="space-y-4">{products.map((product: any, index: number) => (
            <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">🍗</div><div><strong className="text-gray-900">{product.productName}</strong><p className="text-sm text-gray-500">{product.qty} × {product.price}</p></div></div><strong className="text-gray-900">{product.price}</strong></div>
          ))}</div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
        <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Metode Pembayaran</span><strong>{transaction.paymentMethod}</strong></div><div className="flex justify-between border-t pt-2 mt-2"><span className="font-bold text-gray-900">Total Pembayaran</span><strong className="text-blue-600 text-lg">Rp {transaction.totalPrice.toLocaleString("id-ID")}</strong></div></div>
      </div>
    </div>
  );
}