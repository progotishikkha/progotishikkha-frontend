import { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: "blue" | "gold" | "navy";
}) {
  const accentClasses = {
    blue: "bg-brand-blue/10 text-brand-blue",
    gold: "bg-brand-gold/15 text-brand-gold",
    navy: "bg-brand-navy/10 text-brand-navy dark:bg-white/10 dark:text-white",
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-brand-navy dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
