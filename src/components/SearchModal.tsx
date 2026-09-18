import React, { useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '../stores/app-store';
import { RoadWeatherService } from '../services/road-weather-service';

export const SearchModal: React.FC = () => {
  const isSearchOpen = useAppStore((s) => s.isSearchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setPersistedSearchQuery = useAppStore((s) => s.setPersistedSearchQuery);
  const setSelectedRoadId = useAppStore((s) => s.setSelectedRoadId);
  const timelineHour = useAppStore((s) => s.timelineHour);

  const inputRef = useRef<HTMLInputElement>(null);

  const weatherService = useMemo(() => RoadWeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getRoadSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  // Global hotkeys: Command/Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Road-first search matching
  const filteredRoads = useMemo(() => {
    if (!searchQuery.trim()) return snapshots;
    const q = searchQuery.toLowerCase().trim();
    return snapshots.filter(
      (s) =>
        s.road.properties.roadName.toLowerCase().includes(q) ||
        s.road.properties.district.toLowerCase().includes(q)
    );
  }, [snapshots, searchQuery]);

  const handleSelectRoad = (roadId: string, roadName: string) => {
    setSelectedRoadId(roadId);
    // Persist query so the searched term remains visible
    setPersistedSearchQuery(searchQuery.trim() || roadName);
    setSearchOpen(false);
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="search-modal-backdrop"
      onClick={() => setSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm tuyến đường"
    >
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <span className="search-modal-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Tìm theo tên đường (Nguyễn Hữu Cảnh, Thảo Điền...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredRoads.length > 0) {
                handleSelectRoad(
                  filteredRoads[0].road.id,
                  filteredRoads[0].road.properties.roadName
                );
              }
            }}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Xóa từ khóa"
            >
              ×
            </button>
          )}
          <kbd className="search-modal-esc" onClick={() => setSearchOpen(false)}>
            ESC
          </kbd>
        </div>

        <div className="search-modal-results">
          {filteredRoads.length === 0 ? (
            <div className="search-empty-state">
              Không tìm thấy tuyến đường nào khớp với từ khóa "{searchQuery}". Hãy thử tìm "Nguyễn Hữu Cảnh" hoặc "Thảo Điền".
            </div>
          ) : (
            filteredRoads.map((item) => {
              const road = item.road;
              const p = road.properties;
              return (
                <div
                  key={road.id}
                  className="search-result-item"
                  onClick={() => handleSelectRoad(road.id, p.roadName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectRoad(road.id, p.roadName);
                    }
                  }}
                >
                  <div className="result-main">
                    <strong>{p.roadName}</strong>
                    <span>{p.district}</span>
                  </div>
                  <div className="result-meta">
                    <span className={`result-badge ${p.riskLevel}`}>
                      {p.riskLevel === 'severe'
                        ? 'Nghiêm trọng'
                        : p.riskLevel === 'warning'
                        ? 'Cảnh báo'
                        : p.riskLevel === 'watch'
                        ? 'Theo dõi'
                        : 'An toàn'}
                    </span>
                    <span className="result-depth">{p.estimatedDepthCm} cm</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
