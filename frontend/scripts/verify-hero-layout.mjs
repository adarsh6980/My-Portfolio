import { readFile } from 'node:fs/promises';

const stylesheet = await readFile(new URL('../src/app/app.scss', import.meta.url), 'utf8');
const failures = [];

const nameLineRule = stylesheet.match(/\.hero-name-line\s*\{([^}]*)\}/s)?.[1] ?? '';
if (!/display:\s*flex\s*;/.test(nameLineRule) || !/flex-wrap:\s*wrap\s*;/.test(nameLineRule)) {
  failures.push('.hero-name-line must use a wrapping flex layout');
}

const nameRule = stylesheet.match(/\.hero-name\s*\{([^}]*)\}/s)?.[1] ?? '';
if (!/white-space:\s*nowrap\s*;/.test(nameRule)) {
  failures.push('.hero-name must keep the highlighted name and comma together');
}

const dashboardRule = stylesheet.match(/\.hero-dashboard\s*\{([^}]*)\}/s)?.[1] ?? '';
if (!/margin-top:\s*clamp\(1\.5rem,\s*4vh,\s*2\.5rem\)\s*;/.test(dashboardRule)) {
  failures.push('.hero-dashboard must include the approved desktop top margin');
}

const tabletMediaRule = stylesheet.match(/@media\s*\(max-width:\s*980px\)\s*\{([\s\S]*?)(?=@media|$)/)?.[1] ?? '';
const responsiveDashboardRule = tabletMediaRule.match(/\.hero-dashboard\s*\{([^}]*)\}/s)?.[1] ?? '';
if (!/margin-top:\s*\.9rem\s*;/.test(responsiveDashboardRule)) {
  failures.push('.hero-dashboard must use the compact tablet/mobile top margin');
}

if (failures.length > 0) {
  console.error(`Hero layout verification failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Hero layout verification passed.');
