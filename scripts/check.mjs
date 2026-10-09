import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html", "styles.css", "app.js", "config.js", "server.js", "data/places.js"];
const contents = Object.fromEntries(
  await Promise.all(required.map(async (file) => [file, await readFile(resolve(root, file), "utf8")]))
);

const dataSandbox = { window: {} };
vm.runInNewContext(contents["data/places.js"], dataSandbox);
const bundledPlaces = dataSandbox.window.DELICIOUS_FOOD_MAP_DATA;

const checks = [
  ["index references the stylesheet", contents["index.html"].includes("./styles.css")],
  ["index references the application", contents["index.html"].includes("./app.js")],
  ["index loads config before the application", contents["index.html"].indexOf("./config.js") < contents["index.html"].indexOf("./app.js")],
  ["AMap key is configured", /amapKey:\s*"[^"]{8,}"/.test(contents["config.js"])],
  ["AMap security code is configured", /amapSecurityCode:\s*"[^"]{8,}"/.test(contents["config.js"])],
  ["Google Sheet is configured", /sheetId:\s*"[^"]{20,}"/.test(contents["config.js"])],
  ["Google Visualization loader is present", contents["app.js"].includes("/gviz/tq")],
  ["AMap loader is present", contents["app.js"].includes("webapi.amap.com/maps")],
  ["bundled CSV dataset contains 45 places", Array.isArray(bundledPlaces) && bundledPlaces.length === 45],
  ["bundled places have names and addresses", bundledPlaces.every((place) => place.name && place.address)],
  ["bundled dataset contains no mobile phone numbers", !/1[3-9]\d{9}/.test(contents["data/places.js"])]
];

let failed = false;
for (const [label, passed] of checks) {
  console.log(`${passed ? "✓" : "✗"} ${label}`);
  if (!passed) failed = true;
}

if (failed) process.exitCode = 1;
else console.log(`All ${checks.length} project checks passed.`);
