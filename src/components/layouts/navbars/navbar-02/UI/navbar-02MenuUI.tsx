// src/components/layouts/navbars/navbar-02/UI/nav-menuUI.tsx

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, useState, useEffect } from "react";

export const Navbar02MenuUI = (
  props: ComponentProps<typeof NavigationMenu>
) => {
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
      <NavigationMenuList className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={`px-3 py-1 rounded-md transition-colors ${
                  currentPathname.startsWith(link.href)
                    ? "bg-foreground text-background"
                    : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
