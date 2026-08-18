import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/forms/AuthShell";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Tutor Registration",
  description: "Register as a tutor on Progoti Shikkha and start applying to live tuition posts.",
};

export default function TutorRegisterPage() {
  return (
    <AuthShell
      title="Create your tutor account"
      subtitle="Build your profile and apply to live tuition posts."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-blue hover:underline">
            Log in
          </Link>
          <div className="mt-2 text-slate-400">
            Looking for a tutor instead?{" "}
            <Link href="/register/student" className="font-medium text-brand-blue hover:underline">
              Register as a student
            </Link>
          </div>
        </>
      }
    >
      <RegisterForm role="tutor" />
    </AuthShell>
  );
}
