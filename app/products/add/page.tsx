// app/products/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import { tokenStorage } from "@/services/api-client";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", description: "" });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const token = tokenStorage.getToken();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsSuccess(true);
      } else {
        alert(json.message || "Gagal menambah produk");
      }
    } catch (err) {
      alert("Koneksi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FF]">
      <Sidebar />
      <main className="ml-[256px] flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1"><Link href="/products" className="hover:underline">Produk & Stok</Link> / Tambah Produk Baru</p>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
          </div>
          <div className="flex gap-3">
            <button type="submit" form="add-product-form" disabled={isLoading} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Menyimpan..." : "Publikasikan"}</button>
            <Link href="/products" className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-red-700">Batal</Link>
          </div>
        </div>

        <form id="add-product-form" onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar Produk</h2>
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-gray-700">Nama Produk Beku *</label><input type="text" name="name" required onChange={(e) => setForm({...form, name: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" placeholder="Nugget Ayam Crispy Golden 500g" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-gray-700">Kode SKU *</label><input type="text" disabled className="w-full mt-1 p-2.5 bg-gray-100 rounded-lg text-sm border border-gray-200" placeholder="Auto-generate" /></div>
                  <div><label className="text-xs font-bold text-gray-700">Kategori Produk *</label><select name="category" required onChange={(e) => setForm({...form, category: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200"><option value="">Pilih Kategori</option><option value="Nugget">Olahan Ayam</option><option value="Bakso">Olahan Daging</option><option value="Dimsum">Camilan & Siap Masak</option><option value="Kentang">Camilan & Kentang</option></select></div>
                </div>
                <div><label className="text-xs font-bold text-gray-700">Deskripsi (Opsional)</label><textarea name="description" rows={4} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200"></textarea></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Penetapan Harga & Stok</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-700">Harga Jual Satuan (Rp) *</label><input type="number" name="price" required onChange={(e) => setForm({...form, price: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" /></div>
                <div><label className="text-xs font-bold text-gray-700">Jumlah Stok Awal *</label><input type="number" name="stock" required onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" /></div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Foto Produk</h2>
              <label className="relative border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-50 text-gray-400 mb-4 cursor-pointer hover:bg-gray-100 transition overflow-hidden">
                {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <><span className="text-4xl mb-2">📷</span><p className="text-xs font-semibold">Klik untuk upload foto</p></>}
                <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <p className="text-[10px] text-gray-500 text-center">Format JPG, PNG, WEBP. Maks 5MB.</p>
            </div>
          </div>
        </form>
      </main>

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-200"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Publikasi Berhasil!</h2>
            <button onClick={() => router.push("/products")} className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl mt-4 hover:bg-blue-50">Kembali</button>
          </div>
        </div>
      )}
    </div>
  );
}