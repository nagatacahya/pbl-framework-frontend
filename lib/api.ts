// lib/api.ts
// Helper untuk komunikasi dengan backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============================================================
// TYPES
// ============================================================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================
export const tokenStorage = {
  save(token: string, user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
  },
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
  isLoggedIn(): boolean {
    return !!this.getToken();
  },
};

// ============================================================
// FETCH HELPER (auto-attach token)
// ============================================================
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Auto-attach token kalau ada
  const token = tokenStorage.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    // Auto-logout kalau token expired
    if (res.status === 401) {
      tokenStorage.clear();
    }

    return data;
  } catch (err) {
    return {
      success: false,
      message:
        "Tidak dapat terhubung ke server. Pastikan backend berjalan di port 5000.",
    };
  }
}

// ============================================================
// AUTH API
// ============================================================
export const authApi = {
  /**
   * Login user
   */
  async login(identifier: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const isEmail = identifier.includes("@");
    const body = isEmail
      ? { email: identifier, password }
      : { phone: identifier, password };

    const response = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Simpan token kalau sukses
    if (response.success && response.data) {
      tokenStorage.save(response.data.token, response.data.user);
    }

    return response;
  },

  /**
   * Register user baru
   */
  async register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<ApiResponse<User>> {
    return apiFetch<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    });
  },

  /**
   * Logout (hapus token di client)
   */
  async logout(): Promise<void> {
    await apiFetch("/auth/logout", { method: "POST" });
    tokenStorage.clear();
  },

  /**
   * Ambil profil user yang sedang login
   */
  async getMe(): Promise<ApiResponse<User>> {
    return apiFetch<User>("/auth/me");
  },
};

// ============================================================
// ADMIN API (RBAC)
// ============================================================
export const adminApi = {
  /**
   * Ambil semua user (khusus admin)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiFetch<User[]>("/admin/users");
  },

  /**
   * Hapus user (khusus admin)
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/admin/users/${id}`, { method: "DELETE" });
  },
};