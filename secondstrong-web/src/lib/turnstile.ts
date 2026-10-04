/**
 * Cloudflare Turnstile, the bot check on the waiting list. It is invisible for almost everyone and
 * only shows a checkbox when Cloudflare is unsure. Off until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set
 * at build time; the receiver must have the matching TURNSTILE_SECRET.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface Turnstile {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  execute(id: string): void;
  reset(id: string): void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export const turnstileEnabled = !!SITE_KEY;

let loading: Promise<Turnstile> | null = null;
function load(): Promise<Turnstile> {
  loading ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

let host: HTMLElement | null = null;
let widget: string | null = null;
let pending: { resolve: (t: string) => void; reject: (e: Error) => void } | null = null;

/** Where the widget mounts; the form gives it a slot so a challenge, if shown, sits inside the card. */
export function mountTurnstile(el: HTMLElement | null) {
  host = el;
  if (el && SITE_KEY) void load().catch(() => {}); // warm the script while the visitor types
}

/** A fresh single-use token, or undefined when Turnstile is off. */
export async function turnstileToken(): Promise<string | undefined> {
  if (!SITE_KEY) return undefined;
  const ts = await load();
  if (!host) throw new Error("turnstile has no mount point");
  if (!widget) {
    widget = ts.render(host, {
      sitekey: SITE_KEY,
      action: "waitlist",
      execution: "execute",
      appearance: "interaction-only",
      callback: (t: string) => pending?.resolve(t),
      "error-callback": () => pending?.reject(new Error("turnstile error")),
      "expired-callback": () => pending?.reject(new Error("turnstile expired")),
    });
  } else {
    ts.reset(widget);
  }
  const token = new Promise<string>((resolve, reject) => {
    pending = { resolve, reject };
    setTimeout(() => reject(new Error("turnstile timed out")), 60_000);
  });
  ts.execute(widget);
  try {
    return await token;
  } finally {
    pending = null;
  }
}
