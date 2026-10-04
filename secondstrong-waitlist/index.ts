/**
 * Waitlist receiver (Railway Function, Bun). The marketing site POSTs { email, stage?, token?, company? }
 * and the sign-up is stored in Neon through waitlist_join() (see schema.sql), which also enforces
 * global caps. The role in DATABASE_URL can do nothing but call that function.
 *
 * Defences, outermost first:
 *  - browser origin must be one of ALLOWED_ORIGINS (stops other sites embedding the form);
 *  - Cloudflare Turnstile token, verified server-side, when TURNSTILE_SECRET is set (stops bots);
 *  - honeypot field `company`: humans never see it, so a filled one gets a fake success;
 *  - per-IP limit on Railway's X-Real-IP (set by Railway's edge; the sender cannot choose it);
 *  - global per-minute and per-day caps inside the database, which no number of IPs gets around.
 *
 * Env: DATABASE_URL, ALLOWED_ORIGINS (comma-separated), TURNSTILE_SECRET (optional).
 * Deployed with the Railway MCP; this file is the source of truth for the function's code.
 */
import { SQL } from "bun";

const sql = new SQL({ url: Bun.env.DATABASE_URL!, max: 4, idleTimeout: 20 });
const ALLOWED = new Set((Bun.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean));
const HOSTS = new Set([...ALLOWED].map((o) => new URL(o).hostname));
const TURNSTILE_SECRET = Bun.env.TURNSTILE_SECRET ?? "";
const STAGES = new Set(["peri", "meno", "post", "unsure"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Per IP: 5 sign-ups per 10 minutes. Kept in memory; the database caps are the backstop that survives restarts.
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 5;
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
// Drop idle IPs so the map can't grow without bound under a spread-out flood.
setInterval(() => {
  const now = Date.now();
  for (const [ip, ts] of hits) if (!ts.some((t) => now - t < WINDOW_MS)) hits.delete(ip);
}, 60_000);

async function humanVerified(token: unknown, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // not configured yet: other layers still apply
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, ...(ip ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(5000),
    });
    const out = (await res.json()) as { success?: boolean; hostname?: string; action?: string };
    return !!out.success && out.action === "waitlist" && (!out.hostname || HOSTS.has(out.hostname));
  } catch {
    return false; // fail closed: if Cloudflare can't vouch for the visitor, nothing is stored
  }
}

function cors(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const json = (status: number, body: unknown, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

Bun.serve({
  port: Number(Bun.env.PORT ?? 3000),
  maxRequestBodySize: 4096,
  async fetch(req) {
    const origin = req.headers.get("origin");
    const headers = cors(origin);
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/health") return json(200, { ok: true }, {});
    if (req.method === "OPTIONS") return new Response(null, { status: origin && ALLOWED.has(origin) ? 204 : 403, headers });
    if (req.method !== "POST" || url.pathname !== "/") return json(404, { error: "not_found" }, headers);
    if (!origin || !ALLOWED.has(origin)) return json(403, { error: "origin_not_allowed" }, headers);

    // Railway's edge sets X-Real-IP to the connecting address; X-Forwarded-For is sender-controlled, so it is ignored.
    const ip = (req.headers.get("x-real-ip") ?? "").trim();
    if (limited(ip || "unknown")) return json(429, { error: "too_many_requests" }, headers);

    if (Number(req.headers.get("content-length") ?? 0) > 4096) return json(413, { error: "too_large" }, headers);
    let body: { email?: unknown; stage?: unknown; token?: unknown; company?: unknown };
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "invalid_json" }, headers);
    }
    if (!body || typeof body !== "object") return json(400, { error: "invalid_json" }, headers);

    // Honeypot: a person never fills the hidden field. Say yes, store nothing, give a bot no signal.
    if (typeof body.company === "string" && body.company.trim()) return json(201, { ok: true }, headers);

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !EMAIL.test(email)) return json(400, { error: "invalid_email" }, headers);
    const stage = typeof body.stage === "string" && STAGES.has(body.stage) ? body.stage : null;

    if (!(await humanVerified(body.token, ip))) return json(403, { error: "verification_failed" }, headers);

    try {
      // Already on the list counts as success, so the form never reveals who has signed up.
      const [row] = await sql`SELECT waitlist_join(${email}, ${stage}) AS r`;
      if (row?.r === "busy") {
        console.warn("[waitlist] global cap reached; sign-up refused");
        return json(503, { error: "busy" }, { ...headers, "Retry-After": "60" });
      }
    } catch (err) {
      console.error("[waitlist] insert failed:", (err as Error).message);
      return json(500, { error: "server_error" }, headers);
    }
    return json(201, { ok: true }, headers);
  },
});

console.log(`[waitlist] listening; ${ALLOWED.size} allowed origin(s); turnstile ${TURNSTILE_SECRET ? "on" : "off"}`);
