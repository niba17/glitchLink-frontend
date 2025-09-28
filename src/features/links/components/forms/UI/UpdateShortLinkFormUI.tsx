// frontend-final/src/features/links/components/forms/UpdateShortLinkFormUI.tsx

import { DateTimePicker } from "@/components/customs/DateTimePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateShortLinkFormUIProps {
  customAlias: string | null;
  expiresAt: string | null;
  onChangeAlias: (val: string) => void;
  onChangeExpiresAt: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  fieldErrors?: Record<string, string>;
  rootError?: string;
  onClose?: () => void;
  onGenerateAlias?: () => void;
  isGenerating?: boolean; // ⬅️ tambahan baru
}

export default function UpdateShortLinkFormUI({
  customAlias,
  expiresAt,
  onChangeAlias,
  onChangeExpiresAt,
  onSubmit,
  isPending,
  fieldErrors,
  rootError,
  onClose,
  onGenerateAlias,
  isGenerating, // ⬅️ baru
}: UpdateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      {rootError && (
        <p className="text-sm font-extrabold text-red-500">{rootError}</p>
      )}
      <div className="flex flex-col space-y-3">
        {/* Custom Alias */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-md" htmlFor="customAlias">
              Custom Alias
            </Label>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-5"
              onClick={onGenerateAlias}
              disabled={isGenerating} // ✅ selalu ada tombol
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
          <Input
            id="customAlias"
            placeholder="your-alias"
            type="text"
            value={customAlias ?? ""}
            onChange={(e) => onChangeAlias(e.target.value)}
            className={
              fieldErrors?.customAlias
                ? "border border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {fieldErrors?.customAlias && (
            <p className="text-sm text-red-500">{fieldErrors.customAlias}</p>
          )}
        </div>

        {/* Expiration Date */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-md" htmlFor="expiresAt">
              Expiration Date (Optional)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChangeExpiresAt("")}
              className="h-5"
            >
              <span className="text-xs">Reset date</span>
            </Button>
          </div>
          <DateTimePicker
            id="expiresAt"
            value={expiresAt ?? ""}
            onChange={(val) => onChangeExpiresAt(val)}
            className={
              fieldErrors?.expiresAt
                ? "border border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {fieldErrors?.expiresAt && (
            <p className="text-sm text-red-500">{fieldErrors.expiresAt}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Update Short Link"}
        </Button>
      </div>
    </form>
  );
}
