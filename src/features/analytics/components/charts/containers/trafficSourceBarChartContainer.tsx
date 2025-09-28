import React from "react";
import {
  ClickEvent,
  ReferrerChartDataItem,
  ReferrerKey,
} from "@/features/analytics/types/type";
import { referrers } from "@/features/analytics/constants/analyticsKeys";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { TrafficSourceBarChartUI } from "../ui/trafficSourceBarChartUI";

// Mapping dari raw BE -> ReferrerKey UI
const normalizeReferrer = (
  referrer: string | null | undefined
): ReferrerKey => {
  if (!referrer) return "Direct";
  const lower = referrer.toLowerCase();
  if (lower.includes("instagram")) return "Instagram";
  if (lower.includes("whatsapp")) return "WhatsApp";
  if (lower.includes("facebook")) return "Facebook";
  if (lower.includes("linkedin")) return "LinkedIn";
  if (lower.includes("github")) return "GitHub";
  return "Direct";
};

const getReferrerChartData = (
  clicks: ClickEvent[]
): ReferrerChartDataItem[] => {
  // selalu inisialisasi semua key
  const counts: Record<ReferrerKey, number> = {
    Instagram: 0,
    WhatsApp: 0,
    Facebook: 0,
    LinkedIn: 0,
    GitHub: 0,
    Direct: 0,
  };

  clicks.forEach((click) => {
    const ref = normalizeReferrer(click.referrer);
    counts[ref] += 1;
  });

  // **tidak perlu filter**, kembalikan semua key
  return referrers.map((key) => ({
    name: key,
    clicks: counts[key] || 0,
    fill: chartConfig[key]?.color || "#e5e5e5",
  }));
};

interface TrafficSourceBarChartContainerProps {
  clicksData: ClickEvent[];
}

export function TrafficSourceBarChartContainer({
  clicksData,
}: TrafficSourceBarChartContainerProps) {
  const chartData = React.useMemo(
    () => getReferrerChartData(clicksData ?? []),
    [clicksData]
  );

  return <TrafficSourceBarChartUI chartData={chartData} />;
}
