import { TuitionPostForm } from "@/components/forms/TuitionPostForm";

export default function CreateTuitionPostPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">
        Create a tuition post
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        The more detail you provide, the better tutors can judge if they're a good fit.
      </p>
      <div className="mt-6">
        <TuitionPostForm mode="create" />
      </div>
    </div>
  );
}
