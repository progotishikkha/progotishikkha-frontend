"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ContactActions } from "@/components/shared/ContactActions";
import { Tutor, ApplicationStatus } from "@/types";

interface ApplicantCardProps {
  tutor: Tutor;
  coverMessage: string;
  expectedSalary: number;
  availability: string;
  status: ApplicationStatus;
  onHire: () => void;
  onReject: () => void;
}

export function ApplicantCard({
  tutor,
  coverMessage,
  expectedSalary,
  availability,
  status,
  onHire,
  onReject,
}: ApplicantCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href={`/tutors/${tutor.id}`}
          className="flex gap-3.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
        >
          <Image src={tutor.photoUrl} alt={tutor.fullName} width={48} height={48} className="rounded-full" />
          <div>
            <p className="font-display text-sm font-semibold text-brand-navy hover:underline dark:text-white">
              {tutor.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{tutor.qualification}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
              {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews)
            </p>
          </div>
        </Link>
        <StatusBadge status={status} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{coverMessage}</p>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span>Expected salary: ৳{expectedSalary.toLocaleString()}</span>
        <span>Availability: {availability}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ContactActions phone={tutor.phone} whatsappNumber={tutor.whatsappNumber} size="sm" />
        {status === "pending" && (
          <>
            <Button size="sm" onClick={onHire}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Hire
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onReject}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
