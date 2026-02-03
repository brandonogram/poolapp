export interface LatLng {
  lat: number;
  lng: number;
}

const cityAnchors: Array<{ match: string; lat: number; lng: number }> = [
  { match: 'Wilmington', lat: 39.7459, lng: -75.5466 },
  { match: 'Newark', lat: 39.6837, lng: -75.7497 },
  { match: 'Greenville', lat: 39.8043, lng: -75.5974 },
  { match: 'Rehoboth', lat: 38.7209, lng: -75.0760 },
  { match: 'Lewes', lat: 38.7743, lng: -75.1393 },
  { match: 'Dover', lat: 39.1582, lng: -75.5244 },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function deriveLatLng(address: string, city: string): LatLng {
  const base = cityAnchors.find(anchor =>
    city.toLowerCase().includes(anchor.match.toLowerCase())
  ) || { lat: 39.7459, lng: -75.5466 };

  const seed = hashString(`${address}-${city}`);
  const latOffset = ((seed % 1000) / 1000 - 0.5) * 0.04;
  const lngOffset = (((seed / 1000) % 1000) / 1000 - 0.5) * 0.05;

  return {
    lat: Number((base.lat + latOffset).toFixed(6)),
    lng: Number((base.lng + lngOffset).toFixed(6)),
  };
}
