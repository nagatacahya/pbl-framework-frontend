// services/product.service.ts
import { apiFetch } from "./api-client";

export const productService = {
  async getAll() {
    const res = await apiFetch("/products");
    return await res.json();
  },
  async delete(id: string) {
    const res = await apiFetch(`/products/${id}`, { method: "DELETE" });
    return await res.json();
  },
  async bulkUpdateStock(updates: { id: string; newStock: number }[]) {
    const res = await apiFetch("/products/bulk-update-stock", {
      method: "PUT",
      body: JSON.stringify({ updates }),
    });
    return await res.json();
  },
};