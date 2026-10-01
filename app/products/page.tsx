"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const defaultProducts = [
  {
    name: "Nugget Ayam",
    category: "Nugget",
    price: "Rp 35.000",
    stock: 3,
    sku: "NG001",
  },
  {
    name: "Bakso Sapi",
    category: "Bakso",
    price: "Rp 40.000",
    stock: 7,
    sku: "BS002",
  },
  {
    name: "Sosis Ayam",
    category: "Sosis",
    price: "Rp 28.000",
    stock: 9,
    sku: "SA003",
  },
  {
    name: "Dimsum Ayam",
    category: "Dimsum",
    price: "Rp 32.000",
    stock: 25,
    sku: "DM004",
  },
  {
    name: "Kentang Frozen",
    category: "Frozen Food",
    price: "Rp 27.000",
    stock: 31,
    sku: "KF005",
  },
  {
    name: "Chicken Wings",
    category: "Ayam",
    price: "Rp 45.000",
    stock: 18,
    sku: "CW006",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(defaultProducts);

  const [search, setSearch] = useState("");

  // FILTER
  const [categoryFilter, setCategoryFilter] =
    useState("Semua Kategori");

  const [statusFilter, setStatusFilter] =
    useState("Semua Status");


  // ==============================
  // LOAD PRODUCTS
  // ==============================
  useEffect(() => {
    const savedProducts = JSON.parse(
      localStorage.getItem("products") || "[]"
    );

    const savedBySku = new Map(
      savedProducts.map((product: any) => [
        product.sku,
        product,
      ])
    );

    const updatedDefaultProducts =
      defaultProducts.map((product) => {
        return (
          savedBySku.get(product.sku) ||
          product
        );
      });

    const customProducts =
      savedProducts.filter(
        (product: any) =>
          !defaultProducts.some(
            (defaultProduct) =>
              defaultProduct.sku === product.sku
          )
      );

    const allProducts = [
      ...updatedDefaultProducts,
      ...customProducts,
    ];

    localStorage.setItem(
      "products",
      JSON.stringify(allProducts)
    );

    setProducts(allProducts);
  }, []);


  // ==============================
  // SEARCH + FILTER
  // ==============================
  const filteredProducts =
    products.filter((product) => {

      // Filter berdasarkan nama
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase());


      // Filter berdasarkan kategori
      const matchesCategory =
        categoryFilter === "Semua Kategori" ||
        product.category === categoryFilter;


      // Tentukan status produk
      let productStatus = "Tersedia";

      if (product.stock === 0) {
        productStatus = "Habis";
      } else if (product.stock <= 5) {
        productStatus = "Stok Menipis";
      }


      // Filter berdasarkan status
      const matchesStatus =
        statusFilter === "Semua Status" ||
        productStatus === statusFilter;


      // Produk harus memenuhi semua filter
      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });


  // ==============================
  // HAPUS PRODUK
  // ==============================
  const handleDelete = (
    sku: string,
    name: string
  ) => {

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedProducts =
      products.filter(
        (product) =>
          product.sku !== sku
      );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    setProducts(updatedProducts);

    alert("Produk berhasil dihapus!");
  };


  return (
    <div className="dashboard">

      {/* ==============================
          SIDEBAR
      ============================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            ❄
          </div>

          <div>
            <h2>Ikobana</h2>
            <span>Frozenfood</span>
          </div>

        </div>


        <nav className="menu">

          <a
            className="menu-item"
            href="/dashboard"
          >
            <span>▣</span>
            Dashboard
          </a>


          <a
            className="menu-item active"
            href="/products"
          >
            <span>▤</span>
            Produk & Stok
          </a>


          <a
            className="menu-item"
            href="/transactions"
          >
            <span>▥</span>
            Transaksi
          </a>


          <a
            className="menu-item"
            href="/settings"
          >
            <span>⚙</span>
            Pengaturan
          </a>

        </nav>


        <div className="sidebar-bottom">

          <div className="admin-profile">

            <div className="avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>

          </div>


          <a
            href="/"
            className="logout"
          >
            ↪ Keluar
          </a>

        </div>

      </aside>


      {/* ==============================
          MAIN
      ============================== */}

      <main className="dashboard-content">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Produk & Stok
            </h1>

            <p>
              Kelola produk dan stok barang Anda
            </p>

          </div>


          <div className="header-right">

            <button className="notification">
              🔔
            </button>


            <div className="header-user">

              <div className="avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>

            </div>

          </div>

        </header>


        {/* ==============================
            TOP ACTION
        ============================== */}

        <div className="product-actions">

          <div>

            <h2>
              Daftar Produk
            </h2>

            <p>
              Kelola semua produk frozen food
            </p>

          </div>


          <Link
            href="/products/add"
            className="add-product"
          >
            + Tambah Produk
          </Link>

        </div>


        {/* ==============================
            STATISTICS
        ============================== */}

        <section className="statistics">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon blue">
              📦
            </div>

            <div>

              <p>
                Total Produk
              </p>

              <h2>
                {products.length}
              </h2>

            </div>

          </div>


          {/* STOK TERSEDIA */}

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>

              <p>
                Stok Tersedia
              </p>

              <h2>
                {products.reduce(
                  (total, product) =>
                    total + product.stock,
                  0
                )}
              </h2>

            </div>

          </div>


          {/* STOK MENIPIS */}

          <div className="stat-card">

            <div className="stat-icon orange">
              ⚠
            </div>

            <div>

              <p>
                Stok Menipis
              </p>

              <h2>
                {
                  products.filter(
                    (product) =>
                      product.stock > 0 &&
                      product.stock <= 5
                  ).length
                }
              </h2>

            </div>

          </div>


          {/* STOK HABIS */}

          <div className="stat-card">

            <div className="stat-icon purple">
              ⛔
            </div>

            <div>

              <p>
                Stok Habis
              </p>

              <h2>
                {
                  products.filter(
                    (product) =>
                      product.stock === 0
                  ).length
                }
              </h2>

            </div>

          </div>

        </section>


        {/* ==============================
            PRODUCT TABLE
        ============================== */}

        <section className="dashboard-card product-table-card">


          {/* TOOLBAR */}

          <div className="product-toolbar">


            {/* SEARCH */}

            <div className="search-box">

              <span>
                🔍
              </span>


              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            {/* FILTER KATEGORI */}

            <select
              className="product-filter"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >

              <option>
                Semua Kategori
              </option>

              <option>
                Nugget
              </option>

              <option>
                Bakso
              </option>

              <option>
                Sosis
              </option>

              <option>
                Dimsum
              </option>

              <option>
                Kentang
              </option>

              <option>
                Frozen Food
              </option>

              <option>
                Ayam
              </option>

            </select>


            {/* FILTER STATUS */}

            <select
              className="product-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option>
                Semua Status
              </option>

              <option>
                Tersedia
              </option>

              <option>
                Stok Menipis
              </option>

              <option>
                Habis
              </option>

            </select>

          </div>


          {/* ==============================
              TABLE
          ============================== */}

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Produk
                  </th>

                  <th>
                    SKU
                  </th>

                  <th>
                    Kategori
                  </th>

                  <th>
                    Harga
                  </th>

                  <th>
                    Stok
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Aksi
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.length > 0 ? (

                  filteredProducts.map(
                    (product) => (

                      <tr
                        key={product.sku}
                      >

                        {/* PRODUK */}

                        <td>

                          <strong>
                            {product.name}
                          </strong>

                        </td>


                        {/* SKU */}

                        <td>
                          {product.sku}
                        </td>


                        {/* KATEGORI */}

                        <td>
                          {product.category}
                        </td>


                        {/* HARGA */}

                        <td>
                          {product.price}
                        </td>


                        {/* STOK */}

                        <td>
                          {product.stock}
                        </td>


                        {/* STATUS */}

                        <td>

                          {product.stock === 0 ? (

                            <span className="status danger">
                              Habis
                            </span>

                          ) : product.stock <= 5 ? (

                            <span className="status pending">
                              Stok Menipis
                            </span>

                          ) : (

                            <span className="status success">
                              Tersedia
                            </span>

                          )}

                        </td>


                        {/* AKSI */}

                        <td>

                          <div className="product-actions-buttons">

                            <Link
                              href={`/products/edit/${product.sku}`}
                              className="edit-button"
                            >
                              Edit
                            </Link>


                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleDelete(
                                  product.sku,
                                  product.name
                                )
                              }
                            >
                              Hapus
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      Tidak ada produk yang sesuai
                      dengan filter.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}