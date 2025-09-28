import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShortLinkPayload,
  GuestLink,
  GuestLinkUI,
  ShortLinkResponse,
  ImportGuestLinkResult,
  GuestLinkWithMessage,
} from "../types/type";
import { mapGuestLinksToUI } from "../utils/mapGuestLinksToUI";
import { linkService } from "../services/linkService";

const LOCAL_STORAGE_KEY = "guestLinks";

function fetchGuestLinks(): GuestLink[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as GuestLink[];
  } catch {
    return [];
  }
}

export function useGuestLinks() {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const query = useQuery<GuestLink[]>({
    queryKey: [LOCAL_STORAGE_KEY],
    queryFn: fetchGuestLinks,
  });

  const createMutation = useMutation<
    GuestLinkWithMessage,
    Error,
    ShortLinkPayload
  >({
    mutationFn: async (payload: ShortLinkPayload) => {
      const res: ShortLinkResponse = await linkService.createShortLink(payload);

      const newLink: GuestLink = {
        id: res.data.id,
        originalUrl: res.data.originalUrl,
        shortUrl: res.data.shortUrl,
        shortCode: res.data.customAlias || res.data.shortCode || null,
        createdAt: res.data.createdAt || new Date().toISOString(),
        expiresAt: res.data.expiresAt || null,
      };

      return { link: newLink, message: res.message }; // <-- tambahkan message
    },
    onSuccess: ({ link }) => {
      const prev =
        queryClient.getQueryData<GuestLink[]>([LOCAL_STORAGE_KEY]) || [];
      const updated = [link, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      queryClient.setQueryData([LOCAL_STORAGE_KEY], updated);
    },
  });

  const deleteMutation = useMutation<GuestLink[], Error, number>({
    mutationFn: (id: number) => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed: GuestLink[] = stored ? JSON.parse(stored) : [];
      const updated = parsed.filter((link) => link.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return Promise.resolve(updated); // ✅ wajib Promise
    },
    onSuccess: (updated) =>
      queryClient.setQueryData([LOCAL_STORAGE_KEY], updated),
  });

  // Tambahkan ini
  const deleteShortLinkAsync = async (id: number) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed: GuestLink[] = stored ? JSON.parse(stored) : [];
    const updated = parsed.filter((link) => link.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    queryClient.setQueryData([LOCAL_STORAGE_KEY], updated);
    return updated;
  };

  const generateShortCode = async (): Promise<string> => {
    setIsGenerating(true);
    try {
      const code = Math.random().toString(36).substring(2, 8);
      return code;
    } finally {
      setIsGenerating(false);
    }
  };

  const uiGuestLinks: GuestLinkUI[] = query.data
    ? mapGuestLinksToUI(query.data)
    : [];

  return {
    guestLinks: query.data || [],
    uiGuestLinks,
    isLoading: query.isLoading,

    createShortLink: createMutation.mutate,
    createShortLinkAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    deleteShortLink: (
      id: number,
      callbacks?: { onSuccess?: () => void; onError?: (err: any) => void }
    ) => {
      deleteMutation.mutate(id, {
        onSuccess: () => callbacks?.onSuccess?.(),
        onError: (err: any) => callbacks?.onError?.(err),
      });
    },

    deleteShortLinkAsync, // <--- tambahkan di sini

    importGuestLinkSingle,
    generateShortCode,
    isGenerating,
  };
}

export async function importGuestLinkSingle(
  link: GuestLink,
  token: string
): Promise<ImportGuestLinkResult> {
  try {
    const payload = {
      linkId: link.id,
      customAlias: link.shortCode || undefined,
    };

    const res = await linkService.importGuestLink(payload, token); // pakai token dari container

    const importedLink: GuestLink = res.data;

    return {
      link: importedLink,
      status: "success",
      message: "Guest link imported successfully",
    };
  } catch (err: any) {
    return {
      link,
      status: "conflict",
      message: err.data?.message || err.message,
    };
  }
}
