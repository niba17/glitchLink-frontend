import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isTokenValid } from "@/utils/jwt";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  email: string | null;
  rehydrated: boolean;
  setAuth: (auth: {
    isLoggedIn: boolean;
    token: string | null;
    email: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      token: null,
      email: null,
      rehydrated: false,
      setAuth: ({ isLoggedIn, token, email }) => {
        const valid = isTokenValid(token);
        set({
          isLoggedIn: valid ? isLoggedIn : false,
          token: valid ? token : null,
          email: valid ? email : null,
        });
      },
      clearAuth: () => set({ isLoggedIn: false, token: null, email: null }),
      // ==== AUTO LOGOUT INTERVAL ====
      startTokenWatcher: () => {
        setInterval(() => {
          const { token } = get();
          if (!isTokenValid(token)) {
            set({ isLoggedIn: false, token: null, email: null });
          }
        }, 1000 * 10); // cek setiap 10 detik
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          setTimeout(() => {
            const valid = isTokenValid(state.token);
            state.isLoggedIn = valid;
            if (!valid) state.token = null;
            state.rehydrated = true;
          }, 0);
        }
      },
    }
  )
);
