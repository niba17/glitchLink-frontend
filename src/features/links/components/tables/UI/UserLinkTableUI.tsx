// src/features/links/components/tables/UI/UserLinkTableUI.tsx
"use client";

import React from "react";
import { UserLink } from "@/features/links/types/type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Edit, Trash2, QrCode } from "lucide-react";
import { isAfter } from "date-fns";
import { formatForDisplay } from "@/features/links/utils/dateFormatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UserLinkTableUIProps {
  data: UserLink[];
  search: string;
  onSearchChange: (val: string) => void;
  onCopy: (shortUrl: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVisit: (aliasOrCode: string) => void;
  filter: "all" | "active" | "expired";
  onFilterChange: (val: "all" | "active" | "expired") => void;

  // ➕ baru untuk range clicks
  minClicks: number | null;
  maxClicks: number | null;
  onMinClicksChange: (val: number | null) => void;
  onMaxClicksChange: (val: number | null) => void;
  sortBy: "newest" | "oldest" | "mostClicks" | "lessClicks";
  onSortByChange: (
    val: "newest" | "oldest" | "mostClicks" | "lessClicks"
  ) => void;
  onGenerateQR: (id: number) => void;
}

export function UserLinkTableUI({
  data,
  search,
  onSearchChange,
  onCopy,
  onEdit,
  onDelete,
  onVisit,
  filter,
  onFilterChange,
  minClicks,
  maxClicks,
  onMinClicksChange,
  onMaxClicksChange,
  sortBy,
  onSortByChange,
  onGenerateQR,
}: UserLinkTableUIProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Search - lebih panjang */}
        <Input
          placeholder="Search by shortlink, alias, or original link ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full col-span-2"
        />

        {/* Min clicks */}
        <Input
          type="number"
          placeholder="Min clicks ..."
          value={minClicks ?? ""}
          min={0} // ✅ cegah input negatif
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value, 10) : null;
            onMinClicksChange(val !== null && val < 0 ? 0 : val); // ✅ jaga dari input negatif
          }}
          className="h-11 w-full"
        />

        {/* Max clicks */}
        <Input
          type="number"
          placeholder="Max clicks ..."
          value={maxClicks ?? ""}
          min={0} // ✅ cegah input negatif
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value, 10) : null;
            onMaxClicksChange(val !== null && val < 0 ? 0 : val); // ✅ jaga dari input negatif
          }}
          className="h-11 w-full"
        />

        {/* Active/Expired filter */}
        <Select
          value={filter}
          onValueChange={(val) =>
            onFilterChange(val as "all" | "active" | "expired")
          }
        >
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={sortBy}
          onValueChange={(val) =>
            onSortByChange(
              val as "newest" | "oldest" | "mostClicks" | "lessClicks"
            )
          }
        >
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="mostClicks">Most Clicks</SelectItem>
            <SelectItem value="lessClicks">Less Clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead className="text-stone-200 text-xl font-semibold">
                Links
              </TableHead>
              <TableHead className="text-end text-stone-200 text-xl font-semibold">
                Clicks
              </TableHead>
              <TableHead className="text-end text-stone-200 text-xl font-semibold">
                Created / Expired At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-stone-400 py-6"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((link, idx) => {
                const isActive =
                  !link.expiresAt ||
                  isAfter(new Date(link.expiresAt), new Date());

                return (
                  <TableRow
                    key={link.id}
                    className="hover:bg-zinc-800 transition-colors"
                  >
                    {/* Index */}
                    <TableCell>
                      <span className="text-xl font-semibold">{idx + 1}</span>
                    </TableCell>

                    {/* Link + Badge + Actions */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            className="font-semibold underline text-left text-blue-400 hover:text-blue-300 break-words"
                            onClick={() =>
                              onVisit(link.customAlias || link.shortCode!)
                            }
                          >
                            {link.shortUrl}
                          </button>
                          <Badge
                            variant={isActive ? "success" : "blocked"}
                            className="text-[10px] h-5 px-1 rounded-full"
                          >
                            {isActive ? "active" : "expired"}
                          </Badge>
                        </div>

                        <span
                          title="Original link"
                          className="text-[14px] text-stone-400 break-words"
                        >
                          {link.originalUrl}
                        </span>

                        <div className="flex items-center justify-start gap-2 mt-2">
                          <Button
                            title="Copy short link"
                            variant="icon"
                            size="sm"
                            onClick={() => onCopy(link.shortUrl)}
                          >
                            <Copy />
                          </Button>
                          <Button
                            title="Update short link"
                            variant="icon"
                            size="sm"
                            onClick={() => onEdit(link.id)}
                          >
                            <Edit />
                          </Button>
                          <Button
                            title="Delete short link"
                            variant="icon"
                            size="sm"
                            onClick={() => onDelete(link.id)}
                          >
                            <Trash2 />
                          </Button>

                          <Button
                            variant="icon"
                            size="sm"
                            onClick={() => onGenerateQR(link.id)}
                            title="Generate QR Code"
                          >
                            <QrCode className="h-4 w-4" />{" "}
                            {/* ✅ pakai icon lucide */}
                          </Button>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-end">
                      {link.clicksCount ?? 0}{" "}
                      {link.clicksCount === 1 ? "Click" : "Clicks"}
                    </TableCell>

                    <TableCell className="text-end">
                      <div className="flex flex-col text-end">
                        <span title="Short link created">
                          {formatForDisplay(link.createdAt ?? null)}
                        </span>
                        <span
                          title="Short link expired"
                          className="text-red-500"
                        >
                          {formatForDisplay(link.expiresAt ?? null)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
