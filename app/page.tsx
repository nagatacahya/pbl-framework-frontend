"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <main className="login-page">
      <div className="login-card">

        {/* LOGO */}
        <div className="logo">
          ❄
        </div>

        {/* JUDUL */}
        <h1>Ikobana Frozenfood</h1>

        <p className="subtitle">
          Masuk ke akun Anda
        </p>

        {/* FORM */}
        <form>

          {/* EMAIL */}
          <label>Email / Username</label>

          <input
            type="text"
            placeholder="Masukkan email atau username"
          />

          {/* PASSWORD */}
          <label>Password</label>

          <div className="password-container">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
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

            <a href="#">
              Lupa password?
            </a>

          </div>

          {/* BUTTON LOGIN */}
          <button
            type="button"
            className="login-button"
            onClick={handleLogin}
          >
            Masuk ke Dashboard
          </button>

          {/* GOOGLE */}
          <button
            type="button"
            className="google-button"
          >
            G &nbsp; Masuk dengan Google
          </button>

        </form>

        {/* DAFTAR */}
        <p className="register-text">

          Belum punya akun?{" "}

          <a href="/register">
            Daftar sekarang
          </a>

        </p>

      </div>
    </main>
  );
}