import { SearchPlace } from '../../types';

export interface GeocodeOptions {
  limit?: number;
  bounds?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  signal?: AbortSignal;
}

export interface GeocodingProvider {
  readonly name: string;
  search(query: string, options?: GeocodeOptions): Promise<SearchPlace[]>;
  reverse?(lng: number, lat: number, options?: GeocodeOptions): Promise<SearchPlace | null>;
}
