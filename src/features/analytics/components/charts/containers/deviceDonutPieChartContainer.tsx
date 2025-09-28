import * as React from "react";
import { DeviceDonutPieChartUI } from "../ui/deviceDonutPieChartUI";
import { DeviceKey } from "@/features/analytics/types/type";
import { calculateTotalClick } from "../../../utils/donutPieChartHelpers";
interface DeviceDonutPieChartContainerProps {
  chartData: { key: DeviceKey; clicks: number }[];
  activeKeys: DeviceKey[];
  onToggleKey: (key: DeviceKey) => void;
}

function areEqual(
  prev: DeviceDonutPieChartContainerProps,
  next: DeviceDonutPieChartContainerProps
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

export const DeviceDonutPieChartContainer = React.memo(
  function DeviceDonutPieChartContainer({
    chartData,
    activeKeys,
    onToggleKey,
  }: DeviceDonutPieChartContainerProps) {
    const totalClicks = React.useMemo(
      () => calculateTotalClick(chartData),
      [chartData]
    );
    return (
      <DeviceDonutPieChartUI
        chartData={chartData}
        activeKeys={activeKeys}
        onToggleKey={onToggleKey}
        totalClicks={totalClicks}
      />
    );
  },
  areEqual
);
