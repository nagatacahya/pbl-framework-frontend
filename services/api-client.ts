// services/api-client.ts
import { User } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const tokenStorage = {
  save(token: string, user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    document.cookie = `auth_token=${token}; path=/; max-age=86400`; 
  },
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
  isLoggedIn(): boolean {
    return !!this.getToken();
  },
};

// Fungsi helper untuk fetch dengan token otomatis
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = tokenStorage.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  return res;
}