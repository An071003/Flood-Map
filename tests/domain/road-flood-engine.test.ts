import { describe, it, expect } from 'vitest';
import {
  calculate3DHeight,
  calculateRoadSegmentState,
  determineConfidenceBand,
  determineRiskLevel,
} from '../../src/domain/road-flood-engine/engine';
import { MAJOR_HCMC_ROADS } from '../../src/services/geodata/hcmc-roads';

describe('Road-First Flood Engine V3', () => {
  const sampleRoad = MAJOR_HCMC_ROADS[0]; // Nguyễn Hữu Cảnh

  describe('Visual 3D Height mapping (docs/10-3D-ROAD-FLOOD-VISUAL-SPEC.md)', () => {
    it('produces distinct 3D visual heights for 5cm, 15cm, 30cm, and 50cm', () => {
      const h5 = calculate3DHeight(5);
      const h15 = calculate3DHeight(15);
      const h30 = calculate3DHeight(30);
      const h50 = calculate3DHeight(50);

      expect(h5).toBeLessThan(h15);
      expect(h15).toBeLessThan(h30);
      expect(h30).toBeLessThan(h50);

      expect(h5).toBeCloseTo(0.18, 2);
      expect(h15).toBeCloseTo(0.38, 2);
      expect(h30).toBeCloseTo(0.68, 2);
      expect(h50).toBeCloseTo(1.08, 2);
    });
  });

  describe('Risk Level thresholds (docs/08-ROAD-FLOOD-DATA-MODEL.md)', () => {
    it('classifies depths into safe, watch, warning, severe', () => {
      expect(determineRiskLevel(3)).toBe('safe');
      expect(determineRiskLevel(5)).toBe('safe');
      expect(determineRiskLevel(12)).toBe('watch');
      expect(determineRiskLevel(15)).toBe('watch');
      expect(determineRiskLevel(25)).toBe('warning');
      expect(determineRiskLevel(30)).toBe('warning');
      expect(determineRiskLevel(35)).toBe('severe');
      expect(determineRiskLevel(50)).toBe('severe');
    });
  });

  describe('Confidence Bands (docs/09-DATA-SOURCES-AND-CONFIDENCE.md)', () => {
    it('assigns high confidence at hour 0 with sensor', () => {
      const res = determineConfidenceBand(0, true);
      expect(res.band).toBe('high');
      expect(res.score).toBeGreaterThanOrEqual(0.8);
    });

    it('degrades confidence as forecast hour increases', () => {
      const h0 = determineConfidenceBand(0, false);
      const h6 = determineConfidenceBand(6, false);
      const h24 = determineConfidenceBand(24, false);

      expect(h0.score).toBeGreaterThan(h6.score);
      expect(h6.score).toBeGreaterThan(h24.score);
    });
  });

  describe('calculateRoadSegmentState', () => {
    it('is deterministic: produces identical outputs for identical inputs', () => {
      const res1 = calculateRoadSegmentState(sampleRoad, 20, 45, 0.5, 0);
      const res2 = calculateRoadSegmentState(sampleRoad, 20, 45, 0.5, 0);
      expect(res1).toEqual(res2);
    });

    it('calculates depth and risk level under heavy convective rainfall', () => {
      const result = calculateRoadSegmentState(sampleRoad, 28, 60, 0.8, 0);
      expect(result.properties.estimatedDepthCm).toBeGreaterThanOrEqual(20);
      expect(['warning', 'severe']).toContain(result.properties.riskLevel);
      expect(result.properties.drainageMinutes).toBeGreaterThan(60);
      expect(result.properties.isSimulated).toBe(true);
    });
  });
});
