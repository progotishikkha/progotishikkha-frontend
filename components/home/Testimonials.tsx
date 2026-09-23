import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "We found a fantastic Physics tutor within two days of posting. The applicant reviews made it easy to compare and decide.",
    name: "Shirin Akhtar",
    role: "Parent, Dhaka",
  },
  {
    quote:
      "As a tutor, the platform makes it simple to find tuitions that actually match my schedule and subjects.",
    name: "Imran Hossain",
    role: "Tutor, Chattogram",
  },
  {
    quote:
      "Verification gave us peace of mind. We could see the tutor's qualifications and past reviews before even messaging.",
    name: "Kamrul Islam",
    role: "Parent, Sylhet",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Trusted by students and parents" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex gap-0.5 text-brand-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-gold" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-brand-navy dark:text-white">
                {t.name}
                <span className="block text-xs font-normal text-slate-400">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
