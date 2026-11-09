// hooks/use-auth.ts
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/services/api-client";
import { User, Setting } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const localUser = tokenStorage.getUser();
    setUser(localUser);

    if (localUser) {
      const resProfile = await authService.getProfile();
      if (resProfile.success) {
        setUser(resProfile.data);
        tokenStorage.save(tokenStorage.getToken()!, resProfile.data);
      }
    }

    const resSettings = await authService.getSettings();
    if (resSettings.success) setSettings(resSettings.data);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("profileUpdated", handleUpdate);
    return () => window.removeEventListener("profileUpdated", handleUpdate);
  }, []);

  return { user, settings, loading, refresh: loadData };
}