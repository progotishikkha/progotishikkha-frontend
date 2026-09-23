import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/20 blur-3xl"
            aria-hidden="true"
          />
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Join thousands of students and tutors already using Progoti Shikkha
            across Bangladesh.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register/student">
              <Button size="lg" variant="secondary">
                Find a tutor
              </Button>
            </Link>
            <Link href="/register/tutor">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Become a tutor
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
