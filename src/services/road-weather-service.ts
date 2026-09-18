import { CitySummary, RoadFloodSnapshot, RoadSegment, TimelineStep, WeatherCondition } from '../types';
import { MAJOR_HCMC_ROADS } from './geodata/hcmc-roads';
import { calculateRoadSegmentState } from '../domain/road-flood-engine/engine';

export interface RoadTimelineHourly {
  hour: number;
  label: string;
  shortLabel: string;
  note: string;
  trend: 'rising' | 'peak' | 'receding' | 'stable';
  cityTideLevelM: number;
  cityTideState: 'Đang lên' | 'Đỉnh triều' | 'Đang rút' | 'Bình thường';
  rainIntensityFactor: number;
}

export const TIMELINE_STEPS: RoadTimelineHourly[] = [
  { hour: 0, label: 'Bây giờ', shortLabel: 'NOW', note: 'Mưa đang lan rộng, nguy cơ ngập tăng', trend: 'rising', cityTideLevelM: 0.42, cityTideState: 'Đang lên', rainIntensityFactor: 1.0 },
  { hour: 1, label: '+1 giờ', shortLabel: '+1h', note: 'Mưa rào dồn dập tại các quận trũng', trend: 'rising', cityTideLevelM: 0.55, cityTideState: 'Đang lên', rainIntensityFactor: 1.25 },
  { hour: 3, label: '+3 giờ', shortLabel: '+3h', note: 'Đỉnh ngập do mưa tích lũy và triều lên', trend: 'peak', cityTideLevelM: 0.78, cityTideState: 'Đỉnh triều', rainIntensityFactor: 1.4 },
  { hour: 6, label: '+6 giờ', shortLabel: '+6h', note: 'Mưa ngớt, triều bắt đầu hạ chậm', trend: 'receding', cityTideLevelM: 0.62, cityTideState: 'Đang rút', rainIntensityFactor: 0.6 },
  { hour: 12, label: '+12 giờ', shortLabel: '+12h', note: 'Nước rút phần lớn trên các tuyến trục', trend: 'receding', cityTideLevelM: 0.35, cityTideState: 'Đang rút', rainIntensityFactor: 0.15 },
  { hour: 24, label: '+24 giờ', shortLabel: '+24h', note: 'Thời tiết khô ráo, đường thông thoáng', trend: 'stable', cityTideLevelM: 0.20, cityTideState: 'Bình thường', rainIntensityFactor: 0.05 },
];

export class RoadWeatherService {
  private static instance: RoadWeatherService;
  private roads: RoadSegment[] = MAJOR_HCMC_ROADS;

  public static getInstance(): RoadWeatherService {
    if (!RoadWeatherService.instance) {
      RoadWeatherService.instance = new RoadWeatherService();
    }
    return RoadWeatherService.instance;
  }

  public getRoadSnapshots(hour: number): RoadFloodSnapshot[] {
    const clampedH = Math.min(Math.max(hour, 0), 24);

    // Find nearest or interpolate step
    let step = TIMELINE_STEPS.find((s) => s.hour === clampedH);
    if (!step) {
      // Linear approximation from surrounding steps
      const prevStep = [...TIMELINE_STEPS].reverse().find((s) => s.hour <= clampedH) || TIMELINE_STEPS[0];
      const nextStep = TIMELINE_STEPS.find((s) => s.hour >= clampedH) || TIMELINE_STEPS[TIMELINE_STEPS.length - 1];
      const t = prevStep.hour === nextStep.hour ? 0 : (clampedH - prevStep.hour) / (nextStep.hour - prevStep.hour);

      step = {
        hour: clampedH,
        label: `+${clampedH} giờ`,
        shortLabel: `+${clampedH}h`,
        note: clampedH <= 4 ? 'Nguy cơ ngập đang tăng' : 'Mực nước đang hạ dần',
        trend: clampedH <= 4 ? 'rising' : 'receding',
        cityTideLevelM: prevStep.cityTideLevelM + (nextStep.cityTideLevelM - prevStep.cityTideLevelM) * t,
        cityTideState: clampedH <= 4 ? 'Đang lên' : 'Đang rút',
        rainIntensityFactor: prevStep.rainIntensityFactor + (nextStep.rainIntensityFactor - prevStep.rainIntensityFactor) * t,
      };
    }

    return this.roads.map((road) => {
      const baseRain1h = road.properties.rain1hMm;
      const baseRain3h = road.properties.rain3hMm;

      const currentRain1h = Math.max(0, baseRain1h * step.rainIntensityFactor);
      const currentRain3h = Math.max(0, baseRain3h * (step.hour <= 3 ? 0.7 + step.hour * 0.2 : Math.max(0.2, 1.3 - (step.hour - 3) * 0.1)));

      const calculatedRoad = calculateRoadSegmentState(
        road,
        currentRain1h,
        currentRain3h,
        step.cityTideLevelM,
        clampedH
      );

      let condition: WeatherCondition = 'rain';
      let desc = 'Mưa vừa';
      if (currentRain1h === 0) {
        condition = 'cloudy';
        desc = 'Nhiều mây';
      } else if (currentRain1h > 20) {
        condition = 'heavy_rain';
        desc = 'Mưa to xối xả';
      } else if (currentRain1h > 30) {
        condition = 'storm';
        desc = 'Dông sét ngập sâu';
      }

      return {
        road: calculatedRoad,
        weather: {
          condition,
          temperatureC: clampedH <= 6 ? 28 : 31,
          rainRateMmH: Math.round(currentRain1h * 10) / 10,
          windSpeedKmh: clampedH <= 4 ? 18 : 10,
          description: desc,
        },
      };
    });
  }

  public getCitySummary(hour: number): CitySummary {
    const snapshots = this.getRoadSnapshots(hour);
    const step = TIMELINE_STEPS.find((s) => s.hour === hour) || TIMELINE_STEPS[0];

    const warningRoads = snapshots.filter(
      (s) => s.road.properties.riskLevel === 'warning' || s.road.properties.riskLevel === 'severe'
    );
    const avgRain = Math.round(
      snapshots.reduce((acc, s) => acc + s.weather.rainRateMmH, 0) / snapshots.length
    );
    const maxDepth = Math.max(...snapshots.map((s) => s.road.properties.estimatedDepthCm));

    return {
      timestamp: '14:32',
      totalMonitoredRoads: snapshots.length,
      warningRoadsCount: warningRoads.length,
      avgRainMmH: avgRain,
      maxDepthCm: maxDepth,
      tideState: step.cityTideState,
      tideLevelM: step.cityTideLevelM,
      freshnessMinutes: 2,
      isSimulated: true,
    };
  }

  public getTimelineSteps(): TimelineStep[] {
    return TIMELINE_STEPS.map((s) => ({
      hour: s.hour,
      label: s.label,
      shortLabel: s.shortLabel,
      note: s.note,
      trend: s.trend,
    }));
  }
}
