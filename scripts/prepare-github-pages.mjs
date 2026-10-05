#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist", "client");
const repository = (process.env.GITHUB_REPOSITORY ?? "2026-2-1team-industry-academia-capstone-design").split("/").at(-1);
if (!repository || !/^[a-zA-Z0-9._-]+$/.test(repository)) throw new Error("Invalid repository name");
const base = `/${repository}/`;

// Prefix emitted asset URLs, including the runtime's root-relative image paths.
// Source runtime files and the ordinary root-hosted build remain unchanged.
function rewrite(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) rewrite(file);
    else if (/\.(html|css|js)$/.test(entry.name)) {
      const source = readFileSync(file, "utf8");
      writeFileSync(file, source.replace(/(["'`(])\/assets\//g, `$1${base}assets/`));
    }
  }
}
rewrite(output);
writeFileSync(path.join(output, ".nojekyll"), "");
console.log(`Prepared GitHub Pages assets at ${base}`);
