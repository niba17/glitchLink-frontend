import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Navbar02MenuUI } from "./navbar-02MenuUI";

export const Navbar02NavigationUI = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-foreground px-6 py-3 max-w-[100vw] w-[80vw]">
        <Navbar02MenuUI orientation="vertical" withSheetClose />
      </SheetContent>
    </Sheet>
  );
};
