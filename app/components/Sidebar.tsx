// app/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tokenStorage } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(tokenStorage.getUser());
  }, []);

  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Produk & Stok", path: "/products" },
    { name: "Monitoring Transaksi", path: "/transactions" },
    { name: "Notifikasi", path: "/notifications" },
    { name: "Pengaturan Sistem", path: "/settings" },
  ];

  const handleLogout = () => {
    tokenStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-[256px] h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 z-10">
      <div>
        <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100">
          {/* Fallback jika logo belum di-download */}
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
            I
          </div>
          <div>
            <h1 className="text-blue-700 font-bold text-sm">IKOBANA FROZENFOOD</h1>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">UMKM</span>
          </div>
        </div>
        <div className="p-4 space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Menu Utama</p>
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                pathname.startsWith(menu.path) ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">{user?.name || "Administrator"}</p>
            <p className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">
              {user?.role === "ADMIN" ? "Super Admin" : "User"}
            </p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7.5 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5H7.5" />
              <path d="M13.3333 14.1666L17.4999 9.99992L13.3333 5.83325" />
              <path d="M17.5 10H7.5" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}