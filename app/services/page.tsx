import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Home, Laptop, BookOpenCheck, Users2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Home tuition, online tuition, group tuition, and exam-focused coaching — explore how Progoti Shikkha connects students with the right tutors.",
};

const SERVICES = [
  {
    icon: Home,
    title: "Home tuition",
    desc: "One-on-one, in-person tutoring at your home — ideal for younger students and hands-on subjects.",
  },
  {
    icon: Laptop,
    title: "Online tuition",
    desc: "Live video sessions with tutors from anywhere in Bangladesh, on a schedule that fits you.",
  },
  {
    icon: Users2,
    title: "Group tuition",
    desc: "Small-group sessions that combine focused attention with peer learning, at a lower cost.",
  },
  {
    icon: BookOpenCheck,
    title: "Exam-focused coaching",
    desc: "Targeted preparation for SSC, HSC, admission tests, and O/A-Levels with experienced subject tutors.",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Tutoring that fits how you learn"
          description="Every tuition post lets you specify exactly the format you need — we make sure the right tutors see it."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="fold-card rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-navy dark:text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/register/student">
            <Button size="lg">Post your tuition requirement</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
