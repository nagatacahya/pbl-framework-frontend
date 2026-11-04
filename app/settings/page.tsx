// app/settings/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { tokenStorage } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ appName: "LOCALMART", businessName: "Ikobana Frozen Food", desc: "Platform pemesanan..." });
  const [originalForm] = useState({ appName: "LOCALMART", businessName: "Ikobana Frozen Food", desc: "Platform pemesanan..." });
  
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSave = () => {
    // Poin 10: Jika tidak ada perubahan, munculkan error
    if (JSON.stringify(form) === JSON.stringify(originalForm)) {
      setToast({ type: "error", msg: "Tidak ada perubahan data yang disimpan." });
      return;
    }
    // Simulasi simpan berhasil
    setToast({ type: "success", msg: "Informasi Aplikasi berhasil diperbarui." });
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
          <p className="text-sm text-gray-500">Kelola konfigurasi aplikasi dan operasional Ikobana</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Informasi Aplikasi (Poin 10) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Aplikasi & Bisnis</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Nama Aplikasi</label>
                <input type="text" value={form.appName} onChange={(e) => setForm({...form, appName: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Nama Bisnis Resmi</label>
                <input type="text" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Deskripsi Toko</label>
                <textarea rows={3} value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" />
              </div>
              <div className="flex justify-end mt-4">
                {/* Tombol Batal dihilangkan sesuai Poin 10 */}
                <button onClick={handleSave} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>

          {/* Akun & Keamanan (Poin 9) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Profil Akun Pengelola</h2>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">AD</div>
                <div>
                  <p className="font-bold text-gray-900">Administrator</p>
                  <p className="text-xs text-gray-500">admin@ikobana.com</p>
                </div>
              </div>
              <Link href="/settings/edit-profile" className="block w-full text-center bg-[#DEE8FF] text-[#111C2D] font-semibold py-2.5 rounded-lg hover:bg-blue-100">
                Edit Profil
              </Link>
            </div>
            
            <button onClick={() => { tokenStorage.clear(); router.push("/login"); }} className="w-full mt-6 bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100">
              Keluar dari Akun
            </button>
          </div>
        </div>
      </main>

      {/* Toast / Modal (Poin 10) */}
      {toast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${toast.type === "success" ? "bg-blue-600" : "bg-red-600"}`}>
               {toast.type === "success" ? "✓" : "!"}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{toast.type === "success" ? "Update Berhasil!" : "EROR"}</h2>
            <p className="text-xs text-gray-500 mb-6">{toast.msg}</p>
            <button onClick={() => setToast(null)} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl">Kembali</button>
          </div>
        </div>
      )}
    </div>
  );
}