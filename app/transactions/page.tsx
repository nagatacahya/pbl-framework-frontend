"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Transaction = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
};

const defaultTransactions: Transaction[] = [
  {
    id: "TRX-001",
    customer: "Andi Saputra",
    date: "30 Sep 2026",
    total: 125000,
    status: "Selesai",
  },
  {
    id: "TRX-002",
    customer: "Budi Santoso",
    date: "29 Sep 2026",
    total: 85000,
    status: "Diproses",
  },
  {
    id: "TRX-003",
    customer: "Citra Lestari",
    date: "28 Sep 2026",
    total: 210000,
    status: "Selesai",
  },
  {
    id: "TRX-004",
    customer: "Dimas Pratama",
    date: "27 Sep 2026",
    total: 75000,
    status: "Menunggu",
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(defaultTransactions);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [dateFilter, setDateFilter] = useState("");

  // FORMAT RUPIAH
  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // LOAD DATA TRANSAKSI
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      try {
        const parsedTransactions: Transaction[] =
          JSON.parse(savedTransactions);

        setTransactions(parsedTransactions);
      } catch {
        localStorage.setItem(
          "transactions",
          JSON.stringify(defaultTransactions)
        );
      }
    } else {
      localStorage.setItem(
        "transactions",
        JSON.stringify(defaultTransactions)
      );
    }
  }, []);

  // FILTER TRANSAKSI
  const filteredTransactions = transactions.filter((transaction) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      transaction.id.toLowerCase().includes(searchValue) ||
      transaction.customer.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "Semua Status" ||
      transaction.status === statusFilter;

    const matchesDate =
      dateFilter === "" ||
      transaction.date.includes(
        new Date(dateFilter).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );

    return matchesSearch && matchesStatus && matchesDate;
  });

  // STATISTIK
  const totalTransactions = transactions.length;

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "Selesai"
  ).length;

  const processingTransactions = transactions.filter(
    (transaction) => transaction.status === "Diproses"
  ).length;

  const waitingTransactions = transactions.filter(
    (transaction) => transaction.status === "Menunggu"
  ).length;

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

          <Link href="/products">
            📦 Produk
          </Link>

          <Link href="/transactions" className="active">
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

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <h1>Transaksi</h1>
            <p>Kelola seluruh transaksi pelanggan</p>
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

        {/* STATISTIK */}
        <div className="transaction-stats">

          <div className="transaction-stat-card">
            <span>Total Transaksi</span>
            <strong>{totalTransactions}</strong>
          </div>

          <div className="transaction-stat-card">
            <span>Selesai</span>
            <strong>{completedTransactions}</strong>
          </div>

          <div className="transaction-stat-card">
            <span>Diproses</span>
            <strong>{processingTransactions}</strong>
          </div>

          <div className="transaction-stat-card">
            <span>Menunggu</span>
            <strong>{waitingTransactions}</strong>
          </div>

        </div>

        {/* CONTENT CARD */}
        <section className="transaction-card">

          <div className="transaction-card-header">

            <div>
              <h2>Daftar Transaksi</h2>
              <p>Data transaksi pelanggan</p>
            </div>

            <div className="transaction-tools">

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* FILTER STATUS */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Semua Status</option>
                <option>Selesai</option>
                <option>Diproses</option>
                <option>Menunggu</option>
              </select>

              {/* FILTER TANGGAL */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />

            </div>

          </div>

          {/* TABLE */}
          <div className="transaction-table-wrapper">

            <table className="transaction-table">

              <thead>

                <tr>
                  <th>ID Transaksi</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>

              </thead>

              <tbody>

                {filteredTransactions.length > 0 ? (

                  filteredTransactions.map((transaction) => (

                    <tr key={transaction.id}>

                      <td>
                        <strong>#{transaction.id}</strong>
                      </td>

                      <td>
                        {transaction.customer}
                      </td>

                      <td>
                        {transaction.date}
                      </td>

                      <td>
                        <strong>
                          {formatRupiah(transaction.total)}
                        </strong>
                      </td>

                      <td>

                        <span
                          className={`transaction-status ${
                            transaction.status === "Selesai"
                              ? "status-success"
                              : transaction.status === "Diproses"
                              ? "status-process"
                              : "status-waiting"
                          }`}
                        >
                          {transaction.status}
                        </span>

                      </td>

                      <td>

                        <Link
                          href={`/transactions/${transaction.id}`}
                          className="detail-button"
                        >
                          Detail
                        </Link>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#777",
                      }}
                    >
                      Tidak ada transaksi yang sesuai.
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