"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NAV_CONFIG } from "@/lib/navConfig";

export default function TutorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = NAV_CONFIG.tutor.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <RequireAuth role="tutor">
      <DashboardShell role="tutor" title={title}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
