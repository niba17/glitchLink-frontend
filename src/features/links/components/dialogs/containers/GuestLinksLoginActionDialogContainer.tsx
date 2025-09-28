"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { GuestLinksLoginActionDialogUI } from "../UI/GuestLinksLoginActionDialogUI";
import { useDialogStore } from "@/store/useDialogStore";
import {
  useGuestLinks,
  importGuestLinkSingle,
} from "../../../hooks/useGuestLinks";
import { useToastHandler } from "@/hooks/useToastHandler";
import { useAuthStore } from "@/store/useAuthStore";
import { GuestLink } from "../../../types/type";

interface Selection {
  import: boolean;
  remove: boolean;
  ignore: boolean;
}

const LOCAL_STORAGE_KEY = "guestLinks";

export function GuestLinksLoginActionDialogContainer() {
  const router = useRouter();
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { guestLinks, deleteShortLinkAsync } = useGuestLinks();

  const {
    openGuestLinksLoginAction,
    closeGuestLinksLoginActionDialogContainer,
    dialogConfirmCallback,
  } = useDialogStore();

  const [selection, setSelection] = useState<Record<number, Selection>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // redirect jika tidak ada guest links
  useEffect(() => {
    if (openGuestLinksLoginAction && guestLinks.length === 0) {
      closeGuestLinksLoginActionDialogContainer();
      router.push("/links");
    }
  }, [
    openGuestLinksLoginAction,
    guestLinks,
    closeGuestLinksLoginActionDialogContainer,
    router,
  ]);

  // init checkbox
  useEffect(() => {
    if (!openGuestLinksLoginAction) return;
    const initial: Record<number, Selection> = {};
    guestLinks.forEach((link) => {
      initial[link.id] = { import: true, remove: false, ignore: false };
    });
    setSelection(initial);
  }, [openGuestLinksLoginAction, guestLinks]);

  const toggle = (id: number, type: "import" | "remove" | "ignore") => {
    setSelection((prev) => {
      const current = prev[id] || {
        import: false,
        remove: false,
        ignore: false,
      };
      return {
        ...prev,
        [id]: {
          import: type === "import" ? !current.import : false,
          remove: type === "remove" ? !current.remove : false,
          ignore: type === "ignore" ? !current.ignore : false,
        },
      };
    });
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    const selectedForImport = guestLinks.filter((l) => selection[l.id]?.import);
    const selectedForRemove = guestLinks.filter((l) => selection[l.id]?.remove);
    const successfullyImportedIds: number[] = [];

    // IMPORT LINKS
    for (const link of selectedForImport) {
      if (!token) {
        toast.showError("User not authenticated");
        continue;
      }
      try {
        const res = await importGuestLinkSingle(link, token);
        if (res.status === "success") {
          toast.showSuccess(`${res.message ?? "Imported"}: ${link.shortUrl}`);

          successfullyImportedIds.push(link.id);

          // update cache
          queryClient.setQueryData(
            [LOCAL_STORAGE_KEY],
            (old: GuestLink[] | undefined) => {
              if (!old) return [res.link];
              const exists = old.some((l) => l.id === res.link.id);
              return exists ? old : [res.link, ...old];
            }
          );

          // update localStorage
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          const parsed: GuestLink[] = stored ? JSON.parse(stored) : [];
          const updated = [
            res.link,
            ...parsed.filter((l) => l.id !== res.link.id),
          ];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } else {
          toast.showError(res.message ?? `Failed to import: ${link.shortUrl}`);
        }
      } catch (err: any) {
        toast.showError(`Failed to import ${link.shortUrl}: ${err.message}`);
      }
    }

    // DELETE LINKS
    const idsToDelete = selectedForRemove
      .concat(guestLinks.filter((l) => successfullyImportedIds.includes(l.id)))
      .map((l) => l.id);

    for (const id of idsToDelete) {
      const deletedLink = guestLinks.find((l) => l.id === id);
      if (!deletedLink) continue;

      // pakai deleteShortLinkAsync, await biar urut, toast muncul semua
      await deleteShortLinkAsync(id);
      toast.showSuccess(`Deleted from local: ${deletedLink.shortUrl}`);
    }

    setIsProcessing(false);
    closeGuestLinksLoginActionDialogContainer();
    dialogConfirmCallback?.();
  };

  return (
    <GuestLinksLoginActionDialogUI
      open={openGuestLinksLoginAction}
      guestLinks={guestLinks}
      selection={selection}
      toggle={toggle}
      onCancel={closeGuestLinksLoginActionDialogContainer}
      onConfirm={handleConfirm}
      isProcessing={isProcessing}
    />
  );
}
