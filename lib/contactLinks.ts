/**
 * Builds a `tel:` link from a raw phone number, or null if none is
 * available — callers use this to disable the Call button instead of
 * rendering a link that goes nowhere.
 */
export function telHrefFor(phone?: string | null): string | null {
  const trimmed = phone?.trim();
  if (!trimmed) return null;
  return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
}

/**
 * Builds a https://wa.me/<digits> link. WhatsApp requires digits-only
 * (country code, no +/spaces/dashes). Falls back to the regular phone
 * number when no dedicated WhatsApp number was set, since in Bangladesh
 * the same mobile number is almost always used for both.
 */
export function whatsappHrefFor(whatsappNumber?: string | null, fallbackPhone?: string | null): string | null {
  const raw = whatsappNumber?.trim() || fallbackPhone?.trim();
  if (!raw) return null;

  let digits = raw.replace(/[^\d]/g, "");
  // Normalize common Bangladeshi local formats (01XXXXXXXXX) to E.164 (8801XXXXXXXXX)
  // so the wa.me link resolves correctly regardless of how the number was entered.
  if (digits.startsWith("0")) digits = `88${digits}`;
  else if (!digits.startsWith("880") && digits.length === 10) digits = `880${digits}`;

  return `https://wa.me/${digits}`;
}
