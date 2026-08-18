import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  closed: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  filled: "bg-brand-blue/10 text-brand-blue",
  hired: "bg-brand-blue/10 text-brand-blue",
  rejected: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",
  approved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  suspended: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        STYLES[status] ?? "bg-slate-100 text-slate-500"
      )}
    >
      {status}
    </span>
  );
}
