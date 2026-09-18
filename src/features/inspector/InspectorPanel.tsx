import React, { useState, useMemo, useRef } from 'react';
import { useAppStore } from '../../stores/app-store';
import { RoadWeatherService } from '../../services/road-weather-service';

const severityConfig: Record<
  string,
  { label: string; className: string; textClass: string }
> = {
  safe: { label: 'AN TOÀN', className: 'safe', textClass: 'text-safe' },
  watch: { label: 'THEO DÕI', className: 'watch', textClass: 'text-watch' },
  warning: { label: 'CẢNH BÁO', className: 'warning', textClass: 'text-warning' },
  severe: { label: 'NGHIÊM TRỌNG', className: 'severe', textClass: 'text-severe' },
};

const confidenceBandText: Record<string, { label: string; color: string }> = {
  high: { label: 'Độ tin cậy cao', color: 'var(--color-safe)' },
  medium: { label: 'Độ tin cậy trung bình', color: 'var(--color-watch)' },
  low: { label: 'Độ tin cậy thấp (ngoại suy xa)', color: 'var(--text-muted)' },
};

export const InspectorPanel: React.FC = () => {
  const selectedRoadId = useAppStore((s) => s.selectedRoadId);
  const setSelectedRoadId = useAppStore((s) => s.setSelectedRoadId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const isMobileExpanded = useAppStore((s) => s.isMobileInspectorExpanded);
  const setMobileExpanded = useAppStore((s) => s.setMobileInspectorExpanded);

  const [showDetails, setShowDetails] = useState(false);
  const touchStartYRef = useRef(0);

  const weatherService = useMemo(() => RoadWeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getRoadSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  const currentItem = useMemo(
    () => snapshots.find((s) => s.road.id === selectedRoadId),
    [snapshots, selectedRoadId]
  );

  if (!currentItem) return null;

  const road = currentItem.road;
  const p = road.properties;
  const sev = severityConfig[p.riskLevel] || severityConfig.safe;
  const conf = confidenceBandText[p.confidenceBand] || confidenceBandText.medium;

  // Touch gesture handlers for mobile bottom sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartYRef.current;
    if (diff < -40) {
      // Swiped UP -> expand
      setMobileExpanded(true);
    } else if (diff > 40) {
      // Swiped DOWN -> collapse
      setMobileExpanded(false);
    }
  };

  return (
    <section
      className={`inspector ${isMobileExpanded ? 'mobile-expanded' : ''}`}
      aria-labelledby="inspector-heading"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Drawer Grab Handle */}
      <div
        className="mobile-grab-bar"
        onClick={() => setMobileExpanded(!isMobileExpanded)}
        aria-label="Kéo để mở rộng hoặc thu gọn"
      >
        <span className="grab-pill"></span>
      </div>

      <div className="panel-topline">
        <div>
          <div className="eyebrow-row">
            <span className="eyebrow">{p.district.toUpperCase()}</span>
            <span className="sim-badge">MÔ PHỎNG</span>
            <span className="est-badge">ƯỚC TÍNH</span>
          </div>
          <h2 id="inspector-heading">{p.roadName}</h2>
        </div>
        <button
          className="icon-btn small close-btn"
          onClick={() => setSelectedRoadId(null)}
          title="Đóng bảng chi tiết"
          aria-label="Đóng bảng chi tiết"
        >
          ×
        </button>
      </div>

      {/* Hero Metric: Depth & Severity */}
      <div className="hero-metric">
        <div>
          <span className="number">{p.estimatedDepthCm}</span>
          <span className="unit">cm</span>
        </div>
        <span className={`status ${sev.className}`}>{sev.label}</span>
        <small>Mức ngập ước tính tại đoạn trũng</small>
      </div>

      {/* Key Decision Metrics Grid */}
      <div className="metric-grid decision-grid">
        <div>
          <span>Mưa tích lũy 3h</span>
          <strong>{p.rain3hMm} mm</strong>
        </div>
        <div>
          <span>Rút nước dự kiến</span>
          <strong>~{p.drainageMinutes} phút</strong>
        </div>
        <div>
          <span>Triều cường</span>
          <strong>+{p.tideImpactM} m</strong>
        </div>
        <div>
          <span>Đánh giá tin cậy</span>
          <strong style={{ color: conf.color, fontSize: '11px' }}>
            {p.confidenceBand === 'high' ? 'Cao (85%)' : p.confidenceBand === 'medium' ? 'Vừa (75%)' : 'Thấp'}
          </strong>
        </div>
      </div>

      {/* Explanation: Why is this road vulnerable? */}
      <div className="reason-box">
        <h3>Vì sao có nguy cơ ngập?</h3>
        <ul>
          {p.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>

      {/* Actionable Advice */}
      <div className={`advice ${p.riskLevel}`}>
        <span aria-hidden="true">!</span>
        <p>
          <strong>Khuyến nghị lưu thông:</strong> {p.advice}
        </p>
      </div>

      {/* Expandable Technical Details */}
      <button
        className="expand-details-btn"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
      >
        <span>Chi tiết dữ liệu kỹ thuật</span>
        <span>{showDetails ? '▲' : '▼'}</span>
      </button>

      {showDetails && (
        <div className="expanded-technical-details">
          <div className="tech-row">
            <span>Cường độ mưa 1h:</span>
            <b>{p.rain1hMm} mm/h</b>
          </div>
          <div className="tech-row">
            <span>Tọa độ neo (Anchor):</span>
            <code>{p.anchorPoint[0]}, {p.anchorPoint[1]}</code>
          </div>
          <div className="tech-row">
            <span>Điểm trũng địa hình:</span>
            <b>{Math.round(p.lowElevationScore * 100)}% trũng</b>
          </div>
          <div className="tech-row">
            <span>Cống thoát nước:</span>
            <b>{Math.round(p.poorDrainageScore * 100)}% tải</b>
          </div>
          <p className="confidence-doc">
            {conf.label}. Độ tin cậy tính toán dựa trên mức độ tích lũy mưa, triều cường cục bộ và đặc tính thoát nước của đoạn đường.
          </p>
        </div>
      )}

      <footer>
        Dữ liệu mô phỏng · Tuyến đường trục TP.HCM · Cập nhật {p.updatedAt}
      </footer>
    </section>
  );
};
