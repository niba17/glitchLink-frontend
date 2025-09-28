"use client";

import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import { AuthResponse, SignInPayload, SignUpPayload } from "../types/auth";

export interface AuthErrorParsed {
  rootError: string;
  fieldErrors: Record<string, string>;
}

export const parseAuthError = (err: any): AuthErrorParsed => {
  const fe: Record<string, string> = {};
  let re = "Something went wrong";

  if (err?.isAxiosError) {
    const data = (err as AxiosError<any>).response?.data;
    if (data) {
      if (Array.isArray(data.errors)) {
        data.errors.forEach((e: { path: string; message: string }) => {
          fe[e.path] = e.message || "";
        });
      }
      if (data.message) re = data.message;
    }
  } else if (err instanceof Error) {
    re = err.message;
  }

  return { rootError: re, fieldErrors: fe };
};

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();
  const router = useRouter();

  const signInMutation = useMutation<AuthResponse, AxiosError, SignInPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: async (res) => {
      const token = res.data?.token;
      const email = res.data?.user?.email;
      if (token && email) {
        setAuth({ isLoggedIn: true, token, email });
        showSuccess(res.message);
        // Redirect dilakukan oleh GuestLinksLoginActionDialogContainer
      } else {
        showError(res.message);
      }
    },
    onError: (err: AxiosError) => {
      const { rootError } = parseAuthError(err);
      showError(rootError);
    },
  });

  const signUpMutation = useMutation<AuthResponse, AxiosError, SignUpPayload>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (res) => {
      const token = res.data?.token;
      const email = res.data?.user?.email;
      if (token && email) {
        setAuth({ isLoggedIn: true, token, email });
        showSuccess(res.message);
        // Jangan langsung redirect
        // Trigger dialog dilakukan di SignUpFormContainer
      } else {
        showError(res.message);
      }
    },
    onError: (err: AxiosError) => {
      const { rootError } = parseAuthError(err);
      showError(rootError);
      return parseAuthError(err);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => true,
    onSuccess: () => {
      clearAuth();
      showSuccess("Signed out successfully");
      router.replace("/");
    },
    onError: () => showError("Sign out failed"),
  });

  return {
    signIn: signInMutation.mutate as unknown as UseMutateFunction<
      AuthResponse,
      AuthErrorParsed,
      SignInPayload,
      unknown
    >,
    signInAsync: signInMutation.mutateAsync as unknown as (
      payload: SignInPayload
    ) => Promise<AuthResponse>,

    signUp: signUpMutation.mutate as unknown as UseMutateFunction<
      AuthResponse,
      AuthErrorParsed,
      SignUpPayload,
      unknown
    >,
    signUpAsync: signUpMutation.mutateAsync as unknown as (
      payload: SignUpPayload
    ) => Promise<AuthResponse>,

    signOut: signOutMutation.mutate,
    signInStatus: signInMutation.status,
    signUpStatus: signUpMutation.status,
    signOutStatus: signOutMutation.status,
    parseAuthError,
  };
}
