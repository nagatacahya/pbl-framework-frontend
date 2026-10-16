"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tokenStorage, type User } from "@/lib/api";

// ============================================================
// TYPES
// ============================================================
type Product = {
  name: string;
  category: string;
  price: string;
  stock: number;
  sku: string;
};

type Transaction = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
};

// ============================================================
// DATA DUMMY (untuk demo dashboard)
// ============================================================
const defaultProducts: Product[] = [
  { name: "Nugget Ayam", category: "Nugget", price: "Rp 35.000", stock: 3, sku: "NG001" },
  { name: "Bakso Sapi", category: "Bakso", price: "Rp 40.000", stock: 7, sku: "BS002" },
  { name: "Sosis Ayam", category: "Sosis", price: "Rp 28.000", stock: 9, sku: "SA003" },
  { name: "Dimsum Ayam", category: "Dimsum", price: "Rp 32.000", stock: 25, sku: "DM004" },
  { name: "Kentang Frozen", category: "Frozen Food", price: "Rp 27.000", stock: 31, sku: "KF005" },
  { name: "Chicken Wings", category: "Ayam", price: "Rp 45.000", stock: 18, sku: "CW006" },
];

const defaultTransactions: Transaction[] = [
  { id: "TRX-001", customer: "Andi Saputra", date: "30 Sep 2026", total: 125000, status: "Selesai" },
  { id: "TRX-002", customer: "Budi Santoso", date: "29 Sep 2026", total: 85000, status: "Diproses" },
  { id: "TRX-003", customer: "Citra Lestari", date: "28 Sep 2026", total: 210000, status: "Selesai" },
  { id: "TRX-004", customer: "Dimas Pratama", date: "27 Sep 2026", total: 75000, status: "Menunggu" },
];

