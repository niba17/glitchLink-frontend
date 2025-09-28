import { BrowserKey, DeviceKey, OSKey } from "@/features/analytics/types/type";

interface PieChartData {
  key: BrowserKey | DeviceKey | OSKey;
  clicks: number;
}

/**
 * Menghitung total klik dari array data bagan pie.
 *
 * @param chartData Array data bagan pie.
 * @returns Total klik.
 */
export function calculateTotalClick(chartData: PieChartData[]): number {
  return chartData.reduce((sum, entry) => sum + entry.clicks, 0);
}
