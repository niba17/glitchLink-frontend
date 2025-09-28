import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { linkService } from "../services/linkService";
import { useAuthStore } from "@/store/useAuthStore";
import { UserLink, ShortLinkPayload } from "../types/type";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useUserLinks() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastHandler();

  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      return linkService.generateShortCode(token || undefined);
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to generate short code");
    },
  });

  // Fetch user links
  const query = useQuery<UserLink[], Error>({
    queryKey: ["userLinks", token],
    queryFn: async () => {
      if (!token) throw new Error("User not authenticated");
      return linkService.getUserLinks(token);
    },
    enabled: !!token,
  });

  // Create link
  const createMutation = useMutation({
    mutationFn: async (payload: ShortLinkPayload) => {
      if (!token) throw new Error("Unauthorized");
      const res = await linkService.createShortLink(payload, token);
      return { data: res.data, message: res.message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLinks", token] });
    },
  });

  // Update link
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      customAlias,
      expiresAt,
    }: {
      id: number;
      customAlias?: string | null;
      expiresAt?: string | null;
    }) => {
      if (!token) throw new Error("Unauthorized");
      return linkService.updateShortLink(id, { customAlias, expiresAt }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLinks", token] });
    },
  });

  // Delete link
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("User not authenticated");
      return linkService.deleteUserLink(id, token);
    },
    onSuccess: (data) => {
      showSuccess(data.message || "Link deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["userLinks", token] });
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to delete link");
    },
  });

  // di dalam useUserLinks()
  const generateQRMutation = useMutation({
    mutationFn: async (linkId: number) => {
      if (!token) throw new Error("Unauthorized");
      return linkService.generateQRCode(linkId, token);
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to generate QR Code");
    },
  });

  return {
    ...query,
    userLinks: query.data || [],
    createShortLink: createMutation.mutate,
    createShortLinkAsync: createMutation.mutateAsync,
    updateShortLink: updateMutation.mutate,
    updateShortLinkAsync: updateMutation.mutateAsync,
    deleteShortLink: deleteMutation.mutate,
    deleteShortLinkAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    generateShortCode: generateCodeMutation.mutateAsync,
    isGenerating: generateCodeMutation.isPending,
    generateQRCode: generateQRMutation.mutateAsync,
    isGeneratingQRCode: generateQRMutation.isPending,
  };
}
