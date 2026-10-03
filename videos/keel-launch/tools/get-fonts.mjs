// Download the latin woff2 for each Google Font family into assets/fonts.
// Usage: node videos/keel-launch/tools/get-fonts.mjs
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const FAMILIES = {
  'Fraunces-var': 'Fraunces:opsz,wght@9..144,600..900',
  'Anton': 'Anton',
  'GochiHand': 'Gochi+Hand',
  'BricolageGrotesque-var': 'Bricolage+Grotesque:opsz,wght@12..96,400..800',
};

for (const [name, fam] of Object.entries(FAMILIES)) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${fam}&display=swap`, { headers: { 'User-Agent': UA } })).text();
  const block = css.split('/* latin */')[1] ?? css;
  const url = block.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) { console.error(`no url for ${name}`); continue; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(resolve(out, `${name}.woff2`), buf);
  console.log(`${name}.woff2 ${buf.length} bytes`);
}
