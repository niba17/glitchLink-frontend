import { Button } from "@/components/ui/button";
import { Navbar02MenuUI } from "./navbar-02MenuUI";
import { Navbar02NavigationUI } from "./navbar-02NavigationUI";
import ConfirmDialog from "../../../../customs/ConfirmDialog";
import AuthFormContainer from "@/features/auth/components/forms/containers/AuthFormContainer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../ui/dialog";

interface Navbar02UIProps {
  isLoggedIn: boolean;
  openLogoutDialog: boolean;
  setOpenLogoutDialog: (open: boolean) => void;
  handleConfirmLogout: () => void;
}

export const Navbar02UI = ({
  isLoggedIn,
  openLogoutDialog,
  setOpenLogoutDialog,
  handleConfirmLogout,
}: Navbar02UIProps) => {
  return (
    <nav className="sticky top-0 w-full py-3 flex justify-between items-center bg-zinc-800 px-5 z-50">
      <div className="text-3xl font-bold text-white">glitchLink</div>

      {/* Desktop Menu */}
      {isLoggedIn && <Navbar02MenuUI className="hidden md:block" />}

      <div className="flex items-center gap-3">
        {!isLoggedIn ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Authentication</DialogTitle>
                <DialogDescription>
                  Access your account or create a new one
                </DialogDescription>
              </DialogHeader>
              <AuthFormContainer />
            </DialogContent>
          </Dialog>
        ) : (
          <>
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => setOpenLogoutDialog(true)}
            >
              Sign Out
            </Button>

            <ConfirmDialog
              open={openLogoutDialog}
              title="Confirm Logout"
              description="Are you sure you want to sign out?"
              confirmText="Sign Out"
              cancelText="Cancel"
              onConfirm={handleConfirmLogout}
              onCancel={() => setOpenLogoutDialog(false)}
            />
          </>
        )}

        {/* Mobile Menu */}
        {isLoggedIn && (
          <div className="md:hidden">
            <Navbar02NavigationUI />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar02UI;
