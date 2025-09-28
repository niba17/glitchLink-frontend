import * as React from "react";
import { OSDonutPieChartUI } from "../ui/osDonutPieChartUI";
import { OSKey } from "@/features/analytics/types/type";
import { calculateTotalClick } from "../../../utils/donutPieChartHelpers";

interface OSDonutPieChartContainerProps {
  chartData: { key: OSKey; clicks: number }[];
  activeKeys: OSKey[];
  onToggleKey: (key: OSKey) => void;
}

function areEqual(
  prev: OSDonutPieChartContainerProps,
  next: OSDonutPieChartContainerProps
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

export const OSDonutPieChartContainer = React.memo(
  function OSDonutPieChartContainer({
    chartData,
    activeKeys,
    onToggleKey,
  }: OSDonutPieChartContainerProps) {
    const totalClicks = React.useMemo(
      () => calculateTotalClick(chartData),
      [chartData]
    );
    return (
      <OSDonutPieChartUI
        chartData={chartData}
        activeKeys={activeKeys}
        onToggleKey={onToggleKey}
        totalClicks={totalClicks}
      />
    );
  },
  areEqual
);
