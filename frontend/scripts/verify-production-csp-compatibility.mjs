import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const indexUrl = new URL('../dist/frontend/browser/index.html', import.meta.url);
const indexHtml = await readFile(indexUrl, 'utf8');
const executableMarkup = indexHtml.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/giu, '');
const stylesheetLinks = [...executableMarkup.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/giu)].map(
  ([link]) => link,
);

if (stylesheetLinks.length === 0) {
  throw new Error(`No executable stylesheet link was found in ${fileURLToPath(indexUrl)}.`);
}

const incompatibleLink = stylesheetLinks.find(
  (link) => /\bmedia=["']print["']/iu.test(link) || /\bonload\s*=/iu.test(link),
);

if (incompatibleLink) {
  throw new Error(
    `Production stylesheet loading depends on inline script execution and is incompatible with the strict CSP: ${incompatibleLink}`,
  );
}

console.log('Production stylesheet loading is compatible with the strict script CSP.');
