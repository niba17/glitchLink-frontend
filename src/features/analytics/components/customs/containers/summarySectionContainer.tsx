import React from "react";
import { SummarySectionUI } from "../ui/summarySectionUI";
import { UserLink } from "@/features/links/types/type";

interface SummarySectionContainerProps {
  selectedShortlink: UserLink | undefined;
}

export function SummarySectionContainer({
  selectedShortlink,
}: SummarySectionContainerProps) {
  return <SummarySectionUI selectedShortlink={selectedShortlink} />;
}
