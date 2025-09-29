import React from "react";
import {
  TotalClickChartDataItem,
  BrowserKey,
  DeviceKey,
  OSKey,
  ClickEvent,
} from "@/features/analytics/types/type";
import { TotalClickBarChartUI } from "../ui/totalClickBarChartUI";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { allKeys } from "@/features/analytics/constants/analyticsKeys";

// normalisasi browser
const normalizeBrowser = (browser: string): BrowserKey | null => {
  const lower = browser.toLowerCase();
  if (lower.includes("chrome")) return "Chrome";
  if (lower.includes("firefox")) return "Firefox";
  if (lower.includes("edge")) return "Edge";
  if (lower.includes("safari")) return "Safari";
  if (lower.includes("opera")) return "Opera";
  return null; // jika tidak sesuai, abaikan
};

// normalisasi device
const normalizeDevice = (device: string): DeviceKey | null => {
  const lower = device.toLowerCase();
  if (lower.includes("desktop")) return "Desktop";
  if (lower.includes("smartphone") || lower.includes("mobile"))
    return "Smartphone";
  if (lower.includes("tablet")) return "Tablet";
  return null;
};

// normalisasi OS
const normalizeOS = (os: string): OSKey | null => {
  const lower = os.toLowerCase();
  if (lower.includes("windows")) return "Windows";
  if (lower.includes("mac")) return "macOS";
  if (lower.includes("linux")) return "Linux";
  if (lower.includes("android")) return "Android";
  if (lower.includes("ios")) return "iOS";
  return null;
};

const getCombinedChartData = (
  clicks: ClickEvent[]
): TotalClickChartDataItem[] => {
  const counts: Record<string, number> = {};

  clicks.forEach((click) => {
    const browser = normalizeBrowser(click.browser);
    const device = normalizeDevice(click.device);
    const os = normalizeOS(click.os);

    if (browser) counts[browser] = (counts[browser] || 0) + 1;
    if (device) counts[device] = (counts[device] || 0) + 1;
    if (os) counts[os] = (counts[os] || 0) + 1;
  });

  // filter hanya key yang termasuk DeviceKey | OSKey | BrowserKey
  const validKeys: (DeviceKey | OSKey | BrowserKey)[] = allKeys.filter((k) =>
    [
      "Desktop",
      "Smartphone",
      "Tablet",
      "Windows",
      "macOS",
      "Linux",
      "Android",
      "iOS",
      "Chrome",
      "Firefox",
      "Edge",
      "Safari",
      "Opera",
    ].includes(k)
  ) as (DeviceKey | OSKey | BrowserKey)[];

  return validKeys.map((key) => ({
    name: key,
    clicks: counts[key] || 0,
    fill: chartConfig[key]?.color || "#e5e5e5",
  }));
};

interface TotalClickBarChartContainerProps {
  clicksData: ClickEvent[];
}

export function TotalClickBarChartContainer({
  clicksData,
}: TotalClickBarChartContainerProps) {
  const chartData = React.useMemo(
    () => getCombinedChartData(clicksData ?? []),
    [clicksData]
  );
  return <TotalClickBarChartUI chartData={chartData} />;
}
