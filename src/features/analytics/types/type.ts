// frontend-final/src/features/analytics/types/type.ts

export type DeviceKey = "Desktop" | "Smartphone" | "Tablet";
export type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
export type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari" | "Opera";

export type ReferrerKey =
  | "Instagram"
  | "WhatsApp"
  | "Facebook"
  | "LinkedIn"
  | "GitHub"
  | "Direct";

export type ChartKey = DeviceKey | BrowserKey | OSKey | ReferrerKey;

export interface ChartDataItem {
  date: string;
  [key: string]: number | string;
}

export type ActiveState = {
  devices: DeviceKey[];
  browsers: BrowserKey[];
  osList: OSKey[];
};

export type ActiveKeyType = keyof ActiveState;

export interface ClickEvent {
  id: number;
  ip: string;
  country: string | null;
  city: string | null;
  userAgent: string;
  browser: string; // ⚠️ BE bisa kirim variasi → nanti dinormalisasi di container
  os: OSKey;
  device: DeviceKey;
  timestamp: string;
  referrer?: string | null; // ⚠️ opsional & raw dari BE
}

export interface LinkAnalyticsResponse {
  clicksCount: number;
  clicks: ClickEvent[];
  originalUrl: string;
  shortUrl: string;
}

export type TotalClickChartDataItem = {
  name: string;
  clicks: number;
  fill: string;
};

export type ReferrerChartDataItem = {
  name: ReferrerKey;
  clicks: number;
  fill: string;
};
