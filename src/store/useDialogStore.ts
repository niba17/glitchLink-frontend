import { create } from "zustand";

interface DialogState {
  openGuestLinksLoginAction: boolean;
  openGuestLinksLoginActionDialogContainer: (onConfirm?: () => void) => void;
  closeGuestLinksLoginActionDialogContainer: () => void;
  dialogConfirmCallback?: (() => void) | null;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  openGuestLinksLoginAction: false,
  dialogConfirmCallback: null,
  openGuestLinksLoginActionDialogContainer: (onConfirm?: () => void) => {
    set({
      openGuestLinksLoginAction: true,
      dialogConfirmCallback: onConfirm ?? null,
    });
  },
  closeGuestLinksLoginActionDialogContainer: (confirm = false) => {
    const cb = get().dialogConfirmCallback;
    set({
      openGuestLinksLoginAction: false,
      dialogConfirmCallback: null,
    });
    if (confirm && cb) cb();
  },
}));
