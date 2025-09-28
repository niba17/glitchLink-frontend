"use client";

import { useState } from "react";
import SignInFormUI from "../UI/SignInFormUI";
import { useAuth, AuthErrorParsed } from "@/features/auth/hooks/useAuth";
import { SignInPayload } from "../../../types/auth";
import { useDialogStore } from "@/store/useDialogStore";
import { useRouter } from "next/navigation";
import { useGuestLinks } from "@/features/links/hooks/useGuestLinks";

interface Props {
  onClose?: () => void;
}

export default function SignInFormContainer({ onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { signInAsync, parseAuthError } = useAuth();
  const { openGuestLinksLoginActionDialogContainer } = useDialogStore();
  const { guestLinks } = useGuestLinks();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);
    setIsPending(true);

    const payload: SignInPayload = { email, password };

    try {
      const res = await signInAsync(payload);
      if (res.data?.token) {
        // Login sukses
        if (guestLinks.length > 0) {
          // Buka GuestLinks dialog dengan callback otomatis
          openGuestLinksLoginActionDialogContainer(async () => {
            router.push("/links"); // fallback redirect setelah dialog selesai
          });
        } else {
          router.push("/links");
        }
      }
    } catch (err: any) {
      const parsed: AuthErrorParsed = parseAuthError(err);
      const updatedFieldErrors: Record<string, string> = {};
      ["email", "password"].forEach((key) => {
        updatedFieldErrors[key] =
          parsed.fieldErrors[key] && parsed.fieldErrors[key] !== ""
            ? parsed.fieldErrors[key]
            : parsed.rootError;
      });
      setFieldErrors(updatedFieldErrors);
      setRootError(parsed.rootError);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SignInFormUI
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
      isPending={isPending}
    />
  );
}
