"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="register-page">
      <div className="register-card">

        {/* LOGO */}
        <div className="logo">
          ❄
        </div>

        {/* JUDUL */}
        <h1>Ikobana Frozenfood</h1>

        <p className="subtitle">
          Buat akun baru Anda
        </p>

        {/* FORM */}
        <form>

          {/* NAMA */}
          <label>Nama Lengkap</label>

          <input
            type="text"
            placeholder="Masukkan nama lengkap"
          />

          {/* EMAIL */}
          <label>Email</label>

          <input
            type="email"
            placeholder="Masukkan email"
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
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <label>Konfirmasi Password</label>

          <div className="password-container">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Ulangi password"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "Sembunyikan"
                : "Lihat"}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="button"
            className="register-button"
          >
            Daftar Akun
          </button>

        </form>

        {/* LOGIN */}
        <p className="login-text">
          Sudah punya akun?{" "}

          <a href="/">
            Masuk sekarang
          </a>
        </p>

      </div>
    </main>
  );
}