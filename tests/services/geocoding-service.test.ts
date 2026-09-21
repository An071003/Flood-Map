import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalGeocodingProvider } from '../../src/services/geocoding/local-provider';
import { NominatimGeocodingProvider } from '../../src/services/geocoding/nominatim-provider';
import { HybridGeocodingService } from '../../src/services/geocoding/hybrid-geocoder';

describe('V6 Geocoding Architecture & Providers', () => {
  describe('LocalGeocodingProvider', () => {
    const local = new LocalGeocodingProvider();

    it('returns known curated landmarks with poi match quality', async () => {
      const results = await local.search('Bến Thành');
      expect(results.length).toBeGreaterThan(0);
      const benThanh = results.find((r) => r.label.includes('Bến Thành'));
      expect(benThanh).toBeDefined();
      expect(benThanh!.type).toBe('poi');
      expect(benThanh!.routableNodeId).toBeDefined();
    });

    it('parses dynamic address and alley patterns accurately', async () => {
      const addrResults = await local.search('123 Nguyễn Hữu Cảnh');
      expect(addrResults.length).toBeGreaterThan(0);
      expect(addrResults[0].matchQuality).toBe('approximate');
      expect(addrResults[0].type).toBe('address');

      const alleyResults = await local.search('123/45 Nguyễn Xí');
      expect(alleyResults.length).toBeGreaterThan(0);
      expect(alleyResults[0].matchQuality).toBe('approximate');
      expect(alleyResults[0].type).toBe('alley');
    });

    it('respects limit option', async () => {
      const results = await local.search('đường', { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe('NominatimGeocodingProvider', () => {
    const provider = new NominatimGeocodingProvider();

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('handles network failure or offline state gracefully without throwing', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
      const results = await provider.search('Bệnh viện Chợ Rẫy');
      expect(results).toEqual([]);
    });

    it('normalizes external Nominatim items into standard SearchPlace objects', async () => {
      const mockOsmResponse = [
        {
          place_id: 123456,
          lon: '106.6605',
          lat: '10.7578',
          display_name: 'Bệnh viện Chợ Rẫy, 201B, Đường Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
          class: 'amenity',
          type: 'hospital',
          name: 'Bệnh viện Chợ Rẫy',
          address: {
            road: 'Đường Nguyễn Chí Thanh',
            house_number: '201B',
            suburb: 'Phường 12',
            city_district: 'Quận 5',
          },
        },
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockOsmResponse,
      } as Response);

      const results = await provider.search('Bệnh viện Chợ Rẫy');
      expect(results.length).toBe(1);
      const place = results[0];
      expect(place.id).toBe('osm-123456');
      expect(place.type).toBe('address');
      expect(place.matchQuality).toBe('exact');
      expect(place.source).toBe('osm-nominatim');
      expect(place.routableSegmentId).toBeDefined();
      expect(place.routableNodeId).toBeDefined();
      expect(place.lng).toBe(106.6605);
      expect(place.lat).toBe(10.7578);
    });

    it('filters out places outside the HCMC bounding box', async () => {
      const outsideOsmResponse = [
        {
          place_id: 999999,
          lon: '105.85', // Hanoi longitude
          lat: '21.02',  // Hanoi latitude
          display_name: 'Hồ Hoàn Kiếm, Hà Nội',
          class: 'tourism',
          type: 'attraction',
        },
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => outsideOsmResponse,
      } as Response);

      const results = await provider.search('Hồ Hoàn Kiếm');
      expect(results).toEqual([]);
    });
  });

  describe('HybridGeocodingService', () => {
    it('provides unified singleton and attribution statement', () => {
      const hybrid1 = HybridGeocodingService.getInstance();
      const hybrid2 = HybridGeocodingService.getInstance();
      expect(hybrid1).toBe(hybrid2);
      expect(hybrid1.getAttribution()).toContain('OpenStreetMap');
    });

    it('prioritizes exact local prefix matches over distant external results', async () => {
      const hybrid = HybridGeocodingService.getInstance();
      const results = await hybrid.search('Chợ Bến Thành');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].label).toContain('Bến Thành');
      expect(results[0].source).toContain('curated');
    });
  });
});
