"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Users, Clock, GraduationCap } from "lucide-react";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CardSkeleton, ErrorState } from "@/components/dashboard/States";
import { tuitionPostService } from "@/services/tuitionPostService";
import { getErrorMessage } from "@/lib/errorMessage";
import { TuitionPost } from "@/types";

export default function TuitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<TuitionPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // Was reading from the static LIVE_TUITION_POSTS mock array — a tutor
  // could never actually see (or apply to) a post a student had really
  // created, only the seed sample data.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    tuitionPostService
      .getById(id)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if ((err as { response?: { status?: number } })?.response?.status === 404) {
          setNotFoundFlag(true);
        } else {
          setError(getErrorMessage(err, "Couldn't load this tuition post."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFoundFlag) notFound();
  if (loading) return <CardSkeleton count={1} />;
  if (error) return <ErrorState message={error} />;
  if (!post) return null;

  const details = [
    { icon: GraduationCap, label: "Class & Medium", value: `${post.class} · ${post.medium}` },
    { icon: MapPin, label: "Location", value: `${post.location} (${post.teachingMode})` },
    { icon: Calendar, label: "Schedule", value: `${post.daysPerWeek} days/week` },
    {
      icon: Clock,
      label: "Deadline",
      value: new Date(post.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    },
    { icon: Users, label: "Applicants so far", value: `${post.applicantCount}` },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">{post.title}</h2>
            <StatusBadge status={post.status} />
          </div>
          <p className="mt-2 text-2xl font-semibold text-brand-navy dark:text-white">
            ৳{post.salary.toLocaleString()}
            <span className="text-sm font-normal text-slate-400">/month</span>
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                  <d.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{d.label}</p>
                  <p className="text-sm font-medium text-brand-navy dark:text-white">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            <h3 className="font-display text-sm font-semibold text-brand-navy dark:text-white">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.description}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-semibold text-brand-navy dark:text-white">Apply now</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stand out with a clear, specific cover message.
          </p>
          <div className="mt-5">
            <ApplyForm tuitionPostId={post.id} defaultSalary={post.salary} />
          </div>
        </div>
      </div>
    </div>
  );
}
