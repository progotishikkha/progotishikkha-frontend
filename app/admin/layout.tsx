"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NAV_CONFIG } from "@/lib/navConfig";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = NAV_CONFIG.admin.find((item) => item.href === pathname)?.label ?? "Admin";

  return (
    <RequireAuth role="admin">
      <DashboardShell role="admin" title={title}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
