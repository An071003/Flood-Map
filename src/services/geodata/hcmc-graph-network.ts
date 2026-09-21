import { RoadNode, GraphRoadSegment, SegmentFloodState } from '../../types';
import { CANONICAL_SEGMENTS_MAP } from './canonical-road-network';

// ---------------------------------------------------------------------------
// HCMC Road Network Nodes (Key Intersections & Transport Hubs)
// ---------------------------------------------------------------------------
export const HCMC_ROAD_NODES: RoadNode[] = [
  // District 1 (Central Hubs)
  {
    id: 'node-ben-thanh',
    name: 'Chợ Bến Thành · Quách Thị Trang',
    district: 'Quận 1',
    lng: 106.6983,
    lat: 10.7725,
    isMajorHub: true,
  },
  {
    id: 'node-23-9',
    name: 'Công viên 23/9 · Lê Lai',
    district: 'Quận 1',
    lng: 106.693,
    lat: 10.768,
    isMajorHub: false,
  },
  {
    id: 'node-calmette-thd',
    name: 'Ngã tư Calmette · Trần Hưng Đạo',
    district: 'Quận 1',
    lng: 106.697,
    lat: 10.766,
    isMajorHub: false,
  },
  {
    id: 'node-bach-dang',
    name: 'Bến Bạch Đằng · Tôn Đức Thắng',
    district: 'Quận 1',
    lng: 106.706,
    lat: 10.775,
    isMajorHub: true,
  },
  {
    id: 'node-dinh-tien-hoang',
    name: 'Ngã tư Lê Duẩn · Đinh Tiên Hoàng',
    district: 'Quận 1',
    lng: 106.702,
    lat: 10.785,
    isMajorHub: false,
  },
  {
    id: 'node-nhc-tdt',
    name: 'Đầu đường Nguyễn Hữu Cảnh · Tôn Đức Thắng',
    district: 'Quận 1',
    lng: 106.7068,
    lat: 10.7845,
    isMajorHub: false,
  },
  {
    id: 'node-cau-ba-son-q1',
    name: 'Cầu Ba Son (Thủ Thiêm 2) phía Quận 1',
    district: 'Quận 1',
    lng: 106.708,
    lat: 10.782,
    isMajorHub: false,
  },

  // Binh Thanh District
  {
    id: 'node-nhc-thu-thiem',
    name: 'Nguyễn Hữu Cảnh · Chân cầu Thủ Thiêm 1',
    district: 'Bình Thạnh',
    lng: 106.7175,
    lat: 10.7935,
    isMajorHub: true,
  },
  {
    id: 'node-nhc-tan-cang',
    name: 'Nguyễn Hữu Cảnh · Tân Cảng (Landmark 81)',
    district: 'Bình Thạnh',
    lng: 106.723,
    lat: 10.796,
    isMajorHub: false,
  },
  {
    id: 'node-cau-dbp',
    name: 'Cầu Điện Biên Phủ · Rạch Thị Nghè',
    district: 'Bình Thạnh',
    lng: 106.701,
    lat: 10.792,
    isMajorHub: false,
  },
  {
    id: 'node-hang-xanh',
    name: 'Ngã tư Hàng Xanh (Vòng xoay Điện Biên Phủ)',
    district: 'Bình Thạnh',
    lng: 106.7125,
    lat: 10.8015,
    isMajorHub: true,
  },
  {
    id: 'node-cau-sai-gon-bt',
    name: 'Chân Cầu Sài Gòn phía Bình Thạnh',
    district: 'Bình Thạnh',
    lng: 106.7225,
    lat: 10.7985,
    isMajorHub: false,
  },

  // Thu Duc City (Thao Dien & An Phu)
  {
    id: 'node-cau-sai-gon-td',
    name: 'Chân Cầu Sài Gòn phía Thủ Đức (Xa lộ Hà Nội)',
    district: 'Thủ Đức',
    lng: 106.729,
    lat: 10.8035,
    isMajorHub: true,
  },
  {
    id: 'node-quoc-huong-xlhn',
    name: 'Ngã ba Quốc Hương · Xa lộ Hà Nội',
    district: 'Thủ Đức',
    lng: 106.732,
    lat: 10.801,
    isMajorHub: false,
  },
  {
    id: 'node-quoc-huong-mid',
    name: 'Quốc Hương · Khu vực trũng Thảo Điền',
    district: 'Thủ Đức',
    lng: 106.7365,
    lat: 10.8085,
    isMajorHub: true,
  },
  {
    id: 'node-xuan-thuy-thao-dien',
    name: 'Ngã tư Xuân Thủy · Thảo Điền',
    district: 'Thủ Đức',
    lng: 106.741,
    lat: 10.814,
    isMajorHub: true,
  },
  {
    id: 'node-an-phu-xlhn',
    name: 'Xa lộ Hà Nội · Cầu Rạch Chiếc (An Phú)',
    district: 'Thủ Đức',
    lng: 106.748,
    lat: 10.805,
    isMajorHub: false,
  },
  {
    id: 'node-mai-chi-tho-td',
    name: 'Đại lộ Mai Chí Thọ · Nút giao An Phú',
    district: 'Thủ Đức',
    lng: 106.745,
    lat: 10.792,
    isMajorHub: true,
  },
  {
    id: 'node-thu-thiem-1-td',
    name: 'Chân cầu Thủ Thiêm 1 phía Thủ Thiêm',
    district: 'Thủ Đức',
    lng: 106.722,
    lat: 10.79,
    isMajorHub: false,
  },
  {
    id: 'node-cau-ba-son-td',
    name: 'Cầu Ba Son phía Khu đô thị mới Thủ Thiêm',
    district: 'Thủ Đức',
    lng: 106.716,
    lat: 10.776,
    isMajorHub: false,
  },

  // District 4
  {
    id: 'node-cau-calmette-q4',
    name: 'Chân cầu Calmette · Bến Vân Đồn',
    district: 'Quận 4',
    lng: 106.701,
    lat: 10.763,
    isMajorHub: false,
  },
  {
    id: 'node-doan-van-bo-ttt',
    name: 'Đoàn Văn Bơ · Tôn Thất Thuyết',
    district: 'Quận 4',
    lng: 106.7055,
    lat: 10.756,
    isMajorHub: false,
  },
  {
    id: 'node-cau-kenh-te-q4',
    name: 'Cầu Kênh Tẻ phía Quận 4',
    district: 'Quận 4',
    lng: 106.702,
    lat: 10.754,
    isMajorHub: true,
  },
  {
    id: 'node-ben-van-don-q4',
    name: 'Bến Vân Đồn · Chân Cầu Ông Lãnh',
    district: 'Quận 4',
    lng: 106.702,
    lat: 10.761,
    isMajorHub: false,
  },

  // District 7
  {
    id: 'node-cau-kenh-te-q7',
    name: 'Cầu Kênh Tẻ phía Quận 7 · Nguyễn Hữu Thọ',
    district: 'Quận 7',
    lng: 106.703,
    lat: 10.751,
    isMajorHub: true,
  },
  {
    id: 'node-tran-xuan-soan-mid',
    name: 'Trần Xuân Soạn · Bờ Kênh Tẻ',
    district: 'Quận 7',
    lng: 106.7155,
    lat: 10.7525,
    isMajorHub: false,
  },
  {
    id: 'node-nht-ntt',
    name: 'Ngã tư Nguyễn Hữu Thọ · Nguyễn Thị Thập',
    district: 'Quận 7',
    lng: 106.701,
    lat: 10.739,
    isMajorHub: true,
  },
  {
    id: 'node-ntt-htp',
    name: 'Ngã tư Nguyễn Thị Thập · Huỳnh Tấn Phát',
    district: 'Quận 7',
    lng: 106.727,
    lat: 10.744,
    isMajorHub: false,
  },
  {
    id: 'node-pmh-nvl',
    name: 'Nguyễn Văn Linh · Phú Mỹ Hưng',
    district: 'Quận 7',
    lng: 106.718,
    lat: 10.728,
    isMajorHub: true,
  },

  // Additional Cross-River Bridge Nodes (Q1 ↔ Q4 Alternatives)
  {
    id: 'node-khanh-hoi-q1',
    name: 'Bến Bạch Đằng · Chân Cầu Khánh Hội',
    district: 'Quận 1',
    lng: 106.7065,
    lat: 10.768,
    isMajorHub: false,
  },
  {
    id: 'node-khanh-hoi-q4',
    name: 'Chân Cầu Khánh Hội · Bến Vân Đồn',
    district: 'Quận 4',
    lng: 106.708,
    lat: 10.764,
    isMajorHub: false,
  },
  {
    id: 'node-ong-lanh-q1',
    name: 'Ngã tư Trần Hưng Đạo · Cầu Ông Lãnh',
    district: 'Quận 1',
    lng: 106.694,
    lat: 10.763,
    isMajorHub: false,
  },
  {
    id: 'node-ong-lanh-q4',
    name: 'Chân Cầu Ông Lãnh · Hoàng Diệu',
    district: 'Quận 4',
    lng: 106.697,
    lat: 10.759,
    isMajorHub: false,
  },

  // District 3, Phu Nhuan & Tan Binh Corridor
  {
    id: 'node-nam-ky-khoi-nghia',
    name: 'Nam Kỳ Khởi Nghĩa · Điện Biên Phủ',
    district: 'Quận 3',
    lng: 106.691,
    lat: 10.784,
    isMajorHub: true,
  },
  {
    id: 'node-phu-nhuan-nvt',
    name: 'Nguyễn Văn Trỗi · Huỳnh Văn Bánh',
    district: 'Phú Nhuận',
    lng: 106.678,
    lat: 10.793,
    isMajorHub: false,
  },
  {
    id: 'node-lang-cha-ca',
    name: 'Vòng xoay Lăng Cha Cả · Hoàng Văn Thụ',
    district: 'Tân Bình',
    lng: 106.662,
    lat: 10.797,
    isMajorHub: true,
  },
  {
    id: 'node-phan-thuc-duyen',
    name: 'Phan Thúc Duyện · CV Hoàng Văn Thụ (Tân Bình)',
    district: 'Tân Bình',
    lng: 106.658,
    lat: 10.8035,
    isMajorHub: false,
  },
];

