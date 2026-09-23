"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { UserRole } from "@/types";
import { useNotifications } from "@/contexts/NotificationContext";

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: UserRole;
  title: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Was reading a hardcoded mock array — the bell badge never reflected
  // anything real. Now backed by the live NotificationContext (initial
  // fetch + real-time socket push).
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-brand-50/40 dark:bg-slate-950">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 flex-none border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
          <DashboardSidebar role={role} />
        </aside>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed left-0 top-0 z-50 h-screen w-64 bg-white shadow-xl lg:hidden dark:bg-slate-900"
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
                <DashboardSidebar role={role} onNavigate={() => setMobileOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <DashboardTopbar
            role={role}
            title={title}
            unreadCount={unreadCount}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
