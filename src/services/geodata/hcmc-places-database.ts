import {
  SearchPlace,
  SearchMatchQuality,
  RouteSnapResult,
  RouteSnapStatus,
} from '../../types';
import { HCMC_ROAD_NODES, HCMC_GRAPH_SEGMENTS } from './hcmc-graph-network';
import { MAJOR_HCMC_ROADS } from './hcmc-roads';

/**
 * Normalizes Vietnamese string by removing accents and lowercasing.
 * e.g., "Nguyễn Hữu Cảnh" -> "nguyen huu canh"
 */
export function normalizeVietnamese(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Strips common administrative prefixes so queries like "đường Nguyễn Hữu Cảnh" match "Nguyễn Hữu Cảnh".
 */
export function stripVietnamesePrefixes(str: string): string {
  return str
    .replace(/^(đường|duong|phố|pho|hẻm|hem|ngõ|ngo|đại lộ|dai lo|quốc lộ|quoc lo|xa lộ|xa lo)\s+/i, '')
    .replace(/^(quận|quan|q\.|phường|phuong|p\.|thành phố|thanh pho|tp\.|tp)\s+/i, '')
    .trim();
}

/**
 * Curated database of prominent HCMC locations, addresses, alleys, POIs, and intersections.
 */
const HCMC_RAW_CURATED_PLACES: Omit<SearchPlace, 'matchQuality'>[] = [
  // --- 1. POIs (Prominent landmarks) ---
  {
    id: 'poi-ben-thanh',
    type: 'poi',
    label: 'Chợ Bến Thành',
    street: 'Lê Lợi',
    ward: 'Bến Thành',
    district: 'Quận 1',
    lng: 106.6983,
    lat: 10.7725,
    routableNodeId: 'node-ben-thanh',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'poi-landmark-81',
    type: 'poi',
    label: 'Landmark 81 · Vinhomes Central Park',
    street: 'Nguyễn Hữu Cảnh',
    ward: 'Phường 22',
    district: 'Bình Thạnh',
    lng: 106.7218,
    lat: 10.795,
    routableNodeId: 'node-nhc-tan-cang',
    routableSnapDistanceMeters: 120,
    isOutsideGraph: true,
  },
  {
    id: 'poi-bach-dang',
    type: 'poi',
    label: 'Bến Bạch Đằng · Ga Tàu Thủy',
    street: 'Tôn Đức Thắng',
    ward: 'Bến Nghé',
    district: 'Quận 1',
    lng: 106.706,
    lat: 10.775,
    routableNodeId: 'node-bach-dang',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'poi-tan-son-nhat',
    type: 'poi',
    label: 'Sân bay Quốc tế Tân Sơn Nhất',
    street: 'Trường Sơn',
    ward: 'Phường 2',
    district: 'Tân Bình',
    lng: 106.6558,
    lat: 10.8185,
    routableNodeId: 'node-lang-cha-ca',
    routableSnapDistanceMeters: 240,
    isOutsideGraph: true,
  },
  {
    id: 'poi-thao-dien-pearl',
    type: 'poi',
    label: 'Thảo Điền Pearl',
    street: 'Quốc Hương',
    ward: 'Thảo Điền',
    district: 'TP. Thủ Đức',
    lng: 106.7335,
    lat: 10.803,
    routableNodeId: 'node-quoc-huong-xlhn',
    routableSnapDistanceMeters: 80,
    isOutsideGraph: true,
  },
  {
    id: 'poi-bitexco',
    type: 'poi',
    label: 'Tòa nhà Bitexco Financial Tower',
    street: 'Hải Triều',
    ward: 'Bến Nghé',
    district: 'Quận 1',
    lng: 106.7042,
    lat: 10.7716,
    routableNodeId: 'node-bach-dang',
    routableSnapDistanceMeters: 190,
    isOutsideGraph: true,
  },

  // --- 2. Intersections (Key junctions) ---
  {
    id: 'intersection-hang-xanh',
    type: 'intersection',
    label: 'Ngã tư Hàng Xanh',
    street: 'Điện Biên Phủ · Xô Viết Nghệ Tĩnh',
    ward: 'Phường 21',
    district: 'Bình Thạnh',
    lng: 106.712,
    lat: 10.8015,
    routableNodeId: 'node-hang-xanh',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'intersection-thu-duc',
    type: 'intersection',
    label: 'Ngã tư Thủ Đức',
    street: 'Xa lộ Hà Nội · Võ Văn Ngân',
    ward: 'Hiệp Phú',
    district: 'TP. Thủ Đức',
    lng: 106.772,
    lat: 10.852,
    routableNodeId: 'node-nga-tu-thu-duc',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'intersection-calmette-thd',
    type: 'intersection',
    label: 'Ngã tư Calmette · Trần Hưng Đạo',
    street: 'Trần Hưng Đạo · Calmette',
    ward: 'Nguyễn Thái Bình',
    district: 'Quận 1',
    lng: 106.697,
    lat: 10.766,
    routableNodeId: 'node-calmette-thd',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'intersection-dan-chu',
    type: 'intersection',
    label: 'Vòng xoay Dân Chủ',
    street: 'Cách Mạng Tháng 8 · Võ Thị Sáu · 3 Tháng 2',
    ward: 'Phường 7',
    district: 'Quận 3',
    lng: 106.682,
    lat: 10.778,
    routableNodeId: 'node-23-9',
    routableSnapDistanceMeters: 310,
    isOutsideGraph: true,
  },

  // --- 3. Roads (Monitored Arteries) ---
  {
    id: 'road-nguyen-huu-canh',
    type: 'road',
    label: 'Đường Nguyễn Hữu Cảnh',
    street: 'Nguyễn Hữu Cảnh',
    district: 'Bình Thạnh',
    lng: 106.712,
    lat: 10.791,
    routableNodeId: 'node-nhc-thu-thiem',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-dien-bien-phu',
    type: 'road',
    label: 'Đường Điện Biên Phủ',
    street: 'Điện Biên Phủ',
    district: 'Bình Thạnh',
    lng: 106.708,
    lat: 10.798,
    routableNodeId: 'node-hang-xanh',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-quoc-huong',
    type: 'road',
    label: 'Đường Quốc Hương · Thảo Điền',
    street: 'Quốc Hương',
    ward: 'Thảo Điền',
    district: 'TP. Thủ Đức',
    lng: 106.735,
    lat: 10.806,
    routableNodeId: 'node-quoc-huong-mid',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-xuan-thuy',
    type: 'road',
    label: 'Đường Xuân Thủy · Thảo Điền',
    street: 'Xuân Thủy',
    ward: 'Thảo Điền',
    district: 'TP. Thủ Đức',
    lng: 106.741,
    lat: 10.814,
    routableNodeId: 'node-xuan-thuy-thao-dien',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-ung-van-khiem',
    type: 'road',
    label: 'Đường Ung Văn Khiêm',
    street: 'Ung Văn Khiêm',
    ward: 'Phường 25',
    district: 'Bình Thạnh',
    lng: 106.718,
    lat: 10.808,
    routableNodeId: 'node-ung-van-khiem-mid',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-vo-van-ngan',
    type: 'road',
    label: 'Đường Võ Văn Ngân',
    street: 'Võ Văn Ngân',
    ward: 'Linh Chiểu',
    district: 'TP. Thủ Đức',
    lng: 106.765,
    lat: 10.851,
    routableNodeId: 'node-vo-van-ngan-mid',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-le-van-viet',
    type: 'road',
    label: 'Đường Lê Văn Việt',
    street: 'Lê Văn Việt',
    ward: 'Tăng Nhơn Phú A',
    district: 'TP. Thủ Đức',
    lng: 106.782,
    lat: 10.849,
    routableNodeId: 'node-nga-tu-thu-duc',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-huynh-tan-phat',
    type: 'road',
    label: 'Đường Huỳnh Tấn Phát',
    street: 'Huỳnh Tấn Phát',
    ward: 'Tân Phú',
    district: 'Quận 7',
    lng: 106.735,
    lat: 10.738,
    routableNodeId: 'node-cau-phu-my-q7',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },
  {
    id: 'road-tran-hung-dao',
    type: 'road',
    label: 'Đường Trần Hưng Đạo',
    street: 'Trần Hưng Đạo',
    ward: 'Phạm Ngũ Lão',
    district: 'Quận 1',
    lng: 106.694,
    lat: 10.765,
    routableNodeId: 'node-calmette-thd',
    routableSnapDistanceMeters: 0,
    isOutsideGraph: false,
  },

  // --- 4. House Numbers / Addresses ---
  {
    id: 'addr-123-nhc',
    type: 'address',
    label: '123 Nguyễn Hữu Cảnh',
    name: 'Gần 123 Nguyễn Hữu Cảnh (ước lượng)',
    houseNumber: '123',
    street: 'Nguyễn Hữu Cảnh',
    ward: 'Phường 22',
    district: 'Bình Thạnh',
    lng: 106.7145,
    lat: 10.7925,
    linkedRoadId: 'road-nguyen-huu-canh',
    routableNodeId: 'node-nhc-thu-thiem',
    routableSnapDistanceMeters: 75,
    isOutsideGraph: true,
  },
  {
    id: 'addr-195-dbp',
    type: 'address',
    label: '195 Điện Biên Phủ',
    name: 'Gần 195 Điện Biên Phủ (ước lượng)',
    houseNumber: '195',
    street: 'Điện Biên Phủ',
    ward: 'Phường 15',
    district: 'Bình Thạnh',
    lng: 106.7095,
    lat: 10.7995,
    linkedRoadId: 'road-dien-bien-phu',
    routableNodeId: 'node-hang-xanh',
    routableSnapDistanceMeters: 60,
    isOutsideGraph: true,
  },
  {
    id: 'addr-26-uvk',
    type: 'address',
    label: '26 Ung Văn Khiêm',
    name: 'Gần 26 Ung Văn Khiêm (ước lượng)',
    houseNumber: '26',
    street: 'Ung Văn Khiêm',
    ward: 'Phường 25',
    district: 'Bình Thạnh',
    lng: 106.716,
    lat: 10.806,
    linkedRoadId: 'road-ung-van-khiem',
    routableNodeId: 'node-ung-van-khiem-mid',
    routableSnapDistanceMeters: 45,
    isOutsideGraph: false,
  },
  {
    id: 'addr-88-xuan-thuy',
    type: 'address',
    label: '88 Xuân Thủy',
    name: 'Gần 88 Xuân Thủy (ước lượng)',
    houseNumber: '88',
    street: 'Xuân Thủy',
    ward: 'Thảo Điền',
    district: 'TP. Thủ Đức',
    lng: 106.739,
    lat: 10.812,
    linkedRoadId: 'road-xuan-thuy',
    routableNodeId: 'node-xuan-thuy-thao-dien',
    routableSnapDistanceMeters: 90,
    isOutsideGraph: true,
  },

  // --- 5. Alleys / Hẻm ---
  {
    id: 'alley-123-45-nguyen-xi',
    type: 'alley',
    label: '123/45 Nguyễn Xí',
    name: '123/45 Nguyễn Xí (ước lượng)',
    houseNumber: '123/45',
    alley: 'Hẻm 123/45',
    street: 'Nguyễn Xí',
    ward: 'Phường 26',
    district: 'Bình Thạnh',
    lng: 106.708,
    lat: 10.814,
    routableNodeId: 'node-hang-xanh',
    routableSnapDistanceMeters: 380,
    isOutsideGraph: true,
  },
  {
    id: 'alley-48-dbp',
    type: 'alley',
    label: 'Hẻm 48 Điện Biên Phủ',
    alley: 'Hẻm 48',
    street: 'Điện Biên Phủ',
    ward: 'Phường 25',
    district: 'Bình Thạnh',
    lng: 106.714,
    lat: 10.8005,
    routableNodeId: 'node-hang-xanh',
    routableSnapDistanceMeters: 180,
    isOutsideGraph: true,
  },
  {
    id: 'alley-60-uvk',
    type: 'alley',
    label: 'Hẻm 60 Ung Văn Khiêm',
    alley: 'Hẻm 60',
    street: 'Ung Văn Khiêm',
    ward: 'Phường 25',
    district: 'Bình Thạnh',
    lng: 106.719,
    lat: 10.809,
    routableNodeId: 'node-ung-van-khiem-mid',
    routableSnapDistanceMeters: 140,
    isOutsideGraph: true,
  },
];

export const SNAP_THRESHOLDS = {
  EXACT_MAX_METERS: 25,
  NEAR_MAX_METERS: 80,
  FAR_MAX_METERS: 300,
  UNSUPPORTED_MAX_METERS: 1500,
} as const;

/**
 * Snaps coordinates (lng, lat) to the nearest supported node in HCMC_ROAD_NODES.
 * Returns a complete RouteSnapResult including input, snapped point, distance, and status.
 */
export function snapCoordinatesToRoutableNetwork(
  lng: number,
  lat: number
): RouteSnapResult {
  let bestNode = HCMC_ROAD_NODES[0];
  let minDistance = Infinity;

  for (const node of HCMC_ROAD_NODES) {
    const dLat = ((node.lat - lat) * Math.PI) / 180;
    const dLng = ((node.lng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((node.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distMeters = 6371000 * c;

    if (distMeters < minDistance) {
      minDistance = distMeters;
      bestNode = node;
    }
  }

  const distanceMeters = Math.round(minDistance);
  let status: RouteSnapStatus = 'near';
  if (distanceMeters <= SNAP_THRESHOLDS.EXACT_MAX_METERS) {
    status = 'exact';
  } else if (distanceMeters <= SNAP_THRESHOLDS.NEAR_MAX_METERS) {
    status = 'near';
  } else if (distanceMeters <= SNAP_THRESHOLDS.FAR_MAX_METERS) {
    status = 'far';
  } else {
    status = 'unsupported';
  }

  const incidentSeg = HCMC_GRAPH_SEGMENTS.find(
    (s) => s.fromNodeId === bestNode.id || s.toNodeId === bestNode.id
  );
  const segmentId = incidentSeg ? incidentSeg.id : `seg-${bestNode.id}`;

  return {
    inputLng: lng,
    inputLat: lat,
    snappedLng: bestNode.lng,
    snappedLat: bestNode.lat,
    nodeId: bestNode.id,
    segmentId,
    distanceMeters,
    status,
  };
}

/**
 * Snaps a geographic coordinate (lng, lat) to the nearest supported node in HCMC_ROAD_NODES.
 * Returns the nearest node ID and haversine distance in meters.
 */
export function snapCoordinatesToGraph(
  lng: number,
  lat: number
): { nodeId: string; nodeName: string; distanceMeters: number } {
  const result = snapCoordinatesToRoutableNetwork(lng, lat);
  const node = HCMC_ROAD_NODES.find((n) => n.id === result.nodeId) || HCMC_ROAD_NODES[0];
  return {
    nodeId: result.nodeId,
    nodeName: node.name,
    distanceMeters: result.distanceMeters,
  };
}

export const HCMC_CURATED_PLACES: SearchPlace[] = HCMC_RAW_CURATED_PLACES.map((p) => {
  let quality: SearchMatchQuality = 'poi';
  let secLabel = p.secondaryLabel;
  if (p.type === 'poi') {
    quality = 'poi';
    secLabel = secLabel || 'Địa điểm nổi bật';
  } else if (p.type === 'intersection') {
    quality = 'poi';
    secLabel = secLabel || 'Giao lộ trọng điểm';
  } else if (p.type === 'road') {
    quality = 'street-level';
    secLabel = secLabel || 'Tuyến đường giao thông';
  } else if (p.type === 'address') {
    quality = 'approximate';
    secLabel = secLabel || 'Địa chỉ ước lượng theo tim đường (chưa hỗ trợ số nhà chi tiết)';
  } else if (p.type === 'alley') {
    quality = 'approximate';
    secLabel = secLabel || 'Vị trí ước lượng vị trí đầu hẻm (ngoài mạng đường xe chính)';
  }

  return {
    ...p,
    name: p.name || p.label,
    matchQuality: quality,
    secondaryLabel: secLabel,
    source: 'curated-hcmc-database',
  };
});

export const HCMC_ROAD_SEARCH_PLACES: SearchPlace[] = (MAJOR_HCMC_ROADS || []).map((r) => {
  const snap = snapCoordinatesToRoutableNetwork(r.properties.anchorPoint[0], r.properties.anchorPoint[1]);
  return {
    id: `road-place-${r.id}`,
    type: 'road',
    label: r.properties.roadName,
    name: r.properties.roadName,
    secondaryLabel: `${r.properties.roadName} · kết quả theo tuyến đường (Định vị theo tim đường)`,
    street: r.properties.roadName,
    district: r.properties.district,
    lng: r.properties.anchorPoint[0],
    lat: r.properties.anchorPoint[1],
    linkedRoadId: r.id,
    matchQuality: 'street-level',
    source: 'osm-major-roads',
    routableNodeId: snap.nodeId,
    routableSegmentId: snap.segmentId,
    routableSnapDistanceMeters: snap.distanceMeters,
    isOutsideGraph: false,
  };
});

export const ALL_HCMC_PLACES: SearchPlace[] = [
  ...HCMC_ROAD_SEARCH_PLACES,
  ...HCMC_CURATED_PLACES,
];

/**
 * Dynamic parser for addresses and alley numbers (e.g. "123 Nguyễn Hữu Cảnh", "123/45 Nguyễn Xí").
 * Synthesizes an accurate place record with graph snapping if not already in curated DB.
 * Honors V5.1 rule: Never claim exact for unverified street interpolation.
 */
export function parseAddressQuery(query: string): SearchPlace | null {
  const q = query.trim();

  // 1. Check for alley patterns (e.g. "123/45 ...", "hem 48 ...")
  const alleyMatch = q.match(/^(\d+\/\d+|\d+[A-Za-z]?\/\d+|hẻm\s+\d+|hem\s+\d+)\s+(.+)$/i);
  if (alleyMatch) {
    const alleyPart = alleyMatch[1];
    const streetPart = alleyMatch[2].trim();
    const matchedRoad = ALL_HCMC_PLACES.find(
      (p) => p.type === 'road' && (
        normalizeVietnamese(p.street || p.label).includes(normalizeVietnamese(streetPart)) ||
        normalizeVietnamese(streetPart).includes(normalizeVietnamese(p.street || p.label)) ||
        stripVietnamesePrefixes(p.street || p.label).includes(stripVietnamesePrefixes(streetPart))
      )
    );

    if (matchedRoad) {
      const snap = snapCoordinatesToRoutableNetwork(matchedRoad.lng + 0.0015, matchedRoad.lat + 0.001);
      return {
        id: `dynamic-alley-${Date.now()}`,
        type: 'alley',
        label: `${alleyPart} ${matchedRoad.street}`,
        name: `${alleyPart} ${matchedRoad.street}`,
        secondaryLabel: 'Không tìm thấy chính xác số hẻm; hiển thị điểm gần nhất.',
        alley: alleyPart,
        street: matchedRoad.street,
        ward: matchedRoad.ward,
        district: matchedRoad.district,
        lng: matchedRoad.lng + 0.0015,
        lat: matchedRoad.lat + 0.001,
        matchQuality: 'approximate',
        source: 'dynamic-alley-parser',
        routableNodeId: snap.nodeId,
        routableSegmentId: snap.segmentId,
        routableSnapDistanceMeters: Math.max(120, snap.distanceMeters),
        isOutsideGraph: true,
      };
    }
  }

  // 2. Check for house number patterns (e.g. "123 Nguyễn Hữu Cảnh")
  const houseMatch = q.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
  if (houseMatch) {
    const numPart = houseMatch[1];
    const streetPart = houseMatch[2].trim();
    const matchedRoad = ALL_HCMC_PLACES.find(
      (p) => p.type === 'road' && (
        normalizeVietnamese(p.street || p.label).includes(normalizeVietnamese(streetPart)) ||
        normalizeVietnamese(streetPart).includes(normalizeVietnamese(p.street || p.label)) ||
        stripVietnamesePrefixes(p.street || p.label).includes(stripVietnamesePrefixes(streetPart))
      )
    );

    if (matchedRoad) {
      const snap = snapCoordinatesToRoutableNetwork(matchedRoad.lng + 0.0008, matchedRoad.lat + 0.0005);
      return {
        id: `dynamic-addr-${Date.now()}`,
        type: 'address',
        label: `Gần ${numPart} ${matchedRoad.street}`,
        name: `Gần ${numPart} ${matchedRoad.street}`,
        secondaryLabel: 'Vị trí ước lượng theo trục đường, chưa có tọa độ thửa đất',
        houseNumber: numPart,
        street: matchedRoad.street,
        ward: matchedRoad.ward,
        district: matchedRoad.district,
        lng: matchedRoad.lng + 0.0008,
        lat: matchedRoad.lat + 0.0005,
        matchQuality: 'approximate',
        source: 'dynamic-address-parser',
        routableNodeId: snap.nodeId,
        routableSegmentId: snap.segmentId,
        routableSnapDistanceMeters: Math.max(60, snap.distanceMeters),
        isOutsideGraph: snap.distanceMeters > 50,
      };
    }
  }

  return null;
}

const SEARCH_CACHE = new Map<string, SearchPlace[]>();

/**
 * Searches places database matching query with diacritic and prefix insensitivity.
 */
export function searchPlaces(query: string): SearchPlace[] {
  if (!query || !query.trim()) return ALL_HCMC_PLACES.slice(0, 10);

  const cleanQuery = query.trim();
  const normalizedQuery = normalizeVietnamese(cleanQuery);
  const strippedQuery = stripVietnamesePrefixes(cleanQuery);

  if (SEARCH_CACHE.has(normalizedQuery)) {
    return SEARCH_CACHE.get(normalizedQuery)!;
  }

  // 1. First check dynamic address / alley parser
  const dynamicPlace = parseAddressQuery(cleanQuery);

  // 2. Filter curated and road places
  const results = ALL_HCMC_PLACES.filter((place) => {
    const labelNorm = normalizeVietnamese(place.label);
    const nameNorm = normalizeVietnamese(place.name || place.label);
    const streetNorm = place.street ? normalizeVietnamese(place.street) : '';
    const districtNorm = place.district ? normalizeVietnamese(place.district) : '';
    const houseNorm = place.houseNumber ? normalizeVietnamese(place.houseNumber) : '';
    const alleyNorm = place.alley ? normalizeVietnamese(place.alley) : '';

    const matchesNorm =
      labelNorm.includes(normalizedQuery) ||
      nameNorm.includes(normalizedQuery) ||
      streetNorm.includes(normalizedQuery) ||
      districtNorm.includes(normalizedQuery) ||
      (houseNorm && `${houseNorm} ${streetNorm}`.includes(normalizedQuery)) ||
      (alleyNorm && `${alleyNorm} ${streetNorm}`.includes(normalizedQuery));

    if (matchesNorm) return true;

    // Also match stripped prefix if different
    if (strippedQuery && strippedQuery !== normalizedQuery) {
      return (
        labelNorm.includes(strippedQuery) ||
        nameNorm.includes(strippedQuery) ||
        streetNorm.includes(strippedQuery) ||
        (houseNorm && `${houseNorm} ${streetNorm}`.includes(strippedQuery))
      );
    }

    return false;
  });

  if (dynamicPlace && !results.some((r) => r.label.toLowerCase() === dynamicPlace.label.toLowerCase())) {
    results.unshift(dynamicPlace);
  }

  // Deduplicate results by label or id
  const seen = new Set<string>();
  const uniqueResults = results.filter((item) => {
    const key = `${item.type}-${item.label.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by relevancy: exact startsWith first
  uniqueResults.sort((a, b) => {
    const aNorm = normalizeVietnamese(a.label);
    const bNorm = normalizeVietnamese(b.label);
    const aStarts =
      aNorm.startsWith(normalizedQuery) || (strippedQuery ? aNorm.startsWith(strippedQuery) : false);
    const bStarts =
      bNorm.startsWith(normalizedQuery) || (strippedQuery ? bNorm.startsWith(strippedQuery) : false);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  // Cache up to 100 entries
  if (SEARCH_CACHE.size > 100) {
    const firstKey = SEARCH_CACHE.keys().next().value;
    if (firstKey) SEARCH_CACHE.delete(firstKey);
  }
  SEARCH_CACHE.set(normalizedQuery, uniqueResults);

  return uniqueResults;
}
