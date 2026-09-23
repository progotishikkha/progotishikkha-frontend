import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">
          Change password
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          You'll be logged out of all devices after changing your password.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
