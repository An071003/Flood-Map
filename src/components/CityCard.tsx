import React, { useMemo } from 'react';
import { useAppStore } from '../stores/app-store';
import { RoadWeatherService } from '../services/road-weather-service';

export const CityCard: React.FC = () => {
  const selectedRoadId = useAppStore((s) => s.selectedRoadId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const weatherService = useMemo(() => RoadWeatherService.getInstance(), []);
  const citySummary = useMemo(
    () => weatherService.getCitySummary(timelineHour),
    [weatherService, timelineHour]
  );

  if (selectedRoadId) {
    return (
      <section className="city-card compact" aria-label="Tóm tắt tuyến đường">
        <div className="eyebrow">
          <span className="demo-dot" aria-hidden="true"></span>MÔ PHỎNG
        </div>
        <strong>TP.HCM · {citySummary.timestamp}</strong>
        <p>
          <b>{citySummary.warningRoadsCount} tuyến đường</b> có nguy cơ ngập.
        </p>
      </section>
    );
  }

  return (
    <section className="city-card" aria-label="Tổng quan tình hình ngập các tuyến đường TP.HCM">
      <div className="eyebrow">
        <span className="demo-dot" aria-hidden="true"></span>MÔ PHỎNG ƯỚC TÍNH
      </div>
      <strong>TP.HCM lúc {citySummary.timestamp}</strong>
      <p>
        Giám sát <b>{citySummary.totalMonitoredRoads} trục đường lớn</b>. Hiện có{' '}
        <b style={{ color: 'var(--color-warning)' }}>{citySummary.warningRoadsCount} tuyến</b> cần chú ý.
      </p>

      <div className="mini-stats">
        <span>
          <small>Mưa TB</small>
          <b>{citySummary.avgRainMmH} mm/h</b>
        </span>
        <span>
          <small>Ngập cao nhất</small>
          <b style={{ color: 'var(--color-severe)' }}>{citySummary.maxDepthCm} cm</b>
        </span>
        <span>
          <small>Triều cường</small>
          <b>{citySummary.tideState}</b>
        </span>
      </div>
    </section>
  );
};
