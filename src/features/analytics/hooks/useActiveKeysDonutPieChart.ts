import * as React from "react";
import {
  DeviceKey,
  BrowserKey,
  OSKey,
  ChartKey,
} from "@/features/analytics/types/type";

type ActiveState = {
  devices: DeviceKey[];
  browsers: BrowserKey[];
  osList: OSKey[];
};

type ActiveKeyType = keyof ActiveState;

export const useActiveKeysDonutPieChart = (initialActiveState: ActiveState) => {
  const [active, setActive] = React.useState<ActiveState>(initialActiveState);

  // Perbaikan: useEffect ini sangat penting untuk menyinkronkan
  // state internal dengan prop yang berubah dari luar.
  React.useEffect(() => {
    setActive(initialActiveState);
  }, [initialActiveState]);

  const onToggle = React.useCallback(
    (type: ActiveKeyType) => (key: ChartKey) => {
      setActive((prev) => {
        const currentKeys = prev[type] as ChartKey[];
        const newKeys = currentKeys.includes(key)
          ? currentKeys.filter((k) => k !== key)
          : [...currentKeys, key];

        return {
          ...prev,
          [type]: newKeys,
        };
      });
    },
    []
  );

  return { active, onToggle };
};
