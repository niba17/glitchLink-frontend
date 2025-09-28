// frontend-final/src/features/links/components/lists/UI/GuestLinkListUI.tsx
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { GuestLinkUIWithState } from "@/features/links/types/type";
import { GUEST_SHORT_LINK_STRINGS } from "../../../constants/strings";
import ConfirmDialog from "@/components/customs/ConfirmDialog";
import { formatForDisplay } from "@/features/links/utils/dateFormatters";
import { Badge } from "@/components/ui/badge";

interface GuestLinkListUIProps {
  links: GuestLinkUIWithState[];
  onCopy: (shortUrl: string) => void;
  onDeleteClick: (id: number) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  openDialog: boolean;
}

export function GuestLinkListUI({
  links,
  onCopy,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
  openDialog,
}: GuestLinkListUIProps) {
  return (
    <>
      <ul className="grid grid-cols-2 gap-[20px]">
        {links.map((link) => (
          <li key={link.id} className="bg-zinc-800 p-[20px] rounded-sm w-full">
            <div className="flex flex-col space-y-[0.5px]">
              <div className="flex items-center gap-2">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener" // jangan pakai noreferrer kalau butuh referrer
                  title="Visit short link"
                  className="text-[#1de2ae] underline break-all text-lg text-left hover:opacity-80"
                >
                  {link.shortUrl}
                </a>

                <Badge
                  variant={link.isActive ? "success" : "blocked"}
                  className="text-[10px] h-5 px-1 rounded-full"
                >
                  {link.isActive ? "active" : "expired"}
                </Badge>
              </div>

              <span
                title="Original link"
                className="text-gray-400 break-all text-md"
              >
                {link.original}
              </span>

              <div className="flex space-x-1">
                <span
                  title="Created at"
                  className="text-gray-400 break-all text-sm"
                >
                  {formatForDisplay(link.createdAt ?? null)} {" - "}
                </span>
                <span
                  title="Expire at"
                  className="text-red-500 break-all text-sm"
                >
                  {formatForDisplay(link.expiresAt ?? null)}
                </span>
              </div>

              <div className="flex items-center justify-start gap-2 mt-2">
                <Button
                  title="Copy short link"
                  variant="icon"
                  onClick={() => onCopy(link.shortUrl)}
                >
                  <Copy />
                </Button>
                <Button
                  title="Delete short link"
                  variant="icon"
                  onClick={() => onDeleteClick(link.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={openDialog}
        title={GUEST_SHORT_LINK_STRINGS.deleteConfirmTitle}
        description={GUEST_SHORT_LINK_STRINGS.deleteConfirmDescription}
        confirmText={GUEST_SHORT_LINK_STRINGS.delete}
        cancelText={GUEST_SHORT_LINK_STRINGS.cancel}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </>
  );
}
