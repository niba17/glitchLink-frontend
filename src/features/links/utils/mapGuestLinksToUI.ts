// frontend-final/src/features/links/utils/mapGuestLinksToUI.ts
import { GuestLink, GuestLinkUI } from "@/features/links/types/type";
import { parseISO, isValid, format } from "date-fns";

export function mapGuestLinksToUI(links: GuestLink[]): GuestLinkUI[] {
  return links.map((link) => {
    const createdAt =
      link.createdAt && isValid(parseISO(link.createdAt))
        ? format(parseISO(link.createdAt), "yyyy-MM-dd HH:mm:ss.SSS") // ✅ SQL style
        : null;

    const expiresAt =
      link.expiresAt && isValid(parseISO(link.expiresAt))
        ? format(parseISO(link.expiresAt), "yyyy-MM-dd HH:mm:ss.SSS")
        : null;

    return {
      id: link.id,
      original: link.originalUrl,
      shortUrl: link.shortUrl,
      shortCode: link.shortCode || "",
      createdAt,
      expiresAt,
    };
  });
}
