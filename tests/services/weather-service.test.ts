import { describe, it, expect } from 'vitest';
import { WeatherService, generateHourlyTimelineData } from '../../src/services/weather/weather-service';

describe('WeatherService & Scenarios', () => {
  it('generates 25 hourly scenario steps (0 to 24)', () => {
    const steps = generateHourlyTimelineData();
    expect(steps.length).toBe(25);
    expect(steps[0].label).toBe('Bây giờ');
    expect(steps[0].shortLabel).toBe('NOW');
    expect(steps[24].label).toBe('+24 giờ');
    expect(steps[24].shortLabel).toBe('+24h');
  });

  it('retrieves snapshots for all monitored areas at hour 0', () => {
    const service = WeatherService.getInstance();
    const snapshots = service.getAreaSnapshots(0);

    expect(snapshots.length).toBeGreaterThanOrEqual(8);
    const binhThanh = snapshots.find((s) => s.areaId === 'binh-thanh-nhc');
    expect(binhThanh).toBeDefined();
    expect(binhThanh?.district).toBe('Bình Thạnh');
    expect(binhThanh?.flood.severity).toBe('warning');
    expect(binhThanh?.flood.estimatedDepthCm).toBeGreaterThan(15);
  });

  it('calculates city summary correctly', () => {
    const service = WeatherService.getInstance();
    const summary = service.getCitySummary(0);

    expect(summary.totalMonitored).toBeGreaterThanOrEqual(8);
    expect(summary.warningCount).toBeGreaterThan(0);
    expect(summary.maxDepthCm).toBeGreaterThan(0);
    expect(summary.tideState).toBeDefined();
  });
});
