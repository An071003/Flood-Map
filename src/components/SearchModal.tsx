import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useAppStore } from '../stores/app-store';
import { RoadWeatherService } from '../services/road-weather-service';
import { searchPlaces } from '../services/geodata/hcmc-places-database';
import { SearchPlace, SearchPlaceType, SearchMatchQuality } from '../types';

export const SearchModal: React.FC = () => {
  const isSearchOpen = useAppStore((s) => s.isSearchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setPersistedSearchQuery = useAppStore((s) => s.setPersistedSearchQuery);
  const setSelectedRoadId = useAppStore((s) => s.setSelectedRoadId);
  const setOriginPlace = useAppStore((s) => s.setOriginPlace);
  const setDestinationPlace = useAppStore((s) => s.setDestinationPlace);
  const isRoutePlannerOpen = useAppStore((s) => s.isRoutePlannerOpen);
  const setRoutePlannerOpen = useAppStore((s) => s.setRoutePlannerOpen);
  const fetchUserLocation = useAppStore((s) => s.fetchUserLocation);
  const isLocating = useAppStore((s) => s.isLocating);
  const timelineHour = useAppStore((s) => s.timelineHour);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(searchQuery);

  // Synchronize local input if external store query changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // V5.1 200ms Debounce for search execution
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery]);

  const weatherService = useMemo(() => RoadWeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getRoadSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  const roadSnapshotMap = useMemo(() => {
    const map = new Map<string, (typeof snapshots)[0]>();
    snapshots.forEach((s) => map.set(s.road.id, s));
    return map;
  }, [snapshots]);

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

  // V5/V5.1 Multi-category place search (Addresses, Alleys, Roads, POIs, Intersections)
  const searchResults: SearchPlace[] = useMemo(() => {
    return searchPlaces(searchQuery);
  }, [searchQuery]);

  const handleViewFlood = (place: SearchPlace) => {
    if (isRoutePlannerOpen) {
      setRoutePlannerOpen(false);
    }
    if (place.linkedRoadId) {
      setSelectedRoadId(place.linkedRoadId);
    }
    setPersistedSearchQuery(inputValue.trim() || place.name || place.label);
    setSearchOpen(false);
  };

  const handleSetOrigin = (place: SearchPlace) => {
    setOriginPlace(place);
    if (!isRoutePlannerOpen) {
      setRoutePlannerOpen(true);
    }
    setSearchOpen(false);
  };

  const handleSetDestination = (place: SearchPlace) => {
    setDestinationPlace(place);
    if (!isRoutePlannerOpen) {
      setRoutePlannerOpen(true);
    }
    setSearchOpen(false);
  };

  const handleUseCurrentLocation = async () => {
    await fetchUserLocation('origin');
    setSearchOpen(false);
  };

  const renderTypeBadge = (type: SearchPlaceType) => {
    switch (type) {
      case 'address':
        return <span className="search-type-badge address">Số nhà</span>;
      case 'alley':
        return <span className="search-type-badge alley">Hẻm</span>;
      case 'road':
        return <span className="search-type-badge road">Đường</span>;
      case 'poi':
        return <span className="search-type-badge poi">Địa điểm</span>;
      case 'intersection':
        return <span className="search-type-badge intersection">Giao lộ</span>;
      default:
        return null;
    }
  };

  const renderQualityBadge = (quality?: SearchMatchQuality) => {
    switch (quality) {
      case 'exact':
        return <span className="quality-badge exact" title="Tọa độ xác thực từ cơ sở dữ liệu mốc">Chính xác</span>;
      case 'approximate':
        return <span className="quality-badge approx" title="Vị trí ước lượng (chưa hỗ trợ số nhà chi tiết)">Ước lượng</span>;
      case 'street-level':
        return <span className="quality-badge street" title="Định vị theo tim đường">Tuyến đường</span>;
      case 'poi':
        return <span className="quality-badge poi" title="Địa điểm công cộng xác thực">Địa điểm</span>;
      default:
        return null;
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="search-modal-backdrop"
      onClick={() => setSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm địa chỉ, địa điểm và tuyến đường"
    >
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <span className="search-modal-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Tìm địa chỉ, số nhà, hẻm, địa điểm..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const results = searchPlaces(inputValue);
                if (results.length > 0) {
                  const first = results[0];
                  if (first.linkedRoadId) {
                    handleViewFlood(first);
                  } else {
                    handleSetDestination(first);
                  }
                }
              }
            }}
          />
          {inputValue && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setInputValue('');
                setSearchQuery('');
              }}
              title="Xóa từ khóa"
            >
              ×
            </button>
          )}
          <kbd className="search-modal-esc" onClick={() => setSearchOpen(false)}>
            ESC
          </kbd>
        </div>

        {/* Quick GPS Geolocation Button */}
        <div className="search-quick-actions">
          <button
            type="button"
            className="my-location-search-btn"
            disabled={isLocating}
            onClick={handleUseCurrentLocation}
          >
            <span className="location-icon" aria-hidden="true">📍</span>
            <span>
              {isLocating ? 'Đang lấy tọa độ GPS...' : 'Vị trí của tôi (Dùng làm điểm xuất phát)'}
            </span>
          </button>
        </div>

        <div className="search-modal-results">
          {searchResults.length === 0 ? (
            <div className="search-empty-state">
              Không tìm thấy địa điểm hoặc số nhà khớp với "{inputValue || searchQuery}". Hãy thử "123 Nguyễn Xí", "Hẻm 48 Điện Biên Phủ", "Bến Thành", hoặc "Thảo Điền".
            </div>
          ) : (
            searchResults.map((place) => {
              const roadSnap = place.linkedRoadId ? roadSnapshotMap.get(place.linkedRoadId) : undefined;
              const hasSnapWarning = place.routableSnapDistanceMeters && place.routableSnapDistanceMeters > 50;

              return (
                <div
                  key={place.id}
                  className="search-result-item"
                  onClick={() => {
                    if (place.linkedRoadId) {
                      handleViewFlood(place);
                    } else {
                      handleSetDestination(place);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="result-main">
                    <div className="result-title-row">
                      {renderTypeBadge(place.type)}
                      {renderQualityBadge(place.matchQuality)}
                      <strong className="result-name">{place.name || place.label}</strong>
                      {hasSnapWarning && (
                        <span
                          className="search-snap-badge"
                          title="Nằm trong hẻm hoặc ngoài mạng đường xe cơ giới chính"
                        >
                          Cách đường lớn {place.routableSnapDistanceMeters}m
                        </span>
                      )}
                    </div>
                    {place.secondaryLabel && (
                      <div className="result-secondary-label">{place.secondaryLabel}</div>
                    )}
                    <span className="result-district">{place.district}</span>
                  </div>

                  {roadSnap && (
                    <div className="result-meta">
                      <span className={`result-badge ${roadSnap.road.properties.riskLevel}`}>
                        {roadSnap.road.properties.riskLevel === 'severe'
                          ? 'Nghiêm trọng'
                          : roadSnap.road.properties.riskLevel === 'warning'
                          ? 'Cảnh báo'
                          : roadSnap.road.properties.riskLevel === 'watch'
                          ? 'Theo dõi'
                          : 'An toàn'}
                      </span>
                      <span className="result-depth">
                        {roadSnap.road.properties.estimatedDepthCm} cm
                      </span>
                    </div>
                  )}

                  {/* V5 Action Buttons */}
                  <div
                    className="search-result-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {place.linkedRoadId && (
                      <button
                        type="button"
                        className="search-act-btn view-flood"
                        onClick={() => handleViewFlood(place)}
                      >
                        Xem ngập
                      </button>
                    )}
                    <button
                      type="button"
                      className="search-act-btn set-origin"
                      onClick={() => handleSetOrigin(place)}
                    >
                      Đi từ đây
                    </button>
                    <button
                      type="button"
                      className="search-act-btn set-destination"
                      onClick={() => handleSetDestination(place)}
                    >
                      Đi đến đây
                    </button>
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