// Helper to construct forecast states across 0, 1, 3, 6, 12, 24 hours
function makeForecast(
  depthProfile: Record<number, number>,
  status: 'known' | 'unknown' = 'known',
  confidence: 'high' | 'medium' | 'low' = 'high'
): Record<number, SegmentFloodState> {
  const hours = [0, 1, 3, 6, 12, 24];
  const res: Record<number, SegmentFloodState> = {};

  for (const h of hours) {
    if (status === 'unknown') {
      res[h] = {
        status: 'unknown',
        reason: 'missing_forecast',
        forecastFor: h === 0 ? 'Hiện tại (Chưa có dữ liệu)' : `+${h} giờ (Chưa có dữ liệu)`,
        confidenceBand: 'low',
        dataCompleteness: 0.15,
      };
    } else {
      const d = depthProfile[h] ?? 0;
      let risk: 'safe' | 'watch' | 'warning' | 'severe' = 'safe';
      if (d >= 30) risk = 'severe';
      else if (d >= 15) risk = 'warning';
      else if (d >= 5) risk = 'watch';

      res[h] = {
        status: 'known',
        estimatedDepthCm: d,
        riskLevel: risk,
        confidenceBand: confidence,
        dataCompleteness: confidence === 'high' ? 0.9 : 0.75,
        forecastFor: h === 0 ? 'Hiện tại' : `+${h} giờ`,
      };
    }
  }

  return res;
}

