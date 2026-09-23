"use client";

import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserRole } from "@/types";

export function DashboardTopbar({
  role,
  title,
  unreadCount,
  onMenuClick,
}: {
  role: UserRole;
  title: string;
  unreadCount: number;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-navy lg:hidden dark:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href={`/${role}/notifications`}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-brand-navy hover:bg-brand-50 dark:text-white dark:hover:bg-white/5"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-gold" />
          )}
        </Link>
      </div>
    </header>
  );
}
