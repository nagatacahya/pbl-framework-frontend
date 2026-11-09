// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorModal(false);

    try {
      const json = await authService.login(identifier, password);
      if (json.success) {
        router.push("/dashboard");
      } else {
        setErrorModal(true);
      }
    } catch (err) {
      setErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo-horizontal.png" alt="Logo" width={180} height={50} className="mb-4 object-contain" />
          <h2 className="text-xl font-semibold text-gray-800 mt-2">Masuk ke Akun Anda</h2>
          <p className="text-xs text-gray-500 text-center mt-1">Kelola stok rantai dingin, operasional kasir harian.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-gray-700">Email atau Nomor HP</label>
              <span className="text-[10px] text-gray-400">ID Pengguna Resmi</span>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-gray-400">✉</span>
              <input type="text" required className="w-full bg-[#F0F3FF] text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="siti@ikobana.com atau 0812..." value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-gray-700">Kata Sandi</label>
              <Link href="#" className="text-[11px] text-blue-600 font-semibold">Lupa Kata Sandi?</Link>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
              <input type={showPassword ? "text" : "password"} required className="w-full bg-[#F0F3FF] text-sm rounded-lg pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 text-sm">👁</button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#004AC6] text-white font-semibold text-sm py-3 rounded-lg hover:bg-blue-700 transition mt-4">
            {isLoading ? "Memproses..." : "Masuk ke Dashboard →"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-xs text-gray-500">Belum memiliki akses toko? <Link href="/register" className="text-blue-600 font-semibold">Register Sekarang</Link></p>
          <Link href="/register" className="w-full text-center bg-[#004AC6] text-white font-bold text-sm py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">Register Sekarang →</Link>
          <div className="w-full bg-[#F0F3FF] p-3 rounded-lg text-center mt-2"><p className="text-[11px] text-gray-600">Bantuan Operasional WA: <span className="text-blue-600 font-semibold">0812-3456-7890</span></p></div>
        </div>
      </div>

      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] shadow-2xl p-6 w-[338px] flex flex-col items-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">!</div></div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Email atau Password Salah</h2>
            <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">Email atau password yang kamu masukkan tidak sesuai. Silakan periksa kembali dan coba lagi.</p>
            <div className="w-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold py-2 rounded-lg mb-6">● Periksa penulisan huruf besar/kecil</div>
            <button onClick={() => setErrorModal(false)} className="w-full bg-[#0066FF] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">Coba Lagi</button>
          </div>
        </div>
      )}
    </div>
  );
}