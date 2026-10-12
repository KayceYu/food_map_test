import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "styles.css",
  "app.js",
  "config.js",
  "server.js",
  "data/places.js",
  "data/coordinates.js",
  "data/community-places.js",
  "vendor/leaflet.css",
  "vendor/leaflet.js",
  "vendor/LEAFLET-LICENSE.txt"
];
const contents = Object.fromEntries(
  await Promise.all(required.map(async (file) => [file, await readFile(resolve(root, file), "utf8")]))
);

const dataSandbox = { window: {} };
vm.runInNewContext(contents["data/places.js"], dataSandbox);
vm.runInNewContext(contents["data/coordinates.js"], dataSandbox);
vm.runInNewContext(contents["data/community-places.js"], dataSandbox);
const bundledPlaces = dataSandbox.window.DELICIOUS_FOOD_MAP_DATA;
const bundledCoordinates = dataSandbox.window.DELICIOUS_FOOD_MAP_COORDINATES;
const communityPlaces = dataSandbox.window.DELICIOUS_FOOD_MAP_COMMUNITY;
const validCoordinates = bundledCoordinates?.every((place) => (
  Number.isFinite(place.lng) && Number.isFinite(place.lat)
  && place.lng >= 113.7 && place.lng <= 114.7
  && place.lat >= 22.4 && place.lat <= 23
));

const checks = [
  ["index references the stylesheet", contents["index.html"].includes("./styles.css")],
  ["index references the application", contents["index.html"].includes("./app.js")],
  ["index references bundled coordinates", contents["index.html"].includes("./data/coordinates.js")],
  ["index references community places", contents["index.html"].includes("./data/community-places.js")],
  ["index loads config before the application", contents["index.html"].indexOf("./config.js") < contents["index.html"].indexOf("./app.js")],
  ["public config contains no AMap credentials", !/amapKey|amapSecurityCode/.test(contents["config.js"])],
  ["Google Sheet is configured", /sheetId:\s*"[^"]{20,}"/.test(contents["config.js"])],
  ["Google Visualization loader is present", contents["app.js"].includes("/gviz/tq")],
  ["local Leaflet assets are loaded", contents["index.html"].includes("./vendor/leaflet.js") && contents["index.html"].includes("./vendor/leaflet.css")],
  ["runtime has no unpkg dependency", !contents["index.html"].includes("unpkg.com")],
  ["OpenStreetMap tile layer is present", contents["app.js"].includes("tile.openstreetmap.org")],
  ["application contains no AMap API loader", !contents["app.js"].includes("webapi.amap.com/maps")],
  ["bundled CSV dataset contains 45 places", Array.isArray(bundledPlaces) && bundledPlaces.length === 45],
  ["bundled places have names and addresses", bundledPlaces.every((place) => place.name && place.address)],
  ["all 45 places have validated map coordinates", Array.isArray(bundledCoordinates) && bundledCoordinates.length === 45 && validCoordinates],
  ["coordinate names match place names", bundledPlaces.every((place, index) => place.name === bundledCoordinates[index]?.name)],
  ["community dataset is a valid array", Array.isArray(communityPlaces)],
  ["bundled dataset contains no mobile phone numbers", !/1[3-9]\d{9}/.test(contents["data/places.js"])]
];

let failed = false;
for (const [label, passed] of checks) {
  console.log(`${passed ? "✓" : "✗"} ${label}`);
  if (!passed) failed = true;
}

if (failed) process.exitCode = 1;
else console.log(`All ${checks.length} project checks passed.`);
