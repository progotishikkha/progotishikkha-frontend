/**
 * Pulls a human-readable message out of an Axios/API error, falling back to
 * a sensible default. Centralized so every form doesn't reimplement the same
 * `(err as any)?.response?.data?.message` reach-around.
 */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
