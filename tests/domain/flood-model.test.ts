import { describe, it, expect } from 'vitest';
import {
  calculateFloodRisk,
  normalizeRainfallIntensity,
  normalizeAccumulation3h,
  normalizeAccumulation6h,
  clamp,
} from '../../src/domain/flood-model/engine';

describe('Flood Risk Engine', () => {
  describe('Helper normalization and clamp', () => {
    it('clamps values correctly within range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(4, 0, 10)).toBe(4);
    });

    it('normalizes rainfall intensity', () => {
      expect(normalizeRainfallIntensity(0)).toBe(0);
      expect(normalizeRainfallIntensity(25)).toBe(0.5);
      expect(normalizeRainfallIntensity(50)).toBe(1);
      expect(normalizeRainfallIntensity(100)).toBe(1); // clamped
    });

    it('normalizes 3h and 6h accumulations', () => {
      expect(normalizeAccumulation3h(40)).toBe(0.5);
      expect(normalizeAccumulation6h(60)).toBe(0.5);
    });
  });

  describe('calculateFloodRisk', () => {
    it('is deterministic: produces identical outputs for identical inputs', () => {
      const input = {
        rainRateMmH: 22,
        rain1hMm: 18,
        rain3hMm: 46,
        rain6hMm: 58,
        lowElevationScore: 0.85,
        poorDrainageScore: 0.80,
        historicalFloodScore: 0.90,
        tidePressureScore: 0.42,
        observedSensorSignal: 0.60,
      };

      const result1 = calculateFloodRisk(input);
      const result2 = calculateFloodRisk(input);

      expect(result1).toEqual(result2);
    });

    it('classifies low risk conditions as safe (< 0.30)', () => {
      const safeInput = {
        rainRateMmH: 2,
        rain1hMm: 2,
        rain3hMm: 5,
        rain6hMm: 8,
        lowElevationScore: 0.1,
        poorDrainageScore: 0.1,
        historicalFloodScore: 0.1,
        tidePressureScore: 0.1,
      };

      const result = calculateFloodRisk(safeInput);
      expect(result.severity).toBe('safe');
      expect(result.score).toBeLessThan(0.30);
      expect(result.estimatedDepthCm).toBeLessThanOrEqual(5);
    });

    it('classifies moderate conditions as watch (0.30 - 0.50)', () => {
      const watchInput = {
        rainRateMmH: 15,
        rain1hMm: 12,
        rain3hMm: 25,
        rain6hMm: 35,
        lowElevationScore: 0.5,
        poorDrainageScore: 0.5,
        historicalFloodScore: 0.4,
        tidePressureScore: 0.3,
      };

      const result = calculateFloodRisk(watchInput);
      expect(result.severity).toBe('watch');
      expect(result.score).toBeGreaterThanOrEqual(0.30);
      expect(result.score).toBeLessThan(0.50);
      expect(result.estimatedDepthCm).toBeGreaterThanOrEqual(5);
      expect(result.estimatedDepthCm).toBeLessThanOrEqual(15);
    });

    it('classifies high accumulation conditions as warning (0.50 - 0.72)', () => {
      // Prototype state C: Bình Thạnh warning ~ 28cm
      const warningInput = {
        rainRateMmH: 24,
        rain1hMm: 18,
        rain3hMm: 46,
        rain6hMm: 60,
        lowElevationScore: 0.82,
        poorDrainageScore: 0.78,
        historicalFloodScore: 0.88,
        tidePressureScore: 0.42,
      };

      const result = calculateFloodRisk(warningInput);
      expect(result.severity).toBe('warning');
      expect(result.score).toBeGreaterThanOrEqual(0.50);
      expect(result.score).toBeLessThan(0.72);
      expect(result.estimatedDepthCm).toBeGreaterThanOrEqual(16);
      expect(result.estimatedDepthCm).toBeLessThanOrEqual(35);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('classifies extreme accumulation conditions as severe (>= 0.72)', () => {
      const severeInput = {
        rainRateMmH: 55,
        rain1hMm: 45,
        rain3hMm: 85,
        rain6hMm: 130,
        lowElevationScore: 0.95,
        poorDrainageScore: 0.95,
        historicalFloodScore: 0.95,
        tidePressureScore: 0.90,
        observedSensorSignal: 0.85,
      };

      const result = calculateFloodRisk(severeInput);
      expect(result.severity).toBe('severe');
      expect(result.score).toBeGreaterThanOrEqual(0.72);
      expect(result.estimatedDepthCm).toBeGreaterThanOrEqual(36);
      expect(result.advice).toContain('Tuyệt đối không lưu thông');
    });

    it('degrades confidence when tide or sensor is missing, or data is stale/far forecast', () => {
      const baseInput = {
        rainRateMmH: 20,
        rain1hMm: 15,
        rain3hMm: 35,
        rain6hMm: 45,
        lowElevationScore: 0.6,
        poorDrainageScore: 0.6,
        historicalFloodScore: 0.6,
        tidePressureScore: 0.4,
        observedSensorSignal: 0.5,
        freshnessMinutes: 2,
        forecastHour: 0,
      };

      const baseResult = calculateFloodRisk(baseInput);

      // Missing tide and sensor
      const missingResult = calculateFloodRisk({
        ...baseInput,
        tidePressureScore: undefined,
        observedSensorSignal: undefined,
      });
      expect(missingResult.confidence).toBeLessThan(baseResult.confidence);

      // Stale data
      const staleResult = calculateFloodRisk({
        ...baseInput,
        freshnessMinutes: 45,
      });
      expect(staleResult.confidence).toBeLessThan(baseResult.confidence);

      // Distant forecast (+18h)
      const distantResult = calculateFloodRisk({
        ...baseInput,
        forecastHour: 18,
      });
      expect(distantResult.confidence).toBeLessThan(baseResult.confidence);
    });
  });
});
