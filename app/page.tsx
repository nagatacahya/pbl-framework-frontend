"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokenStorage } from "@/lib/api";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Auto-redirect kalau sudah login
  useEffect(() => {
    if (tokenStorage.isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");

    // Validasi
    if (!identifier.trim() || !password.trim()) {
      setError("Email/nomor HP dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login(identifier, password);

      if (response.success && response.data) {
        // Cek role — hanya ADMIN yang boleh masuk ke dashboard web
        if (response.data.user.role !== "ADMIN") {
          setError("Akses ditolak. Hanya admin yang bisa masuk ke dashboard.");
          tokenStorage.clear();
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      } else {
        setError(response.message || "Login gagal. Periksa email dan password.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        {/* LOGO */}
        <div className="logo">❄</div>

        {/* JUDUL */}
        <h1>Ikobana Frozenfood</h1>
        <p className="subtitle">Masuk ke akun Anda</p>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
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

          {/* EMAIL */}
          <label>Email / Nomor HP</label>
          <input
            type="text"
            placeholder="Masukkan email atau nomor HP"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
          />

          {/* PASSWORD */}
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
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

          {/* INGAT & LUPA PASSWORD */}
          <div className="login-option">
            <label className="remember">
              <input type="checkbox" />
              Ingat saya
            </label>
            <a href="#">Lupa password?</a>
          </div>

          {/* BUTTON LOGIN */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>

          {/* GOOGLE */}
          <button type="button" className="google-button" disabled={loading}>
            G &nbsp; Masuk dengan Google
          </button>
        </form>

        {/* DAFTAR */}
        <p className="register-text">
          Belum punya akun? <a href="/register">Daftar sekarang</a>
        </p>
      </div>
    </main>
  );
}