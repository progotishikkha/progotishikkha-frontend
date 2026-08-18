"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Users, Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState, ErrorState, CardSkeleton } from "@/components/dashboard/States";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { tuitionPostService } from "@/services/tuitionPostService";
import { getErrorMessage } from "@/lib/errorMessage";
import { TuitionPost } from "@/types";

export default function MyTuitionPostsPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TuitionPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Previously this page rendered a hardcoded mock array and never called
  // the backend at all, so a post you just created (or deleted) never
  // actually showed up (or disappeared) here — the list was frozen sample
  // data regardless of what was really in MongoDB.
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tuitionPostService.listMine();
      setPosts(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your tuition posts."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await tuitionPostService.remove(deleteTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Tuition post deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete the post. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <CardSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={loadPosts} />;

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No tuition posts yet"
        description="Create your first post to start receiving applications from tutors."
        action={{ label: "Create a post", onClick: () => (window.location.href = "/student/posts/create") }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/student/posts/create">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New post
          </Button>
        </Link>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-brand-navy dark:text-white">
                  {post.title}
                </h3>
                <StatusBadge status={post.status} />
              </div>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                {post.class} · {post.subject} · {post.medium}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                ৳{post.salary.toLocaleString()}/month · {post.location} · Deadline{" "}
                {new Date(post.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>

            <div className="flex flex-none items-center gap-2">
              <Link href={`/student/posts/${post.id}/applicants`}>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4" />
                  {post.applicantCount} applicants
                </Button>
              </Link>
              <Link href={`/student/posts/${post.id}/edit`}>
                <Button size="sm" variant="ghost" aria-label="Edit post">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Delete post"
                onClick={() => setDeleteTarget(post)}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this tuition post?"
        description={`"${deleteTarget?.title}" and all its applications will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
