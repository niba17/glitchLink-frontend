import { DeviceKey, OSKey, BrowserKey, ReferrerKey } from "../types/type";

export const chartConfig: Record<
  DeviceKey | OSKey | BrowserKey | ReferrerKey,
  { label: string; color: string }
> = {
  // Devices (Mempertahankan kontras yang baik untuk kategori umum)
  Desktop: { label: "Desktop", color: "#0a568f" }, // Biru Cerdas
  Tablet: { label: "Tablet", color: "#158f52" }, // Hijau Cerdas
  Smartphone: { label: "Smartphone", color: "#ef790e" }, // Kuning Cerdas

  // Operating Systems (Menyesuaikan dengan warna OS yang khas)
  Windows: { label: "Windows", color: "#0078D4" }, // Biru khas Windows
  macOS: { label: "macOS", color: "#8c8c8c" }, // Abu-abu Apple
  Linux: { label: "Linux", color: "#9d00de" }, // Ungu khas Linux/Tux
  Android: { label: "Android", color: "#3DDC84" }, // Hijau khas Android
  iOS: { label: "iOS", color: "#bbbbbb" }, // Abu-abu terang Apple

  // Browsers (Menggunakan warna merek dengan sedikit penyesuaian untuk diferensiasi)
  Chrome: { label: "Chrome", color: "#00a840" }, // Biru Google yang lebih akurat
  Firefox: { label: "Firefox", color: "#FF7139" }, // Orange khas Firefox
  Edge: { label: "Edge", color: "#54edf3" }, // Menggunakan Biru Windows, tetapi berbeda dari Safari
  Safari: { label: "Safari", color: "#CBEEF0" }, // Biru muda khas Safari
  Opera: { label: "Opera", color: "#FF1B2D" }, // Merah khas Opera

  // Referrers (Warna merek yang kuat)
  Instagram: { label: "Instagram", color: "#C13584" }, // Ungu/Pink khas IG
  WhatsApp: { label: "WhatsApp", color: "#25D366" }, // Hijau terang khas WA
  Facebook: { label: "Facebook", color: "#1877F2" }, // Biru khas FB (lebih gelap dari yang lama)
  LinkedIn: { label: "LinkedIn", color: "#0A66C2" }, // Biru khas LinkedIn
  GitHub: { label: "GitHub", color: "#181717" }, // Hitam khas GitHub
  Direct: { label: "Direct", color: "#E5E5E5" }, // Abu-abu muda untuk traffic langsung (Netral)
};
