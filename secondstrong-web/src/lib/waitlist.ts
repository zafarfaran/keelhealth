/**
 * Waiting-list sign-up. The site is a static export, so sign-ups are POSTed as JSON to the waitlist
 * receiver set at build time: NEXT_PUBLIC_WAITLIST_ENDPOINT (the Railway function in
 * secondstrong-waitlist/, which stores them in Neon).
 *
 * With no endpoint set, sign-ups are NOT stored: the form simulates success so the flow can be
 * designed and tested, and logs a warning.
 */
import { turnstileToken } from "./turnstile";

export type Stage = "peri" | "meno" | "post" | "unsure";

export interface SignUp {
  email: string;
  stage?: Stage;
  /** The hidden honeypot field. People leave it empty; bots that fill it are quietly dropped. */
  company?: string;
}

/** Thrown when the receiver is refusing new sign-ups for a moment (rate limit or global cap). */
export class WaitlistBusy extends Error {}

const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT;

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export async function joinWaitlist({ email, stage, company }: SignUp): Promise<void> {
  const body = { email: email.trim().toLowerCase(), stage, company: company || undefined };
  if (!ENDPOINT) {
    console.warn("[waitlist] NEXT_PUBLIC_WAITLIST_ENDPOINT is not set; this sign-up was not saved.", body);
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  const token = await turnstileToken();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...body, token }),
  });
  if (res.status === 429 || res.status === 503) throw new WaitlistBusy();
  if (!res.ok) throw new Error(`Waitlist sign-up failed (${res.status})`);
}
