import { AreaSnapshot, AreaWeather, CitySummary, DataKind, WeatherCondition } from '../../types';
import { calculateFloodRisk } from '../../domain/flood-model/engine';
import { HCMC_AREAS } from '../geodata/hcmc-areas';

// Scenarios based on docs/08-PROTOTYPE-STATES.md
export interface HourlyScenarioData {
  hour: number;
  label: string;
  shortLabel: string;
  note: string;
  cityTideLevel: number;
  cityTideState: 'Đang lên' | 'Đỉnh triều' | 'Đang rút' | 'Bình thường';
  areaConditions: Record<string, {
    condition: WeatherCondition;
    temp: number;
    rainRate: number;
    rain1h: number;
    rain3h: number;
    rain6h: number;
    wind: number;
    desc: string;
  }>;
}

// Generate calibrated 0h to 24h progression representing a typical tropical convective storm in HCMC
export function generateHourlyTimelineData(): HourlyScenarioData[] {
  const hours: HourlyScenarioData[] = [];

  for (let h = 0; h <= 24; h++) {
    let note = 'Thời tiết ổn định';
    let tideState: 'Đang lên' | 'Đỉnh triều' | 'Đang rút' | 'Bình thường' = 'Bình thường';
    let tideLevel = 0.20;

    // Convective curve: rain peaks around hour 3 to 6
    if (h === 0) {
      note = 'Nguy cơ đang tăng';
      tideState = 'Đang lên';
      tideLevel = 0.42;
    } else if (h <= 3) {
      note = 'Mưa dông phát triển nhanh';
      tideState = 'Đang lên';
      tideLevel = 0.65;
    } else if (h <= 6) {
      note = 'Đỉnh ngập và triều cường dự kiến';
      tideState = 'Đỉnh triều';
      tideLevel = 0.95;
    } else if (h <= 12) {
      note = 'Mưa giảm, nước bắt đầu rút';
      tideState = 'Đang rút';
      tideLevel = 0.50;
    } else {
      note = 'Mực nước giảm dần, thời tiết khô ráo';
      tideState = 'Bình thường';
      tideLevel = 0.15;
    }

    const areaConditions: HourlyScenarioData['areaConditions'] = {};

    HCMC_AREAS.forEach((area) => {
      // Area specific micro-climate simulation
      let rainRate = 0;
      let rain1h = 0;
      let rain3h = 0;
      let rain6h = 0;
      let temp = 30;
      let condition: WeatherCondition = 'cloudy';
      let desc = 'Nhiều mây';

      if (area.id === 'binh-thanh-nhc') {
        // Warning hotspot at h=0..4
        if (h === 0) {
          rainRate = 18; rain1h = 18; rain3h = 46; rain6h = 58; temp = 29;
          condition = 'rain'; desc = 'Mưa vừa';
        } else if (h <= 3) {
          rainRate = 28; rain1h = 28; rain3h = 62; rain6h = 75; temp = 28;
          condition = 'heavy_rain'; desc = 'Mưa to cục bộ';
        } else if (h <= 6) {
          rainRate = 12; rain1h = 14; rain3h = 48; rain6h = 82; temp = 27;
          condition = 'rain'; desc = 'Mưa rào rải rác';
        } else if (h <= 12) {
          rainRate = 3; rain1h = 4; rain3h = 15; rain6h = 35; temp = 29;
          condition = 'cloudy'; desc = 'Mây rải rác';
        } else {
          rainRate = 0; rain1h = 0; rain3h = 0; rain6h = 4; temp = 31;
          condition = 'clear'; desc = 'Trời tạnh';
        }
      } else if (area.id === 'thu-duc-thao-dien') {
        // Severe hotspot at peak
        if (h === 0) {
          rainRate = 22; rain1h = 20; rain3h = 42; rain6h = 52; temp = 28;
          condition = 'heavy_rain'; desc = 'Mưa to';
        } else if (h <= 4) {
          rainRate = 38; rain1h = 35; rain3h = 74; rain6h = 92; temp = 27;
          condition = 'storm'; desc = 'Dông sét mạnh';
        } else if (h <= 8) {
          rainRate = 15; rain1h = 16; rain3h = 52; rain6h = 85; temp = 28;
          condition = 'rain'; desc = 'Mưa rào';
        } else {
          rainRate = 0; rain1h = 0; rain3h = 5; rain6h = 15; temp = 30;
          condition = 'cloudy'; desc = 'Mây thay đổi';
        }
      } else if (area.id === 'quan-7-huynh-tan-phat' || area.id === 'quan-8-me-coc') {
        // Tidal dominated
        if (h === 0) {
          rainRate = 12; rain1h = 14; rain3h = 34; rain6h = 44; temp = 29;
          condition = 'rain'; desc = 'Mưa vừa + triều lên';
        } else if (h <= 6) {
          rainRate = 25; rain1h = 24; rain3h = 60; rain6h = 80; temp = 28;
          condition = 'heavy_rain'; desc = 'Mưa to + đỉnh triều';
        } else {
          rainRate = 2; rain1h = 2; rain3h = 8; rain6h = 22; temp = 30;
          condition = 'cloudy'; desc = 'Mây nhẹ';
        }
      } else if (area.id === 'quan-1-calmette' || area.id === 'quan-3-ky-dong') {
        // Central higher elevation
        if (h <= 2) {
          rainRate = 8; rain1h = 8; rain3h = 18; rain6h = 24; temp = 30;
          condition = 'cloudy'; desc = 'Mưa nhỏ thoáng qua';
        } else if (h <= 5) {
          rainRate = 16; rain1h = 15; rain3h = 32; rain6h = 42; temp = 29;
          condition = 'rain'; desc = 'Mưa rào';
        } else {
          rainRate = 0; rain1h = 0; rain3h = 2; rain6h = 8; temp = 32;
          condition = 'clear'; desc = 'Nắng ráo';
        }
      } else {
        // Other areas
        if (h <= 4) {
          rainRate = 10; rain1h = 10; rain3h = 24; rain6h = 34; temp = 29;
          condition = 'rain'; desc = 'Mưa rải rác';
        } else {
          rainRate = 0; rain1h = 0; rain3h = 4; rain6h = 12; temp = 31;
          condition = 'cloudy'; desc = 'Nhiều mây';
        }
      }

      areaConditions[area.id] = {
        condition,
        temp,
        rainRate,
        rain1h,
        rain3h,
        rain6h,
        wind: 10 + (h <= 4 ? 12 : 4),
        desc,
      };
    });

    hours.push({
      hour: h,
      label: h === 0 ? 'Bây giờ' : `+${h} giờ`,
      shortLabel: h === 0 ? 'NOW' : `+${h}h`,
      note,
      cityTideLevel: tideLevel,
      cityTideState: tideState,
      areaConditions,
    });
  }

  return hours;
}

