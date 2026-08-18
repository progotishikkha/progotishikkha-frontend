import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/forms/AuthShell";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Student Registration",
  description: "Create a free student account on Progoti Shikkha and start posting tuition requirements.",
};

export default function StudentRegisterPage() {
  return (
    <AuthShell
      title="Create your student account"
      subtitle="Post tuition requirements and find verified tutors."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-blue hover:underline">
            Log in
          </Link>
          <div className="mt-2 text-slate-400">
            Are you a tutor?{" "}
            <Link href="/register/tutor" className="font-medium text-brand-blue hover:underline">
              Register as a tutor
            </Link>
          </div>
        </>
      }
    >
      <RegisterForm role="student" />
    </AuthShell>
  );
}
