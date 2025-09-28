// frontend-final/src/features/analytics/components/charts/containers/allLineChartContainer.tsx

import * as React from "react";
import { ChartKey, ChartDataItem } from "@/features/analytics/types/type";
import { AllLineChartUI } from "../ui/allLineChartUI";

// Antarmuka diperbarui untuk hanya menerima 'chartData' dan 'active'
interface AllLineChartContainerProps {
  chartData: ChartDataItem[];
  active: Record<"devices" | "browsers" | "osList", ChartKey[]>;
}

export function AllLineChartContainer(props: AllLineChartContainerProps) {
  return <AllLineChartUI {...props} />;
}
