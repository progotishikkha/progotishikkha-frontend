"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginValues = z.infer<typeof loginSchema>;

const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});
type OtpValues = z.infer<typeof otpSchema>;

function redirectForRole(role: string) {
  if (role === "admin") return "/admin";
  if (role === "tutor") return "/tutor";
  return "/student";
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [verifyMode, setVerifyMode] = useState(params.get("verify") === "1");
  const prefilledEmail = params.get("email") ?? "";

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: prefilledEmail },
  });

  const otpForm = useForm<OtpValues>({ resolver: zodResolver(otpSchema) });

  const onLogin = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success("Welcome back!");
      router.push(redirectForRole(user.role));
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid email or password.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async (values: OtpValues) => {
    setSubmitting(true);
    try {
      const user = await authService.verifyOtp(prefilledEmail, values.code);
      toast.success("Email verified! Your account is now active.");
      router.push(redirectForRole(user.role));
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid or expired code.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      await authService.resendOtp(prefilledEmail);
      toast.success("A new code has been sent to your email.");
    } catch {
      toast.error("Could not resend code. Please try again shortly.");
    }
  };

  if (verifyMode) {
    return (
      <form onSubmit={otpForm.handleSubmit(onVerify)} className="space-y-5" noValidate>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          We sent a 6-digit code to <span className="font-medium">{prefilledEmail}</span>
        </p>
        <Input
          label="Verification code"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="text-center text-lg tracking-[0.5em]"
          {...otpForm.register("code")}
          error={otpForm.formState.errors.code?.message}
        />
        <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
          Verify & continue
        </Button>
        <button
          type="button"
          onClick={resendOtp}
          className="w-full text-center text-sm text-brand-blue hover:underline"
        >
          Resend code
        </button>
        <button
          type="button"
          onClick={() => setVerifyMode(false)}
          className="w-full text-center text-sm text-slate-400 hover:underline"
        >
          Back to login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5" noValidate>
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        {...loginForm.register("email")}
        error={loginForm.formState.errors.email?.message}
      />
      <div>
        <Input
          label="Password"
          type="password"
          showPasswordToggle
          placeholder="••••••••"
          {...loginForm.register("password")}
          error={loginForm.formState.errors.password?.message}
        />
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-xs font-medium text-brand-blue hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
        Log in
      </Button>
    </form>
  );
}
