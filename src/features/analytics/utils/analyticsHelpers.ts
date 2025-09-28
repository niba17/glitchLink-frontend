// frontend-final/src/features/analytics/utils/analyticsHelpers.ts
import { ChartKey } from "@/features/analytics/types/type";
import { chartConfig } from "@/features/analytics/config/chartConfig";

export type DropdownItem<T extends ChartKey> = {
  key: T;
  label: string;
  color: string;
  value: number;
  checked: boolean;
  onToggle: () => void;
};

/**
 * Mapping keys ke dropdown items.
 */
export function mapDropdown<T extends ChartKey>(
  keys: T[],
  active: T[],
  setActive: React.Dispatch<React.SetStateAction<T[]>>,
  rendered: T[],
  setRendered: React.Dispatch<React.SetStateAction<T[]>>,
  total: Record<ChartKey, number>
): DropdownItem<T>[] {
  const toggleLine = (key: T) => {
    if (active.includes(key)) {
      setActive((prev) => prev.filter((k) => k !== key));
    } else {
      setActive((prev) => [...prev, key]);
      if (!rendered.includes(key)) setRendered((prev) => [...prev, key]);
    }
  };

  return keys.map((key) => ({
    key,
    label: chartConfig[key].label,
    color: chartConfig[key].color,
    value: total[key] || 0,
    checked: active.includes(key),
    onToggle: () => toggleLine(key),
  }));
}
