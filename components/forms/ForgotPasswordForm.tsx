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

const emailSchema = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email address") });
type EmailValues = z.infer<typeof emailSchema>;

const resetSchema = z
  .object({
    code: z.string().length(6, "Enter the 6-digit code"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
type ResetValues = z.infer<typeof resetSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailForm = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onRequestCode = async (values: EmailValues) => {
    setSubmitting(true);
    try {
      await authService.forgotPassword(values.email);
      setEmail(values.email);
      setStep("reset");
      toast.success("If that account exists, a reset code has been sent.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = async (values: ResetValues) => {
    setSubmitting(true);
    try {
      await authService.resetPassword({ email, ...values });
      toast.success("Password reset! Please log in.");
      router.push("/login");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid or expired code.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "reset") {
    return (
      <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-5" noValidate>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Enter the code sent to <span className="font-medium">{email}</span> and choose a new password.
        </p>
        <Input
          label="Verification code"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="text-center text-lg tracking-[0.5em]"
          {...resetForm.register("code")}
          error={resetForm.formState.errors.code?.message}
        />
        <Input
          label="New password"
          type="password"
          {...resetForm.register("newPassword")}
          error={resetForm.formState.errors.newPassword?.message}
        />
        <Input
          label="Confirm new password"
          type="password"
          {...resetForm.register("confirmNewPassword")}
          error={resetForm.formState.errors.confirmNewPassword?.message}
        />
        <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
          Reset password
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={emailForm.handleSubmit(onRequestCode)} className="space-y-5" noValidate>
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        {...emailForm.register("email")}
        error={emailForm.formState.errors.email?.message}
      />
      <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
        Send reset code
      </Button>
    </form>
  );
}
