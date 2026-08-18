import { FileText, Search, Handshake, UserCheck, ClipboardList, Send } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STUDENT_STEPS = [
  { icon: FileText, title: "Post your requirement", desc: "Class, subject, budget, location — takes 2 minutes." },
  { icon: Search, title: "Review applicants", desc: "Compare qualifications, ratings, and past reviews." },
  { icon: Handshake, title: "Hire with confidence", desc: "Message, call, or hire directly from the platform." },
];

const TUTOR_STEPS = [
  { icon: UserCheck, title: "Build your profile", desc: "Add subjects, experience, and availability." },
  { icon: ClipboardList, title: "Browse live tuitions", desc: "Filter by subject, location, and salary." },
  { icon: Send, title: "Apply & get hired", desc: "Send a cover message and track your applications." },
];

function StepList({ steps }: { steps: typeof STUDENT_STEPS }) {
  return (
    <ol className="space-y-6">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20">
            <step.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-brand-navy dark:text-white">
              {i + 1}. {step.title}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Two paths, one trusted platform"
          description="Whether you're looking for a tutor or looking to teach, getting started takes minutes."
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-3xl border border-brand-navy/10 bg-brand-50/60 p-8 dark:border-white/10 dark:bg-white/5">
            <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">
              For students & parents
            </h3>
            <div className="mt-6">
              <StepList steps={STUDENT_STEPS} />
            </div>
          </div>
          <div className="rounded-3xl border border-brand-navy/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">
              For tutors
            </h3>
            <div className="mt-6">
              <StepList steps={TUTOR_STEPS} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
