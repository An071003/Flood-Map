import React, { useMemo } from 'react';
import { useAppStore } from '../stores/app-store';
import { WeatherService } from '../services/weather/weather-service';

export const CityCard: React.FC = () => {
  const selectedAreaId = useAppStore((s) => s.selectedAreaId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const weatherService = useMemo(() => WeatherService.getInstance(), []);
  const citySummary = useMemo(
    () => weatherService.getCitySummary(timelineHour),
    [weatherService, timelineHour]
  );

  // If an area is already selected on desktop, city card remains subtly at top-left or can be toggled
  if (selectedAreaId) {
    return (
      <section className="city-card compact" aria-label="Tóm tắt thành phố">
        <div className="eyebrow">
          <span className="demo-dot" aria-hidden="true"></span>MÔ PHỎNG
        </div>
        <strong>TP.HCM · {citySummary.timestamp}</strong>
        <p>
          <b>{citySummary.warningCount} khu vực</b> cảnh báo ngập.
        </p>
      </section>
    );
  }

  return (
    <section className="city-card" aria-label="Tổng quan tình hình TP.HCM">
      <div className="eyebrow">
        <span className="demo-dot" aria-hidden="true"></span>MÔ PHỎNG
      </div>
      <strong>TP.HCM lúc {citySummary.timestamp}</strong>
      <p>
        <b>{citySummary.warningCount} khu vực</b> có nguy cơ ngập đáng chú ý trong 3 giờ tới.
      </p>

      <div className="mini-stats">
        <span>
          <small>Mưa TB</small>
          <b>{citySummary.avgRainMmH} mm/h</b>
        </span>
        <span>
          <small>Cao nhất</small>
          <b>{citySummary.maxDepthCm} cm</b>
        </span>
        <span>
          <small>Thủy triều</small>
          <b>{citySummary.tideState}</b>
        </span>
      </div>
    </section>
  );
};
