import { useState } from "react";
import { ShortLinkPayload } from "../../../types/type";
import { useGuestLinks } from "../../../hooks/useGuestLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateGuestShortLinkFormUI from "../UI/CreateGuestShortLinkFormUI";
import CreateUserShortLinkFormUI from "../UI/CreateUserShortlinkFormUI";
import { useUserLinks } from "../../../hooks/useUserLinks";
import {
  normalizeExpiresAt,
  formatForInput,
} from "../../../utils/dateFormatters";

interface Props {
  onClose?: () => void;
}

export default function CreateShortLinkFormContainer({ onClose }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>(
    formatForInput(null) ?? ""
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showSuccess, showError } = useToastHandler();

  const {
    createShortLink: createGuestShortLink,
    generateShortCode: generateGuestAlias,
    isCreating: isGuestCreating,
    isGenerating: isGuestGenerating,
  } = useGuestLinks();

  const {
    createShortLink: createUserShortLink,
    isCreating: isUserCreating,
    generateShortCode: generateUserAlias,
    isGenerating: isUserGenerating,
  } = useUserLinks();

  const handleGenerateAlias = async () => {
    try {
      const code = isLoggedIn
        ? await generateUserAlias()
        : await generateGuestAlias();
      setCustomAlias(code);
    } catch (err) {
      showError("Failed to generate alias");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: normalizeExpiresAt(expiresAt),
    };

    const handleSuccess = (msg: string) => {
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      showSuccess(msg);
      if (onClose) onClose();
    };

    const handleError = (err: any) => {
      const apiError = err.response?.data || err.data || err;

      if (Array.isArray(apiError?.errors)) {
        const mapped: Record<string, string> = {};
        apiError.errors.forEach((e: { path: string; message: string }) => {
          mapped[e.path] = e.message;
        });
        setFieldErrors(mapped);
        if (apiError.message) setRootError(apiError.message);
      } else if (apiError?.message) {
        setRootError(apiError.message);
      }

      showError(apiError?.message || "Failed to create link");
    };

    if (isLoggedIn) {
      createUserShortLink(payload, {
        onSuccess: (res) => {
          handleSuccess(res.message || "Short link created successfully");
        },
        onError: handleError,
      });
    } else {
      createGuestShortLink(payload, {
        onSuccess: (res) => {
          handleSuccess(res.message || "Short link created successfully"); // ✅ sudah aman
        },
        onError: handleError,
      });
    }
  };

  const sharedProps = {
    originalUrl,
    customAlias,
    expiresAt,
    onChangeOriginal: setOriginalUrl,
    onChangeAlias: setCustomAlias,
    onChangeExpiresAt: setExpiresAt,
    onSubmit: handleSubmit,
    fieldErrors,
  };

  return isLoggedIn ? (
    <CreateUserShortLinkFormUI
      {...sharedProps}
      expiresAt={expiresAt ?? ""}
      rootError={rootError ?? undefined}
      onClose={onClose}
      onGenerateAlias={handleGenerateAlias}
      isGenerating={isUserGenerating}
      isPending={isUserCreating}
    />
  ) : (
    <CreateGuestShortLinkFormUI
      {...sharedProps}
      expiresAt={expiresAt ?? ""}
      onGenerateAlias={handleGenerateAlias}
      isGenerating={isGuestGenerating}
      isPending={isGuestCreating}
    />
  );
}
