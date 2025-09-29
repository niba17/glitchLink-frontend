// frontend/src/features/analytics/utils/donutPieChartNormalizer.ts
import { BrowserKey, DeviceKey, OSKey } from "@/features/analytics/types/type";

// Semua key valid
export const browserKeys: BrowserKey[] = [
  "Chrome",
  "Firefox",
  "Edge",
  "Safari",
  "Opera",
];
export const deviceKeys: DeviceKey[] = ["Desktop", "Smartphone", "Tablet"];
export const osKeys: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

// ===================== Normalisasi Browser =====================
export function normalizeBrowser(raw: string | undefined | null): BrowserKey {
  if (!raw) return "Chrome"; // fallback default
  const lower = raw.toLowerCase();
  if (lower.includes("chrome")) return "Chrome";
  if (lower.includes("firefox")) return "Firefox";
  if (lower.includes("edge")) return "Edge";
  if (lower.includes("safari")) return "Safari";
  if (lower.includes("opera")) return "Opera";
  return "Chrome"; // fallback
}

export function normalizeBrowserChartData(
  rawData: { browser: string; count: number }[]
): { key: BrowserKey; clicks: number }[] {
  const counts: Record<BrowserKey, number> = {
    Chrome: 0,
    Firefox: 0,
    Edge: 0,
    Safari: 0,
    Opera: 0,
  };

  rawData.forEach((item) => {
    const key = normalizeBrowser(item.browser);
    counts[key] += item.count;
  });

  return browserKeys.map((key) => ({ key, clicks: counts[key] }));
}

// ===================== Normalisasi Device =====================
export function normalizeDevice(raw: string | undefined | null): DeviceKey {
  if (!raw) return "Desktop";
  const lower = raw.toLowerCase();
  if (lower.includes("desktop")) return "Desktop";
  if (lower.includes("smartphone") || lower.includes("mobile"))
    return "Smartphone";
  if (lower.includes("tablet")) return "Tablet";
  return "Desktop"; // fallback
}

export function normalizeDeviceChartData(
  rawData: { device: string; count: number }[]
): { key: DeviceKey; clicks: number }[] {
  const counts: Record<DeviceKey, number> = {
    Desktop: 0,
    Smartphone: 0,
    Tablet: 0,
  };

  rawData.forEach((item) => {
    const key = normalizeDevice(item.device);
    counts[key] += item.count;
  });

  return deviceKeys.map((key) => ({ key, clicks: counts[key] }));
}

// ===================== Normalisasi OS =====================
export function normalizeOS(raw: string | undefined | null): OSKey {
  if (!raw) return "Windows";
  const lower = raw.toLowerCase();
  if (lower.includes("windows")) return "Windows";
  if (lower.includes("mac")) return "macOS";
  if (lower.includes("linux")) return "Linux";
  if (lower.includes("android")) return "Android";
  if (lower.includes("ios")) return "iOS";
  return "Windows";
}

export function normalizeOSChartData(
  rawData: { os: string; count: number }[]
): { key: OSKey; clicks: number }[] {
  const counts: Record<OSKey, number> = {
    Windows: 0,
    macOS: 0,
    Linux: 0,
    Android: 0,
    iOS: 0,
  };

  rawData.forEach((item) => {
    const key = normalizeOS(item.os);
    counts[key] += item.count;
  });

  return osKeys.map((key) => ({ key, clicks: counts[key] }));
}

// ===================== Utility =====================
export function calculateTotalClick<T extends { clicks: number }[]>(
  chartData: T
): number {
  return chartData.reduce((acc, item) => acc + item.clicks, 0);
}
