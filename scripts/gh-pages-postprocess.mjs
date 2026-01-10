import fs from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.join(process.cwd(), "dist");
const BASE_PATH = (process.env.GH_PAGES_BASE_PATH || "/gram-price-compare-app").replace(/\/+$/, "");

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function patchHtml(html) {
  // Convert absolute asset URLs emitted by expo export to work under GitHub Pages subpath.
  // Example: "/_expo/..." -> "/gram-price-compare-app/_expo/..."
  // Also patch favicon.
  return html
    .replaceAll('href="/_expo/', `href="${BASE_PATH}/_expo/`)
    .replaceAll('src="/_expo/', `src="${BASE_PATH}/_expo/`)
    .replaceAll('href="/favicon.ico"', `href="${BASE_PATH}/favicon.ico"`)
    .replaceAll('src="/favicon.ico"', `src="${BASE_PATH}/favicon.ico"`);
}

async function main() {
  if (!(await fileExists(DIST_DIR))) {
    throw new Error(`dist directory not found at: ${DIST_DIR}`);
  }

  const allFiles = await walk(DIST_DIR);
  const htmlFiles = allFiles.filter((p) => p.toLowerCase().endsWith(".html"));

  for (const htmlPath of htmlFiles) {
    const before = await fs.readFile(htmlPath, "utf8");
    const after = patchHtml(before);
    if (after !== before) {
      await fs.writeFile(htmlPath, after, "utf8");
    }
  }

  // GitHub Pages serves 404.html for unknown routes. Copy index.html so the app can boot and handle routing.
  const indexPath = path.join(DIST_DIR, "index.html");
  const notFoundPath = path.join(DIST_DIR, "404.html");
  if (await fileExists(indexPath)) {
    await fs.copyFile(indexPath, notFoundPath);
  }

  console.log(`[gh-pages-postprocess] Patched ${htmlFiles.length} HTML files with BASE_PATH=${BASE_PATH}`);
}

await main();

