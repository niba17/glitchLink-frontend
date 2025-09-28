// frontend-final/src/features/links/services/linkService.ts
import axios from "axios";
import {
  ImportGuestLinkSinglePayload,
  ImportGuestLinksPayload,
  ShortLinkPayload,
  ShortLinkResponse,
  UserLink,
} from "../types/type";

class ApiError extends Error {
  data: any;
  constructor(message: string, data: any) {
    super(message);
    this.name = "ApiError";
    this.data = data;
  }
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

export const linkService = {
  async generateShortCode(token?: string): Promise<string> {
    const res = await api.get("/links/generate-code", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = res.data;
    if (data.status !== "success")
      throw new Error(data.message || "Failed to generate short code");
    return data.data.code;
  },

  async createShortLink(
    payload: ShortLinkPayload,
    token?: string
  ): Promise<ShortLinkResponse> {
    const res = await api.post("/links", payload, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = res.data;
    if (data.status !== "success") {
      throw new ApiError(
        data.errors?.[0]?.message ||
          data.message ||
          "Failed to create short link",
        data
      );
    }
    return data;
  },

  async getUserLinks(token: string): Promise<UserLink[]> {
    const res = await api.get("/links", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    if (data.status !== "success")
      throw new Error(data.message || "Failed to fetch user links");
    return data.data;
  },

  async updateShortLink(
    id: number,
    payload: { customAlias?: string | null; expiresAt?: string | null },
    token: string
  ) {
    const res = await api.put(`/links/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    if (data.status !== "success") {
      throw new ApiError(
        data.message || data.errors?.[0]?.message || "Failed to update link",
        data
      );
    }
    return data;
  },

  async deleteUserLink(id: number, token: string) {
    const res = await api.delete(`/links/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    if (data.status !== "success")
      throw new Error(data.message || "Failed to delete link");
    return data;
  },

  async generateQRCode(linkId: number, token: string): Promise<string> {
    try {
      const res = await api.get(`/links/${linkId}/qrcode`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      if (data.status !== "success")
        throw new ApiError(data.message || "Failed to generate QR Code", data);
      return data.data as string;
    } catch (err: any) {
      throw new ApiError(
        err.response?.data?.message || err.message,
        err.response?.data
      );
    }
  },

  async importGuestLink(
    payload: ImportGuestLinkSinglePayload,
    token?: string // <--- jadikan optional
  ): Promise<{ status: string; data: any }> {
    try {
      const res = await api.put("/links/import", payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = res.data;
      if (data.status !== "success") {
        throw new ApiError(data.errors?.[0]?.message || data.message, data);
      }
      return data;
    } catch (err: any) {
      throw new ApiError(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          err.message,
        err.response?.data || err
      );
    }
  },
};
