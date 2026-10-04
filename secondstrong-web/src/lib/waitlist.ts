/**
 * Waiting-list sign-up. The site is a static export, so sign-ups are POSTed as JSON to an endpoint
 * set at build time: NEXT_PUBLIC_WAITLIST_ENDPOINT (e.g. a small Cloudflare Worker writing to Neon,
 * or a Formspree form URL). The endpoint should answer 2xx on success.
 *
 * With no endpoint set, sign-ups are NOT stored: the form simulates success so the flow can be
 * designed and tested, and logs a warning. Set the variable before going live.
 */
export type Stage = "peri" | "meno" | "post" | "unsure";

export interface SignUp {
  email: string;
  stage?: Stage;
}

const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT;

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export async function joinWaitlist({ email, stage }: SignUp): Promise<void> {
  const body = { email: email.trim().toLowerCase(), stage, source: "website", at: new Date().toISOString() };
  if (!ENDPOINT) {
    console.warn("[waitlist] NEXT_PUBLIC_WAITLIST_ENDPOINT is not set; this sign-up was not saved.", body);
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Waitlist sign-up failed (${res.status})`);
}
