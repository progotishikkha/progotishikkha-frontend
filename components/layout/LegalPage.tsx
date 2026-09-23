import { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="py-20 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-brand-navy dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: {updated}</p>
        <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </Container>
    </div>
  );
}
