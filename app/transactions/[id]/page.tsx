"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  name: string;
  quantity: number;
  price: number;
  total: number;
  icon: string;
};

type Transaction = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  address: string;
  district: string;
  city: string;
  postalCode: string;
  products: Product[];
  shipping: number;
  payment: string;
  paymentStatus: string;
  paymentTime: string;
};

const defaultTransactions: Record<string, Transaction> = {
  "TRX-001": {
    id: "TRX-001",
    customer: "Andi Saputra",
    email: "andi@gmail.com",
    phone: "0812-1111-2222",
    date: "30 September 2026, 10:30 WIB",
    status: "Selesai",
    address: "Jl. Soekarno Hatta No. 15",
    district: "Kecamatan Lowokwaru",
    city: "Kota Malang, Jawa Timur",
    postalCode: "65141",
    products: [
      {
        name: "Chicken Nugget",
        quantity: 2,
        price: 30000,
        total: 60000,
        icon: "🍗",
      },
      {
        name: "French Fries",
        quantity: 1,
        price: 25000,
        total: 25000,
        icon: "🍟",
      },
    ],
    shipping: 10000,
    payment: "Transfer Bank",
    paymentStatus: "Lunas",
    paymentTime: "30 September 2026, 10:35 WIB",
  },

  "TRX-002": {
    id: "TRX-002",
    customer: "Budi Santoso",
    email: "budi@gmail.com",
    phone: "0812-3456-7890",
    date: "29 September 2026, 14:30 WIB",
    status: "Diproses",
    address: "Jl. Merdeka No. 10",
    district: "Kecamatan Lowokwaru",
    city: "Kota Malang, Jawa Timur",
    postalCode: "65141",
    products: [
      {
        name: "Chicken Nugget",
        quantity: 2,
        price: 30000,
        total: 60000,
        icon: "🍗",
      },
      {
        name: "French Fries",
        quantity: 1,
        price: 25000,
        total: 25000,
        icon: "🍟",
      },
    ],
    shipping: 10000,
    payment: "Transfer Bank",
    paymentStatus: "Lunas",
    paymentTime: "29 September 2026, 14:35 WIB",
  },

  "TRX-003": {
    id: "TRX-003",
    customer: "Citra Lestari",
    email: "citra@gmail.com",
    phone: "0813-5555-6666",
    date: "28 September 2026, 09:15 WIB",
    status: "Selesai",
    address: "Jl. Veteran No. 25",
    district: "Kecamatan Klojen",
    city: "Kota Malang, Jawa Timur",
    postalCode: "65111",
    products: [
      {
        name: "Chicken Nugget",
        quantity: 3,
        price: 30000,
        total: 90000,
        icon: "🍗",
      },
      {
        name: "Sosis Frozen",
        quantity: 2,
        price: 50000,
        total: 100000,
        icon: "🌭",
      },
    ],
    shipping: 20000,
    payment: "QRIS",
    paymentStatus: "Lunas",
    paymentTime: "28 September 2026, 09:20 WIB",
  },

  "TRX-004": {
    id: "TRX-004",
    customer: "Dimas Pratama",
    email: "dimas@gmail.com",
    phone: "0812-7777-8888",
    date: "27 September 2026, 16:00 WIB",
    status: "Menunggu",
    address: "Jl. Dinoyo No. 8",
    district: "Kecamatan Dinoyo",
    city: "Kota Malang, Jawa Timur",
    postalCode: "65144",
    products: [
      {
        name: "French Fries",
        quantity: 3,
        price: 25000,
        total: 75000,
        icon: "🍟",
      },
    ],
    shipping: 0,
    payment: "Transfer Bank",
    paymentStatus: "Menunggu",
    paymentTime: "-",
  },
};

