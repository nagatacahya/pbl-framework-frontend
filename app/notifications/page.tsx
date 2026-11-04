// app/notifications/page.tsx
"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  const tabs = ["Semua (128)", "Pesanan (46)", "Pembayaran (38)", "Stok Produk (18)", "Pengiriman (14)", "Sistem (12)"];

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pusat Notifikasi</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau seluruh aktivitas dan pembaruan sistem LocalMart</p>
        </div>

        {/* 3 Kartu Statistik */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Notifikasi</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">128</h2>
              <p className="text-xs text-gray-500 mt-1">Seluruh notifikasi tercatat di sistem</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">🔔</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
            <div>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Belum Dibaca</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">12</h2>
              <p className="text-xs text-gray-500 mt-1">Perlu segera diperiksa admin</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">⏰</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Notifikasi Penting</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">5</h2>
              <p className="text-xs text-gray-500 mt-1">Memerlukan perhatian & stok menipis</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 text-xl">⚠️</div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-6 rounded-t-2xl border border-gray-100 border-b-0">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
              <input type="text" placeholder="Cari kata kunci atau #LM..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Semua Status ▼</button>
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">📅 1 Okt - 31 Okt 2024</button>
            <button className="ml-auto text-sm font-semibold text-indigo-600">Reset Filter</button>
          </div>
        </div>

        {/* List Notifikasi */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm">
          
          {/* Item 1 (Unread) */}
          <div className="flex items-start gap-4 p-5 border-b border-gray-50 bg-indigo-50/20 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-2xl"></div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl flex-shrink-0">🛍️</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">Pesanan Baru Diterima</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">Pesanan</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded">#LM001</span>
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Pesanan #LM001 telah dibuat oleh pelanggan dan menunggu konfirmasi pengiriman beku.</p>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-indigo-500">
                <span>⏱ Hari Ini, 10:45 WIB</span>
                <span className="text-gray-400">Pelanggan: Andi Setiawan (Surabaya)</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50">Lihat Detail</button>
          </div>

          {/* Item 2 (Unread) */}
          <div className="flex items-start gap-4 p-5 border-b border-gray-50 bg-indigo-50/20 relative">
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl flex-shrink-0">💳</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">Pembayaran Berhasil</h3>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">QRIS</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded">#LM002</span>
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Pembayaran transaksi #LM002 sebesar Rp150.000 telah berhasil dikonfirmasi secara otomatis via QRIS.</p>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-green-600">
                <span>⏱ Hari Ini, 09:30 WIB</span>
                <span className="text-gray-800 font-bold">Nominal: Rp 150.000</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50">Lihat Detail</button>
          </div>

          {/* Item 3 (Urgent) */}
          <div className="flex items-start gap-4 p-5 border-b border-gray-50 bg-orange-50/20 relative">
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl flex-shrink-0">📦</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">Peringatan Stok Produk</h3>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">Penting</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded">SKU: NUG-CRISP-01</span>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Stok Nugget Ayam Crispy Golden 500g tersisa 3 unit di cold-hub Surabaya. Segera lakukan pengisian stok.</p>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-orange-500">
                <span>⏱ Hari Ini, 08:15 WIB</span>
                <span className="text-orange-600 font-bold">Tersisa 3 unit (Batas minimum: 10)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50">Kelola Stok</button>
              <button className="px-2 py-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50">⋮</button>
            </div>
          </div>

          {/* Item 4 (Read) */}
          <div className="flex items-start gap-4 p-5 border-b border-gray-50 relative">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl flex-shrink-0">🚚</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">Pesanan Telah Dikirim</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">Pengiriman</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded">#LM003</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Pesanan #LM003 telah diserahkan kepada kurir spesialis cold-chain untuk dikirim ke pelanggan.</p>
              <div className="flex items-center gap-4 text-[11px] text-gray-500">
                <span>⏱ Kemarin, 16:20 WIB</span>
                <span>Kurir: Cold Logistics Ekspres (#EXP-992)</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">Lihat Detail</button>
          </div>

        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
          <p>Menampilkan <b>1-6</b> dari <b>128</b> notifikasi</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg opacity-50">Sebelumnya</button>
            <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">2</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">3</button>
            <span className="px-1 flex items-end">...</span>
            <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">13</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Berikutnya</button>
          </div>
        </div>
      </main>
    </div>
  );
}