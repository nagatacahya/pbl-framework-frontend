// app/products/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { tokenStorage } from "@/lib/api";
import { useActionState, useEffect } from "react";
import { createProductAction, type ProductActionState } from "@/actions/product";

const initialState: ProductActionState = { success: false, message: "", errors: {} };

export default function AddProductPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createProductAction, initialState);
  
  // State Pop-up Sukses (Poin 13)
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setIsSuccess(true);
    }
  }, [state.success]);

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      
      <main className="ml-[256px] flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">
              <Link href="/products" className="hover:underline">Produk & Stok</Link> / Tambah Produk Baru
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
          </div>
          <div className="flex gap-3">
            <button type="submit" form="add-product-form" disabled={isPending} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700">
              {isPending ? "Menyimpan..." : "Publikasikan"}
            </button>
            <Link href="/products" className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-red-700">
              Batal
            </Link>
          </div>
        </div>

        {state.message && !state.success && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-semibold">{state.message}</div>
        )}

        <form id="add-product-form" action={formAction} className="grid grid-cols-3 gap-6">
          <input type="hidden" name="token" value={tokenStorage.getToken() || ""} />
          
          {/* Kolom Kiri: Informasi Dasar */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar Produk</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Nama Produk Beku *</label>
                  <input type="text" name="name" required className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nugget Ayam Crispy Golden 500g" />
                  {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Kode SKU *</label>
                    <input type="text" name="sku" disabled className="w-full mt-1 p-2.5 bg-gray-100 rounded-lg text-sm border border-gray-200" placeholder="Auto-generate" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Kategori Produk *</label>
                    <select name="category" required className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Pilih Kategori</option>
                      <option value="Nugget">Olahan Ayam (Nugget, Sosis, Karage)</option>
                      <option value="Bakso">Olahan Daging (Bakso, Sosis Sapi)</option>
                      <option value="Dimsum">Camilan & Siap Masak (Dimsum, Siomay)</option>
                      <option value="Kentang">Camilan & Kentang (Fries, Hashbrown)</option>
                    </select>
                    {state.errors?.category && <p className="text-red-500 text-xs mt-1">{state.errors.category[0]}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Deskripsi & Komposisi (Opsional)</label>
                  <textarea name="description" rows={4} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dibuat dari 100% daging dada ayam..."></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Penetapan Harga & Stok</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Harga Jual Satuan (Rp) *</label>
                  <input type="number" name="price" required className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="38000" />
                  {state.errors?.price && <p className="text-red-500 text-xs mt-1">{state.errors.price[0]}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Jumlah Stok Awal *</label>
                  <input type="number" name="stock" required className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="50" />
                  {state.errors?.stock && <p className="text-red-500 text-xs mt-1">{state.errors.stock[0]}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Upload Foto (Dummy UI) */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Foto Produk</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-50 text-gray-400 mb-4">
                <span className="text-4xl mb-2">📷</span>
                <p className="text-xs">Klik untuk upload foto</p>
              </div>
              <p className="text-[10px] text-gray-500 text-center">Format JPG, PNG, WEBP. Maks 5MB.</p>
            </div>
          </div>
        </form>
      </main>

      {/* Pop-up Publikasi Berhasil (Poin 13) */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Publikasi Berhasil!</h2>
            <button onClick={() => router.push("/products")} className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl mt-4 hover:bg-blue-50">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}