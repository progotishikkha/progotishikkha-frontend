"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { TuitionPostCard } from "@/components/dashboard/TuitionPostCard";
import { EmptyState, ErrorState, CardSkeleton } from "@/components/dashboard/States";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { tuitionPostService } from "@/services/tuitionPostService";
import { applicationService } from "@/services/applicationService";
import { getErrorMessage } from "@/lib/errorMessage";
import { TuitionPost } from "@/types";

export default function BrowseTuitionsPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [teachingMode, setTeachingMode] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 250);
  const debouncedLocation = useDebounce(location, 250);
  const debouncedSubject = useDebounce(subject, 250);

  // Was filtering a static LIVE_TUITION_POSTS mock array — a tutor could
  // never actually see (or find) a post a student had really created.
  // location/subject narrow the query server-side; free-text title search
  // and teaching mode are applied client-side over that result set (the
  // backend doesn't currently support free-text title search).
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tuitionPostService.listLive({
        location: debouncedLocation || undefined,
        subject: debouncedSubject || undefined,
        limit: 50,
      });
      setPosts(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load tuition posts."));
    } finally {
      setLoading(false);
    }
  }, [debouncedLocation, debouncedSubject]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    applicationService
      .listSaved()
      .then((saved) => setSavedIds(new Set(saved.map((p) => p.id))))
      .catch(() => undefined); // non-critical — bookmark state just won't be pre-filled
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery =
        !debouncedQuery ||
        post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        post.subject.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesMode = !teachingMode || post.teachingMode === teachingMode;
      return matchesQuery && matchesMode;
    });
  }, [posts, debouncedQuery, teachingMode]);

  const toggleSave = async (id: string, title: string) => {
    const wasSaved = savedIds.has(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      if (wasSaved) {
        await applicationService.unsaveTuitionPost(id);
        toast.success("Removed from saved tuitions");
      } else {
        await applicationService.saveTuitionPost(id);
        toast.success(`Saved: ${title}`);
      }
    } catch (err) {
      // roll back the optimistic toggle
      setSavedIds((prev) => {
        const next = new Set(prev);
        wasSaved ? next.add(id) : next.delete(id);
        return next;
      });
      toast.error(getErrorMessage(err, "Couldn't update saved tuitions."));
    }
  };

  const clearFilters = () => {
    setLocation("");
    setSubject("");
    setTeachingMode("");
  };

  const hasActiveFilters = location || subject || teachingMode;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or subject..."
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
        <Button
          variant={hasActiveFilters ? "primary" : "outline"}
          size="md"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {filtersOpen && (
        <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
          <Input label="Location" placeholder="e.g. Dhaka" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Input label="Subject" placeholder="e.g. Physics" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Select label="Teaching mode" value={teachingMode} onChange={(e) => setTeachingMode(e.target.value)}>
            <option value="">Any</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </Select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="col-span-full flex items-center gap-1 self-start text-xs font-medium text-red-500 hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="mt-6">
          <CardSkeleton count={3} />
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        <>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{filtered.length} tuitions found</p>

          {filtered.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={Search}
                title="No matching tuitions"
                description="Try adjusting your search or filters to see more results."
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <TuitionPostCard
                  key={post.id}
                  post={post}
                  isSaved={savedIds.has(post.id)}
                  onToggleSave={() => toggleSave(post.id, post.title)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
