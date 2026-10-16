import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const sandbox = { window: {}, URL };
vm.runInNewContext(await readFile(new URL("../amap-import.js", import.meta.url), "utf8"), sandbox);
const { parseShare, safeAmapUrl, parseCoordinatePair } = sandbox.window.DFM_AMAP_IMPORT;

const shared = parseShare("水为财·糟粕醋火锅(承翰·湾尚国际庭玺店)\n¥107/人·糟粕醋火锅\n承翰湾尚国际北门旁\nhttps://surl.amap.com/jisCiw61m1fi");
assert.equal(shared.name, "水为财·糟粕醋火锅(承翰·湾尚国际庭玺店)");
assert.equal(shared.price, 107);
assert.equal(shared.category, "糟粕醋火锅");
assert.equal(shared.address, "承翰湾尚国际北门旁");
assert.equal(shared.needsLocation, true);
assert.equal(shared.lng, null);

const point = parseShare("https://uri.amap.com/marker?position=113.884,22.555&name=测试店&address=深圳市宝安区测试路18号");
assert.equal(point.name, "测试店");
assert.equal(point.lng, 113.884);
assert.equal(point.lat, 22.555);
assert.equal(point.coordinateSystem, "gcj02");
assert.equal(point.needsLocation, false);

const gps = parseShare("https://uri.amap.com/marker?position=113.884,22.555&coordinate=wgs84");
assert.equal(gps.coordinateSystem, "wgs84");
const marker = parseShare("https://uri.amap.com/marker?markers=113.884,22.555,测试店");
assert.equal(marker.name, "测试店");
const query = parseShare("https://m.amap.com/?q=22.555,113.884,测试店");
assert.equal(query.lng, 113.884);
assert.equal(query.lat, 22.555);
const nested = parseShare("https://m.amap.com/?amapexchange=" + encodeURIComponent("/marker?position=113.884,22.555&name=测试店"));
assert.equal(nested.name, "测试店");
assert.equal(nested.lng, 113.884);

assert.equal(safeAmapUrl("javascript:alert(1)"), "");
assert.equal(safeAmapUrl("https://amap.com.evil.example/marker"), "");
assert.equal(safeAmapUrl("https://amap.com@evil.example/marker"), "");
assert.equal(safeAmapUrl("https://user:password@amap.com/"), "");
assert.equal(parseCoordinatePair("181,22"), null);
assert.equal(parseCoordinatePair("113.884,91"), null);
assert.throws(() => parseShare("https://example.com/?position=113,22"));
assert.throws(() => parseShare("https://uri.amap.com/marker?position=200,200"));
assert.throws(() => parseShare("https://uri.amap.com/marker?markers=113,22,一店|114,23,二店"));
assert.throws(() => parseShare("https://uri.amap.com/marker?position=113,22&coordinate=bd09"));
console.log("AMap parser: share text, coordinates, coordinate systems, short links, and unsafe input checks passed.");
