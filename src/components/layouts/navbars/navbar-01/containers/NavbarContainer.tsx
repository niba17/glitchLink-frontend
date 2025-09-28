import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NavbarUI from "../UI/NavbarUI";

export default function NavbarContainer() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const { signOut } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  if (!rehydrated) return null;

  const handleConfirmLogout = () => {
    signOut();
    setOpenLogoutDialog(false);
  };

  return (
    <NavbarUI
      isLoggedIn={isLoggedIn}
      openLogoutDialog={openLogoutDialog}
      setOpenLogoutDialog={setOpenLogoutDialog}
      handleConfirmLogout={handleConfirmLogout}
    />
  );
}
