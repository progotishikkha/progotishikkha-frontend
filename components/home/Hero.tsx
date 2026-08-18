"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="ruled-paper relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-gold/20 blur-3xl dark:bg-brand-gold/10"
        aria-hidden="true"
      />
      <Container className="relative py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-navy shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
            <span className="font-bengali">শিখবো, জানবো, গড়বো আগামি</span>
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-brand-navy dark:text-white sm:text-6xl">
            Find a tutor you can{" "}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              trust
            </span>
            , faster.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500 dark:text-slate-400">
            Progoti Shikkha connects students and parents with verified, experienced
            tutors across Bangladesh — post a requirement, review applicants, and
            hire with confidence.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register/student">
              <Button size="lg" className="group">
                Find a tutor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/register/tutor">
              <Button size="lg" variant="outline">
                Become a tutor
              </Button>
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-blue" />
              <span>2,400+ verified tutors</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand-blue" />
              <span>6,000+ tuitions matched</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
