"use server";

export async function deleteTransactionAction(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (res.ok) return { success: true, message: json.message };
    return { success: false, message: json.message || "Gagal menghapus" };
  } catch (error) {
    return { success: false, message: "Koneksi ke server gagal" };
  }
}