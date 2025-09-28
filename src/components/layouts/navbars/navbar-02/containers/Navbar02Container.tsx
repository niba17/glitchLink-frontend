import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Navbar02UI from "../UI/navbar-02UI";

export default function Navbar02Container() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const { signOut } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  if (!rehydrated) return null;

  const handleConfirmLogout = () => {
    signOut();
    setOpenLogoutDialog(false);
  };

  return (
    <Navbar02UI
      isLoggedIn={isLoggedIn}
      openLogoutDialog={openLogoutDialog}
      setOpenLogoutDialog={setOpenLogoutDialog}
      handleConfirmLogout={handleConfirmLogout}
    />
  );
}
