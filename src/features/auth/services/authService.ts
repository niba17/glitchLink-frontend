import axios from "axios";
import { SignUpPayload, SignInPayload, AuthResponse } from "../types/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

export const authService = {
  register: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const res = await api.post("/users", payload, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  },

  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    const res = await api.post("/users/login", payload, {
      headers: { "Content-Type": "application/json" },
    });

    // jangan hanya return data, return seluruh res.data
    return res.data;
  },
};
