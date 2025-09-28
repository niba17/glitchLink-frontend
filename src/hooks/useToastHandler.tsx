import React from "react";
import { toast } from "sonner";

export function useToastHandler() {
  const showSuccess = (message: string) => {
    toast.success(<span style={{ whiteSpace: "pre-line" }}>{message}</span>);
  };

  const showError = (message: string) => {
    toast.error(<span style={{ whiteSpace: "pre-line" }}>{message}</span>);
  };

  return { showSuccess, showError };
}
