import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '../../stores/app-store';
import { WeatherService } from '../../services/weather/weather-service';
import { ThreeFloodLayer } from './three/ThreeFloodLayer';

const weatherIcons: Record<string, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  heavy_rain: '🌧️',
  storm: '⛈️',
};

const CARTO_DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

interface ScreenMarker {
  id: string;
  name: string;
  district: string;
  condition: string;
  temp: number;
  rainRate: number;
  depthCm: number;
  severity: string;
  x: number;
  y: number;
  visible: boolean;
}

export const MapStage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const threeLayerRef = useRef<ThreeFloodLayer | null>(null);

  const selectedAreaId = useAppStore((s) => s.selectedAreaId);
  const setSelectedAreaId = useAppStore((s) => s.setSelectedAreaId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const activeLayers = useAppStore((s) => s.activeLayers);
  const cameraResetNonce = useAppStore((s) => s.cameraResetNonce);

  const weatherService = useMemo(() => WeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getAreaSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  const [screenMarkers, setScreenMarkers] = useState<ScreenMarker[]>([]);

  // Update screen coordinates for HTML markers
  const updateMarkerPositions = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    const markers: ScreenMarker[] = snapshots.map((snapshot) => {
      const [lng, lat] = snapshot.coordinates;
      const inBounds = bounds.contains([lng, lat]);
      const point = map.project([lng, lat]);

      return {
        id: snapshot.areaId,
        name: snapshot.name,
        district: snapshot.district,
        condition: snapshot.weather.condition,
        temp: snapshot.weather.temperatureC,
        rainRate: snapshot.weather.rainRateMmH,
        depthCm: snapshot.flood.estimatedDepthCm,
        severity: snapshot.flood.severity,
        x: point.x,
        y: point.y,
        visible: inBounds && zoom >= 11,
      };
    });

    setScreenMarkers(markers);
  }, [snapshots]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: CARTO_DARK_STYLE,
      center: [106.695, 10.782],
      zoom: 12.4,
      pitch: activeLayers.is3D ? 48 : 0,
      bearing: activeLayers.is3D ? -16 : 0,
      maxBounds: [
        [106.35, 10.35],
        [107.05, 11.15],
      ],
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add GeoJSON polygon source for HCMC flood areas
      const geojsonFeatures = snapshots.map((snapshot) => ({
        type: 'Feature' as const,
        id: snapshot.areaId,
        properties: {
          id: snapshot.areaId,
          name: snapshot.name,
          district: snapshot.district,
          severity: snapshot.flood.severity,
          depthCm: snapshot.flood.estimatedDepthCm,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [snapshot.polygon],
        },
      }));

      map.addSource('flood-areas', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geojsonFeatures,
        },
      });

      // Polygon outline
      map.addLayer({
        id: 'flood-areas-line',
        type: 'line',
        source: 'flood-areas',
        paint: {
          'line-color': [
            'match',
            ['get', 'severity'],
            'severe',
            '#ff5d73',
            'warning',
            '#ff9f43',
            'watch',
            '#f7c948',
            '#2fd39a',
          ],
          'line-width': 2.5,
          'line-opacity': 0.85,
        },
      });

      // Polygon fill (semi-transparent)
      map.addLayer({
        id: 'flood-areas-fill',
        type: 'fill',
        source: 'flood-areas',
        paint: {
          'fill-color': [
            'match',
            ['get', 'severity'],
            'severe',
            '#ff5d73',
            'warning',
            '#ff9f43',
            'watch',
            '#39c6ff',
            '#2fd39a',
          ],
          'fill-opacity': 0.22,
        },
      });

      // Click on polygon area
      map.on('click', 'flood-areas-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const areaId = e.features[0].properties?.id;
          if (areaId) {
            setSelectedAreaId(areaId);
          }
        }
      });

      map.on('mouseenter', 'flood-areas-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'flood-areas-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      // Add Three.js 3D water and rain layer
      const threeLayer = new ThreeFloodLayer();
      threeLayerRef.current = threeLayer;
      map.addLayer(threeLayer);
      threeLayer.updateData(snapshots, activeLayers);

      updateMarkerPositions();
    });

    map.on('move', updateMarkerPositions);
    map.on('render', updateMarkerPositions);

    return () => {
      map.remove();
      mapRef.current = null;
      threeLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Three.js layer when data or layers change
  useEffect(() => {
    if (threeLayerRef.current) {
      threeLayerRef.current.updateData(snapshots, activeLayers);
    }

    const map = mapRef.current;
    if (map && map.isStyleLoaded() && map.getSource('flood-areas')) {
      const source = map.getSource('flood-areas') as maplibregl.GeoJSONSource;
      source.setData({
        type: 'FeatureCollection',
        features: snapshots.map((s) => ({
          type: 'Feature',
          id: s.areaId,
          properties: {
            id: s.areaId,
            name: s.name,
            district: s.district,
            severity: s.flood.severity,
            depthCm: s.flood.estimatedDepthCm,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [s.polygon],
          },
        })),
      });
    }

    updateMarkerPositions();
  }, [snapshots, activeLayers, updateMarkerPositions]);

  // Smooth camera flight when selectedAreaId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedAreaId) return;

    const targetSnapshot = snapshots.find((s) => s.areaId === selectedAreaId);
    if (targetSnapshot) {
      map.flyTo({
        center: targetSnapshot.coordinates,
        zoom: 14.2,
        pitch: activeLayers.is3D ? 54 : 0,
        bearing: activeLayers.is3D ? -22 : 0,
        duration: 1100,
        essential: true,
      });
    }
  }, [selectedAreaId, activeLayers.is3D, snapshots]);

  // Handle 3D / 2D toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      pitch: activeLayers.is3D ? 48 : 0,
      bearing: activeLayers.is3D ? -16 : 0,
      duration: 800,
    });
  }, [activeLayers.is3D]);

  // Handle camera reset
  useEffect(() => {
    if (cameraResetNonce === 0) return;
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [106.695, 10.782],
      zoom: 12.4,
      pitch: activeLayers.is3D ? 48 : 0,
      bearing: activeLayers.is3D ? -16 : 0,
      duration: 1000,
      essential: true,
    });
  }, [cameraResetNonce, activeLayers.is3D]);

  return (
    <div className="map-stage-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#07111f' }} />

      {/* Weather Billboard Markers Overlay */}
      {activeLayers.weather &&
        screenMarkers.map((marker) => {
          if (!marker.visible) return null;
          const isSelected = marker.id === selectedAreaId;

          return (
            <div
              key={`weather-${marker.id}`}
              className={`weather-marker-overlay ${isSelected ? 'selected' : ''}`}
              style={{
                position: 'absolute',
                left: `${marker.x}px`,
                top: `${marker.y}px`,
                transform: `translate(-50%, -50%) scale(${isSelected ? 1.08 : 1})`,
                zIndex: isSelected ? 12 : 5,
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedAreaId(marker.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedAreaId(marker.id);
                }
              }}
              aria-label={`${marker.name}, ${marker.temp}°C, ${marker.depthCm} cm`}
            >
              <div className="weather-marker-content">
                <span className="marker-icon">{weatherIcons[marker.condition] || '🌧️'}</span>
                <div className="marker-text">
                  <strong className="marker-temp">{marker.temp}°</strong>
                  <small className="marker-name">{marker.district}</small>
                </div>
              </div>
            </div>
          );
        })}

      {/* Depth Pins Overlay */}
      {activeLayers.flood &&
        screenMarkers.map((marker) => {
          if (!marker.visible || marker.depthCm < 5) return null;
          const isSelected = marker.id === selectedAreaId;
          const isSevere = marker.severity === 'severe';
          const isWarning = marker.severity === 'warning';

          return (
            <div
              key={`depth-${marker.id}`}
              className={`depth-pin-overlay ${isSelected ? 'selected' : ''} ${isSevere ? 'severe' : ''} ${isWarning ? 'warning' : ''}`}
              style={{
                position: 'absolute',
                left: `${marker.x + 35}px`,
                top: `${marker.y + 24}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 13 : 6,
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedAreaId(marker.id)}
            >
              <strong>{marker.depthCm} cm</strong>
              <span>
                {marker.severity === 'severe'
                  ? 'NGHIÊM TRỌNG'
                  : marker.severity === 'warning'
                  ? 'CẢNH BÁO'
                  : 'THEO DÕI'}
              </span>
            </div>
          );
        })}
    </div>
  );
};
