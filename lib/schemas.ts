// lib/schemas.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter").max(255),
  category: z.string().min(1, "Kategori wajib dipilih"),
  price: z.coerce.number().min(1000, "Harga minimal Rp 1.000"),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  description: z.string().optional().default(""),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau nomor HP wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});