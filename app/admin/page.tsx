"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Users, GraduationCap, FileText, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  REVENUE_BY_MONTH,
  SIGNUPS_BY_MONTH,
  ADMIN_STUDENTS,
  ADMIN_TUTORS,
  LIVE_TUITION_POSTS,
} from "@/data/mock";

export default function AdminAnalyticsPage() {
  const totalRevenue = REVENUE_BY_MONTH.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total students" value={ADMIN_STUDENTS.length} accent="blue" />
        <StatCard icon={Users} label="Total tutors" value={ADMIN_TUTORS.length} accent="gold" />
        <StatCard icon={FileText} label="Active tuition posts" value={LIVE_TUITION_POSTS.length} accent="navy" />
        <StatCard icon={DollarSign} label="Revenue (6 months)" value={`৳${totalRevenue.toLocaleString()}`} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">
            Revenue trend
          </h2>
          <p className="text-xs text-slate-400">Platform commission, last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_BY_MONTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#2E86EB" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">
            New signups
          </h2>
          <p className="text-xs text-slate-400">Students vs. tutors, last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SIGNUPS_BY_MONTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="students" fill="#2E86EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tutors" fill="#F5A623" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">
          Monthly report summary
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">Tutor approval rate</p>
            <p className="mt-1 text-xl font-semibold text-brand-navy dark:text-white">
              {Math.round((ADMIN_TUTORS.filter((t) => t.isApproved).length / ADMIN_TUTORS.length) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Posts filled this month</p>
            <p className="mt-1 text-xl font-semibold text-brand-navy dark:text-white">18</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Avg. tutor rating</p>
            <p className="mt-1 text-xl font-semibold text-brand-navy dark:text-white">4.8 / 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
