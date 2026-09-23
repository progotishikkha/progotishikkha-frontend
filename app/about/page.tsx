import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Target, ShieldCheck, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Progoti Shikkha is on a mission to make quality education accessible by connecting students with trusted tutors across Bangladesh.",
};

const VALUES = [
  {
    icon: Target,
    title: "Our mission",
    desc: "Make finding a qualified, trustworthy tutor simple — for every family, in every district.",
  },
  {
    icon: ShieldCheck,
    title: "Verified, always",
    desc: "Every tutor profile is reviewed before it goes live, and rated by real students after each tuition.",
  },
  {
    icon: HeartHandshake,
    title: "Built on trust",
    desc: "We design every feature — from OTP verification to review systems — around one goal: trust between students and tutors.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="About us"
          title="শিখবো, জানবো, গড়বো আগামি"
          description="Progoti Shikkha was founded to close the gap between students who need guidance and tutors ready to give it — with trust and transparency at the center."
        />

        <div className="mx-auto mt-16 max-w-3xl space-y-6 text-slate-600 dark:text-slate-300">
          <p>
            Every year, thousands of students across Bangladesh struggle to find the
            right tutor — someone qualified, reliable, and genuinely invested in
            their progress. At the same time, thousands of skilled tutors struggle
            to find students who match their subjects, schedule, and location.
          </p>
          <p>
            Progoti Shikkha exists to close that gap. We built a platform where
            students and parents can post exactly what they need, review real
            applicants with verified qualifications and ratings, and hire with
            confidence — while tutors get a fair, transparent way to find tuitions
            that fit their life.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-navy dark:text-white">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
