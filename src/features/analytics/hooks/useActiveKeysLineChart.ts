import React from "react";
import {
  ChartKey,
  ActiveState,
  ActiveKeyType,
} from "@/features/analytics/types/type";

/**
 * A custom hook to manage active keys for the line chart, ensuring the state
 * is updated whenever the initial data changes.
 *
 * @param initialState - The initial state of active keys based on the chart data.
 * @returns An object containing the current active state and a toggle function.
 */
export function useLineChartActiveKeys(initialState: ActiveState) {
  const [active, setActive] = React.useState<ActiveState>(initialState);

  // useEffect di sini tidak diperlukan karena properti 'key' pada komponen
  // induk sudah me-remount komponen saat tautan berubah.

  const onToggle = React.useCallback(
    (type: ActiveKeyType) => (key: ChartKey) => {
      setActive((prevActive) => {
        const currentKeys = prevActive[type] as ChartKey[];
        const newKeys = currentKeys.includes(key)
          ? currentKeys.filter((k) => k !== key)
          : [...currentKeys, key];

        return {
          ...prevActive,
          [type]: newKeys,
        };
      });
    },
    []
  );

  return { active, onToggle };
}
