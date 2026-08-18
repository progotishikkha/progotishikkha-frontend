"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-slate-200 dark:border-slate-700",
        },
      }}
    />
  );
}