/**
 * Constructs a GraphRoadSegment from canonical road network metadata + attached flood forecast.
 * Preserves the rule: Map geometry === routing geometry.
 */
function createGraphSegment(
  canonicalId: string,
  roadId: string,
  floodForecast: Record<number, SegmentFloodState>
): GraphRoadSegment {
  const canon = CANONICAL_SEGMENTS_MAP.get(canonicalId);
  if (!canon) {
    throw new Error(`Canonical segment not found: ${canonicalId}`);
  }

  return {
    id: canon.id,
    roadId,
    roadName: canon.roadName,
    district: canon.district,
    roadClass: canon.roadClass,
    fromNodeId: canon.fromNodeId,
    toNodeId: canon.toNodeId,
    bidirectional: canon.bidirectional,
    lengthMeters: canon.lengthMeters,
    estimatedTravelSeconds: canon.estimatedTravelSeconds,
    geometry: canon.geometry,
    geometryQuality: canon.geometryQuality,
    canonicalSegmentId: canon.id,
    floodForecast,
  };
}

// ---------------------------------------------------------------------------
// HCMC Topological Road Segments (Derived from Canonical Road Network)
// ---------------------------------------------------------------------------
export const HCMC_GRAPH_SEGMENTS: GraphRoadSegment[] = [
  // 1. Nguyễn Hữu Cảnh Corridor (Historically Severe Flood Hotspot)
  createGraphSegment(
    'seg-nhc-1',
    'nguyen-huu-canh',
    makeForecast({ 0: 28, 1: 32, 3: 38, 6: 22, 12: 8, 24: 2 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-nhc-2',
    'nguyen-huu-canh',
    makeForecast({ 0: 24, 1: 28, 3: 32, 6: 18, 12: 6, 24: 2 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-tan-cang-csg',
    'dien-bien-phu',
    makeForecast({ 0: 6, 1: 8, 3: 10, 6: 5, 12: 2, 24: 0 }, 'known', 'medium')
  ),

  // 2. Điện Biên Phủ Corridor (Elevated Primary Artery - High Capacity, Minimal Flood)
  createGraphSegment(
    'seg-dth-dbp',
    'dien-bien-phu',
    makeForecast({ 0: 4, 1: 5, 3: 6, 6: 4, 12: 2, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-dbp-hang-xanh',
    'dien-bien-phu',
    makeForecast({ 0: 4, 1: 6, 3: 8, 6: 4, 12: 2, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-hang-xanh-csg',
    'dien-bien-phu',
    makeForecast({ 0: 5, 1: 7, 3: 9, 6: 5, 12: 2, 24: 0 }, 'known', 'high')
  ),

  // 3. Central Q1 Connectors
  createGraphSegment(
    'seg-ben-thanh-bach-dang',
    'le-loi',
    makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-bach-dang-tdt',
    'ton-duc-thang',
    makeForecast({ 0: 4, 1: 5, 3: 6, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-ben-thanh-dth',
    'le-duan',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 2, 12: 0, 24: 0 }, 'known', 'high')
  ),

  // 4. Cầu Sài Gòn Arterial Link
  createGraphSegment(
    'seg-cau-sai-gon',
    'cau-sai-gon',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),

  // 5. Thảo Điền Corridor (Quốc Hương Severe Flood vs Xa Lộ Hà Nội Elevated Trunk)
  createGraphSegment(
    'seg-csg-quoc-huong',
    'xa-lo-ha-noi',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-quoc-huong-1',
    'quoc-huong',
    makeForecast({ 0: 35, 1: 42, 3: 48, 6: 30, 12: 12, 24: 4 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-quoc-huong-2',
    'quoc-huong',
    makeForecast({ 0: 26, 1: 34, 3: 40, 6: 24, 12: 8, 24: 2 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-xlhn-an-phu',
    'xa-lo-ha-noi',
    makeForecast({ 0: 4, 1: 5, 3: 6, 6: 4, 12: 2, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-an-phu-xuan-thuy',
    'xuan-thuy',
    makeForecast({ 0: 8, 1: 10, 3: 12, 6: 8, 12: 3, 24: 0 }, 'known', 'medium')
  ),

  // 6. Corridor via Cầu Ba Son (Thủ Thiêm 2) & Mai Chí Thọ
  createGraphSegment(
    'seg-tdt-cau-ba-son',
    'ton-duc-thang',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-cau-ba-son',
    'cau-ba-son',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-mai-chi-tho-1',
    'mai-chi-tho',
    makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-mai-chi-tho-an-phu',
    'mai-chi-tho',
    makeForecast({ 0: 5, 1: 6, 3: 8, 6: 5, 12: 0, 24: 0 }, 'known', 'high')
  ),

  // 7. Cầu Thủ Thiêm 1 Link
  createGraphSegment(
    'seg-cau-thu-thiem-1',
    'cau-thu-thiem-1',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-thu-thiem-mai-chi-tho',
    'nguyen-co-thach',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),

  // 8. South Corridor: District 1 ↔ District 4 ↔ District 7
  createGraphSegment(
    'seg-ben-thanh-calmette',
    'tran-hung-dao',
    makeForecast({ 0: 4, 1: 5, 3: 6, 6: 4, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-cau-calmette',
    'cau-calmette',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-doan-van-bo',
    'doan-van-bo',
    makeForecast({ 0: 16, 1: 20, 3: 25, 6: 14, 12: 5, 24: 0 }, 'known', 'medium')
  ),
  createGraphSegment(
    'seg-ben-van-don-kenh-te',
    'ben-van-don',
    makeForecast({ 0: 6, 1: 8, 3: 10, 6: 6, 12: 2, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-cau-kenh-te',
    'cau-kenh-te',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),

  // 9. District 7: Route A (Trần Xuân Soạn Severe) vs Route B (Nguyễn Hữu Thọ Safe)
  createGraphSegment(
    'seg-tran-xuan-soan',
    'tran-xuan-soan',
    makeForecast({ 0: 38, 1: 44, 3: 42, 6: 26, 12: 10, 24: 2 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-txs-htp',
    'tran-xuan-soan-dong',
    makeForecast({ 0: 32, 1: 36, 3: 35, 6: 20, 12: 8, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-nguyen-huu-tho-1',
    'nguyen-huu-tho',
    makeForecast({ 0: 4, 1: 6, 3: 8, 6: 4, 12: 2, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-nguyen-thi-thap',
    'nguyen-thi-thap',
    makeForecast({ 0: 8, 1: 10, 3: 12, 6: 8, 12: 2, 24: 0 }, 'known', 'medium')
  ),
  createGraphSegment(
    'seg-nht-pmh',
    'nguyen-van-linh',
    makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high')
  ),

  // 10. UNKNOWN Segment (Crucial for ROUTE-QA-PROMPT.md Scenario C & E!)
  createGraphSegment(
    'seg-doan-van-bo-connector-unknown',
    'ton-that-thuyet-branch',
    makeForecast({}, 'unknown', 'low')
  ),

  // 11. Cross-River Bridge Alternatives (Q1 ↔ Q4)
  createGraphSegment(
    'seg-bach-dang-khanh-hoi',
    'ton-duc-thang',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-cau-khanh-hoi',
    'cau-khanh-hoi',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-khanh-hoi-ben-van-don',
    'ben-van-don',
    makeForecast({ 0: 5, 1: 7, 3: 8, 6: 5, 12: 2, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-calmette-ong-lanh-q1',
    'tran-hung-dao',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-cau-ong-lanh',
    'cau-ong-lanh',
    makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-ong-lanh-hoang-dieu',
    'hoang-dieu',
    makeForecast({ 0: 6, 1: 8, 3: 9, 6: 5, 12: 2, 24: 0 }, 'known', 'high')
  ),

  // 12. Tan Binh & Airport Corridor (Nam Kỳ Khởi Nghĩa ↔ Nguyễn Văn Trỗi ↔ Phan Thúc Duyện)
  createGraphSegment(
    'seg-ben-thanh-nkkn',
    'nam-ky-khoi-nghia',
    makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-dth-nkkn',
    'dien-bien-phu',
    makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-nkkn-phu-nhuan',
    'nguyen-van-troi',
    makeForecast({ 0: 4, 1: 5, 3: 6, 6: 3, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-nvt-lang-cha-ca',
    'hoang-van-thu',
    makeForecast({ 0: 5, 1: 7, 3: 8, 6: 4, 12: 0, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-lang-cha-ca-ptd',
    'phan-thuc-duyen',
    makeForecast({ 0: 14, 1: 18, 3: 22, 6: 12, 12: 4, 24: 0 }, 'known', 'high')
  ),

  // 17. Residential & Service Graph Expansion (V6)
  createGraphSegment(
    'seg-residential-q3',
    'residential-q3',
    makeForecast({ 0: 3, 1: 5, 3: 6, 6: 3, 12: 1, 24: 0 }, 'known', 'high')
  ),
  createGraphSegment(
    'seg-doan-van-bo-residential',
    'doan-van-bo',
    makeForecast({ 0: 5, 1: 7, 3: 9, 6: 4, 12: 1, 24: 0 }, 'known', 'medium')
  ),
  createGraphSegment(
    'seg-vinhomes-service',
    'vinhomes-service',
    makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high')
  ),
];
