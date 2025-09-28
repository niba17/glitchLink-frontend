import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { TrafficSourceBarChartContainer } from "../../charts/containers/trafficSourceBarChartContainer";

interface TrafficSourceCardUIProps {
  clicksData: any[];
  totalClicks: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function TrafficSourceCardUI({
  clicksData,
  totalClicks,
  isLoading,
  isError,
}: TrafficSourceCardUIProps) {
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
    content = (
      <div className="flex flex-col w-full">
        <TrafficSourceBarChartContainer clicksData={clicksData ?? []} />
      </div>
    );
  }

  return (
    <Card className="bg-foreground p-5">
      <CardHeader className="p-0 mb-5 text-lg font-semibold text-accent">
        Total clicks : {totalClicks.toLocaleString()}
      </CardHeader>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
}
