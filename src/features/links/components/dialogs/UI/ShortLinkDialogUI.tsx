import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateShortLinkFormContainer from "@/features/links/components/forms/containers/CreateShortLinkFormContainer";
import UpdateShortLinkFormContainer from "@/features/links/components/forms/containers/UpdateShortLinkFormContainer";

interface ShortLinkDialogUIProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  linkId?: number;
  currentAlias?: string;
  currentExpiresAt?: string;
  onClose?: () => void;
}

export default function ShortLinkDialogUI({
  open,
  onOpenChange,
  mode,
  linkId,
  currentAlias = "",
  currentExpiresAt = "",
  onClose,
}: ShortLinkDialogUIProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Short Link" : "Edit Short Link"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create your short link with a custom alias or expiration date."
              : "Update your link with a custom alias or expiration date."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "create" ? (
            <CreateShortLinkFormContainer onClose={onClose} />
          ) : linkId !== undefined ? (
            <UpdateShortLinkFormContainer
              linkId={linkId}
              currentAlias={currentAlias}
              currentExpiresAt={currentExpiresAt}
              onClose={() => onOpenChange(false)}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
