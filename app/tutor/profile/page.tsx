"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, Star } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea, Select } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/dashboard/States";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { getErrorMessage } from "@/lib/errorMessage";
import { avatarUrlFor } from "@/lib/avatar";
import { TutorProfileData } from "@/types";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(1, "Phone number is required"),
  qualification: z.string().trim().max(150).optional(),
  university: z.string().trim().max(150).optional(),
  department: z.string().trim().max(150).optional(),
  experienceYears: z.coerce.number().min(0).max(50).optional(),
  subjects: z.string().trim().min(1, "List at least one subject"),
  skills: z.string().trim().optional(),
  location: z.string().trim().max(150).optional(),
  availability: z.enum(["weekdays", "weekends", "evenings", "flexible"]),
  whatsappNumber: z.string().trim().max(20).optional(),
  about: z.string().trim().max(2000).optional(),
});
type FormValues = z.infer<typeof schema>;

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

// subjects/skills are comma-separated text in the form but arrays in the
// database — small helpers keep that conversion in one place.
const toCsv = (arr?: string[]) => (arr ?? []).join(", ");
const fromCsv = (csv: string) =>
  csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function TutorProfilePage() {
  const { user, isInitializing, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Same root cause as the student profile page: this used to open with
  // hardcoded sample data ("Farhana Akter", a fixed bio, a stock avatar)
  // regardless of who was logged in, and saving never actually reached the
  // backend. Now it's hydrated from — and saved to — the real account.
  useEffect(() => {
    if (!user) return;
    const profile = user.profile as TutorProfileData | null;
    reset({
      fullName: user.fullName,
      phone: user.phone,
      qualification: profile?.qualification ?? "",
      university: profile?.university ?? "",
      department: profile?.department ?? "",
      experienceYears: profile?.experienceYears ?? 0,
      subjects: toCsv(profile?.subjects),
      skills: toCsv(profile?.skills),
      location: profile?.location ?? "",
      availability: profile?.availability ?? "flexible",
      whatsappNumber: profile?.whatsappNumber ?? "",
      about: profile?.about ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await profileService.updateTutorProfile({
        ...values,
        subjects: fromCsv(values.subjects),
        skills: values.skills ? fromCsv(values.skills) : [],
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update your profile. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      toast.error("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Image is too large — please choose one under 2MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      await profileService.uploadTutorPhoto(file);
      await refreshUser();
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't upload the photo. Please try again."));
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (isInitializing || !user) return <CardSkeleton count={1} />;

  const profile = user.profile as TutorProfileData | null;
  const photoUrl = profile?.profilePhoto?.url ?? avatarUrlFor(user.fullName);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="flex items-center gap-5">
        <div className="relative">
          <Image
            src={photoUrl}
            alt="Profile"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
          <button
            type="button"
            aria-label="Change profile photo"
            onClick={handlePhotoClick}
            disabled={uploadingPhoto}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-white shadow-sm disabled:opacity-60"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-brand-navy dark:text-white">{user.fullName}</p>
          <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
            {(profile?.rating ?? 0).toFixed(1)} ({profile?.reviewCount ?? 0} reviews) ·{" "}
            {profile?.completedTuitionCount ?? 0} tuitions completed
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Full name" {...register("fullName")} error={errors.fullName?.message} />
          <Input label="Phone number" {...register("phone")} error={errors.phone?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Qualification" {...register("qualification")} error={errors.qualification?.message} />
          <Input label="University" {...register("university")} error={errors.university?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Department" {...register("department")} error={errors.department?.message} />
          <Input
            label="Years of experience"
            type="number"
            min={0}
            {...register("experienceYears")}
            error={errors.experienceYears?.message}
          />
        </div>

        <Input
          label="Subjects (comma separated)"
          placeholder="e.g. Mathematics, Physics"
          {...register("subjects")}
          error={errors.subjects?.message}
        />
        <Input
          label="Skills (comma separated)"
          placeholder="e.g. Exam strategy, patient explanation"
          {...register("skills")}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Location" {...register("location")} error={errors.location?.message} />
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select label="Availability" {...field} error={errors.availability?.message}>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="flexible">Flexible</option>
              </Select>
            )}
          />
        </div>

        <Input label="WhatsApp number" {...register("whatsappNumber")} error={errors.whatsappNumber?.message} />

        <Textarea
          label="About you"
          rows={4}
          placeholder="Tell students and parents about your teaching style and experience."
          {...register("about")}
          error={errors.about?.message}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={submitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
