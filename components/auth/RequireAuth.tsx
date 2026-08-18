"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

/**
 * Client-side guard for private dashboard routes. Previously the
 * student/tutor/admin layouts rendered their children unconditionally, so
 * an unauthenticated visitor (or the wrong role) could open e.g. /tutor/profile
 * directly and just see broken/empty state instead of being sent to log in.
 *
 * Waits for AuthContext's initial session-restore (`isInitializing`) before
 * deciding, so a logged-in user doing a hard refresh isn't bounced to /login
 * for a split second while their session cookie is still being verified.
 */
export function RequireAuth({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace("/login");
    }
  }, [isInitializing, user, role, router]);

  if (isInitializing || !user || user.role !== role) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-navy border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
