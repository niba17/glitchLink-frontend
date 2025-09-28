import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import { ChartKey } from "@/features/analytics/types/type";

export function calculateTotalClick(
  chartData: ChartDataItem[],
  keys: ChartKey[]
) {
  return keys.reduce((acc, key) => {
    acc[key] = chartData.reduce(
      (sum, curr) => sum + (typeof curr[key] === "number" ? curr[key] : 0),
      0
    );
    return acc;
  }, {} as Record<ChartKey, number>);
}
