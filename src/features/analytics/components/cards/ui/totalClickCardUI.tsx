import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TotalClickBarChartContainer } from "@/features/analytics/components/charts/containers/totalClickBarChartContainer";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface TotalClickCardUIProps {
  clicks: number;
  clicksData: any[];
  isLoading?: boolean;
  isError?: boolean;
}

export function TotalClickCardUI({
  clicks,
  clicksData,
  isLoading,
  isError,
}: TotalClickCardUIProps) {
  let content;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center w-full min-h-[120px]">
        <Spinner />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="flex justify-center items-center w-full min-h-[120px] text-red-400">
        Error fetching data
      </div>
    );
  } else {
    // fallback: jika clicksData kosong, tetap tampilkan chart dengan data 0
    const safeData = clicksData.length
      ? clicksData
      : [{ browser: "Unknown", device: "Unknown", os: "Unknown" }];

    content = (
      <div className="flex flex-col w-full">
        <TotalClickBarChartContainer clicksData={safeData} />
      </div>
    );
  }

  return (
    <Card className="bg-foreground p-5">
      <CardHeader className="p-0 mb-5 text-lg font-semibold text-accent">
        Total clicks : {clicks.toLocaleString()}
      </CardHeader>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
}
