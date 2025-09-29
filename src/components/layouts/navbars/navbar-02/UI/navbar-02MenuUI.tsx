import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, useState, useEffect } from "react";

interface Navbar02MenuUIProps extends ComponentProps<typeof NavigationMenu> {
  withSheetClose?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const Navbar02MenuUI = ({
  withSheetClose,
  orientation = "horizontal",
  ...props
}: Navbar02MenuUIProps) => {
  const router = useRouter();
  const [currentPathname, setCurrentPathname] = useState("");

  useEffect(() => {
    setCurrentPathname(router.pathname);
  }, [router.pathname]);

  const links = [
    { name: "Links", href: "/links" },
    { name: "Analytics", href: "/analytics" },
    { name: "Account", href: "/account" },
  ];

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList
        className={`gap-3 space-x-0 ${
          orientation === "vertical"
            ? "flex-col items-start justify-start"
            : "flex-row"
        }`}
      >
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              {withSheetClose ? (
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      currentPathname === link.href
                        ? "bg-gray-200 text-black"
                        : "text-accent hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                </SheetClose>
              ) : (
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentPathname === link.href
                      ? "bg-gray-200 text-black"
                      : "text-accent hover:text-black hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
