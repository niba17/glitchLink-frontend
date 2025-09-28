import { DateTimePicker } from "@/components/customs/DateTimePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface CreateShortLinkFormUIProps {
  originalUrl: string;
  customAlias: string;
  expiresAt: string;
  onChangeOriginal: (val: string) => void;
  onChangeAlias: (val: string) => void;
  onChangeExpiresAt: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fieldErrors?: Record<string, string>;
  isPending?: boolean;
  rootError?: string;
  onClose?: () => void;
  onGenerateAlias?: () => void; // <<<<<
  isGenerating?: boolean;
}

export default function CreateShortLinkFormUI({
  originalUrl,
  customAlias,
  expiresAt,
  onChangeOriginal,
  onChangeAlias,
  onChangeExpiresAt,
  onSubmit,
  fieldErrors,
  isPending,
  rootError,
  onClose,
  onGenerateAlias,
  isGenerating,
}: CreateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      {rootError && (
        <p className="text-sm font-extrabold text-red-500">{rootError}</p>
      )}

      <div className="flex flex-col space-y-2">
        {/* Original Link */}
        <div className="flex flex-col space-y-1">
          <Label className="text-md" htmlFor="originalUrl">
            Original Link
          </Label>
          <Input
            id="originalUrl"
            placeholder="https://example.com"
            type="url"
            value={originalUrl}
            onChange={(e) => onChangeOriginal(e.target.value)}
            className={
              fieldErrors?.originalUrl
                ? "border border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {fieldErrors?.originalUrl && (
            <p className="text-sm text-red-500">{fieldErrors.originalUrl}</p>
          )}
        </div>

        {/* Custom Alias */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-md" htmlFor="customAlias">
              Custom Alias
            </Label>

            <Button
              type="button"
              variant="outline"
              onClick={onGenerateAlias}
              disabled={isGenerating}
              size="sm"
              className="h-5"
            >
              {isGenerating ? <Spinner /> : "Generate"}
            </Button>
          </div>
          <Input
            id="customAlias"
            placeholder="your-alias"
            type="text"
            value={customAlias}
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
            value={expiresAt} // string ISO
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

      {/* Cancel + Submit */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Get Short Link"}
        </Button>
      </div>
    </form>
  );
}
