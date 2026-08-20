import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, showPasswordToggle, type, ...props }, ref) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const inputId = id ?? props.name;
    const isPassword = type === "password" && showPasswordToggle;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-brand-navy dark:text-white"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword && passwordVisible ? "text" : type}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400",
              "dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500",
              "outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue",
              error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-slate-700",
              isPassword && "pr-11",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setPasswordVisible((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-brand-blue"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