export default function TransactionDetail() {
  const params = useParams();

  const transactionId = String(params.id);

  const [transaction, setTransaction] =
    useState<Transaction | null>(null);

  const [status, setStatus] =
    useState("Menunggu");

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // AMBIL DATA TRANSAKSI
  // =====================================================

  useEffect(() => {
    const loadTransaction = () => {
      try {
        const storedTransactions =
          localStorage.getItem("transactions");

        let storedTransaction: Partial<Transaction> | undefined;

        if (storedTransactions) {
          const transactions = JSON.parse(
            storedTransactions
          );

          if (Array.isArray(transactions)) {
            storedTransaction = transactions.find(
              (item: Transaction) =>
                item.id === transactionId
            );
          }
        }

        const defaultTransaction =
          defaultTransactions[transactionId];

        if (defaultTransaction) {
          /*
           * Data detail dari defaultTransaction
           * digabung dengan data dari localStorage.
           *
           * Jadi walaupun localStorage hanya punya:
           * id, customer, date, total, status
           *
           * data products, alamat, pembayaran, dll
           * tetap tersedia.
           */

          const mergedTransaction: Transaction = {
            ...defaultTransaction,
            ...(storedTransaction || {}),
            products:
              storedTransaction?.products ??
              defaultTransaction.products,
          };

          setTransaction(mergedTransaction);
          setStatus(mergedTransaction.status);
        } else if (storedTransaction) {
          /*
           * Jika transaksi ada di localStorage tetapi
           * tidak ada di defaultTransactions.
           */

          const safeTransaction: Transaction = {
            id: storedTransaction.id || transactionId,
            customer:
              storedTransaction.customer || "-",
            email:
              storedTransaction.email || "-",
            phone:
              storedTransaction.phone || "-",
            date:
              storedTransaction.date || "-",
            status:
              storedTransaction.status || "Menunggu",
            address:
              storedTransaction.address || "-",
            district:
              storedTransaction.district || "-",
            city:
              storedTransaction.city || "-",
            postalCode:
              storedTransaction.postalCode || "-",
            products:
              storedTransaction.products || [],
            shipping:
              storedTransaction.shipping || 0,
            payment:
              storedTransaction.payment || "-",
            paymentStatus:
              storedTransaction.paymentStatus || "-",
            paymentTime:
              storedTransaction.paymentTime || "-",
          };

          setTransaction(safeTransaction);
          setStatus(safeTransaction.status);
        }
      } catch (error) {
        console.error(
          "Gagal mengambil data transaksi:",
          error
        );
      }

      setLoading(false);
    };

    loadTransaction();
  }, [transactionId]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleUpdateStatus = () => {
    if (!transaction) return;

    try {
      const storedTransactions =
        localStorage.getItem("transactions");

      let transactions: Transaction[] = [];

      if (storedTransactions) {
        const parsed = JSON.parse(
          storedTransactions
        );

        if (Array.isArray(parsed)) {
          transactions = parsed;
        }
      }

      /*
       * Jika localStorage kosong,
       * buat dari data default.
       */

      if (transactions.length === 0) {
        transactions = Object.values(
          defaultTransactions
        );
      }

      /*
       * Cari transaksi berdasarkan ID.
       * Kalau ada, update statusnya.
       * Kalau belum ada, tambahkan.
       */

      const existingIndex =
        transactions.findIndex(
          (item) =>
            item.id === transaction.id
        );

      if (existingIndex !== -1) {
        transactions[existingIndex] = {
          ...transactions[existingIndex],
          ...transaction,
          status: status,
          products:
            transactions[existingIndex].products ??
            transaction.products,
        };
      } else {
        transactions.push({
          ...transaction,
          status: status,
        });
      }

      localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
      );

      setTransaction({
        ...transaction,
        status: status,
      });

      alert(
        "Status transaksi berhasil diperbarui!"
      );
    } catch (error) {
      console.error(
        "Gagal memperbarui status:",
        error
      );

      alert(
        "Gagal memperbarui status transaksi."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h2>IKOBANA</h2>
            <p>Frozen Food</p>
          </div>
        </aside>

        <main className="main-content">
          <h1>Memuat Detail Transaksi...</h1>
        </main>
      </div>
    );
  }

  // =====================================================
  // TRANSAKSI TIDAK DITEMUKAN
  // =====================================================

  if (!transaction) {
    return (
      <div className="dashboard-layout">

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

            <Link
              href="/transactions"
              className="active"
            >
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

        <main className="main-content">

          <h1>
            Transaksi Tidak Ditemukan
          </h1>

          <p>
            Data transaksi dengan ID{" "}
            <strong>
              {transactionId}
            </strong>{" "}
            tidak tersedia.
          </p>

          <br />

          <Link
            href="/transactions"
            className="back-transaction"
          >
            ← Kembali ke Transaksi
          </Link>

        </main>

      </div>
    );
  }

  // =====================================================
  // HITUNG SUBTOTAL
  // =====================================================

  /*
   * Menggunakan ?? [] supaya tidak error
   * apabila products tidak tersedia.
   */

  const subtotal =
    (transaction.products ?? []).reduce(
      (total, product) =>
        total + product.total,
      0
    );

  const grandTotal =
    subtotal + (transaction.shipping || 0);

  // =====================================================
  // TAMPILAN
  // =====================================================

  return (
    <div className="dashboard-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <h2>
            IKOBANA
          </h2>

          <p>
            Frozen Food
          </p>

        </div>

        <nav className="sidebar-menu">

          <Link href="/dashboard">
            🏠 Dashboard
          </Link>

          <Link href="/products">
            📦 Produk
          </Link>

          <Link
            href="/transactions"
            className="active"
          >
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

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Detail Transaksi
            </h1>

            <p>
              Informasi lengkap transaksi pelanggan
            </p>

          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>

              <strong>
                Admin
              </strong>

              <small>
                Administrator
              </small>

            </div>

          </div>

        </header>

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          href="/transactions"
          className="back-transaction"
        >
          ← Kembali ke Transaksi
        </Link>

        {/* =================================================
            TRANSACTION HEADER
        ================================================= */}

        <section className="transaction-detail-card">

          <div className="transaction-detail-header">

            <div>

              <h2>
                #{transaction.id}
              </h2>

              <p>
                {transaction.date}
              </p>

            </div>

            <span
              className={`transaction-status ${
                status === "Selesai"
                  ? "status-success"
                  : status === "Diproses"
                  ? "status-process"
                  : "status-waiting"
              }`}
            >
              {status}
            </span>

          </div>

        </section>

        {/* =================================================
            CUSTOMER + ADDRESS
        ================================================= */}

        <section className="transaction-detail-grid">

          {/* INFORMASI PELANGGAN */}

          <div className="transaction-detail-card">

            <h3>
              Informasi Pelanggan
            </h3>

            <div className="detail-info">

              <div>

                <span>
                  Nama Pelanggan
                </span>

                <strong>
                  {transaction.customer}
                </strong>

              </div>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {transaction.email}
                </strong>

              </div>

              <div>

                <span>
                  No. Telepon
                </span>

                <strong>
                  {transaction.phone}
                </strong>

              </div>

            </div>

          </div>

          {/* ALAMAT PENGIRIMAN */}

          <div className="transaction-detail-card">

            <h3>
              Alamat Pengiriman
            </h3>

            <div className="detail-address">

              <strong>
                {transaction.customer}
              </strong>

              <p>

                {transaction.address}

                <br />

                {transaction.district}

                <br />

                {transaction.city}

                <br />

                {transaction.postalCode}

              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            UPDATE STATUS
        ================================================= */}

        <section className="transaction-detail-card">

          <h3>
            Update Status Transaksi
          </h3>

          <div className="status-update">

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >

              <option value="Menunggu">
                Menunggu
              </option>

              <option value="Diproses">
                Diproses
              </option>

              <option value="Selesai">
                Selesai
              </option>

            </select>

            <button
              onClick={
                handleUpdateStatus
              }
            >
              Update Status
            </button>

          </div>

        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section className="transaction-detail-card">

          <h3>
            Produk yang Dibeli
          </h3>

          {(transaction.products ?? []).length === 0 ? (

            <p>
              Tidak ada data produk.
            </p>

          ) : (

            (transaction.products ?? []).map(
              (product, index) => (

                <div
                  className="transaction-product"
                  key={index}
                >

                  <div className="product-detail-info">

                    <div className="product-image">
                      {product.icon}
                    </div>

                    <div>

                      <strong>
                        {product.name}
                      </strong>

                      <p>
                        {product.quantity} × Rp
                        {product.price.toLocaleString(
                          "id-ID"
                        )}
                      </p>

                    </div>

                  </div>

                  <strong>
                    Rp
                    {product.total.toLocaleString(
                      "id-ID"
                    )}
                  </strong>

                </div>

              )
            )

          )}

        </section>

        {/* =================================================
            PAYMENT SUMMARY
        ================================================= */}

        <section className="transaction-detail-card">

          <h3>
            Ringkasan Pembayaran
          </h3>

          <div className="payment-summary">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                Rp
                {subtotal.toLocaleString(
                  "id-ID"
                )}
              </strong>

            </div>

            <div>

              <span>
                Ongkos Kirim
              </span>

              <strong>
                Rp
                {(transaction.shipping || 0).toLocaleString(
                  "id-ID"
                )}
              </strong>

            </div>

            <div className="payment-total">

              <span>
                Total Pembayaran
              </span>

              <strong>
                Rp
                {grandTotal.toLocaleString(
                  "id-ID"
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            PAYMENT INFORMATION
        ================================================= */}

        <section className="transaction-detail-card">

          <h3>
            Informasi Pembayaran
          </h3>

          <div className="detail-info">

            <div>

              <span>
                Metode Pembayaran
              </span>

              <strong>
                {transaction.payment}
              </strong>

            </div>

            <div>

              <span>
                Status Pembayaran
              </span>

              <strong className="payment-success">
                {transaction.paymentStatus}
              </strong>

            </div>

            <div>

              <span>
                Waktu Pembayaran
              </span>

              <strong>
                {transaction.paymentTime}
              </strong>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}