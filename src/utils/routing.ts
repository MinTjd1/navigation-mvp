import type { Address } from '../types';

export interface RouteStep {
  instruction: string;
  icon: string;
  roadName: string;
  distance: number;
  duration: number;
  location: [number, number];
}

export interface OSRMRouteResult {
  geometry: [number, number][];
  totalDistance: number;
  legDistances: number[];
  legSteps: RouteStep[][];
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

function formatManeuver(type: string, modifier: string | undefined, road: string): { icon: string; instruction: string } {
  const r = road || '도로';
  switch (type) {
    case 'depart':
      return { icon: '🚗', instruction: `${r}에서 출발` };
    case 'arrive':
      return { icon: '🏁', instruction: '목적지 도착' };
    case 'turn':
      if (modifier === 'left') return { icon: '⬅️', instruction: `좌회전 → ${r}` };
      if (modifier === 'right') return { icon: '➡️', instruction: `우회전 → ${r}` };
      if (modifier === 'sharp left') return { icon: '↰', instruction: `크게 좌회전 → ${r}` };
      if (modifier === 'sharp right') return { icon: '↱', instruction: `크게 우회전 → ${r}` };
      if (modifier === 'slight left') return { icon: '↖️', instruction: `살짝 좌회전 → ${r}` };
      if (modifier === 'slight right') return { icon: '↗️', instruction: `살짝 우회전 → ${r}` };
      if (modifier === 'uturn') return { icon: '🔄', instruction: 'U턴' };
      return { icon: '↕️', instruction: `회전 → ${r}` };
    case 'new name':
    case 'continue':
      if (modifier === 'straight') return { icon: '⬆️', instruction: `직진 → ${r}` };
      if (modifier === 'slight left') return { icon: '↖️', instruction: `살짝 좌회전 → ${r}` };
      if (modifier === 'slight right') return { icon: '↗️', instruction: `살짝 우회전 → ${r}` };
      if (modifier === 'left') return { icon: '⬅️', instruction: `좌회전 → ${r}` };
      if (modifier === 'right') return { icon: '➡️', instruction: `우회전 → ${r}` };
      return { icon: '⬆️', instruction: `직진 → ${r}` };
    case 'merge':
      return { icon: '🔀', instruction: `합류 → ${r}` };
    case 'on ramp':
    case 'ramp':
      if (modifier?.includes('left')) return { icon: '↖️', instruction: `좌측 진입로 → ${r}` };
      return { icon: '↗️', instruction: `우측 진입로 → ${r}` };
    case 'off ramp':
      if (modifier?.includes('left')) return { icon: '↙️', instruction: `좌측 출구 → ${r}` };
      return { icon: '↘️', instruction: `우측 출구 → ${r}` };
    case 'fork':
      if (modifier?.includes('left')) return { icon: '↖️', instruction: `좌측 분기 → ${r}` };
      return { icon: '↗️', instruction: `우측 분기 → ${r}` };
    case 'end of road':
      if (modifier === 'left') return { icon: '⬅️', instruction: `도로 끝에서 좌회전 → ${r}` };
      return { icon: '➡️', instruction: `도로 끝에서 우회전 → ${r}` };
    case 'roundabout':
    case 'rotary':
      return { icon: '🔄', instruction: `로터리 → ${r}` };
    default:
      return { icon: '⬆️', instruction: `${r} 방면 진행` };
  }
}

export async function getOSRMRoute(addresses: Address[]): Promise<OSRMRouteResult | null> {
  const coords = addresses.map(a => `${a.lng},${a.lat}`).join(';');

  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`
    );
    const data = await res.json();

    if (data.code === 'Ok' && data.routes.length > 0) {
      const route = data.routes[0];
      const geometry: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      );

      const legSteps: RouteStep[][] = route.legs.map((leg: {
        distance: number;
        steps: {
          maneuver: { type: string; modifier?: string; location: [number, number] };
          name: string;
          distance: number;
          duration: number;
        }[];
      }) =>
        leg.steps.map((step: {
          maneuver: { type: string; modifier?: string; location: [number, number] };
          name: string;
          distance: number;
          duration: number;
        }) => {
          const { type, modifier } = step.maneuver;
          const { icon, instruction } = formatManeuver(type, modifier, step.name);
          return {
            instruction,
            icon,
            roadName: step.name || '이름 없는 도로',
            distance: step.distance,
            duration: step.duration,
            location: [step.maneuver.location[1], step.maneuver.location[0]] as [number, number],
          };
        })
      );

      return {
        geometry,
        totalDistance: route.distance / 1000,
        legDistances: route.legs.map((leg: { distance: number }) => leg.distance / 1000),
        legSteps,
      };
    }
  } catch {
    // fall through
  }

  return null;
}
