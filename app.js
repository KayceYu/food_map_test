(function () {
  "use strict";

  const config = window.DELICIOUS_FOOD_MAP_CONFIG || {};

  const fallbackPlaces = [
    {
      name: "阿娘面馆",
      category: "本帮面馆",
      address: "上海市黄浦区思南路36号",
      city: "上海",
      lng: 121.46894,
      lat: 31.21475,
      rating: 4.7,
      price: 42,
      dish: "黄鱼煨面、蟹粉拌面",
      note: "汤头鲜而不腻，黄鱼拆得干净。午市会排队，早点去更从容。"
    },
    {
      name: "光明邨大酒家",
      category: "上海点心",
      address: "上海市黄浦区淮海中路588号",
      city: "上海",
      lng: 121.47016,
      lat: 31.22164,
      rating: 4.6,
      price: 58,
      dish: "鲜肉月饼、酱鸭",
      note: "老字号的扎实味道。现烤鲜肉月饼趁热吃，酥皮会在手里掉渣。"
    },
    {
      name: "兰心餐厅",
      category: "本帮菜",
      address: "上海市黄浦区进贤路130号",
      city: "上海",
      lng: 121.46477,
      lat: 31.22289,
      rating: 4.8,
      price: 112,
      dish: "红烧肉、草头圈子",
      note: "店不大，锅气足。浓油赤酱拿捏得很稳，适合三四个人多点几道。"
    },
    {
      name: "耳光馄饨",
      category: "馄饨小吃",
      address: "上海市黄浦区肇周路209号",
      city: "上海",
      lng: 121.48326,
      lat: 31.21095,
      rating: 4.5,
      price: 31,
      dish: "冷馄饨、炸猪排",
      note: "花生酱拌得浓郁，馄饨皮韧，配一块蘸辣酱油的炸猪排刚刚好。"
    },
    {
      name: "大壶春",
      category: "生煎锅贴",
      address: "上海市黄浦区四川中路136号",
      city: "上海",
      lng: 121.48918,
      lat: 31.23646,
      rating: 4.6,
      price: 34,
      dish: "鲜肉生煎、咖喱牛肉汤",
      note: "清水派生煎，发面厚实、底壳脆。第一口先开窗，别被热汤烫到。"
    },
    {
      name: "佳家汤包",
      category: "汤包点心",
      address: "上海市黄浦区黄河路90号",
      city: "上海",
      lng: 121.46553,
      lat: 31.23552,
      rating: 4.7,
      price: 48,
      dish: "纯鲜肉汤包、蟹粉汤包",
      note: "皮薄汤多，鲜肉款最能吃出基本功。轻轻提、慢慢移，先吸汤再吃。"
    },
    {
      name: "老吉士酒家",
      category: "本帮菜",
      address: "上海市徐汇区天平路41号",
      city: "上海",
      lng: 121.44492,
      lat: 31.20492,
      rating: 4.8,
      price: 238,
      dish: "葱油拌面、红烧肉",
      note: "精致但不失家常气，菜量不大，适合想安静吃顿传统本帮菜的晚上。"
    },
    {
      name: "富春小笼",
      category: "汤包点心",
      address: "上海市静安区愚园路650号",
      city: "上海",
      lng: 121.43783,
      lat: 31.22637,
      rating: 4.4,
      price: 39,
      dish: "鲜肉小笼、开洋葱油面",
      note: "社区里的老派点心店，一笼小笼配一碗葱油面，就是很踏实的一餐。"
    }
  ];

  const aliases = {
    name: ["name", "title", "shopname", "restaurant", "storename", "餐厅名称", "店名", "商家名称", "门店名称", "餐厅", "店铺"],
    category: ["category", "type", "cuisine", "tag", "foodtype", "分类", "类型", "菜系", "品类", "标签", "风味"],
    address: ["address", "addr", "location", "place", "地址", "详细地址", "地点", "位置"],
    city: ["city", "城市", "所在城市", "地区"],
    lng: ["lng", "lon", "longitude", "x", "经度", "高德经度"],
    lat: ["lat", "latitude", "y", "纬度", "高德纬度"],
    coordinates: ["coordinates", "coordinate", "lnglat", "经纬度", "坐标", "定位"],
    rating: ["rating", "score", "stars", "评分", "星级", "推荐指数"],
    price: ["price", "average", "avgprice", "percapita", "cost", "价格", "人均", "人均价格", "消费"],
    dish: ["dish", "recommend", "recommended", "specialty", "推荐菜", "招牌菜", "必点", "推荐美食", "菜品"],
    note: ["note", "notes", "description", "reason", "comment", "review", "备注", "描述", "推荐理由", "评价", "点评", "攻略"],
    link: ["link", "url", "website", "链接", "详情链接", "大众点评"]
  };

  const categoryEmoji = [
    [/面|粉|米线/, "🍜"],
    [/咖啡|茶|饮/, "☕"],
    [/甜|糕|烘焙|面包/, "🍰"],
    [/火锅|锅/, "🍲"],
    [/烧烤|烤肉|串/, "🍢"],
    [/日料|寿司|日本/, "🍣"],
    [/韩|韩国/, "🥘"],
    [/川|辣|湘/, "🌶️"],
    [/小笼|汤包|包子|点心/, "🥟"],
    [/生煎|锅贴/, "🥠"],
    [/馄饨|抄手/, "🥣"],
    [/西餐|牛排/, "🍽️"],
    [/酒|吧/, "🍷"],
    [/海鲜|鱼/, "🐟"],
    [/粤|港|茶餐厅/, "🥢"]
  ];

  const state = {
    places: [],
    filtered: [],
    category: "全部",
    query: "",
    map: null,
    markers: new Map(),
    selectedId: null,
    favorites: loadFavorites(),
    toastTimer: null
  };

  const elements = {
    placeList: document.getElementById("placeList"),
    resultCount: document.getElementById("resultCount"),
    placeCount: document.getElementById("placeCount"),
    categoryCount: document.getElementById("categoryCount"),
    cityCount: document.getElementById("cityCount"),
    categoryFilters: document.getElementById("categoryFilters"),
    searchInput: document.getElementById("searchInput"),
    sourcePill: document.getElementById("sourcePill"),
    sourceLabel: document.getElementById("sourceLabel"),
    refreshButton: document.getElementById("refreshButton"),
    locateButton: document.getElementById("locateButton"),
    fitMapButton: document.getElementById("fitMapButton"),
    mapFallback: document.getElementById("mapFallback"),
    drawer: document.getElementById("detailDrawer"),
    drawerContent: document.getElementById("drawerContent"),
    drawerClose: document.getElementById("drawerClose"),
    scrim: document.getElementById("scrim"),
    toast: document.getElementById("toast")
  };

  function normalizeKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_\-—–·/\\()（）【】\[\]:：]+/g, "");
  }

  const normalizedAliases = Object.fromEntries(
    Object.entries(aliases).map(([key, values]) => [key, values.map(normalizeKey)])
  );

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function pick(row, field) {
    const keys = normalizedAliases[field];
    for (const [key, value] of Object.entries(row)) {
      const normalized = normalizeKey(key);
      if (keys.includes(normalized) && value !== "" && value != null) return value;
    }
    return "";
  }

  function parseNumber(value) {
    const match = String(value == null ? "" : value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  }

  function parseCoordinates(value) {
    const matches = String(value || "").match(/-?\d+(?:\.\d+)?/g);
    if (!matches || matches.length < 2) return [null, null];
    let first = Number(matches[0]);
    let second = Number(matches[1]);
    if (Math.abs(first) <= 90 && Math.abs(second) > 90) [first, second] = [second, first];
    return [first, second];
  }

  function deriveCity(address) {
    const text = String(address || "");
    const municipality = text.match(/^(北京市|上海市|天津市|重庆市)/);
    if (municipality) return municipality[1].replace("市", "");
    const match = text.match(/([^省自治区]{2,8})市/);
    return match ? match[1] : "未标注";
  }

  function emojiFor(category) {
    const found = categoryEmoji.find(([matcher]) => matcher.test(category));
    return found ? found[1] : "🍴";
  }

  function normalizePlace(row, index) {
    const name = String(pick(row, "name") || "").trim();
    if (!name) return null;

    const address = String(pick(row, "address") || "").trim();
    const coordinateValue = pick(row, "coordinates");
    let lng = parseNumber(pick(row, "lng"));
    let lat = parseNumber(pick(row, "lat"));
    if ((!lng || !lat) && coordinateValue) [lng, lat] = parseCoordinates(coordinateValue);

    const category = String(pick(row, "category") || "其他美味").trim();
    const rating = parseNumber(pick(row, "rating"));
    const price = parseNumber(pick(row, "price"));
    const city = String(pick(row, "city") || deriveCity(address)).trim();

    return {
      id: `sheet-${index}-${slug(name)}`,
      name,
      category,
      address: address || "地址待补充",
      city,
      lng: validLngLat(lng, lat) ? lng : null,
      lat: validLngLat(lng, lat) ? lat : null,
      rating: rating && rating <= 5 ? rating : null,
      price: price && price > 0 ? price : null,
      dish: String(pick(row, "dish") || "到店慢慢发现").trim(),
      note: String(pick(row, "note") || "来自共享美食清单的推荐。").trim(),
      link: String(pick(row, "link") || "").trim(),
      emoji: emojiFor(category),
      raw: row
    };
  }

  function validLngLat(lng, lat) {
    return Number.isFinite(lng) && Number.isFinite(lat) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90;
  }

  function gcj02ToWgs84(lng, lat) {
    if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) return [lng, lat];

    const transformLat = (x, y) => {
      let value = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
      value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
      value += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
      value += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
      return value;
    };
    const transformLng = (x, y) => {
      let value = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
      value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
      value += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
      value += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
      return value;
    };

    const earthRadius = 6378245;
    const eccentricity = 0.006693421622965943;
    const radLat = lat / 180 * Math.PI;
    let magic = Math.sin(radLat);
    magic = 1 - eccentricity * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    const latitudeDelta = transformLat(lng - 105, lat - 35) * 180
      / ((earthRadius * (1 - eccentricity)) / (magic * sqrtMagic) * Math.PI);
    const longitudeDelta = transformLng(lng - 105, lat - 35) * 180
      / (earthRadius / sqrtMagic * Math.cos(radLat) * Math.PI);
    return [lng * 2 - (lng + longitudeDelta), lat * 2 - (lat + latitudeDelta)];
  }

  function slug(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  }

  function loadFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem("dfm-favorites") || "[]"));
    } catch (_) {
      return new Set();
    }
  }

  function saveFavorites() {
    localStorage.setItem("dfm-favorites", JSON.stringify([...state.favorites]));
  }

  function tableToRows(table) {
    if (!table || !Array.isArray(table.rows) || !Array.isArray(table.cols)) return [];
    let headers = table.cols.map((col, index) => String(col.label || col.id || `column${index + 1}`).trim());
    let rows = table.rows.map((row) => {
      const result = {};
      (row.c || []).forEach((cell, index) => {
        const value = cell ? (cell.f != null ? cell.f : cell.v) : "";
        result[headers[index] || `column${index + 1}`] = value == null ? "" : value;
      });
      return result;
    });

    const labelsAreGeneric = headers.every((header) => /^column\d+$/.test(header));
    if (labelsAreGeneric && rows.length) {
      headers = Object.values(rows[0]).map((value, index) => String(value || `column${index + 1}`).trim());
      rows = rows.slice(1).map((row) => {
        const result = {};
        Object.values(row).forEach((value, index) => { result[headers[index]] = value; });
        return result;
      });
    }
    return rows;
  }

  function loadGoogleSheet() {
    return new Promise((resolve, reject) => {
      if (!config.sheetId) {
        reject(new Error("Missing Google Sheet ID"));
        return;
      }

      const callbackName = `__dfmSheet_${Date.now()}`;
      const script = document.createElement("script");
      const timeout = window.setTimeout(() => finish(new Error("Google Sheet request timed out")), 12000);

      function finish(error, value) {
        window.clearTimeout(timeout);
        delete window[callbackName];
        script.remove();
        error ? reject(error) : resolve(value);
      }

      window[callbackName] = (response) => {
        try {
          if (!response || !response.table) throw new Error("Unexpected Google Sheet response");
          const rows = tableToRows(response.table);
          const places = rows.map(normalizePlace).filter(Boolean);
          if (!places.length) throw new Error("No recognizable restaurant rows found");
          finish(null, places);
        } catch (error) {
          finish(error);
        }
      };

      script.onerror = () => finish(new Error("Could not load Google Sheet"));
      const params = new URLSearchParams({
        gid: String(config.sheetGid || "0"),
        headers: "1",
        tqx: `out:json;responseHandler:${callbackName}`,
        tq: "select *"
      });
      script.src = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(config.sheetId)}/gviz/tq?${params}`;
      document.head.appendChild(script);
    });
  }

  function initMap() {
    if (!window.L) throw new Error("Leaflet unavailable");
    const center = config.defaultCenter || [113.884, 22.555];
    const [centerLng, centerLat] = gcj02ToWgs84(Number(center[0]), Number(center[1]));
    state.map = L.map("map", { zoomControl: false }).setView(
      [centerLat, centerLng],
      Number(config.defaultZoom) || 12
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(state.map);
    L.control.zoom({ position: "topright" }).addTo(state.map);
    L.control.scale({ imperial: false }).addTo(state.map);
    elements.mapFallback.hidden = true;
  }

  function loadBundledPlaces() {
    const rows = window.DELICIOUS_FOOD_MAP_DATA;
    if (!Array.isArray(rows) || !rows.length) return null;
    const coordinateRows = Array.isArray(window.DELICIOUS_FOOD_MAP_COORDINATES)
      ? window.DELICIOUS_FOOD_MAP_COORDINATES
      : [];
    const coordinatesByName = new Map(coordinateRows.map((item) => [String(item.name || "").trim(), item]));
    return rows.map((place, index) => {
      const category = String(place.category || "其他美味").trim();
      const name = String(place.name || "").trim();
      const coordinates = coordinatesByName.get(name) || place;
      const lng = Number(coordinates.lng);
      const lat = Number(coordinates.lat);
      return {
        id: `csv-${index}-${slug(place.name)}`,
        name,
        category,
        address: String(place.address || "地址待补充").trim(),
        city: String(place.city || "深圳").trim(),
        lng: validLngLat(lng, lat) ? lng : null,
        lat: validLngLat(lng, lat) ? lat : null,
        locationPrecision: String(coordinates.precision || place.locationPrecision || "exact"),
        rating: Number.isFinite(Number(place.rating)) && Number(place.rating) > 0 ? Number(place.rating) : null,
        price: Number.isFinite(Number(place.price)) && Number(place.price) > 0 ? Number(place.price) : null,
        dish: String(place.dish || "到店慢慢发现").trim(),
        note: String(place.note || "来自深圳宝安美食推荐清单。").trim(),
        link: String(place.link || "").trim(),
        emoji: emojiFor(category),
        raw: place
      };
    }).filter((place) => place.name);
  }

  function setSourceStatus(type, text) {
    elements.sourcePill.classList.remove("is-live", "is-fallback");
    if (type) elements.sourcePill.classList.add(`is-${type}`);
    elements.sourceLabel.textContent = text;
  }

  function updateStats() {
    const categories = new Set(state.places.map((place) => place.category).filter(Boolean));
    const cities = new Set(state.places.map((place) => place.city).filter((city) => city && city !== "未标注"));
    elements.placeCount.textContent = state.places.length;
    elements.categoryCount.textContent = categories.size;
    elements.cityCount.textContent = cities.size || "—";
  }

  function renderFilters() {
    const counts = new Map();
    state.places.forEach((place) => counts.set(place.category, (counts.get(place.category) || 0) + 1));
    const categories = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
    elements.categoryFilters.innerHTML = ["全部", ...categories]
      .map((category) => {
        const count = category === "全部" ? state.places.length : counts.get(category);
        return `<button class="filter-chip ${state.category === category ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)} · ${count}</button>`;
      })
      .join("");
  }

  function applyFilters() {
    const query = state.query.toLowerCase().trim();
    state.filtered = state.places.filter((place) => {
      const matchesCategory = state.category === "全部" || place.category === state.category;
      const searchable = [place.name, place.category, place.address, place.city, place.dish, place.note].join(" ").toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
    renderList();
    renderMarkers();
  }

  function renderList() {
    elements.resultCount.textContent = `${state.filtered.length} 家`;
    if (!state.filtered.length) {
      elements.placeList.innerHTML = `
        <div class="empty-state">
          <span>🥢</span>
          <strong>没有找到这一口</strong>
          <p>换个关键词或风味试试看。</p>
        </div>`;
      return;
    }

    elements.placeList.innerHTML = state.filtered
      .map((place, index) => {
        const saved = state.favorites.has(place.id);
        return `
          <button class="place-card ${state.selectedId === place.id ? "is-active" : ""}" type="button" data-place-id="${escapeHtml(place.id)}">
            <span class="place-index" data-emoji="${escapeHtml(place.emoji)}">${String(index + 1).padStart(2, "0")}</span>
            <span class="place-info">
              <span class="place-meta">${escapeHtml(place.city)} · ${escapeHtml(place.category)}</span>
              <h3>${escapeHtml(place.name)}</h3>
              <span class="place-address">⌖ ${escapeHtml(place.address)}</span>
              <span class="place-dish">↳ ${escapeHtml(place.dish)}</span>
            </span>
            ${place.rating ? `<span class="place-card-rating">★ ${place.rating.toFixed(1)}</span>` : ""}
            <span class="favorite-mini ${saved ? "is-saved" : ""}" aria-label="${saved ? "取消收藏" : "收藏"}" data-favorite-id="${escapeHtml(place.id)}">${saved ? "♥" : "♡"}</span>
          </button>`;
      })
      .join("");
  }

  function renderMarkers() {
    if (!state.map || !window.L) return;
    state.markers.forEach((marker) => marker.remove());
    state.markers.clear();

    state.filtered.forEach((place, index) => {
      if (!validLngLat(place.lng, place.lat)) return;
      const [mapLng, mapLat] = gcj02ToWgs84(place.lng, place.lat);
      const markerHtml = `<div class="food-marker ${place.locationPrecision === "approximate" ? "is-approximate" : ""} ${state.selectedId === place.id ? "is-active" : ""}"><span>${index + 1}</span></div>`;
      const icon = L.divIcon({
        className: "food-marker-shell",
        html: markerHtml,
        iconSize: [34, 42],
        iconAnchor: [17, 39],
        popupAnchor: [0, -38]
      });
      const marker = L.marker([mapLat, mapLng], {
        icon,
        title: place.name,
        zIndexOffset: state.selectedId === place.id ? 120 : 100
      }).addTo(state.map);
      marker.on("click", () => selectPlace(place.id, true));
      state.markers.set(place.id, marker);
    });
  }

  function fitMap() {
    if (!state.map) return;
    const markers = [...state.markers.values()];
    if (markers.length > 1) {
      state.map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [60, 60], maxZoom: 14 });
    } else if (markers.length === 1) {
      state.map.setView(markers[0].getLatLng(), 15);
    }
  }

  function selectPlace(id, openDrawer) {
    const place = state.places.find((item) => item.id === id);
    if (!place) return;
    state.selectedId = id;
    renderList();
    renderMarkers();

    const marker = state.markers.get(place.id);
    if (state.map && marker) {
      state.map.setView(marker.getLatLng(), Math.max(state.map.getZoom(), 14));
      const info = `<div class="map-info"><h4>${escapeHtml(place.name)}</h4><p>${escapeHtml(place.dish)}</p></div>`;
      marker.bindPopup(info).openPopup();
    }
    if (openDrawer) showDrawer(place);
  }

  function showDrawer(place) {
    const saved = state.favorites.has(place.id);
    const destination = validLngLat(place.lng, place.lat)
      ? `https://uri.amap.com/marker?position=${place.lng},${place.lat}&name=${encodeURIComponent(place.name)}&src=delicious-food-map&coordinate=gaode&callnative=0`
      : `https://www.amap.com/search?query=${encodeURIComponent(`${place.name} ${place.address}`)}`;

    elements.drawerContent.innerHTML = `
      <div class="drawer-hero" aria-hidden="true">${escapeHtml(place.emoji)}</div>
      <span class="drawer-category">${escapeHtml(place.city)} · ${escapeHtml(place.category)}</span>
      <h2>${escapeHtml(place.name)}</h2>
      <div class="drawer-score">
        ${place.rating ? `★ ${place.rating.toFixed(1)} <small>/ 5.0</small>` : "来自共享美食清单"}
      </div>
      <div class="drawer-grid">
        <div class="drawer-stat"><span>人均消费</span><strong>${place.price ? `约 ¥${Math.round(place.price)}` : "清单未标注"}</strong></div>
        <div class="drawer-stat"><span>推荐风味</span><strong>${escapeHtml(place.category)}</strong></div>
      </div>
      <div class="drawer-section"><span>必点这一口</span><p>${escapeHtml(place.dish)}</p></div>
      <div class="drawer-section"><span>为什么值得去</span><p>${escapeHtml(place.note)}</p></div>
      <div class="drawer-section">
        <span>地址</span>
        <p>${escapeHtml(place.address)}</p>
        ${place.locationPrecision === "approximate" ? '<small class="location-precision">地图标记为附近参考位置，请以店铺地址为准。</small>' : ""}
      </div>
      <div class="drawer-actions">
        <button type="button" class="${saved ? "is-saved" : ""}" data-drawer-favorite="${escapeHtml(place.id)}">${saved ? "♥ 已收藏" : "♡ 收进口袋"}</button>
        <a href="${escapeHtml(place.link || destination)}" target="_blank" rel="noopener noreferrer">去高德导航 ↗</a>
      </div>`;

    elements.scrim.hidden = false;
    elements.drawer.classList.add("is-open");
    elements.drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    elements.drawer.classList.remove("is-open");
    elements.drawer.setAttribute("aria-hidden", "true");
    elements.scrim.hidden = true;
    document.body.style.overflow = "";
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast("已从口袋清单移除");
    } else {
      state.favorites.add(id);
      showToast("已收进口袋清单");
    }
    saveFavorites();
    renderList();
    const place = state.places.find((item) => item.id === id);
    if (place && elements.drawer.classList.contains("is-open")) showDrawer(place);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
  }

  function locateUser() {
    if (!state.map) {
      showToast("地图还没有准备好");
      return;
    }
    state.map.once("locationfound", () => showToast("已定位到你附近"));
    state.map.once("locationerror", () => showToast("暂时无法获取位置，请检查浏览器权限"));
    state.map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true, timeout: 8000 });
  }

  async function loadPlaces(showLoading) {
    if (showLoading) {
      elements.placeList.innerHTML = `<div class="list-loading"><span class="loader"></span><p>正在翻阅大家的美食清单…</p></div>`;
      setSourceStatus("", "正在读取清单");
    }
    const bundledPlaces = loadBundledPlaces();
    if (bundledPlaces) {
      state.places = bundledPlaces;
      setSourceStatus("live", `宝安 CSV · ${bundledPlaces.length} 家`);
    } else {
      try {
        state.places = await loadGoogleSheet();
        setSourceStatus("live", "Google Sheet 已同步");
      } catch (error) {
        console.warn("Using bundled demo data:", error);
        state.places = fallbackPlaces.map((place, index) => ({
          ...place,
          id: `demo-${index}-${slug(place.name)}`,
          emoji: emojiFor(place.category),
          link: ""
        }));
        setSourceStatus("fallback", "演示数据 · 表格暂不可用");
        showToast("共享表格暂不可用，已载入演示地点");
      }
    }
    updateStats();
    renderFilters();
    applyFilters();
  }

  function bindEvents() {
    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      applyFilters();
    });

    elements.categoryFilters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      renderFilters();
      applyFilters();
    });

    elements.placeList.addEventListener("click", (event) => {
      const favorite = event.target.closest("[data-favorite-id]");
      if (favorite) {
        event.stopPropagation();
        toggleFavorite(favorite.dataset.favoriteId);
        return;
      }
      const card = event.target.closest("[data-place-id]");
      if (card) selectPlace(card.dataset.placeId, true);
    });

    elements.drawerContent.addEventListener("click", (event) => {
      const favorite = event.target.closest("[data-drawer-favorite]");
      if (favorite) toggleFavorite(favorite.dataset.drawerFavorite);
    });

    elements.drawerClose.addEventListener("click", closeDrawer);
    elements.scrim.addEventListener("click", closeDrawer);
    elements.fitMapButton.addEventListener("click", fitMap);
    elements.locateButton.addEventListener("click", locateUser);
    elements.refreshButton.addEventListener("click", async () => {
      elements.refreshButton.querySelector("svg").style.animation = "spin .8s linear infinite";
      await loadPlaces(true);
      applyFilters();
      fitMap();
      elements.refreshButton.querySelector("svg").style.animation = "";
    });

    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        elements.searchInput.focus();
      }
      if (event.key === "Escape") closeDrawer();
    });
  }

  async function start() {
    bindEvents();
    const sheetPromise = loadPlaces(false);
    const mapPromise = Promise.resolve()
      .then(() => initMap())
      .catch((error) => {
        console.error(error);
        elements.mapFallback.hidden = false;
      });

    await Promise.allSettled([sheetPromise, mapPromise]);
    applyFilters();
    window.setTimeout(fitMap, 250);
  }

  start();
})();
