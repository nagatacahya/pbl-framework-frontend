// components/layout/Sidebar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tokenStorage } from "@/services/api-client";
import { notificationService } from "@/services/notification.service";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUser(tokenStorage.getUser());
    const loadUnread = async () => {
      const res = await notificationService.getUnreadCount();
      if (res.success) setUnreadCount(res.data.count);
    };
    loadUnread();

    const handleUpdate = () => {
      setUser(tokenStorage.getUser());
      loadUnread();
    };
    window.addEventListener("profileUpdated", handleUpdate);
    window.addEventListener("notificationUpdated", handleUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleUpdate);
      window.removeEventListener("notificationUpdated", handleUpdate);
    };
  }, []);

  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Produk & Stok", path: "/products" },
    { name: "Monitoring Transaksi", path: "/transactions" },
    { name: "Notifikasi", path: "/notifications", badge: unreadCount },
    { name: "Pengaturan Sistem", path: "/settings" },
  ];

  return (
    <aside className="w-[256px] h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 z-10">
      <div>
        <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100">
          <Image src="/images/logo-horizontal.png" alt="Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="p-4 space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Menu Utama</p>
          {menus.map((menu) => (
            <Link key={menu.path} href={menu.path} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${pathname.startsWith(menu.path) ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>
              <span>{menu.name}</span>
              {menu.badge !== undefined && menu.badge > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{menu.badge > 9 ? "9+" : menu.badge}</span>
              )}
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
            <p className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">{user?.role === "ADMIN" ? "Super Admin" : "User"}</p>
          </div>
          <button onClick={() => { tokenStorage.clear(); router.push("/login"); }} className="text-gray-400 hover:text-red-500">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7.5 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5H7.5" /><path d="M13.3333 14.1666L17.4999 9.99992L13.3333 5.83325" /><path d="M17.5 10H7.5" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}