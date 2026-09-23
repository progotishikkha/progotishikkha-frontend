import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Progoti Shikkha team — we typically respond within one business day.",
};

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "progotishikkhabd@gmail.com" },
  { icon: Phone, label: "Phone", value: "+8801408388029" },
  { icon: MapPin, label: "Office", value: "Farmgate, Dhaka, Bangladesh" },
];

export default function ContactPage() {
  return (
    <div className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          description="Questions, feedback, or partnership ideas — send us a message and we'll respond within one business day."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {CONTACT_INFO.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-navy dark:text-white">{info.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
