"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultProducts = [
  {
    name: "Nugget Ayam",
    category: "Nugget",
    price: "35000",
    stock: 3,
    sku: "NG001",
    description: "",
  },
  {
    name: "Bakso Sapi",
    category: "Bakso",
    price: "40000",
    stock: 7,
    sku: "BS002",
    description: "",
  },
  {
    name: "Sosis Ayam",
    category: "Sosis",
    price: "28000",
    stock: 9,
    sku: "SA003",
    description: "",
  },
  {
    name: "Dimsum Ayam",
    category: "Dimsum",
    price: "32000",
    stock: 25,
    sku: "DM004",
    description: "",
  },
  {
    name: "Kentang Frozen",
    category: "Frozen Food",
    price: "27000",
    stock: 31,
    sku: "KF005",
    description: "",
  },
  {
    name: "Chicken Wings",
    category: "Ayam",
    price: "45000",
    stock: 18,
    sku: "CW006",
    description: "",
  },
];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const sku = params.sku as string;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const savedProducts = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const allProducts = [
      ...defaultProducts,
      ...savedProducts,
    ];

    const product = allProducts.find(
      (item) => item.sku === sku
    );

    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(
        product.price
          .replace("Rp ", "")
          .replace(/\./g, "")
      );
      setStock(String(product.stock));
      setDescription(product.description || "");
    }
  }, [sku]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const savedProducts = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const updatedProducts = savedProducts.map(
      (product: {
        name: string;
        category: string;
        price: string;
        stock: number;
        sku: string;
        description?: string;
      }) => {
        if (product.sku === sku) {
          return {
            ...product,
            name,
            category,
            price: `Rp ${Number(price).toLocaleString(
              "id-ID"
            )}`,
            stock: Number(stock),
            description,
          };
        }

        return product;
      }
    );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    alert("Produk berhasil diperbarui!");

    router.push("/products");
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
              Edit Produk
            </h1>

            <p>
              Ubah informasi produk dan stok
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
                Simpan Perubahan
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}