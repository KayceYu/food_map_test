import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html", "styles.css", "app.js", "config.js", "server.js"];
const contents = Object.fromEntries(
  await Promise.all(required.map(async (file) => [file, await readFile(resolve(root, file), "utf8")]))
);

const checks = [
  ["index references the stylesheet", contents["index.html"].includes("./styles.css")],
  ["index references the application", contents["index.html"].includes("./app.js")],
  ["index loads config before the application", contents["index.html"].indexOf("./config.js") < contents["index.html"].indexOf("./app.js")],
  ["AMap key is configured", /amapKey:\s*"[^"]{8,}"/.test(contents["config.js"])],
  ["AMap security code is configured", /amapSecurityCode:\s*"[^"]{8,}"/.test(contents["config.js"])],
  ["Google Sheet is configured", /sheetId:\s*"[^"]{20,}"/.test(contents["config.js"])],
  ["Google Visualization loader is present", contents["app.js"].includes("/gviz/tq")],
  ["AMap loader is present", contents["app.js"].includes("webapi.amap.com/maps")]
];

let failed = false;
for (const [label, passed] of checks) {
  console.log(`${passed ? "✓" : "✗"} ${label}`);
  if (!passed) failed = true;
}

if (failed) process.exitCode = 1;
else console.log(`All ${checks.length} project checks passed.`);
