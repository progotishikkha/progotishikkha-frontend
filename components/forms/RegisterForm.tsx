"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { UserRole } from "@/types";

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    phone: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Enter a valid phone number"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm({ role }: { role: Extract<UserRole, "student" | "tutor"> }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const result = await authService.register({ ...values, role });
      if (result.otpEmailSent) {
        toast.success("Verification code sent! Your account will be created after you verify your email.");
      } else {
        toast.warning("Registration started, but the verification email could not be sent. You can resend the code on the verification screen.");
      }
      router.push(`/login?verify=1&email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Full name"
        placeholder="e.g. Farhana Akter"
        {...register("fullName")}
        error={errors.fullName?.message}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Phone number"
        type="tel"
        placeholder="+8801XXXXXXXXX"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <Input
        label="Password"
        type="password"
        showPasswordToggle
        placeholder="At least 8 characters"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Confirm password"
        type="password"
        showPasswordToggle
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
        Create account
      </Button>
    </form>
  );
}
