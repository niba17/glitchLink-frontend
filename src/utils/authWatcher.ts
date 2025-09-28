import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useTokenWatcher() {
  const { token, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp;
      if (!exp) {
        clearAuth();
        return;
      }

      const expireTime = exp * 1000; // convert detik ke ms
      const timeout = expireTime - Date.now();

      if (timeout <= 0) {
        clearAuth(); // token sudah expired
        return;
      }

      const timer = setTimeout(() => {
        clearAuth();
      }, timeout);

      return () => clearTimeout(timer);
    } catch {
      clearAuth();
    }
  }, [token, clearAuth]);
}
