import * as React from "react";
import { LineCardUI } from "@/features/analytics/components/cards/ui/lineCardUI";
import {
  ChartKey,
  ChartDataItem,
  DeviceKey,
  BrowserKey,
  OSKey,
  ActiveState,
  ActiveKeyType,
} from "@/features/analytics/types/type";
import {
  eachDayOfInterval,
  format,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { DateRange } from "react-day-picker";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";
import { UserLink } from "@/features/links/types/type";
import {
  normalizeBrowser,
  normalizeDevice,
  normalizeOS,
} from "@/features/analytics/utils/donutPieChartNormalizer";

interface LineCardContainerProps {
  selectedShortlink: UserLink | undefined;
}

export function LineCardContainer({
  selectedShortlink,
}: LineCardContainerProps) {
  const { analyticsData, isLoading, isError } = useUserLinkAnalytics(
    selectedShortlink?.id
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );
  const [active, setActive] = React.useState<ActiveState>({
    devices: [],
    browsers: [],
    osList: [],
  });
  const hasInitializedRef = React.useRef(false);

  React.useEffect(() => {
    if (analyticsData && analyticsData.clicks.length > 0) {
      const dates = analyticsData.clicks
        .map((click) => parseISO(click.timestamp))
        .sort((a, b) => a.getTime() - b.getTime());

      setDateRange({ from: dates[0], to: dates[dates.length - 1] });
    } else {
      setDateRange(undefined);
    }
  }, [analyticsData]);

  React.useEffect(() => {
    hasInitializedRef.current = false;
  }, [selectedShortlink?.id]);

  const allKeys = [...devices, ...browsers, ...osList] as ChartKey[];

  const chartData = React.useMemo(() => {
    if (!analyticsData?.clicks) return [];

    const activeDateRange =
      dateRange ||
      (() => {
        const dates = analyticsData.clicks
          .map((click) => parseISO(click.timestamp))
          .sort((a, b) => a.getTime() - b.getTime());
        return { from: dates[0], to: dates[dates.length - 1] };
      })();

    const filteredClicks = analyticsData.clicks.filter((click) =>
      isWithinInterval(parseISO(click.timestamp), {
        start: activeDateRange.from!,
        end: activeDateRange.to!,
      })
    );

    const clicksMap = new Map<string, ChartDataItem>();
    const allDates = eachDayOfInterval({
      start: activeDateRange.from!,
      end: activeDateRange.to!,
    });

    allDates.forEach((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const item: ChartDataItem = { date: dateStr };
      allKeys.forEach((key) => (item[key] = 0));
      clicksMap.set(dateStr, item);
    });

    filteredClicks.forEach((click) => {
      const dateStr = format(parseISO(click.timestamp), "yyyy-MM-dd");
      if (clicksMap.has(dateStr)) {
        const item = clicksMap.get(dateStr)!;

        const deviceKey = normalizeDevice(click.device) as ChartKey;
        const browserKey = normalizeBrowser(click.browser) as ChartKey;
        const osKey = normalizeOS(click.os) as ChartKey;

        if (allKeys.includes(deviceKey))
          item[deviceKey] = ((item[deviceKey] as number) || 0) + 1;
        if (allKeys.includes(browserKey))
          item[browserKey] = ((item[browserKey] as number) || 0) + 1;
        if (allKeys.includes(osKey))
          item[osKey] = ((item[osKey] as number) || 0) + 1;
      }
    });

    return Array.from(clicksMap.values());
  }, [dateRange, analyticsData, allKeys]);

  const initialActiveState = React.useMemo(
    () => ({
      devices: devices.filter((key) =>
        chartData.some((item) => (item[key] as number) > 0)
      ),
      browsers: browsers.filter((key) =>
        chartData.some((item) => (item[key] as number) > 0)
      ),
      osList: osList.filter((key) =>
        chartData.some((item) => (item[key] as number) > 0)
      ),
    }),
    [chartData]
  );

  React.useEffect(() => {
    if (!hasInitializedRef.current && initialActiveState.devices.length > 0) {
      setActive(initialActiveState);
      hasInitializedRef.current = true;
    }
  }, [initialActiveState]);

  const onToggle = React.useCallback(
    (type: ActiveKeyType) => (key: ChartKey) => {
      setActive((prevActive) => {
        const currentKeys = prevActive[type] as ChartKey[];
        const newKeys = currentKeys.includes(key)
          ? currentKeys.filter((k) => k !== key)
          : [...currentKeys, key];
        return { ...prevActive, [type]: newKeys };
      });
    },
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
    <LineCardUI
      dateRange={dateRange}
      setDateRange={setDateRange}
      chartData={chartData}
      activeDevices={active.devices as DeviceKey[]}
      activeOS={active.osList as OSKey[]}
      activeBrowsers={active.browsers as BrowserKey[]}
      onToggleDevice={onToggleDevice}
      onToggleOS={onToggleOS}
      onToggleBrowser={onToggleBrowser}
      isLoading={isLoading}
      isError={isError}
      hasData={analyticsData?.clicks.length !== 0}
    />
  );
}
