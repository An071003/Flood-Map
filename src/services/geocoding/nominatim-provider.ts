import { GeocodingProvider, GeocodeOptions } from './types';
import { SearchPlace, SearchMatchQuality, SearchPlaceType } from '../../types';
import { snapCoordinatesToRoutableNetwork } from '../geodata/hcmc-places-database';

export const HCMC_BOUNDING_BOX: [number, number, number, number] = [
  106.35, // minLng
  10.37,  // minLat
  107.03, // maxLng
  11.16,  // maxLat
];

export class NominatimGeocodingProvider implements GeocodingProvider {
  readonly name = 'osm-nominatim';
  private lastRequestTime = 0;
  private readonly minIntervalMs = 300;

  async search(query: string, options?: GeocodeOptions): Promise<SearchPlace[]> {
    if (!query || query.trim().length < 2) return [];

    // Ensure we don't query if aborted
    if (options?.signal?.aborted) return [];

    // Simple client-side rate throttle
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.minIntervalMs) {
      await new Promise((res) => setTimeout(res, this.minIntervalMs - timeSinceLast));
    }
    this.lastRequestTime = Date.now();

    const limit = options?.limit || 5;
    const bounds = options?.bounds || HCMC_BOUNDING_BOX;
    // Nominatim viewbox format: <min_lon>,<max_lat>,<max_lon>,<min_lat>
    const viewbox = `${bounds[0]},${bounds[3]},${bounds[2]},${bounds[1]}`;
    const cleanQ = query.trim();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cleanQ
    )}&viewbox=${viewbox}&bounded=1&addressdetails=1&limit=${limit}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'vi,en;q=0.8',
        },
        signal: options?.signal,
      });

      if (!response.ok) {
        return [];
      }

      const rawItems = await response.json();
      if (!Array.isArray(rawItems)) return [];

      const places: SearchPlace[] = [];

      for (const item of rawItems) {
        const lng = parseFloat(item.lon);
        const lat = parseFloat(item.lat);

        if (isNaN(lng) || isNaN(lat)) continue;

        // Verify bounds
        if (lng < bounds[0] || lng > bounds[2] || lat < bounds[1] || lat > bounds[3]) {
          continue;
        }

        const addr = item.address || {};
        const houseNumber = addr.house_number;
        const street = addr.road || addr.pedestrian || addr.street;
        const district = addr.suburb || addr.city_district || addr.district || addr.county;
        const ward = addr.quarter || addr.subdivision || addr.ward;

        let type: SearchPlaceType = 'poi';
        let matchQuality: SearchMatchQuality = 'approximate';

        if (houseNumber) {
          type = 'address';
          matchQuality = 'exact';
        } else if (item.class === 'highway' || item.type === 'road') {
          type = 'road';
          matchQuality = 'street-level';
        } else if (item.class === 'amenity' || item.class === 'tourism' || item.class === 'shop' || item.class === 'leisure') {
          type = 'poi';
          matchQuality = 'poi';
        }

        // Clean label
        const primaryTitle = item.name || (houseNumber && street ? `${houseNumber} ${street}` : street) || item.display_name.split(',')[0];
        const secondary = item.display_name;

        const snap = snapCoordinatesToRoutableNetwork(lng, lat);

        places.push({
          id: `osm-${item.place_id}`,
          type,
          label: primaryTitle,
          name: primaryTitle,
          secondaryLabel: secondary,
          houseNumber,
          street,
          ward,
          district,
          lng,
          lat,
          matchQuality,
          source: 'osm-nominatim',
          routableNodeId: snap.nodeId,
          routableSegmentId: snap.segmentId,
          routableSnapDistanceMeters: snap.distanceMeters,
          isOutsideGraph: snap.distanceMeters > 50,
        });
      }

      return places;
    } catch {
      // Network error, abort, or offline -> graceful degradation to empty list
      return [];
    }
  }
}
