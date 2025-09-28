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
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-2 justify-center space-x-5">
        <TotalClickCardContainer shortlinkId={shortlinkId} />
        <TrafficSourceCardContainer shortlinkId={shortlinkId} />
      </div>
    </div>
  );
}
