"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GuestLink } from "../../../types/type";

interface Props {
  open: boolean;
  guestLinks: GuestLink[];
  selection: Record<
    number,
    { import: boolean; remove: boolean; ignore: boolean }
  >;
  toggle: (id: number, type: "import" | "remove" | "ignore") => void;
  onCancel: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function GuestLinksLoginActionDialogUI({
  open,
  guestLinks,
  selection,
  toggle,
  onCancel,
  onConfirm,
  isProcessing,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel(); // close jika overlay clicked
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()} // mencegah close klik di luar
      >
        <DialogHeader>
          <DialogTitle>Take action to your shortlinks</DialogTitle>
        </DialogHeader>

        {guestLinks.length === 0 ? (
          <p>There's not any shortlinks in local storage.</p>
        ) : (
          <ul className="space-y-2">
            {guestLinks.map((link) => (
              <li key={link.id} className="flex justify-between items-center">
                <div>
                  <p>{link.originalUrl}</p>
                  <p className="text-sm text-zinc-500">{link.shortUrl}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selection[link.id]?.import || false}
                      onChange={() => toggle(link.id, "import")}
                    />
                    <p className="text-sm">Import</p>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selection[link.id]?.remove || false}
                      onChange={() => toggle(link.id, "remove")}
                    />
                    <p className="text-sm">Delete</p>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selection[link.id]?.ignore || false}
                      onChange={() => toggle(link.id, "ignore")}
                    />
                    <p className="text-sm">Ignore</p>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(); // jalankan proses import/delete
              onCancel?.(); // tutup dialog
            }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
