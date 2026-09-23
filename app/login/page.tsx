import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/forms/AuthShell";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Progoti Shikkha account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your tuitions and applications."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register/student" className="font-medium text-brand-blue hover:underline">
            Register as a student
          </Link>{" "}
          or{" "}
          <Link href="/register/tutor" className="font-medium text-brand-blue hover:underline">
            as a tutor
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
