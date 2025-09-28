"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface SignInFormUIProps {
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fieldErrors?: Record<string, string>;
  rootError?: string; // pesan error umum di atas form
  isPending?: boolean;
}

export default function SignInFormUI({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  fieldErrors,
  rootError,
  isPending,
}: SignInFormUIProps) {
  // hanya tampil border merah jika field punya error
  const emailHasError = fieldErrors?.email !== undefined;
  const passwordHasError = fieldErrors?.password !== undefined;

  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      {rootError && (
        <p className="text-sm font-extrabold text-red-500">{rootError}</p>
      )}

      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <Label className="text-md" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              emailHasError ? "border border-red-500 focus:ring-red-500" : ""
            }
            required
          />
          {fieldErrors?.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="text-md" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={
              passwordHasError ? "border border-red-500 focus:ring-red-500" : ""
            }
            required
          />
          {fieldErrors?.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center"
        >
          {isPending ? <Spinner className="w-5 h-5" /> : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
