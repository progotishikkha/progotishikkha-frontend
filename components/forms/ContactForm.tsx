"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { contactService } from "@/services/contactService";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Enter a subject").max(200),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await contactService.send(values);
      toast.success("Message sent — we'll get back to you soon.");
      reset();
    } catch {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Your name" {...register("name")} error={errors.name?.message} />
        <Input label="Email address" type="email" {...register("email")} error={errors.email?.message} />
      </div>
      <Input label="Subject" {...register("subject")} error={errors.subject?.message} />
      <Textarea label="Message" rows={5} {...register("message")} error={errors.message?.message} />
      <Button type="submit" size="lg" isLoading={submitting}>
        Send message
      </Button>
    </form>
  );
}
