// app/products/edit/[sku]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { apiFetch } from "@/services/api-client";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const sku = params.sku as string;
  const [productId, setProductId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await productService.getAll();
      if (res.success) {
        const found = res.data.find((p: any) => p.sku === sku);
        if (found) {
          setProductId(found.id);
          setName(found.name);
          setCategory(found.category);
          setPrice(String(found.price));
          setStock(String(found.stock));
          setDescription(found.description || "");
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [sku]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    const res = await apiFetch(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ name, category, price: Number(price), stock: Number(stock), description }),
    });
    if (res.ok) { alert("Produk berhasil diperbarui!"); router.push("/products"); }
    else { alert("Gagal memperbarui produk"); }
  };

  if (loading) return <div className="p-8 text-center">Memuat data produk...</div>;

  return (
    <div className="p-8 bg-[#F9F9FF] min-h-screen">
      <header className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1><p className="text-sm text-gray-500">Ubah informasi produk dan stok</p></header>
      <Link href="/products" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">← Kembali ke Produk</Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-700">Nama Produk</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" required /></div>
          <div><label className="text-xs font-bold text-gray-700">Kategori</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" required><option value="">Pilih kategori</option><option value="Nugget">Nugget</option><option value="Bakso">Bakso</option><option value="Sosis">Sosis</option><option value="Dimsum">Dimsum</option><option value="Kentang">Kentang</option><option value="Frozen Food">Frozen Food</option><option value="Ayam">Ayam</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-gray-700">Harga</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" required /></div>
            <div><label className="text-xs font-bold text-gray-700">Stok</label><input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" required /></div>
          </div>
          <div><label className="text-xs font-bold text-gray-700">Deskripsi</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full mt-1 p-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200" /></div>
          <div className="flex justify-end gap-3 mt-6"><Link href="/products" className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700">Batal</Link><button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700">Simpan Perubahan</button></div>
        </form>
      </div>
    </div>
  );
}