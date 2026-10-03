// Generate a batch of drawings in three styles, paced for the 5-images-per-minute limit.
// Usage: node videos/keel-launch/tools/gen-batch.mjs
// Skips files that already exist, so it can be re-run safely.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = readFileSync(resolve(root, '.env'), 'utf8').match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
const MODEL = 'gpt-image-2.5-flare';
const HER = 'the same woman throughout: early 50s, soft brown bob with a few grey streaks, ordinary natural body, modest everyday clothes';

const STYLES = {
  a: (s) => `Paper cut-out collage illustration made entirely from torn and cut paper shapes: ${s}. Palette of warm almond beige, terracotta, dusty rose, honey yellow, sage green and cream paper, deep brown for small details. Visible paper fibre texture, white torn edges, soft drop shadows between paper layers, simplified bold shapes, editorial magazine style. Plain warm off-white paper background with generous empty space. No text, no letters.`,
  c: (s) => `Loose hand sketch from a personal journal, brown fineliner ink with quick marker colouring in terracotta, honey yellow, dusty rose and sage that goes slightly outside the lines: ${s}. Casual, warm, human, like a doodle in a diary. Pure white background, no paper texture, generous empty space. No text, no letters.`,
  d: (s) => `Minimal continuous single-line drawing made from one unbroken dark brown line of even weight: ${s}. Elegant, sparse, very few details, no fill, no shading, pure white background, generous empty space. No text, no letters.`,
};

const SUBJECTS = [
  ['02-phone', '1024x1024', 'a hand holding a smartphone whose screen shows a lean young athletic woman in her twenties mid-jump in sportswear'],
  ['03-breakfast', '1024x1024', 'a small modest breakfast: one slice of toast on a small plate and a cup of coffee'],
  ['04a-night', '1024x1024', `${HER}, lying awake in bed at night staring at the ceiling, duvet pushed down, a glass of water on the bedside table`],
  ['04b-stairs', '1024x1024', `${HER}, pausing halfway up a flight of house stairs, one hand on the banister and the other on her knee, a little tired`],
  ['04c-desk', '1024x1024', `${HER}, at a desk with a laptop, fingers pressed to her temple, foggy and tired, a mug beside her`],
  ['06-plate', '1024x1024', 'a dinner plate seen from directly above with a salmon fillet, a scoop of rice and green beans, a fork beside the plate'],
  ['08-sofa', '1024x1536', `${HER}, sitting comfortably on a sofa with her feet tucked up, reading her phone with a calm small smile, a mug on a side table`],
  ['09-squat', '1024x1536', `${HER}, in a t-shirt and leggings doing a goblet squat at home, holding one dumbbell at her chest with both hands, focused and steady`],
  ['10-fridge', '1024x1536', 'an open fridge seen from the front, door open, shelves holding chicken thighs, a bag of spinach, a block of feta, a box of eggs and a pot of yoghurt'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gen(prompt, size, out) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, size, n: 1 }),
    });
    const json = await res.json();
    if (res.ok && json.data?.[0]?.b64_json) {
      writeFileSync(out, Buffer.from(json.data[0].b64_json, 'base64'));
      return true;
    }
    const msg = json.error?.message ?? res.status;
    console.log(`  retry ${attempt} for ${out}: ${String(msg).slice(0, 90)}`);
    await sleep(15000);
  }
  return false;
}

for (const dir of Object.keys(STYLES)) {
  const outDir = resolve(root, 'directions', 'art', dir);
  mkdirSync(outDir, { recursive: true });
  for (const [name, size, subject] of SUBJECTS) {
    const out = resolve(outDir, `${name}.png`);
    if (existsSync(out)) continue;
    const t0 = Date.now();
    const ok = await gen(STYLES[dir](subject), size, out);
    console.log(`${ok ? 'wrote' : 'FAILED'} ${dir}/${name}.png`);
    const wait = 13000 - (Date.now() - t0);
    if (wait > 0) await sleep(wait);
  }
}
console.log('batch done');
