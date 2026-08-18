import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, GraduationCap, Clock, Award, BookOpen, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { avatarUrlFor } from "@/lib/avatar";
import { PublicTutorProfile } from "@/types";
import { ProfileViewTracker, StickyMobileContactBar, TutorContactCard } from "./ProfileClient";

interface Props {
  params: Promise<{ id: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

async function getTutor(id: string): Promise<PublicTutorProfile | null> {
  try {
    // no-store: contact info / approval status must always be current —
    // this page is meant to be discoverable and correct, not cached stale.
    const res = await fetch(`${API_BASE}/tutors/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as PublicTutorProfile;
  } catch {
    return null;
  }
}

const AVAILABILITY_LABEL: Record<string, string> = {
  weekdays: "Weekdays",
  weekends: "Weekends",
  evenings: "Evenings",
  flexible: "Flexible",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutor(id);
  if (!tutor) return { title: "Tutor not found" };

  const subjectList = tutor.subjects.slice(0, 3).join(", ");
  const description = `${tutor.user.fullName} — ${tutor.qualification ?? "Tutor"}${
    tutor.location ? ` in ${tutor.location}` : ""
  }${subjectList ? `, teaching ${subjectList}` : ""}. View profile, rating, and contact details on Progoti Shikkha.`;

  return {
    title: `${tutor.user.fullName} — Tutor Profile`,
    description,
    openGraph: {
      title: `${tutor.user.fullName} — Tutor Profile | Progoti Shikkha`,
      description,
      images: tutor.profilePhoto?.url ? [tutor.profilePhoto.url] : undefined,
      type: "profile",
    },
  };
}

export default async function TutorProfilePage({ params }: Props) {
  const { id } = await params;
  const tutor = await getTutor(id);
  if (!tutor) notFound();

  const details = [
    { icon: GraduationCap, label: "Qualification", value: tutor.qualification || "Not specified" },
    { icon: BookOpen, label: "University", value: tutor.university || "Not specified" },
    { icon: MapPin, label: "Location", value: tutor.location || "Not specified" },
    {
      icon: Clock,
      label: "Availability",
      value: tutor.availability ? AVAILABILITY_LABEL[tutor.availability] : "Flexible",
    },
    { icon: Award, label: "Experience", value: `${tutor.experienceYears ?? 0} years` },
  ];

  return (
    <>
      {/* Structured data helps this profile show up richly in search results. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: tutor.user.fullName,
            jobTitle: "Tutor",
            description: tutor.about,
            address: tutor.location,
            image: tutor.profilePhoto?.url,
            aggregateRating:
              tutor.reviewCount > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: tutor.rating,
                    reviewCount: tutor.reviewCount,
                  }
                : undefined,
          }),
        }}
      />

      <ProfileViewTracker tutorId={tutor.id} />

      <section className="border-b border-slate-100 bg-brand-50/50 py-12 dark:border-slate-800 dark:bg-white/[0.02] sm:py-16">
        <Container>
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <Image
              src={tutor.profilePhoto?.url ?? avatarUrlFor(tutor.user.fullName)}
              alt={tutor.user.fullName}
              width={112}
              height={112}
              className="rounded-2xl object-cover"
              priority
            />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold text-brand-navy dark:text-white sm:text-3xl">
                {tutor.user.fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {tutor.qualification || "Tutor"} {tutor.university ? `· ${tutor.university}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-brand-gold text-brand-gold" aria-hidden="true" />
                  <span className="font-medium text-brand-navy dark:text-white">{tutor.rating.toFixed(1)}</span>
                  <span className="text-slate-400">
                    ({tutor.reviewCount} review{tutor.reviewCount !== 1 && "s"})
                  </span>
                </span>
                {tutor.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {tutor.location}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {tutor.subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Extra bottom padding on mobile so content isn't hidden behind the sticky CTA bar. */}
      <section className="pb-28 pt-10 sm:pb-16 sm:pt-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">About</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {tutor.about || "This tutor hasn't added a bio yet."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {details.map((d) => (
                    <div key={d.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                        <d.icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{d.label}</p>
                        <p className="text-sm font-medium text-brand-navy dark:text-white">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {tutor.skills.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <h3 className="font-display text-sm font-semibold text-brand-navy dark:text-white">Skills</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tutor.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {tutor.completedTuitionCount} completed tuition{tutor.completedTuitionCount !== 1 && "s"} via
                  Progoti Shikkha
                </div>
              </div>
            </div>

            {/* Desktop/tablet contact card — hidden on mobile, replaced by the sticky bar. */}
            <div className="hidden sm:block">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-display text-base font-semibold text-brand-navy dark:text-white">
                  Contact {tutor.user.fullName.split(" ")[0]}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Reach out directly to discuss schedule and rate.
                </p>
                <div className="mt-5">
                  <TutorContactCard tutorId={tutor.id} phone={tutor.user.phone} whatsappNumber={tutor.whatsappNumber} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <StickyMobileContactBar tutorId={tutor.id} phone={tutor.user.phone} whatsappNumber={tutor.whatsappNumber} />
    </>
  );
}
