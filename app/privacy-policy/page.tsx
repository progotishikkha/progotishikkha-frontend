import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Progoti Shikkha collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 1, 2026">
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">1. Information we collect</h2>
        <p className="mt-2">
          When you register, we collect your full name, email address, phone number, and password
          (stored as a secure hash, never in plain text). Tutors may additionally provide qualification,
          experience, and profile details. Students may provide tuition post details including location
          and budget.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">2. How we use your information</h2>
        <p className="mt-2">
          We use your information to operate the platform: matching students with tutors, sending
          verification codes and notifications, and improving our services. We do not sell your
          personal information to third parties.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">3. Data security</h2>
        <p className="mt-2">
          Passwords are hashed using bcrypt. Access to your account is protected by JWT-based
          authentication with short-lived access tokens and rotating refresh tokens. We use
          industry-standard practices including input validation, rate limiting, and encrypted
          connections.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">4. Your rights</h2>
        <p className="mt-2">
          You may update or delete your profile information at any time from your account settings,
          or contact us to request full account deletion.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">5. Contact</h2>
        <p className="mt-2">
          Questions about this policy can be sent to progotishikkhabd@gmail.com.
        </p>
      </section>
    </LegalPage>
  );
}
