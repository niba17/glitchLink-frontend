import { DeviceKey, OSKey, BrowserKey, ReferrerKey } from "../types/type";

export const chartConfig: Record<
  DeviceKey | OSKey | BrowserKey | ReferrerKey,
  { label: string; color: string }
> = {
  Desktop: { label: "Desktop", color: "#3B82F6" },
  Tablet: { label: "Tablet", color: "#22C55E" },
  Smartphone: { label: "Smartphone", color: "#EAB308" },

  Windows: { label: "Windows", color: "#2563EB" }, // blue-600
  macOS: { label: "macOS", color: "#8c8c8c" }, // gray
  Linux: { label: "Linux", color: "#9900cc" },
  Android: { label: "Android", color: "#3DDC84" },
  iOS: { label: "iOS", color: "#F5F5F7" },

  // Browsers
  Chrome: { label: "Chrome", color: "#F4B400" },
  Firefox: { label: "Firefox", color: "#FF7139" },
  Edge: { label: "Edge", color: "#0A84FF" }, // ✅ pakai string literal
  Safari: { label: "Safari", color: "#2563EB" },
  Opera: { label: "Opera", color: "#FF1B2D" },

  // Referrers
  Instagram: { label: "Instagram", color: "#C13584" },
  WhatsApp: { label: "WhatsApp", color: "#25D366" },
  Facebook: { label: "Facebook", color: "#4267B2" },
  LinkedIn: { label: "LinkedIn", color: "#0A66C2" },
  GitHub: { label: "GitHub", color: "#333" },
  Direct: { label: "Direct", color: "#E5E5E5" },
};
