// actions/product.ts
"use server";

import { productSchema } from "@/lib/schemas";

export async function createProductAction(prevState: any, formData: FormData) {
  // 1. Ambil data dari form
  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
    token: formData.get("token"), // Token dikirim dari hidden input
  };

  // 2. Validasi dengan Zod di Server
  const validated = productSchema.safeParse(rawData);
  
  if (!validated.success) {
    // Kembalikan error per field
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // 3. Tembak API Express
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${rawData.token}`, 
      },
      body: JSON.stringify({
        name: validated.data.name,
        category: validated.data.category,
        price: validated.data.price,
        stock: validated.data.stock,
        description: validated.data.description,
      }),
    });

    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json.message || "Gagal menyimpan produk");
    }

    return { success: true, message: "Produk berhasil ditambahkan!" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}