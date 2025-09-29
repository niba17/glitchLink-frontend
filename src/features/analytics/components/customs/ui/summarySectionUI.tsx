import React from "react";
import { TotalClickCardContainer } from "../../cards/containers/totalClickCardContainer";
import { TrafficSourceCardContainer } from "../../cards/containers/trafficSourceCardContainer";
import { UserLink } from "@/features/links/types/type";

interface SummarySectionUIProps {
  selectedShortlink: UserLink | undefined;
}

export function SummarySectionUI({ selectedShortlink }: SummarySectionUIProps) {
  // Menggunakan 'id' jika shortlink ada, jika tidak, gunakan 0 atau nilai default
  const shortlinkId = selectedShortlink?.id || 0;

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-center gap-5">
      <TotalClickCardContainer shortlinkId={shortlinkId} />
      <TrafficSourceCardContainer shortlinkId={shortlinkId} />
    </div>
  );
}
