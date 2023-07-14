## 坐标转换
> 来自 [https://github.com/wandergis/coordtransform](https://github.com/wandergis/coordtransform)

一个现代的、支持 TypeScript 的百度坐标（BD09）、火星坐标（GCJ02）、和WGS84坐标系相互转换。

### 安装

```bash
npm install @isvend/coord-transform
```

### 使用

```js
import {
  transformWGS84ToBD09,
  transformBD09ToGCJ02,
  transformBD09ToWGS84,
  transformGCJ02ToWGS84,
  transformWGS84ToGCJ02,
} from "@isvend/coord-transform";

const lng = 116.404;
const lat = 39.915;

console.log("WGS84 to GCJ02", transformWGS84ToGCJ02(lng, lat));
console.log("GCJ02 to WGS84", transformGCJ02ToWGS84(lng, lat));

console.log("WGS84 to BD09", transformWGS84ToBD09(lng, lat));
console.log("BD09 to WGS84", transformBD09ToWGS84(lng, lat));

console.log("BD09 to GCJ02", transformBD09ToGCJ02(lng, lat));
console.log("GCJ02 to BD09", transformBD09ToGCJ02(lng, lat));

```
