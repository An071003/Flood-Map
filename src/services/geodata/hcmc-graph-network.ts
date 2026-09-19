import { RoadNode, GraphRoadSegment } from '../../types';

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
    lng: 106.707,
    lat: 10.786,
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
): Record<number, { status: 'known' | 'unknown'; estimatedDepthCm?: number; riskLevel?: 'safe' | 'watch' | 'warning' | 'severe'; confidenceBand?: 'high' | 'medium' | 'low'; dataCompleteness?: number; forecastFor: string }> {
  const hours = [0, 1, 3, 6, 12, 24];
  const res: Record<number, { status: 'known' | 'unknown'; estimatedDepthCm?: number; riskLevel?: 'safe' | 'watch' | 'warning' | 'severe'; confidenceBand?: 'high' | 'medium' | 'low'; dataCompleteness?: number; forecastFor: string }> = {};

  for (const h of hours) {
    if (status === 'unknown') {
      res[h] = {
        status: 'unknown',
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

// ---------------------------------------------------------------------------
// HCMC Topological Road Segments
// ---------------------------------------------------------------------------
export const HCMC_GRAPH_SEGMENTS: GraphRoadSegment[] = [
  // 1. Nguyễn Hữu Cảnh Corridor (Historically Severe Flood Hotspot)
  {
    id: 'seg-nhc-1',
    roadId: 'nguyen-huu-canh',
    roadName: 'Nguyễn Hữu Cảnh (Tôn Đức Thắng → Cầu Thủ Thiêm)',
    district: 'Bình Thạnh',
    roadClass: 'primary',
    fromNodeId: 'node-nhc-tdt',
    toNodeId: 'node-nhc-thu-thiem',
    bidirectional: true,
    lengthMeters: 1400,
    estimatedTravelSeconds: 150,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.707, 10.786],
        [106.712, 10.791],
        [106.7175, 10.7935],
      ],
    },
    // Flood depths: Hour 0: 28cm, Hour 1: 32cm, Hour 3: 38cm, Hour 6: 22cm, Hour 12: 8cm, Hour 24: 2cm
    floodForecast: makeForecast(
      { 0: 28, 1: 32, 3: 38, 6: 22, 12: 8, 24: 2 },
      'known',
      'high'
    ),
  },
  {
    id: 'seg-nhc-2',
    roadId: 'nguyen-huu-canh',
    roadName: 'Nguyễn Hữu Cảnh (Cầu Thủ Thiêm → Tân Cảng / Cầu Sài Gòn)',
    district: 'Bình Thạnh',
    roadClass: 'primary',
    fromNodeId: 'node-nhc-thu-thiem',
    toNodeId: 'node-nhc-tan-cang',
    bidirectional: true,
    lengthMeters: 800,
    estimatedTravelSeconds: 90,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7175, 10.7935],
        [106.72, 10.795],
        [106.723, 10.796],
      ],
    },
    floodForecast: makeForecast(
      { 0: 24, 1: 28, 3: 32, 6: 18, 12: 6, 24: 2 },
      'known',
      'high'
    ),
  },
  {
    id: 'seg-tan-cang-csg',
    roadId: 'dien-bien-phu',
    roadName: 'Đoạn nối Tân Cảng → Chân Cầu Sài Gòn',
    district: 'Bình Thạnh',
    roadClass: 'secondary',
    fromNodeId: 'node-nhc-tan-cang',
    toNodeId: 'node-cau-sai-gon-bt',
    bidirectional: true,
    lengthMeters: 400,
    estimatedTravelSeconds: 45,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.723, 10.796],
        [106.7225, 10.7985],
      ],
    },
    floodForecast: makeForecast({ 0: 6, 1: 8, 3: 10, 6: 5, 12: 2, 24: 0 }, 'known', 'medium'),
  },

  // 2. Điện Biên Phủ Corridor (Elevated Primary Artery - High Capacity, Minimal Flood)
  {
    id: 'seg-dth-dbp',
    roadId: 'dien-bien-phu',
    roadName: 'Đinh Tiên Hoàng → Cầu Điện Biên Phủ',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-dinh-tien-hoang',
    toNodeId: 'node-cau-dbp',
    bidirectional: true,
    lengthMeters: 1000,
    estimatedTravelSeconds: 110,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.702, 10.785],
        [106.701, 10.792],
      ],
    },
    floodForecast: makeForecast({ 0: 4, 1: 5, 3: 6, 6: 4, 12: 2, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-dbp-hang-xanh',
    roadId: 'dien-bien-phu',
    roadName: 'Điện Biên Phủ (Cầu Điện Biên Phủ → Hàng Xanh)',
    district: 'Bình Thạnh',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-dbp',
    toNodeId: 'node-hang-xanh',
    bidirectional: true,
    lengthMeters: 1400,
    estimatedTravelSeconds: 120,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.701, 10.792],
        [106.707, 10.797],
        [106.7125, 10.8015],
      ],
    },
    floodForecast: makeForecast({ 0: 4, 1: 6, 3: 8, 6: 4, 12: 2, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-hang-xanh-csg',
    roadId: 'dien-bien-phu',
    roadName: 'Điện Biên Phủ (Hàng Xanh → Cầu Sài Gòn)',
    district: 'Bình Thạnh',
    roadClass: 'trunk',
    fromNodeId: 'node-hang-xanh',
    toNodeId: 'node-cau-sai-gon-bt',
    bidirectional: true,
    lengthMeters: 1200,
    estimatedTravelSeconds: 100,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7125, 10.8015],
        [106.718, 10.8],
        [106.7225, 10.7985],
      ],
    },
    floodForecast: makeForecast({ 0: 5, 1: 7, 3: 9, 6: 5, 12: 2, 24: 0 }, 'known', 'high'),
  },

  // 3. Central Q1 Connectors
  {
    id: 'seg-ben-thanh-bach-dang',
    roadId: 'le-loi',
    roadName: 'Lê Lợi (Bến Thành → Bến Bạch Đằng)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-ben-thanh',
    toNodeId: 'node-bach-dang',
    bidirectional: true,
    lengthMeters: 1100,
    estimatedTravelSeconds: 130,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.6983, 10.7725],
        [106.702, 10.774],
        [106.706, 10.775],
      ],
    },
    floodForecast: makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-bach-dang-tdt',
    roadId: 'ton-duc-thang',
    roadName: 'Tôn Đức Thắng (Bến Bạch Đằng → Nguyễn Hữu Cảnh)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-bach-dang',
    toNodeId: 'node-nhc-tdt',
    bidirectional: true,
    lengthMeters: 1300,
    estimatedTravelSeconds: 140,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.706, 10.775],
        [106.7068, 10.78],
        [106.707, 10.786],
      ],
    },
    floodForecast: makeForecast({ 0: 4, 1: 5, 3: 6, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-ben-thanh-dth',
    roadId: 'le-duan',
    roadName: 'Lê Duẩn (Bến Thành / Nhà thờ Đức Bà → Đinh Tiên Hoàng)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-ben-thanh',
    toNodeId: 'node-dinh-tien-hoang',
    bidirectional: true,
    lengthMeters: 1500,
    estimatedTravelSeconds: 160,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.6983, 10.7725],
        [106.6995, 10.778],
        [106.702, 10.785],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 2, 12: 0, 24: 0 }, 'known', 'high'),
  },

  // 4. Cầu Sài Gòn Arterial Link
  {
    id: 'seg-cau-sai-gon',
    roadId: 'cau-sai-gon',
    roadName: 'Cầu Sài Gòn (Bình Thạnh ↔ Thủ Đức)',
    district: 'Bình Thạnh',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-sai-gon-bt',
    toNodeId: 'node-cau-sai-gon-td',
    bidirectional: true,
    lengthMeters: 1000,
    estimatedTravelSeconds: 60,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7225, 10.7985],
        [106.726, 10.801],
        [106.729, 10.8035],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },

  // 5. Thảo Điền Corridor (Quốc Hương Severe Flood vs Xa Lộ Hà Nội Elevated Trunk)
  {
    id: 'seg-csg-quoc-huong',
    roadId: 'xa-lo-ha-noi',
    roadName: 'Xa lộ Hà Nội (Chân Cầu Sài Gòn → Ngã ba Quốc Hương)',
    district: 'Thủ Đức',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-sai-gon-td',
    toNodeId: 'node-quoc-huong-xlhn',
    bidirectional: true,
    lengthMeters: 500,
    estimatedTravelSeconds: 40,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.729, 10.8035],
        [106.732, 10.801],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-quoc-huong-1',
    roadId: 'quoc-huong',
    roadName: 'Quốc Hương (Xa lộ Hà Nội → Đoạn trũng Thảo Điền)',
    district: 'Thủ Đức',
    roadClass: 'secondary',
    fromNodeId: 'node-quoc-huong-xlhn',
    toNodeId: 'node-quoc-huong-mid',
    bidirectional: true,
    lengthMeters: 900,
    estimatedTravelSeconds: 120,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.732, 10.801],
        [106.734, 10.805],
        [106.7365, 10.8085],
      ],
    },
    // Severe tidal + heavy rain basin
    floodForecast: makeForecast(
      { 0: 35, 1: 42, 3: 48, 6: 30, 12: 12, 24: 4 },
      'known',
      'high'
    ),
  },
  {
    id: 'seg-quoc-huong-2',
    roadId: 'quoc-huong',
    roadName: 'Quốc Hương (Đoạn trũng → Xuân Thủy)',
    district: 'Thủ Đức',
    roadClass: 'secondary',
    fromNodeId: 'node-quoc-huong-mid',
    toNodeId: 'node-xuan-thuy-thao-dien',
    bidirectional: true,
    lengthMeters: 750,
    estimatedTravelSeconds: 100,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7365, 10.8085],
        [106.739, 10.811],
        [106.741, 10.814],
      ],
    },
    floodForecast: makeForecast(
      { 0: 26, 1: 34, 3: 40, 6: 24, 12: 8, 24: 2 },
      'known',
      'high'
    ),
  },
  {
    id: 'seg-xlhn-an-phu',
    roadId: 'xa-lo-ha-noi',
    roadName: 'Xa lộ Hà Nội (Quốc Hương → Nút giao An Phú)',
    district: 'Thủ Đức',
    roadClass: 'trunk',
    fromNodeId: 'node-quoc-huong-xlhn',
    toNodeId: 'node-an-phu-xlhn',
    bidirectional: true,
    lengthMeters: 1800,
    estimatedTravelSeconds: 120,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.732, 10.801],
        [106.74, 10.803],
        [106.748, 10.805],
      ],
    },
    floodForecast: makeForecast({ 0: 4, 1: 5, 3: 6, 6: 4, 12: 2, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-an-phu-xuan-thuy',
    roadId: 'xuan-thuy',
    roadName: 'Đường nối Xa lộ Hà Nội (An Phú) → Xuân Thủy Thảo Điền',
    district: 'Thủ Đức',
    roadClass: 'secondary',
    fromNodeId: 'node-an-phu-xlhn',
    toNodeId: 'node-xuan-thuy-thao-dien',
    bidirectional: true,
    lengthMeters: 1200,
    estimatedTravelSeconds: 130,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.748, 10.805],
        [106.745, 10.81],
        [106.741, 10.814],
      ],
    },
    floodForecast: makeForecast({ 0: 8, 1: 10, 3: 12, 6: 8, 12: 3, 24: 0 }, 'known', 'medium'),
  },

  // 6. Corridor via Cầu Ba Son (Thủ Thiêm 2) & Mai Chí Thọ
  {
    id: 'seg-tdt-cau-ba-son',
    roadId: 'ton-duc-thang',
    roadName: 'Tôn Đức Thắng → Cầu Ba Son',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-bach-dang',
    toNodeId: 'node-cau-ba-son-q1',
    bidirectional: true,
    lengthMeters: 800,
    estimatedTravelSeconds: 80,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.706, 10.775],
        [106.708, 10.782],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-cau-ba-son',
    roadId: 'cau-ba-son',
    roadName: 'Cầu Ba Son (Quận 1 ↔ Khu đô thị Thủ Thiêm)',
    district: 'Quận 1',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-ba-son-q1',
    toNodeId: 'node-cau-ba-son-td',
    bidirectional: true,
    lengthMeters: 1200,
    estimatedTravelSeconds: 70,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.708, 10.782],
        [106.712, 10.779],
        [106.716, 10.776],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-mai-chi-tho-1',
    roadId: 'mai-chi-tho',
    roadName: 'Đại lộ Mai Chí Thọ (Cầu Ba Son → Nút giao An Phú)',
    district: 'Thủ Đức',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-ba-son-td',
    toNodeId: 'node-mai-chi-tho-td',
    bidirectional: true,
    lengthMeters: 3200,
    estimatedTravelSeconds: 200,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.716, 10.776],
        [106.73, 10.784],
        [106.745, 10.792],
      ],
    },
    floodForecast: makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-mai-chi-tho-an-phu',
    roadId: 'mai-chi-tho',
    roadName: 'Mai Chí Thọ → Xa lộ Hà Nội (An Phú)',
    district: 'Thủ Đức',
    roadClass: 'primary',
    fromNodeId: 'node-mai-chi-tho-td',
    toNodeId: 'node-an-phu-xlhn',
    bidirectional: true,
    lengthMeters: 1400,
    estimatedTravelSeconds: 110,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.745, 10.792],
        [106.748, 10.805],
      ],
    },
    floodForecast: makeForecast({ 0: 5, 1: 6, 3: 8, 6: 5, 12: 0, 24: 0 }, 'known', 'high'),
  },

  // 7. Cầu Thủ Thiêm 1 Link
  {
    id: 'seg-cau-thu-thiem-1',
    roadId: 'cau-thu-thiem-1',
    roadName: 'Cầu Thủ Thiêm 1 (Bình Thạnh ↔ Thủ Đức)',
    district: 'Bình Thạnh',
    roadClass: 'primary',
    fromNodeId: 'node-nhc-thu-thiem',
    toNodeId: 'node-thu-thiem-1-td',
    bidirectional: true,
    lengthMeters: 1100,
    estimatedTravelSeconds: 80,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7175, 10.7935],
        [106.722, 10.79],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-thu-thiem-mai-chi-tho',
    roadId: 'nguyen-co-thach',
    roadName: 'Nguyễn Cơ Thạch (Cầu Thủ Thiêm 1 → Mai Chí Thọ)',
    district: 'Thủ Đức',
    roadClass: 'primary',
    fromNodeId: 'node-thu-thiem-1-td',
    toNodeId: 'node-mai-chi-tho-td',
    bidirectional: true,
    lengthMeters: 2200,
    estimatedTravelSeconds: 150,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.722, 10.79],
        [106.733, 10.791],
        [106.745, 10.792],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },

  // 8. South Corridor: District 1 ↔ District 4 ↔ District 7
  {
    id: 'seg-ben-thanh-calmette',
    roadId: 'tran-hung-dao',
    roadName: 'Trần Hưng Đạo (Bến Thành → Calmette)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-ben-thanh',
    toNodeId: 'node-calmette-thd',
    bidirectional: true,
    lengthMeters: 750,
    estimatedTravelSeconds: 80,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.6983, 10.7725],
        [106.697, 10.766],
      ],
    },
    floodForecast: makeForecast({ 0: 4, 1: 5, 3: 6, 6: 4, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-cau-calmette',
    roadId: 'cau-calmette',
    roadName: 'Cầu Calmette (Quận 1 ↔ Quận 4)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-calmette-thd',
    toNodeId: 'node-cau-calmette-q4',
    bidirectional: true,
    lengthMeters: 600,
    estimatedTravelSeconds: 50,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.697, 10.766],
        [106.701, 10.763],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-doan-van-bo',
    roadId: 'doan-van-bo',
    roadName: 'Đoàn Văn Bơ (Cầu Calmette → Tôn Thất Thuyết)',
    district: 'Quận 4',
    roadClass: 'secondary',
    fromNodeId: 'node-cau-calmette-q4',
    toNodeId: 'node-doan-van-bo-ttt',
    bidirectional: true,
    lengthMeters: 900,
    estimatedTravelSeconds: 100,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.701, 10.763],
        [106.704, 10.758],
        [106.7055, 10.756],
      ],
    },
    // Known flood on Doan Van Bo
    floodForecast: makeForecast(
      { 0: 16, 1: 20, 3: 25, 6: 14, 12: 5, 24: 0 },
      'known',
      'medium'
    ),
  },
  {
    id: 'seg-ben-van-don-kenh-te',
    roadId: 'ben-van-don',
    roadName: 'Bến Vân Đồn → Cầu Kênh Tẻ',
    district: 'Quận 4',
    roadClass: 'primary',
    fromNodeId: 'node-cau-calmette-q4',
    toNodeId: 'node-cau-kenh-te-q4',
    bidirectional: true,
    lengthMeters: 1000,
    estimatedTravelSeconds: 90,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.701, 10.763],
        [106.702, 10.754],
      ],
    },
    floodForecast: makeForecast({ 0: 6, 1: 8, 3: 10, 6: 6, 12: 2, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-cau-kenh-te',
    roadId: 'cau-kenh-te',
    roadName: 'Cầu Kênh Tẻ (Quận 4 ↔ Quận 7)',
    district: 'Quận 4',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-kenh-te-q4',
    toNodeId: 'node-cau-kenh-te-q7',
    bidirectional: true,
    lengthMeters: 600,
    estimatedTravelSeconds: 50,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.702, 10.754],
        [106.703, 10.751],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },

  // 9. District 7: Route A (Trần Xuân Soạn Severe Tidal Flood) vs Route B (Nguyễn Hữu Thọ Safe)
  {
    id: 'seg-tran-xuan-soan',
    roadId: 'tran-xuan-soan',
    roadName: 'Trần Xuân Soạn (Kênh Tẻ tràn bờ)',
    district: 'Quận 7',
    roadClass: 'secondary',
    fromNodeId: 'node-cau-kenh-te-q7',
    toNodeId: 'node-tran-xuan-soan-mid',
    bidirectional: true,
    lengthMeters: 1300,
    estimatedTravelSeconds: 150,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.703, 10.751],
        [106.711, 10.752],
        [106.7155, 10.7525],
      ],
    },
    // Severe king-tide overflow
    floodForecast: makeForecast(
      { 0: 38, 1: 44, 3: 42, 6: 26, 12: 10, 24: 2 },
      'known',
      'high'
    ),
  },
  {
    id: 'seg-txs-htp',
    roadId: 'tran-xuan-soan-dong',
    roadName: 'Trần Xuân Soạn Đông → Huỳnh Tấn Phát',
    district: 'Quận 7',
    roadClass: 'secondary',
    fromNodeId: 'node-tran-xuan-soan-mid',
    toNodeId: 'node-ntt-htp',
    bidirectional: true,
    lengthMeters: 1600,
    estimatedTravelSeconds: 170,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7155, 10.7525],
        [106.722, 10.748],
        [106.727, 10.744],
      ],
    },
    floodForecast: makeForecast(
      { 0: 32, 1: 36, 3: 35, 6: 20, 12: 8, 24: 0 },
      'known',
      'high'
    ),
  },
  {
    id: 'seg-nguyen-huu-tho-1',
    roadId: 'nguyen-huu-tho',
    roadName: 'Nguyễn Hữu Thọ (Cầu Kênh Tẻ → Nguyễn Thị Thập)',
    district: 'Quận 7',
    roadClass: 'trunk',
    fromNodeId: 'node-cau-kenh-te-q7',
    toNodeId: 'node-nht-ntt',
    bidirectional: true,
    lengthMeters: 1400,
    estimatedTravelSeconds: 100,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.703, 10.751],
        [106.702, 10.745],
        [106.701, 10.739],
      ],
    },
    // High-elevation arterial road - Safe
    floodForecast: makeForecast({ 0: 4, 1: 6, 3: 8, 6: 4, 12: 2, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-nguyen-thi-thap',
    roadId: 'nguyen-thi-thap',
    roadName: 'Nguyễn Thị Thập (Nguyễn Hữu Thọ → Huỳnh Tấn Phát)',
    district: 'Quận 7',
    roadClass: 'primary',
    fromNodeId: 'node-nht-ntt',
    toNodeId: 'node-ntt-htp',
    bidirectional: true,
    lengthMeters: 2800,
    estimatedTravelSeconds: 230,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.701, 10.739],
        [106.714, 10.741],
        [106.727, 10.744],
      ],
    },
    floodForecast: makeForecast({ 0: 8, 1: 10, 3: 12, 6: 8, 12: 2, 24: 0 }, 'known', 'medium'),
  },
  {
    id: 'seg-nht-pmh',
    roadId: 'nguyen-van-linh',
    roadName: 'Nguyễn Văn Linh (Nguyễn Hữu Thọ → Phú Mỹ Hưng)',
    district: 'Quận 7',
    roadClass: 'trunk',
    fromNodeId: 'node-nht-ntt',
    toNodeId: 'node-pmh-nvl',
    bidirectional: true,
    lengthMeters: 2100,
    estimatedTravelSeconds: 150,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.701, 10.739],
        [106.71, 10.732],
        [106.718, 10.728],
      ],
    },
    floodForecast: makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high'),
  },

  // 10. UNKNOWN Segment (Crucial for ROUTE-QA-PROMPT.md Scenario C & E!)
  // Connector from Đoàn Văn Bơ to Cầu Kênh Tẻ with UNKNOWN sensor data
  {
    id: 'seg-doan-van-bo-connector-unknown',
    roadId: 'ton-that-thuyet-branch',
    roadName: 'Nhánh hẻm Tôn Thất Thuyết → Cầu Kênh Tẻ (Chưa đo đạc)',
    district: 'Quận 4',
    roadClass: 'tertiary',
    fromNodeId: 'node-doan-van-bo-ttt',
    toNodeId: 'node-cau-kenh-te-q4',
    bidirectional: true,
    lengthMeters: 550,
    estimatedTravelSeconds: 70,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7055, 10.756],
        [106.7035, 10.755],
        [106.702, 10.754],
      ],
    },
    // Marked as UNKNOWN: Never gets 0 cm, incurs unknown penalty
    floodForecast: makeForecast({}, 'unknown', 'low'),
  },

  // 11. Cross-River Bridge Alternatives (Q1 ↔ Q4)
  {
    id: 'seg-bach-dang-khanh-hoi',
    roadId: 'ton-duc-thang',
    roadName: 'Tôn Đức Thắng (Bạch Đằng → Cầu Khánh Hội)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-bach-dang',
    toNodeId: 'node-khanh-hoi-q1',
    bidirectional: true,
    lengthMeters: 800,
    estimatedTravelSeconds: 70,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.706, 10.775],
        [106.7065, 10.768],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-cau-khanh-hoi',
    roadId: 'cau-khanh-hoi',
    roadName: 'Cầu Khánh Hội (Quận 1 ↔ Quận 4)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-khanh-hoi-q1',
    toNodeId: 'node-khanh-hoi-q4',
    bidirectional: true,
    lengthMeters: 550,
    estimatedTravelSeconds: 45,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.7065, 10.768],
        [106.708, 10.764],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-khanh-hoi-ben-van-don',
    roadId: 'ben-van-don',
    roadName: 'Bến Vân Đồn (Cầu Khánh Hội → Cầu Calmette)',
    district: 'Quận 4',
    roadClass: 'primary',
    fromNodeId: 'node-khanh-hoi-q4',
    toNodeId: 'node-cau-calmette-q4',
    bidirectional: true,
    lengthMeters: 800,
    estimatedTravelSeconds: 75,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.708, 10.764],
        [106.704, 10.7635],
        [106.701, 10.763],
      ],
    },
    floodForecast: makeForecast({ 0: 5, 1: 7, 3: 8, 6: 5, 12: 2, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-calmette-ong-lanh-q1',
    roadId: 'tran-hung-dao',
    roadName: 'Trần Hưng Đạo (Calmette → Cầu Ông Lãnh)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-calmette-thd',
    toNodeId: 'node-ong-lanh-q1',
    bidirectional: true,
    lengthMeters: 450,
    estimatedTravelSeconds: 40,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.697, 10.766],
        [106.694, 10.763],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-cau-ong-lanh',
    roadId: 'cau-ong-lanh',
    roadName: 'Cầu Ông Lãnh (Quận 1 ↔ Quận 4)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-ong-lanh-q1',
    toNodeId: 'node-ong-lanh-q4',
    bidirectional: true,
    lengthMeters: 550,
    estimatedTravelSeconds: 45,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.694, 10.763],
        [106.697, 10.759],
      ],
    },
    floodForecast: makeForecast({ 0: 0, 1: 0, 3: 0, 6: 0, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-ong-lanh-hoang-dieu',
    roadId: 'hoang-dieu',
    roadName: 'Hoàng Diệu (Cầu Ông Lãnh → Cầu Calmette Q4)',
    district: 'Quận 4',
    roadClass: 'secondary',
    fromNodeId: 'node-ong-lanh-q4',
    toNodeId: 'node-cau-calmette-q4',
    bidirectional: true,
    lengthMeters: 600,
    estimatedTravelSeconds: 60,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.697, 10.759],
        [106.699, 10.761],
        [106.701, 10.763],
      ],
    },
    floodForecast: makeForecast({ 0: 6, 1: 8, 3: 9, 6: 5, 12: 2, 24: 0 }, 'known', 'high'),
  },

  // 12. Tan Binh & Airport Corridor (Nam Kỳ Khởi Nghĩa ↔ Nguyễn Văn Trỗi ↔ Phan Thúc Duyện)
  {
    id: 'seg-ben-thanh-nkkn',
    roadId: 'nam-ky-khoi-nghia',
    roadName: 'Nam Kỳ Khởi Nghĩa (Bến Thành → Điện Biên Phủ)',
    district: 'Quận 1',
    roadClass: 'primary',
    fromNodeId: 'node-ben-thanh',
    toNodeId: 'node-nam-ky-khoi-nghia',
    bidirectional: true,
    lengthMeters: 1600,
    estimatedTravelSeconds: 150,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.6983, 10.7725],
        [106.695, 10.778],
        [106.691, 10.784],
      ],
    },
    floodForecast: makeForecast({ 0: 2, 1: 3, 3: 4, 6: 2, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-dth-nkkn',
    roadId: 'dien-bien-phu',
    roadName: 'Điện Biên Phủ (Đinh Tiên Hoàng → Nam Kỳ Khởi Nghĩa)',
    district: 'Quận 1',
    roadClass: 'trunk',
    fromNodeId: 'node-dinh-tien-hoang',
    toNodeId: 'node-nam-ky-khoi-nghia',
    bidirectional: true,
    lengthMeters: 1300,
    estimatedTravelSeconds: 110,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.702, 10.785],
        [106.696, 10.7845],
        [106.691, 10.784],
      ],
    },
    floodForecast: makeForecast({ 0: 3, 1: 4, 3: 5, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-nkkn-phu-nhuan',
    roadId: 'nguyen-van-troi',
    roadName: 'Nguyễn Văn Trỗi (Điện Biên Phủ → Cầu Công Lý / Phú Nhuận)',
    district: 'Phú Nhuận',
    roadClass: 'primary',
    fromNodeId: 'node-nam-ky-khoi-nghia',
    toNodeId: 'node-phu-nhuan-nvt',
    bidirectional: true,
    lengthMeters: 1700,
    estimatedTravelSeconds: 140,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.691, 10.784],
        [106.685, 10.788],
        [106.678, 10.793],
      ],
    },
    floodForecast: makeForecast({ 0: 4, 1: 5, 3: 6, 6: 3, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-nvt-lang-cha-ca',
    roadId: 'hoang-van-thu',
    roadName: 'Hoàng Văn Thụ (Phú Nhuận → Vòng xoay Lăng Cha Cả)',
    district: 'Tân Bình',
    roadClass: 'primary',
    fromNodeId: 'node-phu-nhuan-nvt',
    toNodeId: 'node-lang-cha-ca',
    bidirectional: true,
    lengthMeters: 1900,
    estimatedTravelSeconds: 160,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.678, 10.793],
        [106.67, 10.795],
        [106.662, 10.797],
      ],
    },
    floodForecast: makeForecast({ 0: 5, 1: 7, 3: 8, 6: 4, 12: 0, 24: 0 }, 'known', 'high'),
  },
  {
    id: 'seg-lang-cha-ca-ptd',
    roadId: 'phan-thuc-duyen',
    roadName: 'Phan Thúc Duyện · Trường Sơn (Lăng Cha Cả → CV Hoàng Văn Thụ)',
    district: 'Tân Bình',
    roadClass: 'secondary',
    fromNodeId: 'node-lang-cha-ca',
    toNodeId: 'node-phan-thuc-duyen',
    bidirectional: true,
    lengthMeters: 800,
    estimatedTravelSeconds: 90,
    geometry: {
      type: 'LineString',
      coordinates: [
        [106.662, 10.797],
        [106.659, 10.801],
        [106.658, 10.8035],
      ],
    },
    // Flood profile matching road-phan-thuc-duyen from V3.3
    floodForecast: makeForecast(
      { 0: 14, 1: 18, 3: 22, 6: 12, 12: 4, 24: 0 },
      'known',
      'high'
    ),
  },
];
