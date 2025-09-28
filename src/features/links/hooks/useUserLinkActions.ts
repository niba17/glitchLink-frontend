import { useClipboard } from "@/hooks/useClipboard";
import { useToastHandler } from "@/hooks/useToastHandler";
import type { UserLinkDialogs } from "./useUserLinkDialogs";
import { useVisitShortLink } from "./useVisitShortLink";

interface UseUserLinkActionsProps {
  dialogs: UserLinkDialogs;
  deleteShortLink: (id: number) => Promise<any>; // async version
}

export function useUserLinkActions({
  dialogs,
  deleteShortLink,
}: UseUserLinkActionsProps) {
  const { copy } = useClipboard();
  const { showError, showSuccess } = useToastHandler();
  const { selectForEdit, selectForDelete, selectedId, setOpenDialog } = dialogs;
  const { onVisit, loading } = useVisitShortLink();

  const onCopy = (shortUrl: string) => copy(shortUrl);
  const onEdit = (id: number) => selectForEdit(id);
  const onDelete = (id: number) => selectForDelete(id);

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        const res = await deleteShortLink(selectedId); // mutateAsync
        showSuccess(res?.message || "Link deleted successfully");
      } catch (err: any) {
        showError(err?.message || "Failed to delete link");
      }
    }
    setOpenDialog(false);
  };

  return { onCopy, onEdit, onDelete, onVisit, handleConfirmDelete };
}
