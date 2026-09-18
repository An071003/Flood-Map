import React, { useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '../stores/app-store';
import { WeatherService } from '../services/weather/weather-service';

export const SearchModal: React.FC = () => {
  const isSearchOpen = useAppStore((s) => s.isSearchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setSelectedAreaId = useAppStore((s) => s.setSelectedAreaId);
  const timelineHour = useAppStore((s) => s.timelineHour);

  const inputRef = useRef<HTMLInputElement>(null);

  const weatherService = useMemo(() => WeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getAreaSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  // Global hotkey: Command/Ctrl + K and Escape
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
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen, setSearchQuery]);

  const filteredSnapshots = useMemo(() => {
    if (!searchQuery.trim()) return snapshots;
    const q = searchQuery.toLowerCase().trim();
    return snapshots.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
    );
  }, [snapshots, searchQuery]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="search-modal-backdrop"
      onClick={() => setSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm khu vực"
    >
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <span className="search-modal-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Tìm theo tên đường, phường hoặc quận..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="search-modal-esc" onClick={() => setSearchOpen(false)}>
            ESC
          </kbd>
        </div>

        <div className="search-modal-results">
          {filteredSnapshots.length === 0 ? (
            <div className="search-empty-state">
              Không tìm thấy khu vực nào khớp với từ khóa "{searchQuery}"
            </div>
          ) : (
            filteredSnapshots.map((item) => (
              <div
                key={item.areaId}
                className="search-result-item"
                onClick={() => {
                  setSelectedAreaId(item.areaId);
                  setSearchOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedAreaId(item.areaId);
                    setSearchOpen(false);
                  }
                }}
              >
                <div className="result-main">
                  <strong>{item.name}</strong>
                  <span>{item.district}</span>
                </div>
                <div className="result-meta">
                  <span className={`result-badge ${item.flood.severity}`}>
                    {item.flood.severity === 'severe'
                      ? 'Nghiêm trọng'
                      : item.flood.severity === 'warning'
                      ? 'Cảnh báo'
                      : item.flood.severity === 'watch'
                      ? 'Theo dõi'
                      : 'An toàn'}
                  </span>
                  <span className="result-depth">{item.flood.estimatedDepthCm} cm</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