// ============================================================
// DASHBOARD PAGE
// ============================================================
export default function DashboardPage() {
  const router = useRouter();

  // ===== STATE AUTH =====
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // ===== STATE DATA =====
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);

  // ============================================================
  // 🔒 CEK AUTH + ROLE — WAJIB ADMIN
  // ============================================================
  useEffect(() => {
    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();

    // 1. Belum login → redirect ke login
    if (!token || !user) {
      router.push("/");
      return;
    }

    // 2. Role bukan ADMIN → tolak akses
    if (user.role !== "ADMIN") {
      alert("❌ Akses Ditolak. Hanya ADMIN yang bisa masuk ke dashboard web.");
      tokenStorage.clear();
      router.push("/");
      return;
    }

    // 3. OK — set user & lanjut
    setCurrentUser(user);
    setIsChecking(false);
  }, [router]);

  // ============================================================
  // LOAD DATA PRODUK DARI LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    if (isChecking) return;

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");

    if (savedProducts.length > 0) {
      const savedBySku = new Map(
        savedProducts.map((product: Product) => [product.sku, product])
      );

      const updatedDefaultProducts = defaultProducts.map(
        (product) => savedBySku.get(product.sku) || product
      );

      const customProducts = savedProducts.filter(
        (product: Product) =>
          !defaultProducts.some(
            (defaultProduct) => defaultProduct.sku === product.sku
          )
      );

      setProducts([...updatedDefaultProducts, ...customProducts]);
    } else {
      localStorage.setItem("products", JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  }, [isChecking]);

  // ============================================================
  // LOAD DATA TRANSAKSI DARI LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    if (isChecking) return;

    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch {
        localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
        setTransactions(defaultTransactions);
      }
    } else {
      localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
      setTransactions(defaultTransactions);
    }
  }, [isChecking]);

  // ============================================================
  // HANDLE LOGOUT
  // ============================================================
  const handleLogout = () => {
    if (!confirm("Yakin ingin keluar?")) return;
    tokenStorage.clear();
    router.push("/");
  };

  // ============================================================
  // HITUNG STATISTIK
  // ============================================================
  const totalProducts = products.length;
  const totalStock = products.reduce((total, p) => total + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const totalOrders = transactions.length;
  const uniqueCustomers = new Set(transactions.map((t) => t.customer)).size;
  const totalRevenue = transactions.reduce((total, t) => total + t.total, 0);

  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          fontSize: "16px",
          color: "#64748B",
        }}
      >
        🔒 Memeriksa akses admin...
      </div>
    );
  }

  // ============================================================
  // RENDER DASHBOARD
  // ============================================================
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">❄</div>
          <div>
            <h2>Ikobana</h2>
            <span>Frozenfood</span>
          </div>
        </div>

        <nav className="menu">
          <Link className="menu-item active" href="/dashboard">
            <span>▣</span>
            Dashboard
          </Link>
          <Link className="menu-item" href="/products">
            <span>▤</span>
            Produk & Stok
          </Link>
          <Link className="menu-item" href="/transactions">
            <span>▥</span>
            Transaksi
          </Link>
          <Link className="menu-item" href="/settings">
            <span>⚙</span>
            Pengaturan
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="avatar">
              {currentUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <strong>{currentUser?.name || "Admin"}</strong>
              <small>{currentUser?.role || "Administrator"}</small>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="logout"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "inherit",
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
            }}
          >
            ↪ Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Selamat datang kembali, <strong>{currentUser?.name || "Admin"}</strong>!
            </p>
          </div>

          <div className="header-right">
            <button className="notification">🔔</button>
            <div className="header-user">
              <div className="avatar">
                {currentUser?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <strong>{currentUser?.name || "Admin"}</strong>
                <small>{currentUser?.email || "admin@ikobana.com"}</small>
              </div>
            </div>
          </div>
        </header>

        {/* STATISTICS */}
        <section className="statistics">
          <div className="stat-card">
            <div className="stat-icon blue">📦</div>
            <div>
              <p>Total Produk</p>
              <h2>{totalProducts}</h2>
              <span className="positive">{totalStock} total stok</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">🛒</div>
            <div>
              <p>Total Pesanan</p>
              <h2>{totalOrders}</h2>
              <span className="positive">Data transaksi</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">👥</div>
            <div>
              <p>Total Pelanggan</p>
              <h2>{uniqueCustomers}</h2>
              <span className="positive">Pelanggan unik</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">💰</div>
            <div>
              <p>Total Pendapatan</p>
              <h2>{formatRupiah(totalRevenue)}</h2>
              <span className="positive">Dari transaksi</span>
            </div>
          </div>
        </section>

        {/* CONTENT GRID */}
        <section className="dashboard-grid">
          {/* PENJUALAN */}
          <div className="dashboard-card chart-card">
            <div className="card-header">
              <div>
                <h3>Penjualan</h3>
                <p>Statistik penjualan 7 hari terakhir</p>
              </div>
              <select>
                <option>7 Hari</option>
                <option>30 Hari</option>
              </select>
            </div>

            <div className="chart">
              <div className="chart-bar" style={{ height: "40%" }} />
              <div className="chart-bar" style={{ height: "60%" }} />
              <div className="chart-bar" style={{ height: "45%" }} />
              <div className="chart-bar" style={{ height: "75%" }} />
              <div className="chart-bar" style={{ height: "55%" }} />
              <div className="chart-bar" style={{ height: "90%" }} />
              <div className="chart-bar" style={{ height: "70%" }} />
            </div>

            <div className="chart-labels">
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
              <span>Min</span>
            </div>
          </div>

          {/* STOK MENIPIS */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Stok Menipis</h3>
                <p>Produk yang perlu diperhatikan</p>
              </div>
              <Link href="/products">Lihat semua</Link>
            </div>

            <div className="stock-list">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div className="stock-item" key={product.sku}>
                    <div>
                      <strong>{product.name}</strong>
                      <small>SKU: {product.sku}</small>
                    </div>
                    <span
                      className={
                        product.stock <= 3 ? "stock-danger" : "stock-warning"
                      }
                    >
                      {product.stock} tersisa
                    </span>
                  </div>
                ))
              ) : (
                <p>Tidak ada produk dengan stok menipis.</p>
              )}
            </div>
          </div>
        </section>

        {/* TRANSACTIONS */}
        <section className="dashboard-card transaction-card">
          <div className="card-header">
            <div>
              <h3>Transaksi Terbaru</h3>
              <p>Daftar transaksi terbaru</p>
            </div>
            <Link href="/transactions">Lihat semua</Link>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.customer}</td>
                    <td>{transaction.date}</td>
                    <td>{formatRupiah(transaction.total)}</td>
                    <td>
                      <span
                        className={
                          transaction.status === "Selesai"
                            ? "status success"
                            : transaction.status === "Diproses"
                            ? "status process"
                            : "status pending"
                        }
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}