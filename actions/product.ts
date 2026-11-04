"use server";
import { productSchema } from "@/lib/schemas";

export type ProductActionState = {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
};

export async function createProductAction(
  prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description") ?? "",
    token: formData.get("token"),
  };

  const validated = productSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "Periksa kembali form Anda",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rawData.token}`,
      },
      body: JSON.stringify({
        name: validated.data.name,
        category: validated.data.category,
        price: validated.data.price,
        stock: validated.data.stock,
        description: validated.data.description,
      }),
      cache: "no-store",
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return { success: true, message: json.message, errors: {} };
    }

    return {
      success: false,
      message: json.message || `Gagal menyimpan produk`,
      errors: json.errors ?? {},
    };
  } catch (err: any) {
    return { success: false, message: "Koneksi ke server gagal", errors: {} };
  }
}