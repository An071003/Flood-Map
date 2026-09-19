import React, { useState, useMemo, useRef } from 'react';
import { useAppStore } from '../../stores/app-store';
import { RoadWeatherService } from '../../services/road-weather-service';
import { RoutingEngine } from '../../domain/routing/routing-engine';

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
  type SheetState = 'collapsed' | 'half' | 'expanded';
  const [sheetState, setSheetState] = useState<SheetState>('half');
  const [showDetails, setShowDetails] = useState(false);
  const touchStartYRef = useRef<number>(0);

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

  // Cycle sheet state on tap
  const cycleSheetState = () => {
    setSheetState((prev) => {
      if (prev === 'collapsed') return 'half';
      if (prev === 'half') return 'expanded';
      return 'collapsed';
    });
  };

  // Touch gesture handlers for mobile bottom sheet snap points
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartYRef.current;
    if (diff < -35) {
      // Swiped UP -> expand higher
      setSheetState((prev) => (prev === 'collapsed' ? 'half' : 'expanded'));
    } else if (diff > 35) {
      // Swiped DOWN -> collapse lower
      setSheetState((prev) => (prev === 'expanded' ? 'half' : 'collapsed'));
    }
  };

  return (
    <section
      className={`inspector sheet-${sheetState}`}
      aria-labelledby="inspector-heading"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Drawer Grab Handle */}
      <div
        className="mobile-grab-bar"
        onClick={cycleSheetState}
        role="button"
        tabIndex={0}
        aria-label={`Trạng thái bảng điều khiển di động: ${sheetState}. Bấm hoặc vuốt để đổi nấc`}
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

      {/* Route Planner Quick Actions */}
      <div className="inspector-route-actions">
        <button
          className="route-action-btn"
          onClick={() => {
            const nearest = RoutingEngine.getInstance().findNearestNode(p.anchorPoint[0], p.anchorPoint[1]);
            if (nearest) {
              useAppStore.getState().setRouteOriginId(nearest.node.id);
              useAppStore.getState().setRoutePlannerOpen(true);
            }
          }}
          title={`Đặt ${p.roadName} làm điểm xuất phát (A)`}
        >
          <span className="point-badge origin mini" aria-hidden="true">A</span>
          <span>Đi từ đây</span>
        </button>
        <button
          className="route-action-btn"
          onClick={() => {
            const nearest = RoutingEngine.getInstance().findNearestNode(p.anchorPoint[0], p.anchorPoint[1]);
            if (nearest) {
              useAppStore.getState().setRouteDestinationId(nearest.node.id);
              useAppStore.getState().setRoutePlannerOpen(true);
            }
          }}
          title={`Đặt ${p.roadName} làm điểm đến (B)`}
        >
          <span className="point-badge destination mini" aria-hidden="true">B</span>
          <span>Đến đây</span>
        </button>
      </div>

      {/* Hero Metric: Depth & Severity */}
      <div className="hero-metric">
        <div>
          <span className="number">{p.estimatedDepthCm}</span>
          <span className="unit">cm</span>
        </div>
        <span className={`status ${sev.className}`}>{sev.label}</span>
        <small>
          Mực nước ngập ước tính tại đoạn trũng nhất · <span className="text-tag">MÔ PHỎNG</span>
        </small>
      </div>

      {/* Key Decision Metrics Grid with Data-Class Semantics */}
      <div className="metric-grid decision-grid">
        <div title="Mưa tích lũy dự báo 3 giờ gần nhất từ mô hình thời tiết">
          <div className="metric-label-row">
            <span>Mưa tích lũy 3h</span>
            <span className="data-class-tag forecast">DỰ BÁO</span>
          </div>
          <strong>{p.rain3hMm} mm</strong>
        </div>
        <div title="Thời gian tiêu thoát nước ước tính theo khẩu độ cống và triều">
          <div className="metric-label-row">
            <span>Rút nước dự kiến</span>
            <span className="data-class-tag estimated">ƯỚC TÍNH</span>
          </div>
          <strong>~{p.drainageMinutes} phút</strong>
        </div>
        <div title="Mực nước triều dâng dự kiến tại trạm hạ lưu phụ cận">
          <div className="metric-label-row">
            <span>Triều cường</span>
            <span className="data-class-tag forecast">DỰ BÁO</span>
          </div>
          <strong>+{p.tideImpactM} m</strong>
        </div>
        <div title="Mức độ đầy đủ của dữ liệu đầu vào (mưa, triều, cống, địa hình)">
          <div className="metric-label-row">
            <span>Đầy đủ dữ liệu</span>
            <span className="data-class-tag static">ĐẦU VÀO</span>
          </div>
          <strong style={{ color: conf.color, fontSize: '12px' }}>
            {Math.round(p.confidenceScore * 100)}% ({p.confidenceBand === 'high' ? 'Cao' : p.confidenceBand === 'medium' ? 'Vừa' : 'Thấp'})
          </strong>
        </div>
      </div>

      {/* Vehicle Passability Advisory Grid */}
      <div className="vehicle-advisory-box">
        <h4>Khả năng lưu thông theo phương tiện:</h4>
        <div className="vehicle-pills">
          <span className={`veh-pill ${p.estimatedDepthCm < 20 ? 'pass' : 'fail'}`}>
            🏍️ Xe máy: {p.estimatedDepthCm < 20 ? 'Qua được' : 'Nguy hiểm / Chết máy'}
          </span>
          <span className={`veh-pill ${p.estimatedDepthCm < 25 ? 'pass' : 'fail'}`}>
            🚗 Sedan (gầm thấp): {p.estimatedDepthCm < 25 ? 'Cẩn trọng' : 'Không nên qua'}
          </span>
          <span className={`veh-pill ${p.estimatedDepthCm < 40 ? 'pass' : 'caution'}`}>
            🚙 SUV / Xe tải: {p.estimatedDepthCm < 40 ? 'Lưu thông được' : 'Hạn chế qua'}
          </span>
        </div>
      </div>

      {/* Explanation: Why is this road vulnerable? */}
      <div className="reason-box">
        <h3>Vì sao có nguy cơ ngập?</h3>
        <ul>
          {p.reasons.map((reason: string, idx: number) => (
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
        <span>Chi tiết dữ liệu kỹ thuật & xuất xứ</span>
        <span>{showDetails ? '▲' : '▼'}</span>
      </button>

      {showDetails && (
        <div className="expanded-technical-details">
          <div className="tech-row">
            <span>Cường độ mưa 1h:</span>
            <b>{p.rain1hMm} mm/h <small>(Dự báo)</small></b>
          </div>
          <div className="tech-row">
            <span>Tọa độ neo (Anchor):</span>
            <code>{p.anchorPoint[0]}, {p.anchorPoint[1]}</code>
          </div>
          <div className="tech-row">
            <span>Điểm trũng địa hình:</span>
            <b>{Math.round(p.lowElevationScore * 100)}% trũng <small>(Địa hình tĩnh)</small></b>
          </div>
          <div className="tech-row">
            <span>Tải cống thoát nước:</span>
            <b>{Math.round(p.poorDrainageScore * 100)}% tải <small>(Hạ tầng tĩnh)</small></b>
          </div>
          <div className="confidence-doc">
            <strong>Về chỉ số độ đầy đủ dữ liệu ({Math.round(p.confidenceScore * 100)}%):</strong>
            <p>
              Chỉ số phản ánh chất lượng và mức độ sẵn sàng của các biến số đầu vào (lượng mưa vệ tinh/radar, mực nước trạm thủy văn Phú An/Nhà Bè, độ dốc tự nhiên, khẩu độ cống). Đây là <em>mô hình ước tính mô phỏng</em>, chưa qua hiệu chuẩn cảm biến đo ngập thời gian thực (ground-truth).
            </p>
          </div>
        </div>
      )}

      <footer>
        Dữ liệu mô phỏng · Tuyến đường trục TP.HCM · Cập nhật {p.updatedAt}
      </footer>
    </section>
  );
};
