import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="ruled-paper flex min-h-[70vh] items-center py-20">
      <Container className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gold/15 text-brand-gold">
          <BookX className="h-9 w-9" />
        </div>
        <h1 className="mt-8 font-display text-5xl font-semibold text-brand-navy dark:text-white">404</h1>
        <p className="mt-3 text-lg font-medium text-brand-navy dark:text-white">
          This page hasn&apos;t been written yet.
        </p>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <Link href="/" className="mt-8">
          <Button size="lg">Back to homepage</Button>
        </Link>
      </Container>
    </div>
  );
}
