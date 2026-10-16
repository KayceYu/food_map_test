import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "amap-import.js",
  "config.js",
  "data/places.js",
  "data/coordinates.js",
  "data/community-places.js",
  "vendor/leaflet.css",
  "vendor/leaflet.js",
  "vendor/LEAFLET-LICENSE.txt"
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await mkdir(resolve(out, "data"), { recursive: true });
await mkdir(resolve(out, "vendor"), { recursive: true });
await Promise.all(files.map((file) => cp(resolve(root, file), resolve(out, file))));

const submissionsDirectory = resolve(root, "data", "community-submissions");
let submissionFiles = [];
try {
  submissionFiles = (await readdir(submissionsDirectory)).filter((file) => file.endsWith(".json")).sort();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const communityPlaces = [];
for (const file of submissionFiles) {
  const place = JSON.parse(await readFile(resolve(submissionsDirectory, file), "utf8"));
  if (!place.name || !place.category || !place.address) {
    throw new Error(`Community submission ${file} is missing a required field`);
  }
  communityPlaces.push(place);
}
await writeFile(
  resolve(out, "data", "community-places.js"),
  `window.DELICIOUS_FOOD_MAP_COMMUNITY = ${JSON.stringify(communityPlaces, null, 2)};\n`,
  "utf8"
);

console.log(`Built ${files.length} files and ${communityPlaces.length} community places into ${out}`);
