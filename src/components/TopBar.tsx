import React from 'react';
import { useAppStore } from '../stores/app-store';

export const TopBar: React.FC = () => {
  const activeLayers = useAppStore((s) => s.activeLayers);
  const set3D = useAppStore((s) => s.set3D);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);

  return (
    <header className="topbar">
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
        aria-label="Tìm kiếm khu vực hoặc tuyến đường"
      >
        <span className="search-icon" aria-hidden="true">⌕</span>
        <span className="search-placeholder">Tìm quận, phường, đường...</span>
        <kbd className="search-kbd">⌘ K</kbd>
      </button>

      <div className="top-actions">
        <div className="freshness">
          <span className="live-dot" aria-hidden="true"></span>
          <div>
            <strong>Dữ liệu mới</strong>
            <small>14:32 • 2 phút trước</small>
          </div>
        </div>

        <button
          className={`icon-btn mode-btn ${activeLayers.is3D ? 'active' : ''}`}
          onClick={() => set3D(!activeLayers.is3D)}
          title={activeLayers.is3D ? 'Chuyển sang 2D' : 'Chuyển sang 3D'}
          aria-label={activeLayers.is3D ? 'Chế độ 3D đang bật' : 'Chế độ 2D đang bật'}
        >
          {activeLayers.is3D ? '3D' : '2D'}
        </button>

        <button
          className="icon-btn settings-btn"
          title="Cài đặt hệ thống"
          aria-label="Cài đặt"
          onClick={() => alert('Flood Map HCMC v1.0 — Dữ liệu khí tượng và mô hình ngập cục bộ')}
        >
          ⚙
        </button>
      </div>
    </header>
  );
};
