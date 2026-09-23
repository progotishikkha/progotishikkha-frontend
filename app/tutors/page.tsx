"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, CardSkeleton } from "@/components/dashboard/States";
import { useDebounce } from "@/hooks/useDebounce";
import { tutorService } from "@/services/tutorService";
import { getErrorMessage } from "@/lib/errorMessage";
import { avatarUrlFor } from "@/lib/avatar";
import { PublicTutorProfile } from "@/types";

const PAGE_SIZE = 12;

/**
 * Public tutor marketplace — SEO-friendly, no login required. Search by
 * name/subject/location, filter by subject/location/availability, paginate.
 */
export default function TutorsMarketplacePage() {
  const [tutors, setTutors] = useState<PublicTutorProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const debouncedSubject = useDebounce(subject, 300);
  const debouncedLocation = useDebounce(location, 300);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tutorService.list({
        q: debouncedQuery || undefined,
        subject: debouncedSubject || undefined,
        location: debouncedLocation || undefined,
        availability: availability || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setTutors(data.tutors);
      setTotal(data.total);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load tutors."));
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, debouncedSubject, debouncedLocation, availability, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Any filter change should reset back to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedSubject, debouncedLocation, availability]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);
  const hasActiveFilters = subject || location || availability;

  const clearFilters = () => {
    setSubject("");
    setLocation("");
    setAvailability("");
  };

  return (
    <>
      <section className="border-b border-slate-100 bg-brand-50/50 py-14 dark:border-slate-800 dark:bg-white/[0.02] sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Tutor marketplace"
            title="Browse verified tutors across Bangladesh"
            description="Every profile below has been approved. Search by subject, area, or name, then call or message a tutor directly — no sign-up required to browse."
          />
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by tutor name, subject, or area..."
                aria-label="Search tutors"
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <Button
              variant={hasActiveFilters ? "primary" : "outline"}
              size="md"
              className="w-full sm:w-auto"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {filtersOpen && (
            <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
              <Input label="Subject" placeholder="e.g. Physics" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Input label="Location" placeholder="e.g. Dhanmondi, Dhaka" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Select label="Availability" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="">Any</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="flexible">Flexible</option>
              </Select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="col-span-full flex min-h-[44px] items-center gap-1 self-start text-xs font-medium text-red-500 hover:underline"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="mt-8">
              <CardSkeleton count={4} />
            </div>
          ) : error ? (
            <div className="mt-8">
              <ErrorState message={error} onRetry={load} />
            </div>
          ) : (
            <>
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                {total} tutor{total !== 1 && "s"} found
              </p>

              {tutors.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    icon={Search}
                    title="No matching tutors"
                    description="Try a different subject, area, or clear your filters."
                  />
                </div>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {tutors.map((tutor) => (
                    <Link
                      key={tutor.id}
                      href={`/tutors/${tutor.id}`}
                      className="fold-card group rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3.5">
                        <Image
                          src={tutor.profilePhoto?.url ?? avatarUrlFor(tutor.user.fullName)}
                          alt={tutor.user.fullName}
                          width={52}
                          height={52}
                          className="rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-semibold text-brand-navy dark:text-white">
                            {tutor.user.fullName}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {tutor.qualification ?? "Tutor"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tutor.subjects.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {tutor.location ?? "—"}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-brand-navy dark:text-white">
                          <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                          {tutor.rating.toFixed(1)}
                          <span className="text-slate-400">({tutor.reviewCount})</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
