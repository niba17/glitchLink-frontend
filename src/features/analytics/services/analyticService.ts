import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

export const analyticService = {
  async getLinkAnalytics(shortlinkId: number, token: string): Promise<any> {
    // Mengubah tipe pengembalian menjadi any untuk fleksibilitas
    const res = await api.get(`/links/${shortlinkId}/analytics`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message ||
        data.message ||
        "Failed to fetch analytics data";
      throw new Error(message);
    }

    // Mengembalikan seluruh objek data
    return data.data;
  },
};
