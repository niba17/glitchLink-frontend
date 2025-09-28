// frontend-final/src/pages/links.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import ConfirmDialog from "@/components/customs/ConfirmDialog";
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import ShortLinkDialogContainer from "@/features/links/components/dialogs/containers/ShortLinkDialogContainer";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useUserLinkDialogs } from "@/features/links/hooks/useUserLinkDialogs";
import { useUserLinkActions } from "@/features/links/hooks/useUserLinkActions";
import { UserLinkTableContainer } from "@/features/links/components/tables/containers/UserLinkTableContainer";

export default function LinksPage() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const router = useRouter();
  const {
    data: links,
    isLoading,
    error,
    deleteShortLinkAsync,
  } = useUserLinks();
  const dialogs = useUserLinkDialogs();

  const { handleConfirmDelete } = useUserLinkActions({
    dialogs,
    deleteShortLink: deleteShortLinkAsync, // gunakan async version
  });

  useEffect(() => {
    if (rehydrated && !isLoggedIn) router.replace("/");
  }, [isLoggedIn, rehydrated, router]);

  if (!rehydrated) return null;
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <section>
      <div className="bg-zinc-950 min-h-screen p-5 space-y-[10px]">
        <div className="grid grid-cols-5">
          <Button onClick={() => dialogs.setOpenCreateDialog(true)}>
            Create Short Link
          </Button>
        </div>

        <UserLinkTableContainer dialogs={dialogs} />
      </div>

      {/* Create Dialog */}
      <ShortLinkDialogContainer
        open={dialogs.openCreateDialog}
        onOpenChange={dialogs.setOpenCreateDialog}
        mode="create"
        onClose={() => dialogs.setOpenCreateDialog(false)}
      />

      {/* Edit Dialog */}
      <ShortLinkDialogContainer
        open={dialogs.openEditDialog}
        onOpenChange={dialogs.setOpenEditDialog}
        mode="update"
        linkId={dialogs.selectedId ?? undefined}
        currentAlias={
          links?.find((l) => l.id === dialogs.selectedId)?.customAlias || ""
        }
        currentExpiresAt={
          links?.find((l) => l.id === dialogs.selectedId)?.expiresAt || ""
        }
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={dialogs.openDialog}
        title={GUEST_SHORT_LINK_STRINGS.deleteConfirmTitle}
        description={GUEST_SHORT_LINK_STRINGS.deleteConfirmDescription}
        confirmText={GUEST_SHORT_LINK_STRINGS.delete}
        cancelText={GUEST_SHORT_LINK_STRINGS.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => dialogs.setOpenDialog(false)}
      />
    </section>
  );
}
