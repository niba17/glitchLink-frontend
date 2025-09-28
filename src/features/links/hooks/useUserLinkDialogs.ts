import { useState } from "react";

export function useUserLinkDialogs() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectForEdit = (id: number) => {
    setSelectedId(id);
    setOpenEditDialog(true);
  };

  const selectForDelete = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  return {
    openDialog,
    setOpenDialog,
    openCreateDialog,
    setOpenCreateDialog,
    openEditDialog,
    setOpenEditDialog,
    selectedId,
    selectForEdit,
    selectForDelete,
  };
}

export type UserLinkDialogs = ReturnType<typeof useUserLinkDialogs>;
