"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, CheckCircle2, Star, Bell, Search } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CardSkeleton, ErrorState } from "@/components/dashboard/States";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { applicationService } from "@/services/applicationService";
import { getErrorMessage } from "@/lib/errorMessage";
import { Application, TutorProfileData } from "@/types";

export default function TutorOverviewPage() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Was reading the static MY_APPLICATIONS mock array — every tutor's
  // dashboard showed the same sample applications no matter who was logged
  // in or what they'd actually applied to.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.listMine();
      setApplications(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <CardSkeleton count={2} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const hired = applications.filter((a) => a.status === "hired").length;
  const rating = (user?.profile as TutorProfileData | null)?.rating ?? 0;
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Applications sent" value={applications.length} accent="blue" />
        <StatCard icon={CheckCircle2} label="Tuitions hired" value={hired} accent="gold" />
        <StatCard icon={Star} label="Average rating" value={rating.toFixed(1)} accent="navy" />
        <StatCard icon={Bell} label="Unread notifications" value={unreadCount} accent="blue" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">
            Recent applications
          </h2>
          <Link href="/tutor/browse">
            <Button size="sm">
              <Search className="h-4 w-4" />
              Browse tuitions
            </Button>
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            You haven&apos;t applied to any tuition posts yet.
          </p>
        ) : (
          <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-navy dark:text-white">
                    {app.tuitionPost?.title ?? "Tuition post removed"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Applied{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
