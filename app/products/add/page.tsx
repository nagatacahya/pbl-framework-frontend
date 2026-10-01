"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingProducts = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const newProduct = {
      name,
      category,
      price: `Rp ${Number(price).toLocaleString("id-ID")}`,
      stock: Number(stock),
      sku: `PR${Date.now().toString().slice(-4)}`,
      description,
    };

    localStorage.setItem(
      "products",
      JSON.stringify([...existingProducts, newProduct])
    );

    alert("Produk berhasil ditambahkan!");

    window.location.href = "/products";
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>IKOBANA</h2>
          <p>Frozen Food</p>
        </div>

        <nav className="sidebar-menu">

          <Link href="/dashboard">
            🏠 Dashboard
          </Link>

          <Link
            href="/products"
            className="active"
          >
            📦 Produk
          </Link>

          <Link href="/transactions">
            🧾 Transaksi
          </Link>

          <Link href="/settings">
            ⚙️ Pengaturan
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link href="/">
            🚪 Keluar
          </Link>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main-content">

        <header className="dashboard-header">

          <div>
            <h1>
              Tambah Produk
            </h1>

            <p>
              Tambahkan produk baru ke dalam katalog
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>

          </div>

        </header>

        {/* BACK */}
        <Link
          href="/products"
          className="back-transaction"
        >
          ← Kembali ke Produk
        </Link>

        {/* FORM */}
        <section className="transaction-detail-card">

          <form
            onSubmit={handleSubmit}
            className="product-form"
          >

            <div className="form-group">

              <label>
                Nama Produk
              </label>

              <input
                type="text"
                placeholder="Masukkan nama produk"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Kategori
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
              >

                <option value="">
                  Pilih kategori
                </option>

                <option value="Nugget">
                  Nugget
                </option>

                <option value="Bakso">
                  Bakso
                </option>

                <option value="Sosis">
                  Sosis
                </option>

                <option value="Dimsum">
                  Dimsum
                </option>

                <option value="Kentang">
                  Kentang
                </option>

                <option value="Frozen Food">
                  Frozen Food
                </option>

                <option value="Ayam">
                  Ayam
                </option>

              </select>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Harga
                </label>

                <input
                  type="number"
                  placeholder="Contoh: 30000"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Stok
                </label>

                <input
                  type="number"
                  placeholder="Contoh: 20"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Deskripsi
              </label>

              <textarea
                placeholder="Masukkan deskripsi produk"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
              />

            </div>

            <div className="form-actions">

              <Link
                href="/products"
                className="cancel-button"
              >
                Batal
              </Link>

              <button
                type="submit"
                className="save-product-button"
              >
                Simpan Produk
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}