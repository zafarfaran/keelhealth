/**
 * Waitlist receiver (Railway Function, Bun). The marketing site POSTs { email, stage? } here and it
 * is inserted into Neon as `waitlist_insert`, a role that can only INSERT into `waitlist`.
 *
 * Env: DATABASE_URL (Neon, waitlist_insert role), ALLOWED_ORIGINS (comma-separated site origins).
 * Deployed with the Railway MCP `create-function`; this file is the source of truth for that code.
 */
import { SQL } from "bun";

const sql = new SQL({ url: Bun.env.DATABASE_URL!, max: 2, idleTimeout: 20 });
const ALLOWED = new Set((Bun.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean));
const STAGES = new Set(["peri", "meno", "post", "unsure"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A light per-IP limit so the form can't be used to flood the table: 10 posts per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 10;
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear();
  return recent.length > LIMIT;
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
  async fetch(req) {
    const origin = req.headers.get("origin");
    const headers = cors(origin);
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/health") return json(200, { ok: true }, {});
    if (req.method === "OPTIONS") return new Response(null, { status: origin && ALLOWED.has(origin) ? 204 : 403, headers });
    if (req.method !== "POST" || url.pathname !== "/") return json(404, { error: "not_found" }, headers);
    if (!origin || !ALLOWED.has(origin)) return json(403, { error: "origin_not_allowed" }, headers);

    const ip = (req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
    if (limited(ip || "unknown")) return json(429, { error: "too_many_requests" }, headers);

    if (Number(req.headers.get("content-length") ?? 0) > 2048) return json(413, { error: "too_large" }, headers);
    let body: { email?: unknown; stage?: unknown };
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "invalid_json" }, headers);
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !EMAIL.test(email)) return json(400, { error: "invalid_email" }, headers);
    const stage = typeof body.stage === "string" && STAGES.has(body.stage) ? body.stage : null;

    try {
      // Already on the list counts as success, so the form never reveals who has signed up.
      await sql`INSERT INTO waitlist (email, stage, source) VALUES (${email}, ${stage}, 'website')
                ON CONFLICT DO NOTHING`;
    } catch (err) {
      console.error("[waitlist] insert failed:", (err as Error).message);
      return json(500, { error: "server_error" }, headers);
    }
    return json(201, { ok: true }, headers);
  },
});

console.log(`[waitlist] listening; ${ALLOWED.size} allowed origin(s)`);
