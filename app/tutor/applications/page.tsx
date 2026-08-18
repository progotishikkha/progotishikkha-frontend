"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState, CardSkeleton } from "@/components/dashboard/States";
import { applicationService } from "@/services/applicationService";
import { getErrorMessage } from "@/lib/errorMessage";
import { Application } from "@/types";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Was reading a hardcoded MY_APPLICATIONS mock array regardless of who was
  // logged in or what they'd actually applied to.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.listMine();
      setApplications(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your applications."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <CardSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No applications yet"
        description="Browse live tuition posts and apply to ones that match your subjects and schedule."
      />
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-brand-navy dark:text-white">
                {app.tuitionPost?.title ?? "Tuition post removed"}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Applied{" "}
                {new Date(app.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{app.coverMessage}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Expected salary: ৳{app.expectedSalary.toLocaleString()}</span>
            <span>Availability: {app.availability}</span>
            {app.tuitionPost?.location && <span>Location: {app.tuitionPost.location}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
