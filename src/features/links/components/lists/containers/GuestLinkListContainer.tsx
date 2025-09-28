// frontend-final/src/features/links/components/lists/containers/GuestLinkListContainer.tsx
import { useState } from "react";
import { isAfter } from "date-fns";
import { useClipboard } from "@/hooks/useClipboard";
import { useGuestLinks } from "@/features/links/hooks/useGuestLinks";
import { useToastHandler } from "@/hooks/useToastHandler";
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import { GuestLinkUI } from "@/features/links/types/type";
import { GuestLinkListUI } from "../UI/GuestLinkListUI";
import { visitShortLink } from "@/features/links/utils/visitShortLink";

interface GuestLinksListContainerProps {
  links: GuestLinkUI[];
}

export default function GuestLinksListContainer({
  links,
}: GuestLinksListContainerProps) {
  const { copy } = useClipboard();
  const { deleteShortLink } = useGuestLinks();
  const { showSuccess, showError } = useToastHandler();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => setSelectedId(id);

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      try {
        deleteShortLink(selectedId);
        showSuccess(GUEST_SHORT_LINK_STRINGS.deleteSuccess);
      } catch {
        showError(GUEST_SHORT_LINK_STRINGS.deleteError);
      }
      setSelectedId(null);
    }
  };

  return (
    <GuestLinkListUI
      links={links.map((link) => ({
        ...link,
        isActive:
          !link.expiresAt || isAfter(new Date(link.expiresAt), new Date()),
      }))}
      onCopy={copy}
      onDeleteClick={handleDeleteClick}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={() => setSelectedId(null)}
      openDialog={selectedId !== null}
    />
  );
}
