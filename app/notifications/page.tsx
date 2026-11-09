// app/notifications/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useNotifications } from "@/hooks/use-notifications";
import { notificationService } from "@/services/notification.service";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const { notifications, unreadCount, refresh } = useNotifications({
    category: activeTab === "Semua" ? undefined : activeTab,
    search,
    startDate: selectedMonth ? `${selectedMonth}-01` : undefined,
    endDate: selectedMonth ? `${selectedMonth}-31` : undefined,
  });

  const handleClick = async (notif: any) => {
    await notificationService.markAsRead(notif.id);
    refresh();
    if (notif.category === "Pesanan" || notif.category === "Pengiriman") router.push("/transactions");
    else if (notif.category === "Stok Produk") router.push("/products");
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    refresh();
  };

  const tabs = ["Semua", "Pesanan", "Stok Produk", "Pengiriman", "Sistem"];
  const totalPages = Math.ceil(notifications.length / perPage);
  const paginatedData = notifications.slice((page - 1) * perPage, page * perPage);
  const importantCount = notifications.filter((n) => (n.category === "Pesanan" && !n.isRead) || n.category === "Stok Produk").length;

  const formatMonthDisplay = (monthString: string) => {
    if (!monthString) return "Pilih Bulan";
    const [year, month] = monthString.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    const monthName = date.toLocaleString("id-ID", { month: "short" });
    return `${monthName} ${year} / 1 - ${lastDay} ${monthName} ${year}`;
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      <main className="ml-[256px] flex-1 p-8">
        <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Pusat Notifikasi</h1><p className="text-sm text-gray-500 mt-1">Pantau seluruh aktivitas dan pembaruan sistem</p></div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"><div><p className="text-xs font-bold text-gray-500 uppercase">Total Notifikasi</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{notifications.length}</h2></div><div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">🔔</div></div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div><div><p className="text-xs font-bold text-indigo-500 uppercase">Belum Dibaca</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{unreadCount}</h2></div><div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">⏰</div></div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div><div><p className="text-xs font-bold text-orange-500 uppercase">Notifikasi Penting</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{importantCount}</h2></div><div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 text-xl">⚠️</div></div>
        </div>

        <div className="bg-white p-6 rounded-t-2xl border border-gray-100 border-b-0">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4">{tabs.map((tab) => (<button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${activeTab === tab ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500"}`}>{tab}</button>))}</div>
          <div className="flex gap-3 items-center">
            <input type="text" placeholder="Cari notifikasi..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1 p-2.5 border rounded-xl text-sm" />
            <div className="relative">
              <input type="month" value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setPage(1); }} className="p-2.5 border rounded-xl text-sm w-48 text-transparent absolute inset-0 cursor-pointer z-10 opacity-0" />
              <div className="p-2.5 border rounded-xl text-sm w-48 bg-white flex items-center justify-between"><span className="text-gray-700 font-medium truncate">{formatMonthDisplay(selectedMonth)}</span><span className="text-gray-400">📅</span></div>
            </div>
            <button onClick={() => { setSearch(""); setSelectedMonth(""); }} className="text-sm font-semibold text-indigo-600">Reset</button>
            <button onClick={handleMarkAllRead} className="ml-auto text-sm font-semibold text-gray-600 hover:text-indigo-600">Tandai Semua Dibaca</button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm">
          {paginatedData.length === 0 ? (<div className="p-8 text-center text-gray-500">Tidak ada notifikasi.</div>) : (
            paginatedData.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-4 p-5 border-b border-gray-50 relative cursor-pointer hover:bg-gray-50 ${!notif.isRead ? "bg-indigo-50/20" : ""}`} onClick={() => handleClick(notif)}>
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${notif.category === "Pesanan" ? "bg-indigo-500" : notif.category === "Stok Produk" ? "bg-orange-500" : "bg-blue-500"}`}></div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${notif.category === "Pesanan" ? "bg-indigo-100 text-indigo-600" : notif.category === "Stok Produk" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>{notif.category === "Pesanan" ? "🛍️" : notif.category === "Stok Produk" ? "📦" : "🚚"}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1"><h3 className="font-bold text-gray-900 text-sm">{notif.title}</h3><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">{notif.category}</span>{!notif.isRead && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}</div>
                  <p className="text-xs text-gray-500 mb-2">{notif.message}</p>
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-indigo-500"><span>⏱ {new Date(notif.createdAt).toLocaleString("id-ID")}</span></div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
          <p>Menampilkan <b>{paginatedData.length}</b> dari <b>{notifications.length}</b> notifikasi</p>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">Sebelumnya</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg font-bold ${page === p ? "bg-indigo-600 text-white" : "border hover:bg-gray-50"}`}>{p}</button>))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </main>
    </div>
  );
}