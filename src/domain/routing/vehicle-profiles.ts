import { VehicleProfile, VehicleType } from '../../types';

export const VEHICLE_PROFILES: Record<VehicleType, VehicleProfile> = {
  motorbike: {
    type: 'motorbike',
    label: 'Xe máy',
    unknownPenalty: 120,
    warningPenalty: 180,
    severePenalty: 600,
    depthPenaltyCurve: [
      { minCm: 0, maxCm: 5, penalty: 0 },
      { minCm: 6, maxCm: 15, penalty: 30 },
      { minCm: 16, maxCm: 25, penalty: 180 },
      { minCm: 26, maxCm: 35, penalty: 600 },
      { minCm: 36, maxCm: null, penalty: 1200 },
    ],
    note: 'Ngưỡng định tuyến ước tính cho xe máy; không phải bảo đảm an toàn vật lý tuyệt đối.',
  },
  car: {
    type: 'car',
    label: 'Xe ô tô',
    unknownPenalty: 100,
    warningPenalty: 120,
    severePenalty: 500,
    depthPenaltyCurve: [
      { minCm: 0, maxCm: 5, penalty: 0 },
      { minCm: 6, maxCm: 15, penalty: 10 },
      { minCm: 16, maxCm: 25, penalty: 80 },
      { minCm: 26, maxCm: 35, penalty: 300 },
      { minCm: 36, maxCm: null, penalty: 1000 },
    ],
    note: 'Ngưỡng định tuyến ước tính cho xe hơi; khoảng sáng gầm xe thực tế có sự khác biệt.',
  },
};

export function getDepthPenalty(depthCm: number, profile: VehicleProfile): number {
  for (const bracket of profile.depthPenaltyCurve) {
    if (bracket.maxCm === null) {
      if (depthCm >= bracket.minCm) return bracket.penalty;
    } else {
      if (depthCm >= bracket.minCm && depthCm <= bracket.maxCm) {
        return bracket.penalty;
      }
    }
  }
  return 0;
}
