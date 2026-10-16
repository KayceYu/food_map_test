(function () {
  "use strict";

  function safeAmapUrl(value) {
    try {
      const url = new URL(String(value || "").trim());
      const isAmapHost = /(^|\.)(amap|gaode)\.com$/i.test(url.hostname);
      if (!isAmapHost || !["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port) return "";
      url.protocol = "https:";
      return url.href;
    } catch (_) {
      return "";
    }
  }

  function parseCoordinatePair(value, latitudeFirst = false) {
    const match = String(value || "").trim().match(/^(-?\d+(?:\.\d+)?)\s*[,，]\s*(-?\d+(?:\.\d+)?)(?:\s*[,，](.+))?$/);
    if (!match) return null;
    let lng = Number(match[latitudeFirst ? 2 : 1]);
    let lat = Number(match[latitudeFirst ? 1 : 2]);
    if (Math.abs(lng) <= 90 && Math.abs(lat) > 90) [lng, lat] = [lat, lng];
    if (Math.abs(lng) > 180 || Math.abs(lat) > 90) return null;
    return { lng, lat, name: (match[3] || "").trim() };
  }

  function parseShare(input) {
    const text = String(input || "").trim();
    if (!text) throw new Error("请先粘贴高德链接或分享文本。");
    const rawUrl = text.match(/https?:\/\/[^\s<>"“”《》]+/i)?.[0]?.replace(/[。；;，\]】]+$/, "");
    const amapUrl = safeAmapUrl(rawUrl);
    if (!amapUrl) throw new Error("未找到有效的高德地图链接，请复制店铺的完整分享内容。");
    const url = new URL(amapUrl);
    let params = url.searchParams;
    // Mobile share links sometimes wrap the original place URL in amapexchange.
    const nested = params.get("amapexchange");
    if (nested) {
      try {
        const nestedUrl = new URL(nested, "https://m.amap.com");
        if (safeAmapUrl(nestedUrl.href)) params = nestedUrl.searchParams;
      } catch (_) { /* Keep the outer URL's parameters. */ }
    }

    const markerValue = params.get("markers");
    if (markerValue?.includes("|")) throw new Error("这个链接包含多个地点，请分别分享并导入单个店铺。");
    const positionValue = params.get("position") || params.get("location") || markerValue;
    let position = positionValue ? parseCoordinatePair(positionValue) : null;
    if (positionValue && !position && !/^[A-Z0-9]+$/i.test(positionValue)) {
      throw new Error("链接里的坐标格式不正确，请检查经度和纬度。");
    }
    if (!position && params.has("lng") && params.has("lat")) {
      position = parseCoordinatePair(`${params.get("lng")},${params.get("lat")}`);
      if (!position) throw new Error("链接里的坐标超出有效范围。");
    }
    if (!position && params.has("q")) position = parseCoordinatePair(params.get("q"), true);
    const coordinate = (params.get("coordinate") || "gaode").toLowerCase();
    if (position && !["gaode", "gcj02", "wgs84"].includes(coordinate)) {
      throw new Error("暂不支持这个链接的坐标系，请使用高德地图分享链接。");
    }

    const lines = text.replace(rawUrl, "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const priceLineIndex = lines.findIndex((line) => /[¥￥]\s*\d|\d+(?:\.\d+)?\s*元?\s*\/人/.test(line));
    const priceLine = priceLineIndex >= 0 ? lines[priceLineIndex] : "";
    const priceMatch = priceLine.match(/[¥￥]\s*(\d+(?:\.\d+)?)/) || priceLine.match(/(\d+(?:\.\d+)?)\s*元?\s*\/人/);
    const categoryMatch = priceLine.match(/人\s*[·•|｜]\s*(.+)$/);
    const nameLine = lines.find((line, index) => index !== priceLineIndex && !/^(?:地址|位置|人均)\s*[:：]/.test(line));
    const explicitAddress = lines.find((line) => /^(?:地址|位置)\s*[:：]/.test(line));
    const addressLine = explicitAddress
      ? explicitAddress.replace(/^(?:地址|位置)\s*[:：]\s*/, "")
      : (priceLineIndex >= 0 ? lines[priceLineIndex + 1] || "" : "");
    return {
      amapUrl,
      name: (params.get("name") || params.get("poiname") || position?.name || nameLine || "").slice(0, 80),
      address: (params.get("address") || params.get("addr") || addressLine).slice(0, 180),
      category: (categoryMatch?.[1] || "").trim().slice(0, 30),
      price: priceMatch ? Number(priceMatch[1]) : null,
      lng: position?.lng ?? null,
      lat: position?.lat ?? null,
      coordinateSystem: coordinate === "wgs84" ? "wgs84" : "gcj02",
      needsLocation: !position
    };
  }

  window.DFM_AMAP_IMPORT = Object.freeze({ safeAmapUrl, parseCoordinatePair, parseShare });
})();
