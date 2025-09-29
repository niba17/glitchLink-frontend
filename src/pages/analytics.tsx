"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore"; // ✅ pakai yang sama kayak /links
import { DonutPieCardContainer } from "@/features/analytics/components/cards/containers/donutPieCardContainer";
import { LineCardContainer } from "@/features/analytics/components/cards/containers/lineCardContainer";
import { SummarySectionContainer } from "@/features/analytics/components/customs/containers/summarySectionContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { UserLink } from "@/features/links/types/type";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function AnalyticsPage() {
  const router = useRouter();
  const { isLoggedIn, rehydrated } = useAuthStore(); // ✅ sama dengan /links
  const { userLinks, isLoading } = useUserLinks();
  const [selectedShortlink, setSelectedShortlink] = React.useState<UserLink>();

  // 🚨 Guard login
  React.useEffect(() => {
    if (rehydrated && !isLoggedIn) {
      router.replace("/"); // atau /login kalau mau langsung ke halaman login
    }
  }, [rehydrated, isLoggedIn, router]);

  React.useEffect(() => {
    if (userLinks && userLinks.length > 0 && !selectedShortlink) {
      const defaultLink = userLinks.find((link) => link.shortUrl);
      if (defaultLink) {
        setSelectedShortlink(defaultLink);
      }
    }
  }, [userLinks, selectedShortlink]);

  if (!rehydrated) return null; // ✅ tunggu store selesai rehydrate

  return (
    <div className="bg-zinc-950 min-h-screen p-5 space-y-5">
      <section>
        <div className="flex items-center lg:space-x-2 md:space-x-2 space-x-1">
          <h1 className="lg:text-xl md:text-xl text-sm font-bold text-stone-200">
            Shortlink analytics for
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "lg:text-md md:text-md text-sm font-semibold break-all",
                  isLoading && "animate-pulse"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner></Spinner>
                ) : (
                  selectedShortlink?.shortUrl || "Pilih Shortlink"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px]">
              {userLinks.map((d) => (
                <DropdownMenuItem
                  key={d.id}
                  onSelect={() => setSelectedShortlink(d)}
                  className="justify-start cursor-pointer"
                >
                  <span className="flex flex-col items-start space-y-1">
                    <span className="lg:text-md md:text-md text-sm font-semibold">
                      {d.shortUrl}
                    </span>
                    <span className="text-xs text-stone-500 truncate w-full">
                      {d.originalUrl}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section>
        <SummarySectionContainer selectedShortlink={selectedShortlink} />
      </section>
      <section>
        <DonutPieCardContainer
          key={selectedShortlink?.id}
          selectedShortlink={selectedShortlink}
        />
      </section>
      <section>
        <LineCardContainer
          key={selectedShortlink?.id}
          selectedShortlink={selectedShortlink}
        />
      </section>
    </div>
  );
}
