import React from 'react';
import { useAppStore } from '../stores/app-store';

export const TopBar: React.FC = () => {
  const activeLayers = useAppStore((s) => s.activeLayers);
  const set3D = useAppStore((s) => s.set3D);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const persistedSearchQuery = useAppStore((s) => s.persistedSearchQuery);
  const dataState = useAppStore((s) => s.dataState);
  const lastUpdatedTimestamp = useAppStore((s) => s.lastUpdatedTimestamp);

  return (
    <header className="topbar" role="banner">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">≈</div>
        <div>
          <strong>Flood Map</strong>
          <span>Hồ Chí Minh City</span>
        </div>
      </div>

      <button
        className="search"
        onClick={() => setSearchOpen(true)}
        aria-label="Tìm kiếm tuyến đường"
      >
        <span className="search-icon" aria-hidden="true">⌕</span>
        <span className="search-placeholder">
          {persistedSearchQuery
            ? `Tuyến đường: ${persistedSearchQuery}`
            : 'Tìm đường lớn (Nguyễn Hữu Cảnh, Thảo Điền...)'}
        </span>
        <kbd className="search-kbd">⌘ K</kbd>
      </button>

      <div className="top-actions">
        <div className={`freshness ${dataState}`} title="Trạng thái độ tin cậy nguồn dữ liệu đầu vào">
          <span className={`live-dot ${dataState}`} aria-hidden="true"></span>
          <div>
            <strong>Mô hình ước tính</strong>
            <small>
              {dataState === 'error'
                ? 'Lỗi mạng · Chế độ offline'
                : dataState === 'stale'
                ? `Dữ liệu cũ • ${lastUpdatedTimestamp}`
                : `${lastUpdatedTimestamp} • MÔ PHỎNG`}
            </small>
          </div>
        </div>

        <button
          className={`icon-btn mode-btn ${activeLayers.is3D ? 'active' : ''}`}
          onClick={() => set3D(!activeLayers.is3D)}
          title={activeLayers.is3D ? 'Chuyển sang chế độ phẳng 2D' : 'Xem góc nghiêng 3D'}
          aria-label={activeLayers.is3D ? 'Chế độ 3D đang bật' : 'Chế độ 2D đang bật'}
        >
          {activeLayers.is3D ? '3D' : '2D'}
        </button>

        <button
          className="icon-btn settings-btn"
          title="Thông tin hệ thống Flood Map HCMC V3"
          aria-label="Thông tin hệ thống"
          onClick={() => alert('Flood Map HCMC V3 — Road-First Flood Monitoring System for Ho Chi Minh City')}
        >
          ⚙
        </button>
      </div>
    </header>
  );
};
