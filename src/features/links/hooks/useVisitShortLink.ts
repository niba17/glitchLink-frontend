"use client";

import { useState } from "react";
import { visitShortLink } from "../utils/visitShortLink";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useVisitShortLink() {
  const { showError, showSuccess } = useToastHandler();
  const [loading, setLoading] = useState(false);

  const onVisit = async (aliasOrCode: string) => {
    setLoading(true);
    try {
      await visitShortLink(aliasOrCode, showError, showSuccess);
    } finally {
      setLoading(false);
    }
  };

  return { onVisit, loading };
}
