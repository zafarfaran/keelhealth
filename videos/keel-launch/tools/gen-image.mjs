// Generate one line-art drawing with the OpenAI Images API.
// Usage: node tools/gen-image.mjs <model> <out.png> <size> "<subject>"
// Reads OPENAI_API_KEY from the project .env; never prints it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = readFileSync(resolve(root, '.env'), 'utf8');
const key = env.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) throw new Error('OPENAI_API_KEY missing from .env');

const [model, out, size = '1024x1536', subject] = process.argv.slice(2);
if (!subject) throw new Error('usage: gen-image.mjs <model> <out.png> <size> "<subject>"');

const STYLE =
  'Hand-drawn line illustration in the style of a clean storyboard sketch: ' +
  'confident single-weight dark brown ink lines (#3B322C), slightly loose and human, ' +
  'no fill, no shading, no hatching, no colour, no grey tones, pure white background, ' +
  'generous empty space around the subject, no text, no letters, no logos, no frame or border. ' +
  'Minimal, warm, observational, like an editorial picture book. ' +
  'Any women shown are ordinary real women in their 50s, natural bodies, modest everyday clothes, ' +
  'kind faces with simple dot eyes, not models, not glamorous. Subject: ';

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  // A subject starting with "RAW:" is sent as the whole prompt (no line-art style prefix).
  body: JSON.stringify({ model, prompt: subject.startsWith('RAW:') ? subject.slice(4).trim() : STYLE + subject, size, n: 1 }),
});
const json = await res.json();
if (!res.ok) {
  console.error(JSON.stringify(json.error ?? json));
  process.exit(1);
}
const b64 = json.data?.[0]?.b64_json;
if (!b64) {
  console.error('no image in response: ' + JSON.stringify(json).slice(0, 300));
  process.exit(1);
}
mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(out, Buffer.from(b64, 'base64'));
console.log(`wrote ${out}${json.usage ? ' ' + JSON.stringify(json.usage) : ''}`);
