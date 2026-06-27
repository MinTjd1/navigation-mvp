import type { Address } from '../types';

export interface OSRMRouteResult {
  geometry: [number, number][];
  totalDistance: number;
  legDistances: number[];
}

export async function getOSRMDistanceMatrix(addresses: Address[]): Promise<number[][] | null> {
  const coords = addresses.map(a => `${a.lng},${a.lat}`).join(';');

  try {
    const res = await fetch(
      `https://router.project-osrm.org/table/v1/driving/${coords}?annotations=distance`
    );
    const data = await res.json();

    if (data.code === 'Ok' && data.distances) {
      return data.distances.map((row: (number | null)[]) =>
        row.map((d: number | null) => (d != null ? d / 1000 : Infinity))
      );
    }
  } catch {
    // fall through
  }

  return null;
}

export async function getOSRMRoute(addresses: Address[]): Promise<OSRMRouteResult | null> {
  const coords = addresses.map(a => `${a.lng},${a.lat}`).join(';');

  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    if (data.code === 'Ok' && data.routes.length > 0) {
      const route = data.routes[0];
      const geometry: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      );
      return {
        geometry,
        totalDistance: route.distance / 1000,
        legDistances: route.legs.map((leg: { distance: number }) => leg.distance / 1000),
      };
    }
  } catch {
    // fall through
  }

  return null;
}
