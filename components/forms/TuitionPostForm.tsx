"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea, Select } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { tuitionPostService, TuitionPostInput } from "@/services/tuitionPostService";
import { getErrorMessage } from "@/lib/errorMessage";

const schema = z.object({
  title: z.string().trim().min(5, "Title should be at least 5 characters").max(150),
  class: z.string().trim().min(1, "Required"),
  medium: z.string().trim().min(1, "Required"),
  subject: z.string().trim().min(1, "Required"),
  daysPerWeek: z.coerce.number().min(1).max(7),
  salary: z.coerce.number().min(500, "Enter a realistic monthly salary"),
  location: z.string().trim().min(2, "Required"),
  teachingMode: z.enum(["online", "offline", "both"]),
  genderPreference: z.enum(["male", "female", "any"]),
  description: z.string().trim().min(20, "Add a bit more detail (min 20 characters)").max(3000),
  preferredTutor: z.string().trim().optional(),
  deadline: z.string().min(1, "Select a deadline"),
});

type FormValues = z.infer<typeof schema>;

export function TuitionPostForm({
  mode,
  postId,
  defaultValues,
}: {
  mode: "create" | "edit";
  postId?: string;
  defaultValues?: Partial<FormValues>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      teachingMode: "offline",
      genderPreference: "any",
      daysPerWeek: 3,
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = values as TuitionPostInput;
      if (mode === "create") {
        await tuitionPostService.create(payload);
        toast.success("Tuition post created");
      } else if (postId) {
        await tuitionPostService.update(postId, payload);
        toast.success("Tuition post updated");
      }
      router.push("/student/posts");
    } catch (err) {
      // Previously this caught every error (including real failures — bad
      // request body, expired session, network issues) and faked a success
      // toast + redirect anyway, so the post silently never made it to the
      // database while the user was told it worked. Now the real failure is
      // shown and the user stays on the form so they don't lose their input.
      toast.error(getErrorMessage(err, "Couldn't save the tuition post. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input label="Title" placeholder="e.g. Need Math tutor for Class 9" {...register("title")} error={errors.title?.message} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Class" placeholder="e.g. Class 9" {...register("class")} error={errors.class?.message} />
        <Input label="Medium" placeholder="e.g. English Medium" {...register("medium")} error={errors.medium?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Subject(s)" placeholder="e.g. Math, Physics" {...register("subject")} error={errors.subject?.message} />
        <Input label="Location" placeholder="e.g. Dhanmondi, Dhaka" {...register("location")} error={errors.location?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Input label="Days per week" type="number" min={1} max={7} {...register("daysPerWeek")} error={errors.daysPerWeek?.message} />
        <Input label="Salary (৳/month)" type="number" min={500} {...register("salary")} error={errors.salary?.message} />
        <Input label="Application deadline" type="date" {...register("deadline")} error={errors.deadline?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Teaching mode" {...register("teachingMode")} error={errors.teachingMode?.message}>
          <option value="offline">Offline (in-person)</option>
          <option value="online">Online</option>
          <option value="both">Both</option>
        </Select>
        <Select label="Gender preference" {...register("genderPreference")} error={errors.genderPreference?.message}>
          <option value="any">No preference</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </div>

      <Input
        label="Preferred tutor background (optional)"
        placeholder="e.g. Student from a public university"
        {...register("preferredTutor")}
      />

      <Textarea
        label="Description"
        rows={5}
        placeholder="Describe what you're looking for, your child's current level, and any other details tutors should know."
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push("/student/posts")}>
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          {mode === "create" ? "Publish post" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
