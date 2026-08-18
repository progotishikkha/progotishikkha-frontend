import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Tutor } from "@/types";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="fold-card group block rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-3.5">
        <Image
          src={tutor.photoUrl}
          alt={tutor.fullName}
          width={52}
          height={52}
          className="rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-brand-navy dark:text-white">
            {tutor.fullName}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{tutor.qualification}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tutor.subjects.map((s) => (
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
          {tutor.location}
        </span>
        <span className="flex items-center gap-1 font-medium text-brand-navy dark:text-white">
          <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
          {tutor.rating.toFixed(1)}
          <span className="text-slate-400">({tutor.reviewCount})</span>
        </span>
      </div>
    </Link>
  );
}
