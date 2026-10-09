import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");
const files = ["index.html", "styles.css", "app.js", "config.js", "data/places.js", "data/coordinates.js"];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await mkdir(resolve(out, "data"), { recursive: true });
await Promise.all(files.map((file) => cp(resolve(root, file), resolve(out, file))));

console.log(`Built ${files.length} files into ${out}`);
