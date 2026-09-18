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
        className={`rail-btn ${activeLayers.flood ? 'active' : ''}`}
        onClick={() => toggleLayer('flood')}
        title="Lớp nước ngập 3D"
        aria-pressed={activeLayers.flood}
      >
        ≈
      </button>

      <button
        className={`rail-btn ${activeLayers.rain ? 'active' : ''}`}
        onClick={() => toggleLayer('rain')}
        title="Lớp mưa hạt và mây dông"
        aria-pressed={activeLayers.rain}
      >
        ☂
      </button>

      <button
        className={`rail-btn ${activeLayers.weather ? 'active' : ''}`}
        onClick={() => toggleLayer('weather')}
        title="Nhãn thời tiết khu vực"
        aria-pressed={activeLayers.weather}
      >
        ☁
      </button>

      <button
        className={`rail-btn ${activeLayers.tide ? 'active' : ''}`}
        onClick={() => toggleLayer('tide')}
        title="Áp lực triều cường"
        aria-pressed={activeLayers.tide}
      >
        ◒
      </button>

      <div className="rail-sep" aria-hidden="true"></div>

      <button
        className={`rail-btn ${activeLayers.is3D ? 'active' : ''}`}
        onClick={() => set3D(!activeLayers.is3D)}
        title="Góc nhìn 3D nghiêng"
        aria-pressed={activeLayers.is3D}
      >
        3D
      </button>

      <button
        className="rail-btn"
        onClick={triggerResetCamera}
        title="Định vị về trung tâm TP.HCM"
        aria-label="Về góc nhìn toàn cảnh thành phố"
      >
        ⌖
      </button>
    </aside>
  );
};
