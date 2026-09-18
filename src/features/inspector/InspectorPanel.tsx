import React, { useMemo } from 'react';
import { useAppStore } from '../../stores/app-store';
import { WeatherService } from '../../services/weather/weather-service';

const weatherIcons: Record<string, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  heavy_rain: '⛈️',
  storm: '⛈️',
};

const severityLabels: Record<string, { label: string; className: string }> = {
  safe: { label: 'AN TOÀN', className: 'safe' },
  watch: { label: 'THEO DÕI', className: 'watch' },
  warning: { label: 'CẢNH BÁO', className: 'warning' },
  severe: { label: 'NGHIÊM TRỌNG', className: 'severe' },
};

export const InspectorPanel: React.FC = () => {
  const selectedAreaId = useAppStore((s) => s.selectedAreaId);
  const setSelectedAreaId = useAppStore((s) => s.setSelectedAreaId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const isMobileExpanded = useAppStore((s) => s.isMobileInspectorExpanded);
  const setMobileExpanded = useAppStore((s) => s.setMobileInspectorExpanded);

  const weatherService = useMemo(() => WeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getAreaSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  const currentSnapshot = useMemo(
    () => snapshots.find((s) => s.areaId === selectedAreaId),
    [snapshots, selectedAreaId]
  );

  if (!currentSnapshot) {
    return null;
  }

  const sevInfo = severityLabels[currentSnapshot.flood.severity] || severityLabels.safe;
  const confidencePercent = Math.round(currentSnapshot.flood.confidence * 100);

  return (
    <section
      className={`inspector ${isMobileExpanded ? 'mobile-expanded' : ''}`}
      aria-labelledby="inspector-heading"
    >
      {/* Mobile Drawer Grab Handle */}
      <div
        className="mobile-grab-bar"
        onClick={() => setMobileExpanded(!isMobileExpanded)}
        aria-label="Kéo để mở rộng chi tiết"
      >
        <span className="grab-pill"></span>
      </div>

      <div className="panel-topline">
        <div>
          <span className="eyebrow">
            {currentSnapshot.district.toUpperCase()} ·{' '}
            {currentSnapshot.kind === 'demo' ? 'MÔ PHỎNG' : 'QUAN TRẮC'}
          </span>
          <h2 id="inspector-heading">{currentSnapshot.name}</h2>
        </div>
        <button
          className="icon-btn small close-btn"
          onClick={() => setSelectedAreaId(null)}
          title="Đóng bảng chi tiết"
          aria-label="Đóng bảng chi tiết"
        >
          ×
        </button>
      </div>

      <div className="condition-row">
        <span className="big-weather" aria-hidden="true">
          {weatherIcons[currentSnapshot.weather.condition] || '🌧️'}
        </span>
        <div>
          <strong>{currentSnapshot.weather.description}</strong>
          <small>
            {currentSnapshot.weather.temperatureC}°C · Gió {currentSnapshot.weather.windSpeedKmh} km/h
          </small>
        </div>
      </div>

      <div className="hero-metric">
        <div>
          <span className="number">{currentSnapshot.flood.estimatedDepthCm}</span>
          <span className="unit">cm</span>
        </div>
        <span className={`status ${sevInfo.className}`}>{sevInfo.label}</span>
        <small>Mức ngập ước tính</small>
      </div>

      <div className="metric-grid">
        <div>
          <span>Mưa 1 giờ</span>
          <strong>{currentSnapshot.weather.rain1hMm} mm</strong>
        </div>
        <div>
          <span>Mưa 3 giờ</span>
          <strong>{currentSnapshot.weather.rain3hMm} mm</strong>
        </div>
        <div>
          <span>Rút nước</span>
          <strong>
            {currentSnapshot.flood.drainMinMinutes}–{currentSnapshot.flood.drainMaxMinutes}'
          </strong>
        </div>
        <div>
          <span>Thủy triều</span>
          <strong>+0.42 m</strong>
        </div>
      </div>

      <div className="confidence">
        <div>
          <span>Độ tin cậy</span>
          <strong>{confidencePercent}%</strong>
        </div>
        <div className="bar" role="progressbar" aria-valuenow={confidencePercent} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${confidencePercent}%` }}></span>
        </div>
      </div>

      <div className="reason-box">
        <h3>Vì sao có nguy cơ?</h3>
        <ul>
          {currentSnapshot.flood.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="advice">
        <span aria-hidden="true">!</span>
        <p>
          <strong>Khuyến nghị</strong> {currentSnapshot.flood.advice}
        </p>
      </div>

      <footer>
        Nguồn dữ liệu: {currentSnapshot.kind} · cập nhật {currentSnapshot.timestamp}
      </footer>
    </section>
  );
};
