export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  userType?: 'driver' | 'general';
  isSubscribed?: boolean;
}

export interface Address {
  id: string;
  address: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface RouteResult {
  orderedAddresses: Address[];
  totalDistance: number;
  distanceMatrix: number[][];
  path: number[][];
}

export interface ScannedBarcode {
  raw: string;
  address: string;
  timestamp: number;
}
