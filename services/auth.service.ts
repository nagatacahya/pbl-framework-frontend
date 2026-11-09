// services/auth.service.ts
import { API_URL, apiFetch, tokenStorage } from "./api-client";
import { Setting, User } from "@/types";

export const authService = {
  async login(identifier: string, password: string) {
    const isEmail = identifier.includes("@");
    const body = isEmail ? { email: identifier, password } : { phone: identifier, password };
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.success) tokenStorage.save(data.data.token, data.data.user);
    return data;
  },
  async register(name: string, email: string, phone: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    return await res.json();
  },
  async getProfile() {
    const res = await apiFetch("/auth/me");
    return await res.json();
  },
  async updateProfile(name: string, email: string, phone: string) {
    const res = await apiFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email, phone }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const currentUser = tokenStorage.getUser();
      if (currentUser) tokenStorage.save(tokenStorage.getToken()!, { ...currentUser, name, email, phone });
    }
    return data;
  },
  async getSettings() {
    const res = await fetch(`${API_URL}/auth/settings`);
    return await res.json();
  },
  async updateSettings(appName: string, businessName: string, description: string) {
    const res = await apiFetch("/auth/settings", {
      method: "PUT",
      body: JSON.stringify({ appName, businessName, description }),
    });
    return await res.json();
  },
};