import React, { useMemo, useState, useRef } from 'react';
import { useAppStore } from '../../stores/app-store';
import { RoutingEngine } from '../../domain/routing/routing-engine';

export const RoutePlannerPanel: React.FC = () => {
  const isRoutePlannerOpen = useAppStore((s) => s.isRoutePlannerOpen);
  const setRoutePlannerOpen = useAppStore((s) => s.setRoutePlannerOpen);
  const routeOriginId = useAppStore((s) => s.routeOriginId);
  const routeDestinationId = useAppStore((s) => s.routeDestinationId);
  const setRouteOriginId = useAppStore((s) => s.setRouteOriginId);
  const setRouteDestinationId = useAppStore((s) => s.setRouteDestinationId);
  const selectedVehicle = useAppStore((s) => s.selectedVehicle);
  const setSelectedVehicle = useAppStore((s) => s.setSelectedVehicle);
  const routeCandidates = useAppStore((s) => s.routeCandidates);
  const selectedRouteCandidateId = useAppStore((s) => s.selectedRouteCandidateId);
  const setSelectedRouteCandidateId = useAppStore((s) => s.setSelectedRouteCandidateId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const routeOmissionNote = useAppStore((s) => s.routeOmissionNote);

  type SheetState = 'collapsed' | 'half' | 'expanded';
  const [sheetState, setSheetState] = useState<SheetState>('expanded');
  const touchStartYRef = useRef<number>(0);

  const engine = useMemo(() => RoutingEngine.getInstance(), []);
  const allNodes = useMemo(() => engine.getNodes(), [engine]);

  // Group nodes by district for easy selection
  const nodesByDistrict = useMemo(() => {
    const map = new Map<string, typeof allNodes>();
    for (const node of allNodes) {
      const list = map.get(node.district) || [];
      list.push(node);
      map.set(node.district, list);
    }
    return map;
  }, [allNodes]);

  if (!isRoutePlannerOpen) return null;

  const handleSwap = () => {
    const temp = routeOriginId;
    setRouteOriginId(routeDestinationId);
    setRouteDestinationId(temp);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    return `~${mins} phút`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  const cycleSheetState = () => {
    setSheetState((prev) => {
      if (prev === 'collapsed') return 'half';
      if (prev === 'half') return 'expanded';
      return 'collapsed';
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartYRef.current;
    if (diff < -35) {
      setSheetState((prev) => (prev === 'collapsed' ? 'half' : 'expanded'));
    } else if (diff > 35) {
      setSheetState((prev) => (prev === 'expanded' ? 'half' : 'collapsed'));
    }
  };

  return (
    <section
      className={`route-planner-panel sheet-${sheetState}`}
      aria-label="Bảng lập lộ trình tránh ngập"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Drawer Pill Handle */}
      <div
        className="mobile-grab-bar"
        onClick={cycleSheetState}
        role="button"
        tabIndex={0}
        aria-label={`Trạng thái bảng lộ trình: ${sheetState}. Bấm hoặc vuốt để thay đổi`}
      >
        <span className="grab-pill"></span>
      </div>

      <div className="route-panel-header">
        <div>
          <div className="eyebrow-row">
            <span className="eyebrow">ĐỊNH TUYẾN THÔNG MINH</span>
            <span className="sim-badge">V4.2 ENGINE</span>
          </div>
          <h2>Tìm đường tránh ngập</h2>
        </div>
        <button
          className="icon-btn small close-btn"
          onClick={() => setRoutePlannerOpen(false)}
          title="Đóng bảng lập lộ trình"
          aria-label="Đóng bảng lập lộ trình"
        >
          ×
        </button>
      </div>

      {/* Origin & Destination Pickers */}
      <div className="route-input-group">
        <div className="route-input-row">
          <span className="point-badge origin" aria-hidden="true">A</span>
          <div className="select-wrap">
            <label htmlFor="origin-node-select" className="sr-only">Điểm xuất phát (A)</label>
            <select
              id="origin-node-select"
              className="route-node-select"
              value={routeOriginId || ''}
              onChange={(e) => setRouteOriginId(e.target.value)}
              aria-label="Điểm xuất phát"
            >
              <option value="" disabled>Chọn điểm xuất phát...</option>
              {Array.from(nodesByDistrict.entries()).map(([district, nodes]) => (
                <optgroup key={`origin-grp-${district}`} label={district}>
                  {nodes.map((node) => (
                    <option key={`origin-${node.id}`} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <button
          className="swap-nodes-btn"
          onClick={handleSwap}
          title="Đổi chiều xuất phát ⇄ điểm đến"
          aria-label="Đổi chiều điểm đi và điểm đến"
        >
          ⇄
        </button>

        <div className="route-input-row">
          <span className="point-badge destination" aria-hidden="true">B</span>
          <div className="select-wrap">
            <label htmlFor="dest-node-select" className="sr-only">Điểm đến (B)</label>
            <select
              id="dest-node-select"
              className="route-node-select"
              value={routeDestinationId || ''}
              onChange={(e) => setRouteDestinationId(e.target.value)}
              aria-label="Điểm đến"
            >
              <option value="" disabled>Chọn điểm đến...</option>
              {Array.from(nodesByDistrict.entries()).map(([district, nodes]) => (
                <optgroup key={`dest-grp-${district}`} label={district}>
                  {nodes.map((node) => (
                    <option key={`dest-${node.id}`} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Mode Selector */}
      <div className="vehicle-selector-strip" role="radiogroup" aria-label="Phương tiện di chuyển">
        <button
          className={`veh-tab ${selectedVehicle === 'motorbike' ? 'active' : ''}`}
          onClick={() => setSelectedVehicle('motorbike')}
          role="radio"
          aria-checked={selectedVehicle === 'motorbike'}
          aria-label="Xe máy (ngưỡng nhạy ngập >15cm)"
        >
          <span className="veh-icon" aria-hidden="true">🏍️</span>
          <div>
            <strong>Xe máy</strong>
            <small>Nhạy ngập (&gt;15cm)</small>
          </div>
        </button>

        <button
          className={`veh-tab ${selectedVehicle === 'car' ? 'active' : ''}`}
          onClick={() => setSelectedVehicle('car')}
          role="radio"
          aria-checked={selectedVehicle === 'car'}
          aria-label="Xe hơi (ngưỡng nhạy ngập >25cm)"
        >
          <span className="veh-icon" aria-hidden="true">🚗</span>
          <div>
            <strong>Xe hơi</strong>
            <small>Chịu ngập (&gt;25cm)</small>
          </div>
        </button>
      </div>

      {/* Forecast departure time notice */}
      <div className="route-forecast-pill">
        <span aria-hidden="true">🕒</span>
        <span>
          Tính theo dự báo ngập:{' '}
          <b>{timelineHour === 0 ? 'Hiện tại (Bây giờ)' : `+${timelineHour} giờ tới`}</b>
        </span>
      </div>

      {/* Candidate Omission Explanation (AGENT-V4.2 P1 & IMPLEMENT-V4.2 Phase 5) */}
      {(routeOmissionNote || routeCandidates[0]?.omissionNote) && (
        <div className="route-omission-banner" role="status" aria-live="polite">
          <span className="omission-icon" aria-hidden="true">ℹ️</span>
          <span className="omission-text">
            {routeOmissionNote || routeCandidates[0]?.omissionNote}
          </span>
        </div>
      )}

      {/* Route Candidates Result Cards */}
      <div className="route-candidates-list" role="region" aria-label="Danh sách phương án đường đi">
        {routeCandidates.length === 0 ? (
          <div className="route-empty-state">
            <p>Không tìm thấy lộ trình liên thông giữa hai điểm đã chọn.</p>
            <small>Vui lòng chọn hai nút giao thông khác trên hành lang chính.</small>
          </div>
        ) : (
          routeCandidates.map((candidate) => {
            const isSelected = candidate.id === selectedRouteCandidateId;

            return (
              <div
                key={candidate.id}
                className={`route-card ${candidate.strategy.toLowerCase()} ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={() => setSelectedRouteCandidateId(candidate.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedRouteCandidateId(candidate.id);
                  }
                }}
              >
                <div className="route-card-top">
                  <div className="strategy-tag-wrap">
                    <span className={`strategy-badge ${candidate.strategy.toLowerCase()}`}>
                      {candidate.strategyLabel}
                    </span>
                    {candidate.strategy === 'LEAST_FLOOD' && (
                      <span className="rec-badge">KHUYÊN DÙNG</span>
                    )}
                  </div>
                  <div className="route-main-metric">
                    <strong className="route-time">
                      {formatDuration(candidate.totalDurationSeconds)}
                    </strong>
                    <span className="route-dist">
                      {formatDistance(candidate.totalDistanceMeters)}
                    </span>
                  </div>
                </div>

                {/* Flood Risk & Worst Point Indicator */}
                <div className="route-flood-summary">
                  <div className="flood-stat">
                    <span className="stat-label">Mực ngập cao nhất:</span>
                    <strong
                      className={`depth-val ${
                        candidate.maxDepthCm !== undefined && candidate.maxDepthCm >= 30
                          ? 'severe'
                          : candidate.maxDepthCm !== undefined && candidate.maxDepthCm >= 15
                          ? 'warning'
                          : candidate.maxDepthCm !== undefined && candidate.maxDepthCm >= 5
                          ? 'watch'
                          : candidate.maxDepthCm !== undefined
                          ? 'safe'
                          : 'unknown'
                      }`}
                    >
                      {candidate.maxDepthCm !== undefined
                        ? candidate.maxDepthCm > 0
                          ? `${candidate.maxDepthCm} cm`
                          : '0 cm (Khô ráo)'
                        : 'Chưa có dữ liệu cảm biến'}
                    </strong>
                  </div>

                  {candidate.worstSegment && candidate.worstSegment.depthCm !== undefined && candidate.worstSegment.depthCm > 0 && (
                    <div className="worst-point">
                      <span>Đoạn trũng: </span>
                      <b>{candidate.worstSegment.roadName} (~{candidate.worstSegment.depthCm} cm)</b>
                    </div>
                  )}

                  {/* Vehicle Compatibility Semantics (IMPLEMENT-V4.2 Phase 6) */}
                  <div
                    className="compatibility-stat"
                    title="Điểm này dùng để so sánh mức phù hợp giữa các tuyến theo mô hình, không phải xác suất an toàn."
                  >
                    <div className="compat-row">
                      <span className="compat-label">Mức phù hợp:</span>
                      <strong className={`compat-badge level-${candidate.compatibilityLevel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                        {candidate.compatibilityLevel}
                      </strong>
                      <span className="compat-score">
                        (Điểm mô hình: <b>{candidate.routeScore}/100</b>)
                      </span>
                    </div>
                  </div>

                  {/* Coverage & Unknown Count (Always visible, even when 0) */}
                  <div className="route-metrics-row">
                    <div
                      className="coverage-stat"
                      title={`Đoạn có cảm biến: ${(candidate.evaluation.knownDistanceMeters / 1000).toFixed(1)} km / Tổng: ${(candidate.evaluation.totalDistanceMeters / 1000).toFixed(1)} km`}
                    >
                      <span>Độ phủ: </span>
                      <b className={candidate.coveragePercent < 80 ? 'text-warn' : 'text-good'}>
                        {candidate.coveragePercent}%
                      </b>
                    </div>

                    <div className="unknown-count-stat" title="Số phân đoạn chưa có trạm cảm biến đo đạc">
                      <span>Chưa đo: </span>
                      <b className={candidate.unknownCount > 0 ? 'text-warn' : 'text-good'}>
                        {candidate.unknownCount} đoạn
                      </b>
                      {candidate.unknownCount > 0 && candidate.evaluation.unknownDistanceMeters > 0 ? (
                        <span className="unknown-pill">
                          (~{candidate.evaluation.unknownDistanceMeters}m)
                        </span>
                      ) : (
                        <span className="unknown-pill text-good">
                          (100% cảm biến)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendation Notice */}
                <div className={`route-advice-box ${candidate.recommendationState}`}>
                  <span className="advice-dot" aria-hidden="true"></span>
                  <p>{candidate.recommendationText}</p>
                </div>

                <div className="route-explanation">
                  <small>{candidate.explanation}</small>
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="route-footer">
        <small>
          * Ngưỡng tính toán mang tính chất tham khảo dựa trên mô hình mưa &amp; triều dâng. Người lái xe cần chủ động quan sát an toàn thực địa.
        </small>
      </footer>
    </section>
  );
};
