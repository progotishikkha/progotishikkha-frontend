"use client";

import { useEffect } from "react";
import { tutorService } from "@/services/tutorService";
import { ContactActions } from "@/components/shared/ContactActions";

/** Fires once, client-side, when a visitor lands on a tutor's public profile. */
export function ProfileViewTracker({ tutorId }: { tutorId: string }) {
  useEffect(() => {
    tutorService.trackEvent(tutorId, "profile_view");
    // Intentionally run only once per mount — a re-render shouldn't double-count a view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId]);

  return null;
}

/** Sticky bottom contact bar shown only on mobile viewports. */
export function StickyMobileContactBar({
  tutorId,
  phone,
  whatsappNumber,
}: {
  tutorId: string;
  phone?: string;
  whatsappNumber?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:hidden">
      <ContactActions
        phone={phone}
        whatsappNumber={whatsappNumber}
        fullWidth
        onCallClick={() => tutorService.trackEvent(tutorId, "call_click")}
        onWhatsappClick={() => tutorService.trackEvent(tutorId, "whatsapp_click")}
        className="grid grid-cols-2 gap-2"
      />
    </div>
  );
}

/** Inline contact card (desktop + fallback on mobile before the sticky bar). */
export function TutorContactCard({
  tutorId,
  phone,
  whatsappNumber,
}: {
  tutorId: string;
  phone?: string;
  whatsappNumber?: string;
}) {
  return (
    <ContactActions
      phone={phone}
      whatsappNumber={whatsappNumber}
      size="lg"
      fullWidth
      onCallClick={() => tutorService.trackEvent(tutorId, "call_click")}
      onWhatsappClick={() => tutorService.trackEvent(tutorId, "whatsapp_click")}
    />
  );
}
