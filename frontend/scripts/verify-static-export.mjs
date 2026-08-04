import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const exportDirectory = resolve("out");
const indexPath = resolve(exportDirectory, "index.html");
const assetDirectory = resolve(exportDirectory, "_next", "static");

const failures = [];

try {
  await access(indexPath, constants.R_OK);
} catch {
  failures.push("out/index.html is missing");
}

try {
  await access(assetDirectory, constants.R_OK);
} catch {
  failures.push("out/_next/static is missing");
}

if (failures.length === 0) {
  const indexHtml = await readFile(indexPath, "utf8");
  if (!indexHtml.includes("/_next/static/")) {
    failures.push("out/index.html does not reference the exported Next.js assets");
  }
  if (!/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/i.test(indexHtml)) {
    failures.push("out/index.html does not contain the inline hydration payload");
  }
}

if (failures.length > 0) {
  console.error(`Static export verification failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Static Next.js export is ready for the ASP.NET static-file host.");
