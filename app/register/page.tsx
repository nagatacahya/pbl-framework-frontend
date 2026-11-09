// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const json = await authService.register(form.name, form.email, form.phone, form.password);
      if (json.success) setShowSuccess(true);
      else alert(json.message || "Registrasi gagal");
    } catch (err) {
      alert("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col items-center py-10 px-4">
      <div className="bg-white p-10 rounded-[24px] shadow-2xl w-full max-w-2xl relative">
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo-horizontal.png" alt="Logo" width={200} height={50} className="mb-4 object-contain" />
          <p className="text-[#455F87] text-xs font-medium tracking-wide mt-2">Pendaftaran Akun Pengelola</p>
          <h1 className="text-xl font-bold text-gray-900 mt-1">Daftar Akun Pengelola Toko</h1>
          <p className="text-xs text-gray-500 text-center mt-2 max-w-md">Mulai digitalisasi inventaris rantai dingin, kasir POS cerdas, dan orkestrasian pesanan online frozen food Anda.</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
          <div className="col-span-1"><label className="text-xs font-semibold text-gray-700">Nama Lengkap Pemilik</label><input type="text" required className="w-full mt-1 p-2.5 bg-[#F0F3FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Siti Rahmawati" onChange={(e) => setForm({...form, name: e.target.value})} /></div>
          <div className="col-span-1"><label className="text-xs font-semibold text-gray-700">Nomor WhatsApp Aktif</label><input type="text" required className="w-full mt-1 p-2.5 bg-[#F0F3FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+62 812-8921-3340" onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
          <div className="col-span-2"><label className="text-xs font-semibold text-gray-700">Email Bisnis / Akun Utama</label><input type="email" required className="w-full mt-1 p-2.5 bg-[#F0F3FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="siti@ikobana.com" onChange={(e) => setForm({...form, email: e.target.value})} /></div>
          <div className="col-span-2"><label className="text-xs font-semibold text-gray-700">Kata Sandi</label><input type="password" required className="w-full mt-1 p-2.5 bg-[#F0F3FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" onChange={(e) => setForm({...form, password: e.target.value})} /></div>
          <div className="col-span-2 flex items-start gap-2 mt-2"><input type="checkbox" required className="mt-1" /><p className="text-xs text-gray-600">Saya menyetujui <span className="text-blue-600 font-semibold">Syarat & Ketentuan</span> serta Standar Penanganan Rantai Dingin LOCALMART.</p></div>
          <button type="submit" disabled={isLoading} className="col-span-2 bg-[#004AC6] text-white font-bold text-sm py-3.5 rounded-xl mt-4 hover:bg-blue-700 transition">{isLoading ? "Memproses..." : "Daftar & Buat Akun Toko Sekarang →"}</button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600">Sudah memiliki akun pengelola? <Link href="/login" className="text-blue-600 font-bold">Masuk ke Akun Anda</Link></p>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-200"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">Akun IKOBANA FROZENFOOD kamu berhasil dibuat. Sekarang kamu sudah bisa mulai berbelanja frozen food favoritmu.</p>
            <div className="w-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold py-2 rounded-lg mb-6 flex items-center justify-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full"></span> Selamat datang di IKOBANA FROZEENFOOD</div>
            <button onClick={() => router.push("/login")} className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition">Ke Halaman Login</button>
          </div>
        </div>
      )}
    </div>
  );
}