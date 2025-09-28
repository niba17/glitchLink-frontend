import ShortLinkDialogUI from "../UI/ShortLinkDialogUI";

interface ShortLinkDialogContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  linkId?: number;
  currentAlias?: string;
  currentExpiresAt?: string;
  onClose?: () => void;
}

export default function ShortLinkDialogContainer({
  open,
  onOpenChange,
  mode,
  linkId,
  currentAlias = "",
  currentExpiresAt = "",
  onClose,
}: ShortLinkDialogContainerProps) {
  return (
    <ShortLinkDialogUI
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      linkId={linkId}
      currentAlias={currentAlias}
      currentExpiresAt={currentExpiresAt}
      onClose={onClose}
    />
  );
}
