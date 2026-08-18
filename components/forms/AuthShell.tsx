import { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="ruled-paper py-16 sm:py-20">
      <Container className="flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:p-10">
          <div className="flex justify-center">
            <Image src="/logo.jpeg" alt="Progoti Shikkha" width={48} height={48} className="rounded-full" />
          </div>
          <h1 className="mt-5 text-center font-display text-2xl font-semibold text-brand-navy dark:text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-center text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </Container>
    </div>
  );
}
