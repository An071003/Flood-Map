import React from 'react';
import { useAppStore } from '../stores/app-store';

export const LayerRail: React.FC = () => {
  const activeLayers = useAppStore((s) => s.activeLayers);
  const toggleLayer = useAppStore((s) => s.toggleLayer);
  const set3D = useAppStore((s) => s.set3D);
  const triggerResetCamera = useAppStore((s) => s.triggerResetCamera);

  return (
    <aside className="layer-rail" aria-label="Bộ điều khiển lớp bản đồ">
      <button
        className={`rail-btn ${activeLayers.roadFlood ? 'active' : ''}`}
        onClick={() => toggleLayer('roadFlood')}
        title="Bật/tắt dải nước ngập 3D trên tuyến đường"
        aria-pressed={activeLayers.roadFlood}
        aria-label="Lớp ngập đường 3D"
      >
        ≈
      </button>

      <button
        className={`rail-btn ${activeLayers.rain ? 'active' : ''}`}
        onClick={() => toggleLayer('rain')}
        title="Bật/tắt hiệu ứng hạt mưa rơi"
        aria-pressed={activeLayers.rain}
        aria-label="Lớp mưa rơi"
      >
        ☂
      </button>

      <button
        className={`rail-btn ${activeLayers.weatherLabels ? 'active' : ''}`}
        onClick={() => toggleLayer('weatherLabels')}
        title="Bật/tắt ghim nhãn độ sâu trên đường"
        aria-pressed={activeLayers.weatherLabels}
        aria-label="Ghim độ sâu đường"
      >
        ☁
      </button>

      <button
        className={`rail-btn ${activeLayers.tide ? 'active' : ''}`}
        onClick={() => toggleLayer('tide')}
        title="Bật/tắt cảnh báo triều cường sông Sài Gòn"
        aria-pressed={activeLayers.tide}
        aria-label="Lớp triều cường"
      >
        ◒
      </button>

      <div className="rail-sep" aria-hidden="true"></div>

      <button
        className={`rail-btn ${activeLayers.is3D ? 'active' : ''}`}
        onClick={() => set3D(!activeLayers.is3D)}
        title="Chuyển đổi góc nhìn nghiêng 3D / 2D phẳng"
        aria-pressed={activeLayers.is3D}
        aria-label="Chế độ 3D"
      >
        3D
      </button>

      <button
        className="rail-btn"
        onClick={triggerResetCamera}
        title="Định vị về trung tâm toàn cảnh TP.HCM"
        aria-label="Về góc nhìn toàn cảnh thành phố"
      >
        ⌖
      </button>
    </aside>
  );
};
