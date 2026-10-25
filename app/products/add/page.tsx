"use client";

import Link from "next/link";
import { useActionState } from "react"; // ✅ Diambil dari react
import { useRouter } from "next/navigation";
import { createProductAction } from "@/actions/product";
import { tokenStorage } from "@/lib/api";

const initialState = {
  success: false,
  errors: {} as any,
  message: "",
};

export default function AddProductPage() {
  const router = useRouter();
  
  // ✅ Perbaikan: useActionState memanggil action secara otomatis
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialState
  );

  // Jika sukses, redirect ke halaman products
  if (state.success) {
    router.push("/products");
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>IKOBANA</h2>
          <p>Frozen Food</p>
        </div>
        <nav className="sidebar-menu">
          <Link href="/dashboard">🏠 Dashboard</Link>
          <Link href="/products" className="active">📦 Produk</Link>
          <Link href="/transactions">🧾 Transaksi</Link>
          <Link href="/settings">⚙️ Pengaturan</Link>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/">🚪 Keluar</Link>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Tambah Produk</h1>
            <p>Tambahkan produk baru ke dalam katalog</p>
          </div>
        </header>

        <Link href="/products" className="back-transaction">
          ← Kembali ke Produk
        </Link>

        <section className="transaction-detail-card">
          {state.message && (
            <div style={{ color: state.success ? "green" : "red", marginBottom: "10px" }}>
              {state.message}
            </div>
          )}

          {/* ✅ Perbaikan: action={formAction} bukan action={...manual} */}
          <form action={formAction} className="product-form">
            
            {/* Hidden input untuk mengirim token ke Server Action */}
            <input type="hidden" name="token" value={tokenStorage.getToken() || ""} />

            <div className="form-group">
              <label>Nama Produk</label>
              <input type="text" name="name" placeholder="Masukkan nama produk" disabled={isPending} />
              {state.errors?.name && <p style={{ color: "red", fontSize: "12px" }}>{state.errors.name[0]}</p>}
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select name="category" disabled={isPending}>
                <option value="">Pilih kategori</option>
                <option value="Nugget">Nugget</option>
                <option value="Bakso">Bakso</option>
                <option value="Sosis">Sosis</option>
                <option value="Dimsum">Dimsum</option>
                <option value="Kentang">Kentang</option>
                <option value="Frozen Food">Frozen Food</option>
                <option value="Ayam">Ayam</option>
              </select>
              {state.errors?.category && <p style={{ color: "red", fontSize: "12px" }}>{state.errors.category[0]}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Harga</label>
                <input type="number" name="price" placeholder="Contoh: 30000" disabled={isPending} />
                {state.errors?.price && <p style={{ color: "red", fontSize: "12px" }}>{state.errors.price[0]}</p>}
              </div>
              <div className="form-group">
                <label>Stok</label>
                <input type="number" name="stock" placeholder="Contoh: 20" disabled={isPending} />
                {state.errors?.stock && <p style={{ color: "red", fontSize: "12px" }}>{state.errors.stock[0]}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea name="description" placeholder="Masukkan deskripsi produk" rows={5} disabled={isPending} />
            </div>

            <div className="form-actions">
              <Link href="/products" className="cancel-button">Batal</Link>
              <button type="submit" className="save-product-button" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}