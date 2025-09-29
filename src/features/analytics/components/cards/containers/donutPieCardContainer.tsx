import * as React from "react";
import { DonutPieCardUI } from "../ui/donutPieCardUI";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";
import { useActiveKeysDonutPieChart } from "@/features/analytics/hooks/useActiveKeysDonutPieChart";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";
import { UserLink } from "@/features/links/types/type";
import {
  normalizeBrowserChartData,
  normalizeDeviceChartData,
  normalizeOSChartData,
} from "@/features/analytics/utils/donutPieChartNormalizer";

interface DonutPieCardContainerProps {
  selectedShortlink: UserLink | undefined;
}

export function DonutPieCardContainer({
  selectedShortlink,
}: DonutPieCardContainerProps) {
  const { analyticsData, isLoading, isError } = useUserLinkAnalytics(
    selectedShortlink?.id
  );

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );

  // Reset dateRange saat selectedShortlink berubah
  React.useEffect(() => {
    setDateRange(undefined);
  }, [selectedShortlink]);

  // ===================== SET DATE RANGE AWAL =====================
  React.useEffect(() => {
    if (analyticsData?.clicks?.length) {
      const sortedDates = analyticsData.clicks
        .map((click) => parseISO(click.timestamp))
        .sort((a, b) => a.getTime() - b.getTime());

      // Pastikan tidak undefined untuk TypeScript
      if (sortedDates.length > 0) {
        setDateRange({
          from: sortedDates[0],
          to: sortedDates[sortedDates.length - 1],
        });
      }
    }
  }, [analyticsData]);

  // ===================== FILTERED CLICKS =====================
  const filteredClicks = React.useMemo(() => {
    if (!analyticsData?.clicks) return [];
    return analyticsData.clicks.filter((click) => {
      if (!dateRange?.from || !dateRange.to) return true;
      const date = parseISO(click.timestamp);
      return isWithinInterval(date, {
        start: dateRange.from!,
        end: dateRange.to!,
      });
    });
  }, [analyticsData, dateRange]);

  // ===================== NORMALIZE CHART DATA =====================
  const deviceData = React.useMemo(
    () =>
      normalizeDeviceChartData(
        filteredClicks.map((click) => ({ device: click.device, count: 1 }))
      ),
    [filteredClicks]
  );

  const osData = React.useMemo(
    () =>
      normalizeOSChartData(
        filteredClicks.map((click) => ({ os: click.os, count: 1 }))
      ),
    [filteredClicks]
  );

  const browserData = React.useMemo(
    () =>
      normalizeBrowserChartData(
        filteredClicks.map((click) => ({ browser: click.browser, count: 1 }))
      ),
    [filteredClicks]
  );

  // ===================== INITIAL ACTIVE STATE =====================
  const initialActiveState = React.useMemo(
    () => ({
      devices: deviceData.filter((d) => d.clicks > 0).map((d) => d.key),
      osList: osData.filter((o) => o.clicks > 0).map((o) => o.key),
      browsers: browserData.filter((b) => b.clicks > 0).map((b) => b.key),
    }),
    [deviceData, osData, browserData]
  );

  const { active, onToggle } = useActiveKeysDonutPieChart(initialActiveState);

  const onDateRangeChange = React.useCallback(
    (range: DateRange | undefined) => setDateRange(range),
    []
  );
  const onToggleDevice = React.useCallback(
    (key: DeviceKey) => onToggle("devices")(key),
    [onToggle]
  );
  const onToggleOS = React.useCallback(
    (key: OSKey) => onToggle("osList")(key),
    [onToggle]
  );
  const onToggleBrowser = React.useCallback(
    (key: BrowserKey) => onToggle("browsers")(key),
    [onToggle]
  );

  return (
    <DonutPieCardUI
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      deviceData={deviceData}
      osData={osData}
      browserData={browserData}
      activeDevices={active.devices as DeviceKey[]}
      activeOS={active.osList as OSKey[]}
      activeBrowsers={active.browsers as BrowserKey[]}
      onToggleDevice={onToggleDevice}
      onToggleOS={onToggleOS}
      onToggleBrowser={onToggleBrowser}
      isLoading={isLoading}
      isError={isError}
      hasData={filteredClicks.length > 0}
    />
  );
}
