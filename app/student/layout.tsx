"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NAV_CONFIG } from "@/lib/navConfig";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = NAV_CONFIG.student.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <RequireAuth role="student">
      <DashboardShell role="student" title={title}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
