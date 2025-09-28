import * as React from "react";
import { BrowserDonutPieChartUI } from "../ui/browserDonutPieChartUI";
import { BrowserKey } from "@/features/analytics/types/type";
import { calculateTotalClick } from "@/features/analytics/utils/donutPieChartHelpers"; // Mengimpor fungsi pembantu baru

interface BrowserDonutPieChartContainerProps {
  chartData: { key: BrowserKey; clicks: number }[];
  activeKeys: BrowserKey[];
  onToggleKey: (key: BrowserKey) => void;
}

function areEqual(
  prev: BrowserDonutPieChartContainerProps,
  next: BrowserDonutPieChartContainerProps
) {
  if (prev.chartData.length !== next.chartData.length) return false;
  for (let i = 0; i < prev.chartData.length; i++) {
    if (
      prev.chartData[i].key !== next.chartData[i].key ||
      prev.chartData[i].clicks !== next.chartData[i].clicks
    )
      return false;
  }
  if (prev.activeKeys.length !== next.activeKeys.length) return false;
  for (let i = 0; i < prev.activeKeys.length; i++) {
    if (prev.activeKeys[i] !== next.activeKeys[i]) return false;
  }
  if (prev.onToggleKey !== next.onToggleKey) return false;
  return true;
}

export const BrowserDonutPieChartContainer = React.memo(
  function BrowserDonutPieChartContainer({
    chartData,
    activeKeys,
    onToggleKey,
  }: BrowserDonutPieChartContainerProps) {
    // Menggunakan fungsi pembantu baru untuk menghitung total
    const totalClicks = React.useMemo(
      () => calculateTotalClick(chartData),
      [chartData]
    );
    return (
      <BrowserDonutPieChartUI
        chartData={chartData}
        activeKeys={activeKeys}
        onToggleKey={onToggleKey}
        totalClicks={totalClicks}
      />
    );
  },
  areEqual
);
