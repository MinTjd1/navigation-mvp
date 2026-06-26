import type { Address, RouteResult } from '../types';

export function floydWarshall(distanceMatrix: number[][]): { dist: number[][]; next: number[][] } {
  const n = distanceMatrix.length;
  const dist = distanceMatrix.map(row => [...row]);
  const next: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (dist[i][j] === Infinity ? -1 : j))
  );

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  return { dist, next };
}

function reconstructPath(next: number[][], from: number, to: number): number[] {
  if (next[from][to] === -1) return [];
  const path = [from];
  let current = from;
  while (current !== to) {
    current = next[current][to];
    if (current === -1) return [];
    path.push(current);
  }
  return path;
}

function nearestNeighborOrder(dist: number[][], start: number): number[] {
  const n = dist.length;
  const visited = new Set<number>([start]);
  const order = [start];
  let current = start;

  while (visited.size < n) {
    let nearest = -1;
    let minDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && dist[current][i] < minDist) {
        minDist = dist[current][i];
        nearest = i;
      }
    }
    if (nearest === -1) break;
    visited.add(nearest);
    order.push(nearest);
    current = nearest;
  }

  return order;
}

export function optimizeRoute(addresses: Address[], distanceMatrix: number[][]): RouteResult {
  const { dist, next } = floydWarshall(distanceMatrix);
  const visitOrder = nearestNeighborOrder(dist, 0);

  const orderedAddresses = visitOrder.map(i => addresses[i]);

  let totalDistance = 0;
  const path: number[][] = [];
  for (let i = 0; i < visitOrder.length - 1; i++) {
    const segmentPath = reconstructPath(next, visitOrder[i], visitOrder[i + 1]);
    path.push(segmentPath);
    totalDistance += dist[visitOrder[i]][visitOrder[i + 1]];
  }

  return {
    orderedAddresses,
    totalDistance,
    distanceMatrix: dist,
    path,
  };
}

export function buildDistanceMatrix(addresses: Address[]): number[][] {
  const n = addresses.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        matrix[i][j] = haversineDistance(
          addresses[i].lat, addresses[i].lng,
          addresses[j].lat, addresses[j].lng
        );
      }
    }
  }

  return matrix;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
