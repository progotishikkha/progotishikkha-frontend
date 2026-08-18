"use client";

import { Phone, MessageCircle } from "lucide-react";
import { telHrefFor, whatsappHrefFor } from "@/lib/contactLinks";
import { cn } from "@/lib/utils";

interface ContactActionsProps {
  phone?: string | null;
  whatsappNumber?: string | null;
  onCallClick?: () => void;
  onWhatsappClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

// Mirrors the "outline" variant in components/ui/Button.tsx — kept as
// standalone <a>/<button> here (rather than reusing <Button>) because an
// <a> can never legally nest inside a <button>, and these actions must be
// real anchor tags (tel:/wa.me) to work as native links, share targets,
// and long-press "copy number" on mobile.
const actionClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 " +
  "border border-brand-navy/20 text-brand-navy hover:bg-brand-50 dark:text-white dark:border-white/20 dark:hover:bg-white/5 " +
  "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]";

/**
 * Renders working Call / WhatsApp buttons. When a number isn't available,
 * renders a real disabled <button> (not a dead link), so a tap never opens
 * a broken tel:/wa.me href.
 */
export function ContactActions({
  phone,
  whatsappNumber,
  onCallClick,
  onWhatsappClick,
  size = "md",
  className,
  fullWidth,
}: ContactActionsProps) {
  const telHref = telHrefFor(phone);
  const waHref = whatsappHrefFor(whatsappNumber, phone);

  return (
    <div className={cn("flex flex-wrap gap-2", fullWidth && "flex-col sm:flex-row", className)}>
      {telHref ? (
        <a
          href={telHref}
          onClick={onCallClick}
          aria-label="Call tutor"
          className={cn(actionClasses, sizeClasses[size], fullWidth && "w-full sm:w-auto")}
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="Phone number not available"
          aria-label="Call — phone number not available"
          className={cn(actionClasses, sizeClasses[size], fullWidth && "w-full sm:w-auto")}
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </button>
      )}

      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsappClick}
          aria-label="Message tutor on WhatsApp"
          className={cn(actionClasses, sizeClasses[size], fullWidth && "w-full sm:w-auto")}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="WhatsApp number not available"
          aria-label="WhatsApp — number not available"
          className={cn(actionClasses, sizeClasses[size], fullWidth && "w-full sm:w-auto")}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </button>
      )}
    </div>
  );
}
