import React from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import {
  BrowserKey,
  DeviceKey,
  OSKey,
  TotalClickChartDataItem,
} from "@/features/analytics/types/type";

interface TotalClickBarChartUIProps {
  chartData: TotalClickChartDataItem[];
}

export function TotalClickBarChartUI({ chartData }: TotalClickBarChartUIProps) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 20, right: 5 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const label =
              chartConfig[value as BrowserKey | DeviceKey | OSKey]?.label ??
              value;
            return label.length > 10 ? `${label.substring(0, 10)}...` : label;
          }}
          interval={0}
        />
        <XAxis dataKey="clicks" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={({ payload }) => (
            <div className="w-[150px] bg-zinc-800 bg-opacity-70 p-2 text-accent">
              {payload?.map((entry) => (
                <div
                  key={entry.name}
                  className="flex justify-between items-center"
                >
                  <span className="flex items-center space-x-1">
                    <span className="font-semibold">
                      {chartConfig[entry.name as BrowserKey | DeviceKey | OSKey]
                        ?.label ?? entry.name}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="font-semibold">
                      {entry.value?.toLocaleString() ?? 0}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        />
        <Bar
          dataKey="clicks"
          layout="vertical"
          isAnimationActive={true}
          animationDuration={800}
        />
      </BarChart>
    </ChartContainer>
  );
}
