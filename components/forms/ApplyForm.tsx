"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/FormControls";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { applicationService } from "@/services/applicationService";
import { getErrorMessage } from "@/lib/errorMessage";

const schema = z.object({
  coverMessage: z.string().trim().min(20, "Write at least 20 characters").max(1000),
  expectedSalary: z.coerce.number().min(500, "Enter a realistic amount"),
  availability: z.string().trim().min(2, "Required"),
});
type FormValues = z.infer<typeof schema>;

export function ApplyForm({ tuitionPostId, defaultSalary }: { tuitionPostId: string; defaultSalary: number }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { expectedSalary: defaultSalary } });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await applicationService.apply({ tuitionPostId, ...values });
      toast.success("Application submitted!");
      router.push("/tutor/applications");
    } catch (err) {
      // Previously any failure here (already applied, expired post, network
      // error) was swallowed and faked as a success + redirect, so a tutor
      // could believe they'd applied when nothing was ever saved.
      toast.error(getErrorMessage(err, "Couldn't submit your application. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Textarea
        label="Cover message"
        rows={4}
        placeholder="Introduce yourself and explain why you're a good fit for this tuition."
        {...register("coverMessage")}
        error={errors.coverMessage?.message}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Expected salary (৳/month)"
          type="number"
          {...register("expectedSalary")}
          error={errors.expectedSalary?.message}
        />
        <Input
          label="Your availability"
          placeholder="e.g. Evenings, weekends"
          {...register("availability")}
          error={errors.availability?.message}
        />
      </div>
      <Button type="submit" className="w-full" isLoading={submitting}>
        Submit application
      </Button>
    </form>
  );
}
