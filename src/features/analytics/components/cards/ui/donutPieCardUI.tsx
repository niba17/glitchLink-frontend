import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { DeviceDonutPieChartContainer } from "../../charts/containers/deviceDonutPieChartContainer";
import { OSDonutPieChartContainer } from "../../charts/containers/osDonutPieChartContainer";
import { BrowserDonutPieChartContainer } from "../../charts/containers/browserDonutPieChartContainer";
import DateRangePicker from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";

interface DonutPieCardUIProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  deviceData: { key: DeviceKey; clicks: number }[];
  osData: { key: OSKey; clicks: number }[];
  browserData: { key: BrowserKey; clicks: number }[];
  activeDevices: DeviceKey[];
  activeOS: OSKey[];
  activeBrowsers: BrowserKey[];
  onToggleDevice: (key: DeviceKey) => void;
  onToggleOS: (key: OSKey) => void;
  onToggleBrowser: (key: BrowserKey) => void;
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
}

export function DonutPieCardUI({
  dateRange,
  onDateRangeChange,
  deviceData,
  osData,
  browserData,
  activeDevices,
  activeOS,
  activeBrowsers,
  onToggleDevice,
  onToggleOS,
  onToggleBrowser,
  isLoading,
  isError,
  hasData,
}: DonutPieCardUIProps) {
  // Memo filtered data for charts, based on active keys AND clicks > 0
  const filteredDeviceData = React.useMemo(
    () =>
      deviceData.filter(
        (item) => activeDevices.includes(item.key) && item.clicks > 0
      ),
    [deviceData, activeDevices]
  );
  const filteredOSData = React.useMemo(
    () =>
      osData.filter((item) => activeOS.includes(item.key) && item.clicks > 0),
    [osData, activeOS]
  );
  const filteredBrowserData = React.useMemo(
    () =>
      browserData.filter(
        (item) => activeBrowsers.includes(item.key) && item.clicks > 0
      ),
    [browserData, activeBrowsers]
  );

  return (
    <Card className="bg-foreground p-5">
      <CardHeader className="p-0 pb-3">
        <div className="flex flex-wrap gap-y-2 space-x-2">
          {/* Add key here to force component to re-render */}
          <DateRangePicker
            key={JSON.stringify(dateRange)}
            initialRange={dateRange}
            onChange={onDateRangeChange}
          />

          {/* DropdownMenu for Device */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Device</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* Dropdown menu displays all items, active or not */}
              {deviceData.map((d) => (
                <DropdownMenuCheckboxItem
                  key={d.key}
                  checked={activeDevices.includes(d.key)}
                  onCheckedChange={() => onToggleDevice(d.key)}
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[d.key].color }}
                    />
                    <span>{d.key}</span>
                  </span>
                  <span>{d.clicks}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* DropdownMenu for OS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">OS</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {osData.map((o) => (
                <DropdownMenuCheckboxItem
                  key={o.key}
                  checked={activeOS.includes(o.key)}
                  onCheckedChange={() => onToggleOS(o.key)}
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[o.key].color }}
                    />
                    <span>{o.key}</span>
                  </span>
                  <span>{o.clicks}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* DropdownMenu for Browser */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Browser</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {browserData.map((b) => (
                <DropdownMenuCheckboxItem
                  key={b.key}
                  checked={activeBrowsers.includes(b.key)}
                  onCheckedChange={() => onToggleBrowser(b.key)}
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[b.key].color }}
                    />
                    <span>{b.key}</span>
                  </span>
                  <span>{b.clicks}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          By default, the chart displays data from the shortlink's entire
          lifetime
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-wrap justify-around gap-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px] text-stone-400 w-full">
            <span className="animate-pulse">Loading analytics...</span>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-[200px] text-red-400 w-full">
            <span className="text-sm">Failed to load analytics data.</span>
          </div>
        ) : !hasData ? (
          <div className="flex justify-center items-center h-[200px] text-stone-400 w-full">
            <span>No click data available for this link.</span>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <DeviceDonutPieChartContainer
                chartData={filteredDeviceData}
                activeKeys={activeDevices}
                onToggleKey={onToggleDevice}
              />
            </div>
            <div className="flex-1">
              <OSDonutPieChartContainer
                chartData={filteredOSData}
                activeKeys={activeOS}
                onToggleKey={onToggleOS}
              />
            </div>
            <div className="flex-1">
              <BrowserDonutPieChartContainer
                chartData={filteredBrowserData}
                activeKeys={activeBrowsers}
                onToggleKey={onToggleBrowser}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
