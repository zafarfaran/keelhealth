// Real-time resize test over the Chrome DevTools Protocol (no virtual time, no hidden tab).
// Usage: npm run build, serve out/ (e.g. npx serve out), then: node scripts/resize-test.mjs http://localhost:3000/
// Loads at 1440x900, resizes to a 390x844 phone and back, and prints whether every line hand-off
// point matches what a fresh load at that size would build. Screenshots go to .perf/.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const url = process.argv[2] ?? "http://localhost:3000/";
const out = fileURLToPath(new URL("../.perf/", import.meta.url));
mkdirSync(out, { recursive: true });
const chrome = spawn(process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--remote-debugging-port=9333", "--hide-scrollbars",
  `--user-data-dir=${out}chrome-profile`, "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 40 && !ws; i++) {
  await sleep(250);
  try {
    const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
    ws = new WebSocket(t.webSocketDebuggerUrl);
  } catch {}
}
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? m.error); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.value;
const size = (width, height, mobile) => send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(out + name, Buffer.from(r.data, "base64")); };

const STATE = `(() => {
  const d = document, last = (s) => [...d.querySelectorAll(s)].pop()?.getAttribute('d') ?? '';
  const vw = d.getElementById('facts').clientWidth, phone = innerWidth < 860;
  const fc = d.querySelector('#facts .fcols').getBoundingClientRect().left;
  const facts = last('#facts .fline path.pen'), day = last('#day .fline path.pen');
  const startX = (p) => +p.split(' ')[1];
  const endX = (p) => { const n = p.trim().split(' '); return +n[n.length - 2]; };
  return {
    viewport: innerWidth + 'x' + innerHeight,
    factsStartX: startX(facts), factsStartExpected: phone ? 6 : Math.max(10, fc - 44),
    factsExitX: endX(facts), factsExitExpected: phone ? 3 * vw - 8 : null,
    dayExitX: endX(day), dayExitExpected: phone ? 3 * vw + 6 : startX(day),
    pageStroke: d.querySelector('#line path').getAttribute('stroke-width'), pageStrokeExpected: phone ? '4.5' : '7',
    heroVideo: d.querySelector('#hero video').currentSrc ? 'loaded' : 'none',
  };
})()`;

await send("Page.enable");
await size(1440, 900, false);
await send("Page.navigate", { url });
await sleep(5000);
const results = { desktop: await evaluate(STATE) };
await size(390, 844, true);
await sleep(2500);
results.afterShrinkToPhone = await evaluate(STATE);
await evaluate(`(() => { const f = document.getElementById('facts'); scrollTo(0, f.offsetTop + (f.offsetHeight - innerHeight) * 0.3); })()`);
await sleep(2500);
await shot("resize-phone-facts.png");
await size(1440, 900, false);
await sleep(2500);
results.afterGrowToDesktop = await evaluate(STATE);
await evaluate(`(() => { const f = document.getElementById('facts'); scrollTo(0, f.offsetTop + (f.offsetHeight - innerHeight) * 0.9); })()`);
await sleep(2500);
await shot("resize-desktop-facts.png");
console.log(JSON.stringify(results, null, 1));
ws.close();
chrome.kill();
process.exit(0);
