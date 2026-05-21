const DEG2RAD = Math.PI / 180;

// WGS84 / UTM Zone 23S parameters (matching ConverteMapaParaGrafo.c)
const A = 6378137.0;
const F = 1 / 298.257223563;
const K0 = 0.9996;
const LON0 = -45 * DEG2RAD;
const E2 = F * (2 - F);
const EP2 = E2 / (1 - E2);

export function latLonToUTM(lat: number, lon: number): { x: number; y: number } {
  const latR = lat * DEG2RAD;
  const lonR = lon * DEG2RAD;

  const N = A / Math.sqrt(1 - E2 * Math.sin(latR) ** 2);
  const T = Math.tan(latR) ** 2;
  const C = EP2 * Math.cos(latR) ** 2;
  const Av = Math.cos(latR) * (lonR - LON0);

  const e2 = E2;
  const M =
    A *
    ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * latR -
      ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * latR) +
      ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * latR) -
      ((35 * e2 ** 3) / 3072) * Math.sin(6 * latR));

  const easting =
    K0 *
      N *
      (Av +
        ((1 - T + C) * Av ** 3) / 6 +
        ((5 - 18 * T + T ** 2 + 72 * C - 58 * EP2) * Av ** 5) / 120) +
    500000;

  const northing =
    K0 *
    (M +
      N *
        Math.tan(latR) *
        (Av ** 2 / 2 +
          ((5 - T + 9 * C + 4 * C ** 2) * Av ** 4) / 24 +
          ((61 - 58 * T + T ** 2 + 600 * C - 330 * EP2) * Av ** 6) / 720));

  // Southern hemisphere offset
  const y = lat < 0 ? northing + 10_000_000 : northing;

  return { x: easting, y };
}

interface RawNode {
  id: string;
  x: number;
  y: number;
}

// Mirrors reduzirEscala() + Y-flip from ConverteMapaParaGrafo.c
export function normalizeCoords<T extends RawNode>(nodes: T[]): T[] {
  if (nodes.length === 0) return nodes;

  const minX = Math.min(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));

  const shifted = nodes.map(n => ({ ...n, x: (n.x - minX) / 2, y: (n.y - minY) / 2 }));

  const maxY = Math.max(...shifted.map(n => n.y));

  return shifted.map(n => ({ ...n, y: maxY - n.y }));
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * DEG2RAD;
  const dLon = (lon2 - lon1) * DEG2RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
