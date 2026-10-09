# 好味地图 · Delicious Food Map

一个可直接运行的高德地图美食探索应用。项目参考
[dhbxs/DeliciousFoodMap-Web](https://github.com/dhbxs/DeliciousFoodMap-Web) 的核心产品方向，使用提供的高德 Web JS API 配置，并把指定 Google Sheet 作为实时数据源。

## 已实现

- 高德地图、标记点、定位、自动缩放与高德导航
- Google Sheets 免后端实时读取（Visualization JSONP，避免浏览器 CORS 限制）
- 中英文表头自动识别；只有地址时会用高德地理编码补全坐标
- 关键词搜索、风味筛选、地点详情、收藏（本地保存）
- 桌面和移动端响应式布局
- 表格不可访问时自动切换到内置演示地点
- 零第三方构建依赖的本地开发服务器和静态构建脚本

## 本地运行

需要 Node.js 18 或更高版本。

首次克隆后，复制示例配置并填入自己的高德凭据和 Google Sheet 信息：

```bash
cp config.example.js config.js
```

`config.js` 包含本地凭据，已被 `.gitignore` 排除，不会上传到 GitHub。

```bash
npm run check
npm run dev
```

然后打开 <http://127.0.0.1:5173>。

生成可部署的静态目录：

```bash
npm run build
```

构建结果位于 `dist/`，可以部署到任意静态网站服务。

## Google Sheet 字段

应用会自动识别常见中英文表头。推荐使用以下字段：

| 必需 | 推荐表头 | 说明 |
| --- | --- | --- |
| 是 | 店名 / name | 地点名称 |
| 建议 | 分类 / category | 菜系或风味 |
| 建议 | 地址 / address | 没有经纬度时用于地理编码 |
| 可选 | 经度 / lng | 高德坐标系经度 |
| 可选 | 纬度 / lat | 高德坐标系纬度 |
| 可选 | 城市 / city | 城市统计与搜索 |
| 可选 | 评分 / rating | 0–5 分 |
| 可选 | 人均 / price | 数字即可 |
| 可选 | 推荐菜 / dish | 必点菜品 |
| 可选 | 推荐理由 / note | 地点描述 |
| 可选 | 链接 / link | 自定义详情链接 |

当前数据源配置在 `config.js`。Google Sheet 需要设置为“知道链接的任何人可查看”，否则应用会使用内置演示数据。

## 高德配置注意事项

高德 Web JS API Key 通常需要配置域名白名单。开发时请允许 `localhost` / `127.0.0.1`，上线时再加入正式域名。浏览器应用中的 Key 与安全密钥会随前端资源下发，因此应同时依赖高德控制台中的域名白名单限制滥用。

配置项位于 `config.js`：

```js
window.DELICIOUS_FOOD_MAP_CONFIG = {
  amapKey: "...",
  amapSecurityCode: "...",
  sheetId: "...",
  sheetGid: "..."
};
```

## 部署

运行 `npm run build` 后，将 `dist/` 作为静态站点根目录部署即可。由于使用高德 Web JS API 和 Google Sheets，部署站点需要能够通过 HTTPS 访问这两个服务。
