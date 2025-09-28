// frontend-final/src/features/analytics/hooks/useDropdownOptions.ts
import {
  ChartKey,
  DeviceKey,
  BrowserKey,
  OSKey,
} from "@/features/analytics/types/type";
import { chartConfig } from "@/features/analytics/config/chartConfig";

// Definisikan interface untuk opsi dropdown
interface DropdownOption {
  key: ChartKey;
  label: string;
  color: string;
  value: number;
  checked: boolean;
  onToggle: () => void;
}

// Definisikan tipe untuk objek dropdown
type DropdownCollection = {
  devices: DropdownOption[];
  osList: DropdownOption[];
  browsers: DropdownOption[];
};

export const useDropdownOptions = (
  active: Record<"devices" | "browsers" | "osList", ChartKey[]>,
  total: Record<ChartKey, number>,
  toggleLine: (type: keyof typeof active, key: ChartKey) => void
): DropdownCollection => {
  const mapDropdown = (keys: ChartKey[], type: keyof typeof active) =>
    keys.map((key) => ({
      key,
      label: chartConfig[key].label,
      color: chartConfig[key].color,
      value: total[key] || 0,
      checked: active[type].includes(key),
      onToggle: () => toggleLine(type, key),
    }));

  const devices: DeviceKey[] = ["Desktop", "Mobile", "Tablet"];
  const browsers: BrowserKey[] = [
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
    "Opera",
  ];
  const osList: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

  return {
    devices: mapDropdown(devices, "devices"),
    osList: mapDropdown(osList, "osList"),
    browsers: mapDropdown(browsers, "browsers"),
  };
};