const TIMELINE_DATA = generateHourlyTimelineData();

export class WeatherService {
  private static instance: WeatherService;
  private timelineData: HourlyScenarioData[] = TIMELINE_DATA;
  private kind: DataKind = 'demo';
  private freshnessMinutes = 2;

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Retrieves snapshots for all monitored areas at the given forecast hour
   */
  public getAreaSnapshots(hour: number): AreaSnapshot[] {
    const clampedHour = Math.min(Math.max(hour, 0), 24);
    const step = this.timelineData[clampedHour] || this.timelineData[0];
    const timestamp = '14:32';

    return HCMC_AREAS.map((area) => {
      const cond = step.areaConditions[area.id] || {
        condition: 'cloudy',
        temp: 30,
        rainRate: 5,
        rain1h: 5,
        rain3h: 15,
        rain6h: 25,
        wind: 12,
        desc: 'Nhiều mây',
      };

      const weather: AreaWeather = {
        condition: cond.condition,
        temperatureC: cond.temp,
        rainRateMmH: cond.rainRate,
        rain1hMm: cond.rain1h,
        rain3hMm: cond.rain3h,
        rain6hMm: cond.rain6h,
        windSpeedKmh: cond.wind,
        description: cond.desc,
      };

      const flood = calculateFloodRisk({
        rainRateMmH: weather.rainRateMmH,
        rain1hMm: weather.rain1hMm,
        rain3hMm: weather.rain3hMm,
        rain6hMm: weather.rain6hMm,
        lowElevationScore: area.lowElevationScore,
        poorDrainageScore: area.poorDrainageScore,
        historicalFloodScore: area.historicalFloodScore,
        tidePressureScore: step.cityTideLevel,
        observedSensorSignal: 0.55,
        freshnessMinutes: this.freshnessMinutes,
        forecastHour: clampedHour,
      });

      return {
        areaId: area.id,
        name: area.name,
        district: area.district,
        timestamp,
        kind: clampedHour === 0 ? this.kind : 'forecast',
        weather,
        flood,
        freshnessMinutes: this.freshnessMinutes,
        coordinates: area.coordinates,
        polygon: area.polygon,
      };
    });
  }

  /**
   * Retrieves city summary statistics for the top overview
   */
  public getCitySummary(hour: number): CitySummary {
    const snapshots = this.getAreaSnapshots(hour);
    const step = this.timelineData[hour] || this.timelineData[0];

    const warningCount = snapshots.filter(s => s.flood.severity === 'warning' || s.flood.severity === 'severe').length;
    const avgRain = Math.round(snapshots.reduce((acc, s) => acc + s.weather.rainRateMmH, 0) / snapshots.length);
    const maxDepth = Math.max(...snapshots.map(s => s.flood.estimatedDepthCm));

    return {
      timestamp: '14:32',
      totalMonitored: snapshots.length,
      warningCount,
      avgRainMmH: avgRain,
      maxDepthCm: maxDepth,
      tideState: step.cityTideState,
      tideLevelM: step.cityTideLevel,
      freshnessMinutes: this.freshnessMinutes,
    };
  }

  public getTimelineSteps(): HourlyScenarioData[] {
    return this.timelineData;
  }
}
