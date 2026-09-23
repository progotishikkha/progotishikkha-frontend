"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { TuitionPostCard } from "@/components/dashboard/TuitionPostCard";
import { EmptyState, ErrorState, CardSkeleton } from "@/components/dashboard/States";
import { applicationService } from "@/services/applicationService";
import { getErrorMessage } from "@/lib/errorMessage";
import { TuitionPost } from "@/types";

export default function SavedTuitionsPage() {
  const [saved, setSaved] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Was hardcoded to the first two entries of the global mock array — every
  // tutor "saw" the same two posts as saved regardless of what they'd
  // actually bookmarked (or whether they'd bookmarked anything at all).
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.listSaved();
      setSaved(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your saved tuitions."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unsave = async (id: string) => {
    const previous = saved;
    setSaved((prev) => prev.filter((p) => p.id !== id)); // optimistic
    try {
      await applicationService.unsaveTuitionPost(id);
      toast.success("Removed from saved tuitions");
    } catch (err) {
      setSaved(previous); // roll back if the backend call actually failed
      toast.error(getErrorMessage(err, "Couldn't remove this. Please try again."));
    }
  };

  if (loading) return <CardSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No saved tuitions"
        description="Bookmark tuition posts while browsing to revisit them later."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((post) => (
        <TuitionPostCard key={post.id} post={post} isSaved onToggleSave={() => unsave(post.id)} />
      ))}
    </div>
  );
}
