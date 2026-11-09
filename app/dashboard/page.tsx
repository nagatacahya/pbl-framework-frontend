// app/dashboard/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useProducts } from "@/hooks/use-products";
import { useTransactions } from "@/hooks/use-transactions";
import { productService } from "@/services/product.service";

export default function DashboardPage() {
  const router = useRouter();
  const { products, refresh: refreshProducts } = useProducts();
  const { transactions } = useTransactions();
  
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [stockUpdates, setStockUpdates] = useState<Record<string, string>>({});
  const [salesFilter, setSalesFilter] = useState<"Hari ini" | "Minggu ini" | "Bulan ini">("Minggu ini");

  const lowStock = products.filter((p: any) => p.stock <= 5);
  
  // ✅ Revenue HANYA dari transaksi berstatus "Selesai"
  const revenue = transactions
    .filter((t: any) => t.status === "Selesai")
    .reduce((acc: number, t: any) => acc + t.totalPrice, 0);

  const salesData = useMemo(() => {
    const completedTrx = transactions.filter((t: any) => t.status === "Selesai");
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const today = new Date();
    
    if (salesFilter === "Minggu ini") {
      const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      return days.map((day, i) => {
        const dayStart = new Date(startOfWeek);
        dayStart.setDate(startOfWeek.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const total = completedTrx
          .filter((trx: any) => {
            const trxDate = new Date(trx.createdAt);
            return trxDate >= dayStart && trxDate <= dayEnd;
          })
          .reduce((sum: number, trx: any) => sum + trx.totalPrice, 0);
        
        return { label: day, value: total };
      });
    } else if (salesFilter === "Hari ini") {
      return completedTrx
        .filter((trx: any) => new Date(trx.createdAt).toDateString() === today.toDateString())
        .reduce((acc: any[], trx: any) => {
          const hour = new Date(trx.createdAt).getHours();
          const existing = acc.find(item => item.label === `${hour}:00`);
          if (existing) existing.value += trx.totalPrice;
          else acc.push({ label: `${hour}:00`, value: trx.totalPrice });
          return acc;
        }, [])
        .sort((a: any, b: any) => parseInt(a.label) - parseInt(b.label));
    } else {
      const weekData = [0, 0, 0, 0, 0];
      completedTrx.forEach((trx: any) => {
        const trxDate = new Date(trx.createdAt);
        if (trxDate.getMonth() === today.getMonth() && trxDate.getFullYear() === today.getFullYear()) {
          const weekIndex = Math.floor((trxDate.getDate() - 1) / 7);
          if (weekIndex < 5) weekData[weekIndex] += trx.totalPrice;
        }
      });
      return weekData.map((value, i) => ({ label: `Mgg ${i + 1}`, value }));
    }
  }, [transactions, salesFilter]);

  const avgDaily = salesData.length > 0 
    ? salesData.reduce((sum: number, d: any) => sum + d.value, 0) / salesData.length 
    : 0;
  const peakSale = salesData.reduce((max: any, d: any) => d.value > max.value ? d : max, { label: "-", value: 0 });
  const maxValue = Math.max(...salesData.map((d: any) => d.value), 1);

  const openStockModal = (product: any) => {
    setSelectedProducts([product]);
    setStockUpdates({ [product.id]: "" });
    setIsStockModalOpen(true);
  };

  const handleSaveStock = async () => {
    const updates = selectedProducts.map((p) => ({ id: p.id, newStock: Number(stockUpdates[p.id]) || 0 }));
    await productService.bulkUpdateStock(updates);
    setIsStockModalOpen(false);
    setIsSuccessModalOpen(true);
    refreshProducts();
  };

  const parseProductNames = (itemsString: string) => {
    try {
      const items = JSON.parse(itemsString);
      if (Array.isArray(items)) return items.map((item: any) => item.productName).join(", ");
    } catch (e) { return itemsString; }
    return "-";
  };

  const formatRupiah = (value: number) => "Rp " + value.toLocaleString("id-ID");

  return (
    <div className="flex min-h-screen bg-[#F9F9FF] font-sans">
      <Sidebar />
      <main className="ml-[256px] flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111C2D]">Dashboard</h1>
            <p className="text-sm text-[#434655]">Ringkasan aktivitas dan performa Ikobana Frozen Food</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-blue-600 font-bold text-lg">📅</span>
            <span className="text-sm font-semibold text-gray-700">Hari ini: {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* ALERT BANNER */}
        {lowStock.length > 0 && (
          <div className="bg-[#D5E3FF] p-4 rounded-xl flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#B5D0FD] rounded-full flex items-center justify-center text-[#3E5980] font-bold">!</div>
            <p className="text-sm text-[#001C3B]">Perhatian: Ada <b>{lowStock.length} produk</b> dengan stok menipis (≤ 5) dan perlu restock segera.</p>
          </div>
        )}

        {/* 4 METRIC CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start"><div><p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider">TOTAL PRODUK</p><h2 className="text-3xl font-bold text-[#111C2D] mt-2">{products.length}</h2></div><div className="w-11 h-11 bg-[#E7EEFF] rounded-full flex items-center justify-center text-[#004AC6] text-xl">📦</div></div>
            <p className="text-[11px] font-bold text-[#004AC6] mt-4">+4 produk baru</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start"><div><p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider">STOK MENIPIS</p><h2 className="text-3xl font-bold text-[#111C2D] mt-2">{lowStock.length}</h2></div><div className="w-11 h-11 bg-[#FFDAD6]/60 rounded-full flex items-center justify-center text-[#BA1A1A] text-xl">⚠️</div></div>
            <span className="bg-[#FFDAD6] text-[#93000A] text-[11px] font-bold px-2 py-1 rounded-full w-fit mt-4">Perhatian Segera</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start"><div><p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider">TOTAL TRANSAKSI</p><h2 className="text-3xl font-bold text-[#111C2D] mt-2">{transactions.length}</h2></div><div className="w-11 h-11 bg-[#D5E3FF] rounded-full flex items-center justify-center text-[#2D486D] text-xl">🧾</div></div>
            <p className="text-[11px] font-bold text-[#004AC6] mt-4">Data hari ini</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start"><div><p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider">TOTAL PENDAPATAN</p><h2 className="text-2xl font-bold text-[#111C2D] mt-2">{formatRupiah(revenue)}</h2></div><div className="w-11 h-11 bg-[#DEE8FF] rounded-full flex items-center justify-center text-[#004AC6] text-xl">💵</div></div>
            <p className="text-[11px] font-bold text-[#004AC6] mt-4">Dari Pesanan Selesai</p>
          </div>
        </div>

        {/* GRAFIK & STOK MENIPIS */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-7 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div><h3 className="text-lg font-bold text-[#111C2D]">Ringkasan Penjualan</h3><p className="text-xs text-[#434655]">Performa penjualan Ikobana (dari pesanan Selesai)</p></div>
              <div className="flex bg-[#F0F3FF] p-1 rounded-lg">
                {(["Hari ini", "Minggu ini", "Bulan ini"] as const).map((filter) => (
                  <button key={filter} onClick={() => setSalesFilter(filter)} className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${salesFilter === filter ? "bg-[#2563EB] text-white shadow-sm" : "text-gray-500"}`}>{filter}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 h-[200px] border-b border-gray-100 pb-2 relative">
              {salesData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">Tidak ada data penjualan pada periode ini.</div>
              ) : (
                salesData.map((data: any, i: number) => {
                  const barHeight = maxValue > 0 ? Math.max((data.value / maxValue) * 100, data.value > 0 ? 5 : 0) : 0;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group relative">
                      {data.value > 0 && (
                        <div className="absolute -top-8 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{formatRupiah(data.value)}</div>
                      )}
                      <div className={`w-8 rounded-t-md transition-all ${data.value > 0 ? "bg-[#2563EB] hover:bg-[#1E40AF]" : "bg-gray-100"}`} style={{ height: `${barHeight}%` }}></div>
                      <span className="text-[11px] font-bold text-[#434655]">{data.label}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex justify-between items-center bg-[#F0F3FF] p-3 rounded-lg mt-4">
              <div className="flex items-center gap-2 text-xs text-[#434655]">Rata-rata: <b className="text-[#111C2D]">{formatRupiah(avgDaily)}</b></div>
              <div className="flex items-center gap-2 text-xs text-[#434655]">Puncak Penjualan: <b className="text-[#004AC6]">{peakSale.value > 0 ? `${peakSale.label} (${formatRupiah(peakSale.value)})` : "Tidak ada data"}</b></div>
            </div>
          </div>

          <div className="col-span-5 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div><h3 className="text-lg font-bold text-[#111C2D]">Produk Stok Menipis</h3><p className="text-xs text-[#434655]">Segera lakukan restock sebelum kehabisan</p></div>
              <span className="bg-[#FFDAD6] text-[#93000A] text-[11px] font-bold px-2 py-1 rounded-full">{lowStock.length} Item</span>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {lowStock.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center bg-[#F0F3FF] p-3 rounded-lg">
                  <div><p className="text-xs font-bold text-[#111C2D]">{p.name}</p><p className="text-[11px] text-[#434655] mt-1">Sisa: <span className="text-[#BA1A1A] font-bold">{p.stock}</span> / Min: 20</p></div>
                  <button onClick={() => openStockModal(p)} className="bg-white text-[#004AC6] font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">Update Stok</button>
                </div>
              ))}
              {lowStock.length === 0 && <p className="text-center text-xs text-gray-500 py-4">Semua stok aman.</p>}
            </div>
          </div>
        </div>

        {/* TABEL TRANSAKSI TERBARU */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div><h3 className="text-lg font-bold text-[#111C2D]">Transaksi Terbaru</h3><p className="text-xs text-[#434655]">Daftar pesanan masuk terakhir</p></div>
            <button onClick={() => router.push("/transactions")} className="text-sm text-[#004AC6] font-bold hover:underline">Lihat Semua Transaksi →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F0F3FF] text-[#737686] uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-4 rounded-l-lg">ID TRANSAKSI</th><th className="p-4">PELANGGAN</th><th className="p-4">PRODUK</th><th className="p-4">TANGGAL & WAKTU</th><th className="p-4">TOTAL</th><th className="p-4">STATUS</th><th className="p-4 text-center rounded-r-lg">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada data transaksi di database.</td></tr>
                ) : (
                  transactions.slice(0, 5).map((trx: any) => {
                    const initials = trx.customerName ? trx.customerName.substring(0, 2).toUpperCase() : "UN";
                    return (
                      <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 font-bold text-[#004AC6]">{trx.orderId}</td>
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#D5E3FF] text-[#001C3B] flex items-center justify-center text-[10px] font-bold">{initials}</div><span className="font-semibold text-[#111C2D]">{trx.customerName}</span></div></td>
                        <td className="p-4 text-[#434655] max-w-[200px] truncate" title={parseProductNames(trx.items)}>{parseProductNames(trx.items)}</td>
                        <td className="p-4 text-[#434655]">{new Date(trx.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-4 font-bold text-[#111C2D]">{formatRupiah(trx.totalPrice)}</td>
                        <td className="p-4"><span className={`px-3 py-1 rounded-full text-[11px] font-bold ${trx.status === "Selesai" ? "bg-green-100 text-green-700" : trx.status === "Diproses" ? "bg-blue-100 text-blue-700" : trx.status === "Dikirim" ? "bg-purple-100 text-purple-700" : trx.status === "Dibatalkan" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{trx.status}</span></td>
                        <td className="p-4 text-center"><button onClick={() => router.push("/transactions")} className="bg-[#DEE8FF] text-[#111C2D] text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-200">Detail</button></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL UPDATE STOK */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[576px] overflow-hidden">
            <div className="bg-[#F0F3FF] p-6 flex justify-between items-center border-b border-gray-100"><div><span className="text-[10px] font-bold bg-[#DBE1FF] text-[#00174B] px-2 py-0.5 rounded">IKOBANA FROZEN FOOD INVENTORY</span><h2 className="text-xl font-bold text-[#111C2D] mt-1">Update Stok Produk</h2></div><button onClick={() => setIsStockModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button></div>
            <div className="p-6 space-y-4">
              <div className="bg-[#F0F3FF] p-4 rounded-xl flex justify-between items-center"><div><p className="font-bold text-[#111C2D]">{selectedProducts[0]?.name}</p><p className="text-xs text-[#737686] mt-1">SKU: {selectedProducts[0]?.sku}</p></div><div className="text-right"><p className="text-[10px] font-bold text-[#737686] uppercase">Stok Saat Ini</p><p className="text-lg font-bold text-[#004AC6]">{selectedProducts[0]?.stock} box</p></div></div>
              <div><label className="text-xs font-bold text-[#111C2D]">Jumlah Penyesuaian Baru</label><div className="flex items-center mt-1 bg-[#F0F3FF] rounded-lg p-2 border border-transparent focus-within:border-blue-500 transition-colors"><input type="number" autoFocus className="flex-1 bg-transparent border-none focus:outline-none font-bold text-[#111C2D] pl-2 placeholder-gray-400" value={stockUpdates[selectedProducts[0]?.id] ?? ""} onChange={(e) => setStockUpdates({ ...stockUpdates, [selectedProducts[0].id]: e.target.value })} placeholder="Masukkan jumlah..." /><span className="text-sm font-semibold text-[#737686] pr-2">box</span></div></div>
              <div className="bg-[#DEE8FF]/60 p-3 rounded-lg flex items-center gap-2 text-sm text-[#111C2D]"><span className="text-[#004AC6]">📊</span> Proyeksi Total Stok Akhir: <b>{stockUpdates[selectedProducts[0]?.id] || 0} box</b></div>
            </div>
            <div className="bg-[#F0F3FF] p-6 flex justify-end gap-3"><button onClick={handleSaveStock} className="bg-[#2563EB] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700">Simpan Update Stok</button><button onClick={() => setIsStockModalOpen(false)} className="bg-[#DC2626] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700">Batal</button></div>
          </div>
        </div>
      )}

      {/* MODAL BERHASIL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center animate-fade-in"><h2 className="text-xl font-bold text-gray-900 mb-2">Update Berhasil!</h2><div className="w-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold py-2 rounded-lg mb-6">● Selamat datang di IKOBANA FROZEENFOOD</div><button onClick={() => setIsSuccessModalOpen(false)} className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50">Kembali</button></div>
        </div>
      )}
    </div>
  );
}