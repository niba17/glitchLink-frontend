import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import { ChartKey } from "@/features/analytics/types/type";

interface AllLineChartUIProps {
  chartData: ChartDataItem[];
  active: Record<"devices" | "browsers" | "osList", ChartKey[]>;
}

export function AllLineChartUI({ chartData, active }: AllLineChartUIProps) {
  // Gabungkan semua key yang aktif menjadi satu array tunggal untuk rendering
  const allActiveKeys = [
    ...active.devices,
    ...active.browsers,
    ...active.osList,
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          ticks={chartData.map((d) => d.date)}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip
          content={({ payload, label }) => (
            <div className="w-[150px] bg-zinc-800 bg-opacity-70 p-2 text-accent">
              <div className="text-sm mb-1">
                {new Date(label).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              {payload?.map((entry) => (
                <div
                  key={entry.dataKey}
                  className="flex justify-between items-center"
                >
                  <span className="flex items-center space-x-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.dataKey}</span>
                  </span>
                  <span>{entry.value?.toLocaleString() ?? "0"}</span>
                </div>
              ))}
            </div>
          )}
        />
        {/* Render hanya garis (line) untuk key yang aktif */}
        {allActiveKeys.map((key) => (
          <Line
            key={key}
            type="linear"
            dataKey={key}
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={300}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
