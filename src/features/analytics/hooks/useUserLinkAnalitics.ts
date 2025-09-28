import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { analyticService } from "../services/analyticService";
import { LinkAnalyticsResponse } from "../types/type";

export function useUserLinkAnalytics(shortlinkId?: number) {
  const token = useAuthStore((s) => s.token);

  const query = useQuery<LinkAnalyticsResponse, Error>({
    queryKey: ["linkAnalytics", shortlinkId, token],
    queryFn: async () => {
      if (!token || typeof shortlinkId === "undefined") {
        throw new Error("User not authenticated or shortlink ID is missing");
      }
      return analyticService.getLinkAnalytics(shortlinkId, token);
    },
    enabled: !!token && typeof shortlinkId !== "undefined",
  });

  return {
    ...query,
    analyticsData: query.data,
  };
}
