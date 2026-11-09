// services/notification.service.ts
import { apiFetch } from "./api-client";

export const notificationService = {
  async getAll(params: { category?: string; search?: string; startDate?: string; endDate?: string; status?: string }) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    const res = await apiFetch(`/notifications?${query.toString()}`);
    return await res.json();
  },

  async getUnreadCount() {
    const res = await apiFetch("/notifications/unread-count");
    return await res.json();
  },

  async markAsRead(id: string) {
    const res = await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
    return await res.json();
  },

  async markAllAsRead() {
    const res = await apiFetch("/notifications/read-all", { method: "PUT" });
    return await res.json();
  },
};