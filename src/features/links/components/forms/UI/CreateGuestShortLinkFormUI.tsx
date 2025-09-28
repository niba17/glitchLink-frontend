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
  onGenerateAlias?: () => void;
  isGenerating?: boolean;
  rootError?: string;
  onClose?: () => void;
}

export default function CreateGuestShortLinkFormUI({
  originalUrl,
  customAlias,
  expiresAt,
  onChangeOriginal,
  onChangeAlias,
  onChangeExpiresAt,
  onSubmit,
  fieldErrors,
  isPending,
  onGenerateAlias,
  isGenerating,
  rootError,
  onClose,
}: CreateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      {rootError && (
        <p className="text-sm font-extrabold text-red-500">{rootError}</p>
      )}

      <div className="flex flex-col space-y-2">
        {/* Original Link */}
        <div className="flex flex-col space-y-1">
          <Label className="text-lg" htmlFor="originalUrl">
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

        {/* Alias */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-lg" htmlFor="customAlias">
              Custom Alias
            </Label>

            <Button
              type="button"
              variant="outline"
              className="h-5"
              size="sm"
              onClick={onGenerateAlias}
              disabled={isGenerating}
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
            <Label className="text-lg" htmlFor="expiresAt">
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

      <Button
        type="submit"
        variant="default"
        className="text-[20px] h-14 flex items-center justify-center"
        disabled={isPending}
      >
        {isPending ? <Spinner className="w-7 h-7" /> : "Get Shortlink"}
      </Button>
    </form>
  );
}
