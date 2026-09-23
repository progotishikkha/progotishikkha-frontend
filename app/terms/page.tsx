import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing use of the Progoti Shikkha platform.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="September 20, 2026">
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">1. Acceptance of terms</h2>
        <p className="mt-2">
          By creating an account on Progoti Shikkha, you agree to these terms. If you do not agree,
          please do not use the platform.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">2. Accounts</h2>
        <p className="mt-2">
          You must provide accurate information during registration and verify your email via OTP
          before your account becomes active. You are responsible for maintaining the confidentiality
          of your password.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">3. Platform role</h2>
        <p className="mt-2">
          Progoti Shikkha connects students and tutors and provides administrative support around
          tuition placement. Student and tutor phone/WhatsApp details are not exposed to one another;
          authorized administrators may contact either side when arranging or supporting a tuition.
          For tutors who receive a tuition through Progoti Shikkha, the current operating policy is to
          collect a donation equal to 10% of the first month's salary to support the continuation of
          Progoti Shikkha's tuition-support activities. Donation payments are recorded and verified by
          administrators.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">4. Conduct</h2>
        <p className="mt-2">
          Users must not post false information, harass other users, or misuse the platform for
          purposes unrelated to tuition. Accounts violating these terms may be suspended or removed.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">5. Changes to these terms</h2>
        <p className="mt-2">
          We may update these terms from time to time. Continued use of the platform after changes
          constitutes acceptance of the revised terms.
        </p>
      </section>
    </LegalPage>
  );
}
