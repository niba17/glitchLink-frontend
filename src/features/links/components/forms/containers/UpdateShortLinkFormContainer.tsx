// frontend-final\src\features\links\components\forms\containers\UpdateShortLinkFormContainer.tsx
"use client";

import { useState } from "react";
import UpdateShortLinkFormUI from "../UI/UpdateShortLinkFormUI";
import { useUserLinks } from "../../../hooks/useUserLinks";
import {
  normalizeExpiresAt,
  formatForInput,
} from "../../../utils/dateFormatters";
import { useToastHandler } from "@/hooks/useToastHandler"; // ⬅️ import custom hook

interface UpdateShortLinkFormContainerProps {
  linkId: number;
  currentAlias?: string;
  currentExpiresAt?: string | null;
  onClose: () => void;
}

export default function UpdateShortLinkFormContainer({
  linkId,
  currentAlias = "",
  currentExpiresAt = null,
  onClose,
}: UpdateShortLinkFormContainerProps) {
  const [customAlias, setCustomAlias] = useState(currentAlias);
  const [expiresAt, setExpiresAt] = useState<string | null>(
    formatForInput(currentExpiresAt)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { updateShortLink, isUpdating, generateShortCode, isGenerating } =
    useUserLinks();
  const { showSuccess, showError } = useToastHandler(); // ⬅️ gunakan custom toast

  const handleGenerateAlias = async () => {
    try {
      const code = await generateShortCode();
      setCustomAlias(code);
    } catch (error: any) {
      // Tangkap pesan error dari BE
      const apiError = error.response?.data || error.data;
      const message = apiError?.message || "Failed to generate alias";
      showError(message);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload = {
      id: linkId,
      customAlias,
      expiresAt: normalizeExpiresAt(expiresAt),
    };

    updateShortLink(payload, {
      onSuccess: (data: any) => {
        // Ambil pesan sukses dari response BE
        const successMessage = data?.message || "Link updated successfully!";
        showSuccess(successMessage);
        onClose();
      },
      onError: (error: any) => {
        try {
          const apiError = error.response?.data || error.data;
          if (apiError?.message) {
            setRootError(apiError.message);
            showError(apiError.message);
          }

          if (Array.isArray(apiError?.errors)) {
            const mapped: Record<string, string> = {};
            let allEmpty = true;
            apiError.errors.forEach(
              (err: { path: string; message: string }) => {
                mapped[err.path] = err.message;
                if (err.message) allEmpty = false;
              }
            );
            setFieldErrors(mapped);
            if (allEmpty && apiError.message) {
              setRootError(apiError.message);
            }
          }

          // Jika tidak ada pesan sama sekali dari BE
          if (
            !apiError?.message &&
            (!apiError?.errors || apiError.errors.length === 0)
          ) {
            setRootError("Unexpected error occurred");
            showError("Unexpected error occurred");
          }
        } catch (err) {
          // fallback kalau terjadi error saat parsing response
          setRootError("Unexpected error occurred");
          showError("Unexpected error occurred");
        }
      },
    });
  };

  return (
    <UpdateShortLinkFormUI
      customAlias={customAlias}
      expiresAt={expiresAt}
      onChangeAlias={setCustomAlias}
      onChangeExpiresAt={setExpiresAt}
      onSubmit={handleSubmit}
      isPending={isUpdating}
      isGenerating={isGenerating}
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
      onClose={onClose}
      onGenerateAlias={handleGenerateAlias}
    />
  );
}
