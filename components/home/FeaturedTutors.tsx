import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TutorCard } from "./TutorCard";
import { Button } from "@/components/ui/Button";
import { avatarUrlFor } from "@/lib/avatar";
import { FEATURED_TUTORS } from "@/data/mock";
import { PublicTutorProfile, Tutor } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

function toTutor(t: PublicTutorProfile): Tutor {
  return {
    id: t.id,
    fullName: t.user.fullName,
    photoUrl: t.profilePhoto?.url ?? avatarUrlFor(t.user.fullName),
    qualification: t.qualification ?? "Tutor",
    university: t.university ?? "",
    subjects: t.subjects,
    location: t.location ?? "",
    experienceYears: t.experienceYears ?? 0,
    rating: t.rating,
    reviewCount: t.reviewCount,
    availability: t.availability ?? "flexible",
    phone: t.user.phone,
    whatsappNumber: t.whatsappNumber,
  };
}

async function getFeaturedTutors(): Promise<Tutor[]> {
  try {
    // Revalidate periodically rather than no-store — the homepage doesn't
    // need per-request freshness for a "top rated" showcase.
    const res = await fetch(`${API_BASE}/tutors?limit=4`, { next: { revalidate: 300 } });
    if (!res.ok) return FEATURED_TUTORS;
    const json = await res.json();
    const tutors: PublicTutorProfile[] = json?.data?.tutors ?? [];
    return tutors.length > 0 ? tutors.map(toTutor) : FEATURED_TUTORS;
  } catch {
    // Real tutors aren't live yet, or the API is unreachable at build time —
    // fall back to sample data so the homepage never renders empty.
    return FEATURED_TUTORS;
  }
}

export async function FeaturedTutors() {
  const tutors = await getFeaturedTutors();

  return (
    <section className="bg-brand-50/50 py-20 dark:bg-white/[0.02] sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Top rated"
          title="Meet a few of our tutors"
          description="Every tutor profile is reviewed before it goes live, and rated by real students."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/tutors">
            <Button variant="outline">Browse all tutors</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
