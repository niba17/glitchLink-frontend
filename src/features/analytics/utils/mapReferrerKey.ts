import { ReferrerKey } from "../types/type";

export function mapReferrerKey(raw: string): ReferrerKey {
  switch (raw) {
    case "Instagram App":
      return "Instagram";
    case "WhatsApp":
    case "Facebook":
    case "LinkedIn":
    case "GitHub":
      return raw as ReferrerKey;
    default:
      return "Direct"; // fallback kalau ada string aneh
  }
}
