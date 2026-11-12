// Dependency-free static smoke test for Growth's concept landing.
// Usage: node scripts/check-landing.mjs
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const js = readFileSync(join(root, 'assets/scripts/vision.js'), 'utf8');
const css = readFileSync(join(root, 'assets/styles/vision.css'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Page must have exactly one h1');

for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(match[1]), 'Missing local anchor: ' + match[1]);
}
for (const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
  assert(existsSync(join(root, match[1])), 'Missing asset: ' + match[1]);
}
for (const key of ['data-ws-breadcrumb','data-ws-title','data-ws-insight','data-chat-question','data-chat-answer','data-chat-scopes','data-chat-evidence']) {
  assert(html.includes(key), 'Missing interactive element: ' + key);
}
assert(html.includes('role="tablist"') && html.includes('role="tabpanel"'), 'Accessible workspace tabs expected');
assert(html.includes('aria-pressed='), 'Prompt controls must expose pressed state');
assert(html.includes('Visión de producto') && html.includes('datos ficticios'), 'Vision and fictional-data disclosures expected');
assert(js.includes('prefers-reduced-motion'), 'Reduced-motion fallback expected');
assert(css.includes('prefers-reduced-motion:reduce'), 'Reduced-motion CSS expected');
assert(!/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\s*\(/.test(js), 'Demo should not access network or browser storage');
assert(existsSync(join(root, 'privacy/index.html')), 'Privacy policy must remain reachable');
console.log('Growth vision landing: static checks passed.');
