import * as React from "react";
import { DonutPieCardUI } from "../ui/donutPieCardUI";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";
import { useActiveKeysDonutPieChart } from "@/features/analytics/hooks/useActiveKeysDonutPieChart";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";
import { UserLink } from "@/features/links/types/type";

interface DonutPieCardContainerProps {
  selectedShortlink: UserLink | undefined;
}

export function DonutPieCardContainer({
  selectedShortlink,
}: DonutPieCardContainerProps) {
  const { analyticsData, isLoading, isError } = useUserLinkAnalytics(
    selectedShortlink?.id
  );

  // State untuk menyimpan rentang tanggal
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );

  // Efek ini akan dijalankan saat `selectedShortlink` berubah.
  // Ini akan mereset `dateRange` sebelum data baru dimuat.
  React.useEffect(() => {
    setDateRange(undefined);
  }, [selectedShortlink]);

  // Efek ini akan dijalankan saat data analitik baru tiba.
  // Ini akan mengatur `dateRange` berdasarkan data baru.
  React.useEffect(() => {
    if (analyticsData && analyticsData.clicks.length > 0) {
      const dates = analyticsData.clicks
        .map((click) => parseISO(click.timestamp))
        .sort((a, b) => a.getTime() - b.getTime());

      setDateRange({
        from: dates[0],
        to: dates[dates.length - 1],
      });
    } else {
      // Jika tidak ada data, set dateRange menjadi undefined
      setDateRange(undefined);
    }
  }, [analyticsData]);

  const data = React.useMemo(() => {
    if (!analyticsData?.clicks) {
      return {
        deviceData: [],
        osData: [],
        browserData: [],
      };
    }

    const filteredClicks = analyticsData.clicks.filter((click) => {
      if (!dateRange?.from || !dateRange.to) {
        return true;
      }
      const date = parseISO(click.timestamp);
      return isWithinInterval(date, {
        start: dateRange.from,
        end: dateRange.to,
      });
    });

    const deviceData = [...devices.map((key) => ({ key, clicks: 0 }))];
    const osData = [...osList.map((key) => ({ key, clicks: 0 }))];
    const browserData = [...browsers.map((key) => ({ key, clicks: 0 }))];

    filteredClicks.forEach((click) => {
      // Perbaikan: Konversi data menjadi huruf kecil sebelum memproses
      const deviceKey = click.device.toLowerCase() as DeviceKey;
      const osKey = click.os.toLowerCase() as OSKey;
      const browserKey = click.browser.toLowerCase() as BrowserKey;

      const deviceItem = deviceData.find(
        (d) => d.key.toLowerCase() === deviceKey
      );
      if (deviceItem) {
        deviceItem.clicks += 1;
      }
      const osItem = osData.find((o) => o.key.toLowerCase() === osKey);
      if (osItem) {
        osItem.clicks += 1;
      }
      const browserItem = browserData.find(
        (b) => b.key.toLowerCase() === browserKey
      );
      if (browserItem) {
        browserItem.clicks += 1;
      }
    });

    return {
      deviceData,
      osData,
      browserData,
    };
  }, [dateRange, analyticsData]);

  // Menghitung initial state untuk useActiveKeysDonutPieChart
  const initialActiveState = React.useMemo(() => {
    return {
      devices: data.deviceData.filter((d) => d.clicks > 0).map((d) => d.key),
      osList: data.osData.filter((o) => o.clicks > 0).map((o) => o.key),
      browsers: data.browserData.filter((b) => b.clicks > 0).map((b) => b.key),
    };
  }, [data]);

  // Menggunakan hook useActiveKeysDonutPieChart dengan initial state yang telah dihitung
  const { active, onToggle } = useActiveKeysDonutPieChart(initialActiveState);

  const onDateRangeChange = React.useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
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
    <DonutPieCardUI
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      deviceData={data.deviceData}
      osData={data.osData}
      browserData={data.browserData}
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
