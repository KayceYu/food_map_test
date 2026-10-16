# Community place submissions

Each JSON file in this directory represents one community-added place. The site build validates the required `name`, `category`, and `address` fields, then combines all submissions into the public map data.

The website's “同步到公开仓库” option opens GitHub's authenticated file editor with a submission pre-filled. Repository owners can commit directly; other GitHub users can propose the file through a fork and pull request.

The “高德导入” button accepts AMap share text and URLs. Links containing coordinates place a marker automatically. Short links prefill any name, category, price and address present in the share text; confirm their position by clicking the preview map or entering AMap longitude and latitude before saving. No AMap API credentials are needed for this import flow.

Imported records preserve `lng`, `lat`, `coordinateSystem` (`gcj02` for AMap coordinates, `wgs84` for positions picked on the map), `locationPrecision`, and `amapUrl` when saved locally or proposed to this directory. The site converts GCJ-02 coordinates for its map display and preserves the original coordinate system in AMap navigation links.
