"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/dashboard/States";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { getErrorMessage } from "@/lib/errorMessage";
import { avatarUrlFor } from "@/lib/avatar";
import { StudentProfileData } from "@/types";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(1, "Phone number is required"),
  location: z.string().trim().max(150).optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
});
type FormValues = z.infer<typeof schema>;

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2MB, matches the backend limit
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function StudentProfilePage() {
  const { user, isInitializing, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Previously this page opened with hardcoded values ("Rafi Ahmed", a fixed
  // phone number, a stock avatar) no matter who was logged in, and "saving"
  // just faked a delay + success toast without calling the backend at all —
  // that's the whole "profile section not taking data from the account" bug.
  // Now it hydrates the form from the real, logged-in user via AuthContext.
  useEffect(() => {
    if (!user) return;
    const profile = user.profile as StudentProfileData | null;
    reset({
      fullName: user.fullName,
      phone: user.phone,
      location: profile?.location ?? "",
      whatsappNumber: profile?.whatsappNumber ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await profileService.updateStudentProfile(values);
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
    e.target.value = ""; // allow re-selecting the same file later
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
      await profileService.uploadStudentPhoto(file);
      await refreshUser();
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't upload the photo. Please try again."));
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (isInitializing || !user) return <CardSkeleton count={1} />;

  const profile = user.profile as StudentProfileData | null;
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
          <p className="text-sm text-slate-500 dark:text-slate-400">Student</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Input label="Full name" {...register("fullName")} error={errors.fullName?.message} />
        <Input label="Phone number" {...register("phone")} error={errors.phone?.message} />
        <Input label="Location" {...register("location")} error={errors.location?.message} />
        <Input label="WhatsApp number" {...register("whatsappNumber")} error={errors.whatsappNumber?.message} />
        <div className="flex justify-end">
          <Button type="submit" isLoading={submitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
