import { SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-brand-navy dark:text-white">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400",
            "dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500",
            "outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue",
            error ? "border-red-400" : "border-slate-200 dark:border-slate-700",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-brand-navy dark:text-white">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-slate-800",
            "dark:bg-slate-900/60 dark:text-slate-100",
            "outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue",
            error ? "border-red-400" : "border-slate-200 dark:border-slate-700",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
