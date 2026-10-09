# 好味地图 · Delicious Food Map

一个可直接运行的美食探索应用。项目参考
[dhbxs/DeliciousFoodMap-Web](https://github.com/dhbxs/DeliciousFoodMap-Web) 的核心产品方向，使用 Leaflet 与 OpenStreetMap 显示地图，并把指定 Google Sheet 作为实时数据源。

## 已实现

- 无密钥地图、标记点、定位、自动缩放与高德导航
- Google Sheets 免后端实时读取（Visualization JSONP，避免浏览器 CORS 限制）
- 内置 45 条深圳宝安美食推荐，来源于用户提供的 CSV；无需访问私有表格也能显示清单
- 45 条地点均已写入地图坐标；精确门店直接标注，流动摊位或描述模糊的地点以虚线标记附近参考位置
- 中英文表头自动识别，并支持表格中的经纬度字段
- 关键词搜索、风味筛选、地点详情、收藏（本地保存）
- 桌面和移动端响应式布局
- 表格不可访问时自动切换到内置演示地点
- 零第三方构建依赖的本地开发服务器和静态构建脚本

## 本地运行

需要 Node.js 18 或更高版本。

`config.js` 只包含公开的表格编号与默认地图中心，不保存 API Key 或其他密钥。

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
| 建议 | 地址 / address | 用于列表展示和导航搜索 |
| 可选 | 经度 / lng | 高德坐标系经度 |
| 可选 | 纬度 / lat | 高德坐标系纬度 |
| 可选 | 城市 / city | 城市统计与搜索 |
| 可选 | 评分 / rating | 0–5 分 |
| 可选 | 人均 / price | 数字即可 |
| 可选 | 推荐菜 / dish | 必点菜品 |
| 可选 | 推荐理由 / note | 地点描述 |
| 可选 | 链接 / link | 自定义详情链接 |

Google Sheet 配置位于 `config.js`，可作为后续同步来源。若要直接读取该表格，需要将其设置为“知道链接的任何人可查看”。

仓库中的 `data/places.js` 是当前地图的优先数据源，`data/coordinates.js` 保存对应地图坐标。两者包含从《深圳美食推荐 - 宝安区》CSV 清理后的 45 条地点记录。表格分值已换算为 5 分制，价格区间取中间值，缺失值保持为空；原表中的个人联系方式不会发布。

## 地图与坐标

地图底图来自 OpenStreetMap，通过 Leaflet 渲染，不需要高德 Key。原始门店坐标为高德 GCJ-02 坐标，应用在显示到 OpenStreetMap 前会转换为 WGS-84；“去高德导航”仍使用原始坐标，不需要调用高德 Web JS API。

公开配置位于 `config.js`：

```js
window.DELICIOUS_FOOD_MAP_CONFIG = {
  sheetId: "...",
  sheetGid: "..."
};
```

## 部署

运行 `npm run build` 后，将 `dist/` 作为静态站点根目录部署即可。仓库中的 GitHub Actions 流程会在每次推送到 `main` 后自动构建并发布 GitHub Pages，不需要配置任何地图密钥。
