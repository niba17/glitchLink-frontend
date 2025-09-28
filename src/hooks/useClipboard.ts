// frontend-final/src/hooks/useClipboard.ts
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import { useState } from "react";
import { useToastHandler } from "./useToastHandler"; // ⬅️ pakai custom hook

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const { showSuccess, showError } = useToastHandler();

  const copy = async (text: string, showToast = true) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (showToast) showSuccess(GUEST_SHORT_LINK_STRINGS.copySuccess);
      setTimeout(() => setCopied(false), 2000); // reset state setelah 2 detik
    } catch (err) {
      setCopied(false);
      showError(GUEST_SHORT_LINK_STRINGS.copyError);
    }
  };

  return { copied, copy };
}
