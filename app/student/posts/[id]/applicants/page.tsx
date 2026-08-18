"use client";

import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { ApplicantCard } from "@/components/dashboard/ApplicantCard";
import { EmptyState, ErrorState, CardSkeleton } from "@/components/dashboard/States";
import { applicationService } from "@/services/applicationService";
import { tuitionPostService } from "@/services/tuitionPostService";
import { getErrorMessage } from "@/lib/errorMessage";
import { avatarUrlFor } from "@/lib/avatar";
import { PostApplicant, Tutor, TuitionPost } from "@/types";
import { notFound } from "next/navigation";

function toTutor(applicant: PostApplicant): Tutor {
  const { tutor } = applicant;
  return {
    id: tutor.id,
    fullName: tutor.user.fullName,
    photoUrl: tutor.profilePhoto?.url ?? avatarUrlFor(tutor.user.fullName),
    qualification: tutor.qualification ?? "—",
    university: tutor.university ?? "—",
    subjects: tutor.subjects,
    location: tutor.location ?? "—",
    experienceYears: tutor.experienceYears ?? 0,
    rating: tutor.rating,
    reviewCount: tutor.reviewCount,
    availability: tutor.availability ?? "flexible",
    phone: tutor.user.phone,
    whatsappNumber: tutor.whatsappNumber,
  };
}

export default function ViewApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<TuitionPost | null>(null);
  const [applicants, setApplicants] = useState<PostApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postData, applicantsData] = await Promise.all([
        tuitionPostService.getById(id),
        applicationService.listForPost(id),
      ]);
      setPost(postData);
      setApplicants(applicantsData);
    } catch (err) {
      if ((err as { response?: { status?: number } })?.response?.status === 404) {
        setNotFoundFlag(true);
      } else {
        setError(getErrorMessage(err, "Couldn't load applicants for this post."));
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (appId: string, status: "hired" | "rejected") => {
    try {
      if (status === "hired") {
        await applicationService.hire(appId);
      } else {
        await applicationService.reject(appId);
      }
      setApplicants((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
      toast.success(status === "hired" ? "Tutor hired! They've been notified." : "Applicant rejected.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update this application. Please try again."));
    }
  };

  if (notFoundFlag) notFound();
  if (loading) return <CardSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!post) return null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{post.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {applicants.length} applicant{applicants.length !== 1 && "s"}
        </p>
      </div>

      {applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          description="Once tutors apply to this post, they'll appear here."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((a) => (
            <ApplicantCard
              key={a.id}
              tutor={toTutor(a)}
              coverMessage={a.coverMessage}
              expectedSalary={a.expectedSalary}
              availability={a.availability}
              status={a.status}
              onHire={() => updateStatus(a.id, "hired")}
              onReject={() => updateStatus(a.id, "rejected")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
