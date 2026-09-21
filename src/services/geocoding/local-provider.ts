import { GeocodingProvider, GeocodeOptions } from './types';
import { SearchPlace } from '../../types';
import { searchPlaces } from '../geodata/hcmc-places-database';

export class LocalGeocodingProvider implements GeocodingProvider {
  readonly name = 'local-curated';

  async search(query: string, options?: GeocodeOptions): Promise<SearchPlace[]> {
    const results = searchPlaces(query);
    if (options?.limit && options.limit > 0) {
      return results.slice(0, options.limit);
    }
    return results;
  }
}
