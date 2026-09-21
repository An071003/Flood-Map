import { GeocodingProvider, GeocodeOptions } from './types';
import { LocalGeocodingProvider } from './local-provider';
import { NominatimGeocodingProvider } from './nominatim-provider';
import { SearchPlace } from '../../types';
import { normalizeVietnamese, stripVietnamesePrefixes } from '../geodata/hcmc-places-database';

export class HybridGeocodingService {
  private static instance: HybridGeocodingService;
  private localProvider: GeocodingProvider;
  private externalProvider: GeocodingProvider;

  private constructor() {
    this.localProvider = new LocalGeocodingProvider();
    this.externalProvider = new NominatimGeocodingProvider();
  }

  public static getInstance(): HybridGeocodingService {
    if (!HybridGeocodingService.instance) {
      HybridGeocodingService.instance = new HybridGeocodingService();
    }
    return HybridGeocodingService.instance;
  }

  /**
   * Hybrid search: queries local database first, then queries external provider if needed.
   * Merges, ranks, and deduplicates.
   */
  public async search(query: string, options?: GeocodeOptions): Promise<SearchPlace[]> {
    if (!query || !query.trim()) {
      return this.localProvider.search('', options);
    }

    const cleanQuery = query.trim();
    const normalizedQuery = normalizeVietnamese(cleanQuery);
    const strippedQuery = stripVietnamesePrefixes(cleanQuery);

    // 1. Local results (curated POIs, major roads, dynamic address/alley parsing)
    const localResults = await this.localProvider.search(cleanQuery, options);

    // 2. Query external geocoder if query is long enough and not aborted
    let externalResults: SearchPlace[] = [];
    if (cleanQuery.length >= 3 && !options?.signal?.aborted) {
      try {
        externalResults = await this.externalProvider.search(cleanQuery, options);
      } catch {
        externalResults = [];
      }
    }

    // 3. Merge results with local taking precedence
    const merged: SearchPlace[] = [...localResults];

    for (const ext of externalResults) {
      // Check if duplicate with any existing local result
      const isDuplicate = merged.some((loc) => {
        const dLng = Math.abs(loc.lng - ext.lng);
        const dLat = Math.abs(loc.lat - ext.lat);
        const isNear = dLng < 0.0005 && dLat < 0.0005; // ~50m
        const sameName =
          normalizeVietnamese(loc.label) === normalizeVietnamese(ext.label) ||
          normalizeVietnamese(loc.name || '') === normalizeVietnamese(ext.name || '');
        return isNear || sameName;
      });

      if (!isDuplicate) {
        merged.push(ext);
      }
    }

    // 4. Rank results
    merged.sort((a, b) => {
      const aNorm = normalizeVietnamese(a.label);
      const bNorm = normalizeVietnamese(b.label);

      // Exact startsWith gets highest priority
      const aStarts =
        aNorm.startsWith(normalizedQuery) || (strippedQuery ? aNorm.startsWith(strippedQuery) : false);
      const bStarts =
        bNorm.startsWith(normalizedQuery) || (strippedQuery ? bNorm.startsWith(strippedQuery) : false);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Local/curated database preferred for same prefix tier
      const aIsLocal = a.source?.includes('curated') || a.source?.includes('osm-major');
      const bIsLocal = b.source?.includes('curated') || b.source?.includes('osm-major');
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;

      return 0;
    });

    const limit = options?.limit || 12;
    return merged.slice(0, limit);
  }

  public getAttribution(): string {
    return 'Dữ liệu: Cơ sở dữ liệu TP.HCM & Đóng góp từ OpenStreetMap';
  }
}
