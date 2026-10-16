"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // Validasi
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(name, email, phone, password);

      if (response.success) {
        setSuccess("Registrasi berhasil! Mengarahkan ke halaman login...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(response.message || "Registrasi gagal.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-card">
        {/* LOGO */}
        <div className="logo">❄</div>

        {/* JUDUL */}
        <h1>Ikobana Frozenfood</h1>
        <p className="subtitle">Buat akun baru Anda</p>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "12px",
                border: "1px solid #FEE2E2",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              style={{
                background: "#F0FDF4",
                color: "#16A34A",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "12px",
                border: "1px solid #BBF7D0",
              }}
            >
              ✅ {success}
            </div>
          )}

          {/* NAMA */}
          <label>Nama Lengkap</label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* NOMOR HP */}
          <label>Nomor WhatsApp</label>
          <input
            type="tel"
            placeholder="Contoh: 81234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />

          {/* PASSWORD */}
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <label>Konfirmasi Password</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar Akun"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="login-text">
          Sudah punya akun? <a href="/">Masuk sekarang</a>
        </p>
      </div>
    </main>
  );
}