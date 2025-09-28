import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { BrowserKey } from "@/features/analytics/types/type"; // Jalur impor yang diperbaiki

interface Props {
  chartData: { key: BrowserKey; clicks: number }[];
  activeKeys: BrowserKey[];
  onToggleKey: (key: BrowserKey) => void;
  totalClicks: number;
}

export const BrowserDonutPieChartUI = React.memo(
  function BrowserDonutPieChartUI({
    chartData,
    activeKeys,
    onToggleKey,
    totalClicks,
  }: Props) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-accent">Browser</h2>
        <ChartContainer config={chartConfig} className="mx-auto h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={({ payload }) => (
                  <div className="w-[150px] bg-zinc-800 bg-opacity-70 p-2 text-accent">
                    {payload?.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex justify-between items-center"
                      >
                        <span className="flex items-center space-x-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                chartConfig[entry.name as BrowserKey]?.color,
                            }}
                          />
                          <span>
                            {chartConfig[entry.name as BrowserKey]?.label ??
                              entry.name}
                          </span>
                        </span>
                        <span>{entry.value?.toLocaleString() ?? 0}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Pie
                data={chartData}
                dataKey="clicks"
                nameKey="key"
                innerRadius={50}
                strokeWidth={1}
                labelLine={false}
                animationDuration={200}
                label={({ index, value, cx, cy, midAngle, outerRadius }) => {
                  const entry = chartData[index];
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius! + 10;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      style={{ fill: chartConfig[entry.key]?.color }}
                      className="text-[10px]"
                    >
                      {`${
                        chartConfig[entry.key]?.label ?? entry.key
                      }: ${value}`}
                    </text>
                  );
                }}
              >
                {chartData.map((item) => (
                  <Cell
                    key={item.key}
                    fill={chartConfig[item.key]?.color}
                    onClick={() => onToggleKey(item.key)}
                    className="cursor-pointer"
                  />
                ))}
                <Label
                  content={({ viewBox }) =>
                    viewBox && "cx" in viewBox && "cy" in viewBox ? (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-accent text-3xl font-bold"
                        >
                          {totalClicks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clicks
                        </tspan>
                      </text>
                    ) : null
                  }
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="text-xs text-muted-foreground">
          Last click about 5 mins ago by Chrome
        </p>
      </div>
    );
  }
);
