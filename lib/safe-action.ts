// lib/safe-action.ts
import { createSafeActionClient } from "next-safe-action";

export const authActionClient = createSafeActionClient({
  // ✅ Perbaikan: Gunakan handleServerError
  handleServerError: (e) => {
    if (e instanceof Error) {
      return e.message;
    }
    return "Terjadi kesalahan pada server";
  },
});