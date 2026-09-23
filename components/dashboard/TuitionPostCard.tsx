import Link from "next/link";
import { MapPin, Calendar, Users, Bookmark } from "lucide-react";
import { TuitionPost } from "@/types";

export function TuitionPostCard({
  post,
  isSaved,
  onToggleSave,
}: {
  post: TuitionPost;
  isSaved?: boolean;
  onToggleSave?: () => void;
}) {
  return (
    <div className="fold-card rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/tutor/browse/${post.id}`} className="min-w-0">
          <h3 className="font-display text-base font-semibold text-brand-navy hover:text-brand-blue dark:text-white">
            {post.title}
          </h3>
        </Link>
        {onToggleSave && (
          <button
            onClick={onToggleSave}
            aria-label={isSaved ? "Remove from saved" : "Save tuition"}
            className="flex-none text-slate-400 transition-colors hover:text-brand-gold"
          >
            <Bookmark className={isSaved ? "h-5 w-5 fill-brand-gold text-brand-gold" : "h-5 w-5"} />
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue">
          {post.subject}
        </span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-navy dark:bg-white/5 dark:text-white">
          {post.class}
        </span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-navy dark:bg-white/5 dark:text-white">
          {post.medium}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{post.description}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {post.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {post.daysPerWeek}x/week
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {post.applicantCount} applied
          </span>
        </div>
        <span className="font-semibold text-brand-navy dark:text-white">৳{post.salary.toLocaleString()}/mo</span>
      </div>

      <Link href={`/tutor/browse/${post.id}`}>
        <span className="mt-4 inline-block text-sm font-medium text-brand-blue hover:underline">
          View details &amp; apply →
        </span>
      </Link>
    </div>
  );
}
