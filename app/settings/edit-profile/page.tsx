// app/settings/edit-profile/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "Siti", email: "admin@ikobana.com", phone: "0812-3456-7890" });
  const [originalForm] = useState({ name: "Siti", email: "admin@ikobana.com", phone: "0812-3456-7890" });
  const [modal, setModal] = useState<{ type: "success" | "error" } | null>(null);

  const handleSave = () => {
    // Jika tidak ada perubahan, munculkan error (Poin 11)
    if (JSON.stringify(form) === JSON.stringify(originalForm)) {
      setModal({ type: "error" });
      return;
    }
    setModal({ type: "success" });
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-1">Pengaturan Sistem / Edit Profil</p>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Informasi Profil</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700">Nama Lengkap</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">Alamat Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">No. Handphone / WhatsApp</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => router.push("/settings")} className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700">
              Batal
            </button>
            <button onClick={handleSave} className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </main>

      {/* Pop-up Sukses/Error Edit Profil (Poin 11) */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modal.type === "success" ? "bg-blue-600" : "bg-red-600"}`}>
               {modal.type === "success" ? "✓" : "!"}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{modal.type === "success" ? "Update Berhasil!" : "EROR"}</h2>
            {modal.type === "success" && (
              <div className="w-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold py-2 rounded-lg mb-4">
                ● Selamat datang di IKOBANA FROZEENFOOD
              </div>
            )}
            <button onClick={() => { setModal(null); if(modal.type === "success") router.push("/settings"); }} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl mt-2">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}