// lib/schemas.ts
import { z } from "zod";

// Schema Validasi Produk (Dipakai Client & Server)
export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  price: z.coerce.number().min(1000, "Harga minimal Rp 1.000"),
  stock: z.coerce.number().min(1, "Stok minimal 1"),
  description: z.string().optional(),
});

// Schema Validasi Register Admin/User
export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});