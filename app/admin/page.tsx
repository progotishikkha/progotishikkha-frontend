"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, FileText, HeartHandshake, ShieldCheck, Clock3, AlertTriangle, BadgeCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { adminService } from "@/services/adminService";
import { AdminAnalytics } from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessage";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  useEffect(() => { adminService.analytics().then(setData).catch((e) => toast.error(getErrorMessage(e, "Couldn't load analytics."))); }, []);
  if (!data) return <div>Loading analytics...</div>;
  return <div className="space-y-8">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={GraduationCap} label="Total students" value={data.studentCount} accent="blue" />
      <StatCard icon={Users} label="Total tutors" value={data.tutorCount} accent="gold" />
      <StatCard icon={FileText} label="Open tuition posts" value={data.openPostsCount} accent="navy" />
      <StatCard icon={BadgeCheck} label="Filled tuition posts" value={data.filledPostsCount} accent="blue" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={ShieldCheck} label="Pending tutor verification" value={data.pendingTutorVerifications} accent="gold" />
      <StatCard icon={ShieldCheck} label="Pending student verification" value={data.pendingStudentVerifications} accent="blue" />
      <StatCard icon={HeartHandshake} label="Donation due" value={data.donationDue} accent="navy" />
      <StatCard icon={AlertTriangle} label="Overdue donations" value={data.donationOverdue} accent="gold" />
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">Donation workflow</h2>
      <p className="mt-1 text-sm text-slate-500">First-month donation records by current status.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div><p className="text-xs text-slate-400">Payment submitted</p><p className="mt-1 text-xl font-semibold text-brand-navy dark:text-white">{data.donationPaymentSubmitted}</p></div>
        <div><p className="text-xs text-slate-400">Completed</p><p className="mt-1 text-xl font-semibold text-brand-navy dark:text-white">{data.donationCompleted}</p></div>
        <div><p className="text-xs text-slate-400">Pending tutor approval</p><p className="mt-1 text-xl font-semibold text-brand-navy dark:text-white">{data.pendingApprovals}</p></div>
      </div>
    </div>
  </div>;
}
