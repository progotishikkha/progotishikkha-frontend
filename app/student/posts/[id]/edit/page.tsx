"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { TuitionPostForm } from "@/components/forms/TuitionPostForm";
import { CardSkeleton, ErrorState } from "@/components/dashboard/States";
import { tuitionPostService } from "@/services/tuitionPostService";
import { getErrorMessage } from "@/lib/errorMessage";
import { TuitionPost } from "@/types";

export default function EditTuitionPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<TuitionPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

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

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">
        Edit tuition post
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Update the details below — changes go live immediately.
      </p>
      <div className="mt-6">
        <TuitionPostForm
          mode="edit"
          postId={post.id}
          defaultValues={{
            title: post.title,
            class: post.class,
            medium: post.medium,
            subject: post.subject,
            daysPerWeek: post.daysPerWeek,
            salary: post.salary,
            location: post.location,
            teachingMode: post.teachingMode,
            genderPreference: post.genderPreference,
            description: post.description,
            deadline: post.deadline?.slice(0, 10),
          }}
        />
      </div>
    </div>
  );
}
