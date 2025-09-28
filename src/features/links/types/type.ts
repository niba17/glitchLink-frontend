export interface ShortLinkPayload {
  originalUrl: string;
  customAlias?: string | null;
  expiresAt?: string | null;
}

export interface ShortLinkResponse {
  status: "success";
  message: string;
  data: ShortLinkPayload & {
    id: number;
    shortCode: string;
    shortUrl: string;
    userId?: number | null;
    expiresAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface GuestLinkUI {
  id: number;
  original: string;
  shortCode: string | null;
  shortUrl: string;
  createdAt: string | null;
  expiresAt: string | null; // ✅ tambahin ini
}

export interface GuestLink {
  id: number;
  originalUrl: string;
  shortUrl: string;
  shortCode?: string | null;
  createdAt?: string | null;
  expiresAt?: string | null; // ✅ tambahin ini
}

export interface UserLink {
  id: number;
  originalUrl: string;
  shortCode: string;
  customAlias?: string | null;
  userId: number;
  clicksCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;
  shortUrl: string;
}

// untuk klaim guest links
export interface ImportGuestLinksPayload {
  links: {
    linkId: number;
    customAlias?: string | null;
  }[];
}

// hasil klaim dari backend
export interface ImportGuestLinkResult {
  link: GuestLink;
  status: "success" | "conflict";
  message?: string;
}

export type ImportGuestLinkSinglePayload = {
  linkId: number;
  customAlias?: string;
};

export interface ImportGuestLinkSingleResult {
  link: GuestLink;
  status: "success" | "conflict";
  message?: string;
}

export interface GuestLinkWithMessage {
  link: GuestLink;
  message?: string;
}

export interface GuestLinkUIWithState extends GuestLinkUI {
  isActive: boolean;
}
