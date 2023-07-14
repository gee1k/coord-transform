const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param {number} bd_lon
 * @param {number} bd_lat
 * @returns {[number, number]} GCJ-02 坐标：[经度，纬度]
 */
export const transformBD09ToGCJ02 = (bd_lon: number, bd_lat: number): [number, number] => {
  let x = bd_lon - 0.0065;
  let y = bd_lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  let gg_lng = z * Math.cos(theta);
  let gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
};

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param {number} lng
 * @param {number} lat
 * @returns {[number, number]}  BD-09 坐标：[经度，纬度]
 */
let transformGCJ02ToBD09 = (lng: number, lat: number): [number, number] => {
  let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  let bd_lng = z * Math.cos(theta) + 0.0065;
  let bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat];
};

/**
 * WGS84 转 GCj02
 * @param {number} lng
 * @param {number} lat
 * @returns {[number, number]} GCj02 坐标：[经度，纬度]
 */
export const transformWGS84ToGCJ02 = (lng: number, lat: number): [number, number] => {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dLat = _transformLat(lng - 105.0, lat - 35.0);
    let dLng = _transformLng(lng - 105.0, lat - 35.0);
    let radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
    dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
    let mgLat = lat + dLat;
    let mgLng = lng + dLng;
    return [mgLng, mgLat];
  }
};

/**
 * GCJ02 转换为 WGS84
 * @param {number} lng
 * @param {number} lat
 * @returns {[number, number]} WGS84 坐标：[经度，纬度]
 */
export const transformGCJ02ToWGS84 = (lng: number, lat: number): [number, number] => {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dLat = _transformLat(lng - 105.0, lat - 35.0);
    let dLng = _transformLng(lng - 105.0, lat - 35.0);
    let radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
    dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
    let mgLat = lat + dLat;
    let mgLng = lng + dLng;
    return [lng * 2 - mgLng, lat * 2 - mgLat];
  }
};

/**
 * 百度坐标BD09 转 WGS84
 *
 * @param lng 经度
 * @param lat 纬度
 * @return {[]} WGS84 坐标：[经度，纬度]
 */
export const transformBD09ToWGS84 = (lng: number, lat: number): [number, number] => {
  let lngLat = transformBD09ToGCJ02(lng, lat);
  return transformGCJ02ToWGS84(lngLat[0], lngLat[1]);
};

/**
 * WGS84 转 百度坐标BD09
 *
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @return {[number, number]} BD09 坐标：[经度，纬度]
 */
export const transformWGS84ToBD09 = (lng: number, lat: number): [number, number] => {
  let lngLat = transformWGS84ToGCJ02(lng, lat);

  return transformGCJ02ToBD09(lngLat[0], lngLat[1]);
};

const _transformLat = (lng: number, lat: number): number => {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
};

const _transformLng = (lng: number, lat: number): number => {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
};

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param {number} lng
 * @param {number} lat
 * @returns {boolean}
 */
export const outOfChina = (lng: number, lat: number): boolean => {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
};
