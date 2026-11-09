// services/transaction.service.ts
import { apiFetch } from "./api-client";

export const transactionService = {
  async getAll() {
    const res = await apiFetch("/transactions");
    return await res.json();
  },
  async updateStatus(id: string, status: string) {
    const res = await apiFetch(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return await res.json();
  },
  async delete(id: string) {
    const res = await apiFetch(`/transactions/${id}`, { method: "DELETE" });
    return await res.json();
  },
};