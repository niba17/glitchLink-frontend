import React from "react";
import { TotalClickCardUI } from "../ui/totalClickCardUI";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";

interface TotalClickCardContainerProps {
  shortlinkId?: number;
}

export function TotalClickCardContainer({
  shortlinkId,
}: TotalClickCardContainerProps) {
  const { analyticsData, isLoading, isError } =
    useUserLinkAnalytics(shortlinkId);

  const clicksCount = analyticsData?.clicksCount ?? 0;
  const clicksData = analyticsData?.clicks ?? [];

  return (
    <TotalClickCardUI
      clicks={clicksCount}
      clicksData={clicksData}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
