"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Users, Bell, CheckCircle2, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CardSkeleton, ErrorState } from "@/components/dashboard/States";
import { useNotifications } from "@/contexts/NotificationContext";
import { tuitionPostService } from "@/services/tuitionPostService";
import { getErrorMessage } from "@/lib/errorMessage";
import { TuitionPost } from "@/types";

export default function StudentOverviewPage() {
  const [myPosts, setMyPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { unreadCount } = useNotifications();

  // Was reading the static LIVE_TUITION_POSTS mock array — every student's
  // dashboard showed the same sample stats regardless of what they'd
  // actually posted.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tuitionPostService.listMine();
      setMyPosts(data);
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

  const openPosts = myPosts.filter((p) => p.status === "open").length;
  const totalApplicants = myPosts.reduce((sum, p) => sum + p.applicantCount, 0);
  const hiredCount = myPosts.filter((p) => p.status === "filled").length;
  const recentPosts = myPosts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Active tuition posts" value={openPosts} accent="blue" />
        <StatCard icon={Users} label="Total applicants" value={totalApplicants} accent="gold" />
        <StatCard icon={CheckCircle2} label="Tutors hired" value={hiredCount} accent="navy" />
        <StatCard icon={Bell} label="Unread notifications" value={unreadCount} accent="blue" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">
            Recent tuition posts
          </h2>
          <Link href="/student/posts/create">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New post
            </Button>
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            You haven&apos;t posted a tuition requirement yet.
          </p>
        ) : (
          <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href="/student/posts"
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-navy dark:text-white">{post.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {post.subject} · {post.location} · ৳{post.salary.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-none items-center gap-3">
                  <span className="text-xs text-slate-400">{post.applicantCount} applicants</span>
                  <StatusBadge status={post.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
