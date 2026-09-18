import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '../../stores/app-store';
import { RoadWeatherService } from '../../services/road-weather-service';
import { ThreeFloodLayer } from './three/ThreeFloodLayer';
import {
  HCMC_BOUNDARY_LINE_GEOJSON,
  HCMC_OUTSIDE_MASK_GEOJSON,
} from '../../services/geodata/hcmc-boundary';

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

interface ScreenRoadMarker {
  id: string;
  roadName: string;
  district: string;
  depthCm: number;
  riskLevel: string;
  condition: string;
  x: number;
  y: number;
  visible: boolean;
}

export const MapStage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const threeLayerRef = useRef<ThreeFloodLayer | null>(null);

  const selectedRoadId = useAppStore((s) => s.selectedRoadId);
  const setSelectedRoadId = useAppStore((s) => s.setSelectedRoadId);
  const timelineHour = useAppStore((s) => s.timelineHour);
  const activeLayers = useAppStore((s) => s.activeLayers);
  const cameraResetNonce = useAppStore((s) => s.cameraResetNonce);

  const weatherService = useMemo(() => RoadWeatherService.getInstance(), []);
  const snapshots = useMemo(
    () => weatherService.getRoadSnapshots(timelineHour),
    [weatherService, timelineHour]
  );

  const [screenMarkers, setScreenMarkers] = useState<ScreenRoadMarker[]>([]);

  // Update screen coordinates for anchor pins directly from road anchorPoint
  const updateMarkerPositions = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    const markers: ScreenRoadMarker[] = snapshots.map((item) => {
      const road = item.road;
      const [lng, lat] = road.properties.anchorPoint;
      const inBounds = bounds.contains([lng, lat]);
      const pt = map.project([lng, lat]);

      return {
        id: road.id,
        roadName: road.properties.roadName,
        district: road.properties.district,
        depthCm: road.properties.estimatedDepthCm,
        riskLevel: road.properties.riskLevel,
        condition: item.weather.condition,
        x: pt.x,
        y: pt.y,
        visible: inBounds && zoom >= 11.2,
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
      center: [106.698, 10.782],
      zoom: 12.5,
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
      // 1. HCMC Outside Dimming Mask Layer (de-emphasize areas outside HCMC)
      map.addSource('hcmc-outside-mask', {
        type: 'geojson',
        data: HCMC_OUTSIDE_MASK_GEOJSON,
      });

      map.addLayer({
        id: 'hcmc-outside-mask-fill',
        type: 'fill',
        source: 'hcmc-outside-mask',
        paint: {
          'fill-color': '#030910',
          'fill-opacity': 0.65,
        },
      });

      // 2. HCMC Administrative Boundary Line
      map.addSource('hcmc-boundary-line', {
        type: 'geojson',
        data: HCMC_BOUNDARY_LINE_GEOJSON,
      });

      map.addLayer({
        id: 'hcmc-boundary-stroke',
        type: 'line',
        source: 'hcmc-boundary-line',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 1.8,
          'line-opacity': 0.55,
          'line-dasharray': [3, 2],
        },
      });

      // 3. Road Segments GeoJSON
      const roadFeatures = snapshots.map((s) => ({
        type: 'Feature' as const,
        id: s.road.id,
        properties: {
          id: s.road.id,
          roadName: s.road.properties.roadName,
          district: s.road.properties.district,
          riskLevel: s.road.properties.riskLevel,
          depthCm: s.road.properties.estimatedDepthCm,
        },
        geometry: s.road.geometry,
      }));

      map.addSource('hcmc-roads', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: roadFeatures,
        },
      });

      // Road background casing
      map.addLayer({
        id: 'hcmc-roads-casing',
        type: 'line',
        source: 'hcmc-roads',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#071422',
          'line-width': 8,
          'line-opacity': 0.85,
        },
      });

      // Road flood colored line
      map.addLayer({
        id: 'hcmc-roads-line',
        type: 'line',
        source: 'hcmc-roads',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'riskLevel'],
            'severe',
            '#ff5d73',
            'warning',
            '#ff9f43',
            'watch',
            '#38bdf8',
            '#2fd39a',
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['get', 'depthCm'],
            0,
            4,
            15,
            5.5,
            30,
            7,
            50,
            9,
          ],
          'line-opacity': 0.9,
        },
      });

      // Road selection highlight layer
      map.addLayer({
        id: 'hcmc-roads-selected-glow',
        type: 'line',
        source: 'hcmc-roads',
        filter: ['==', ['get', 'id'], selectedRoadId || ''],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#39c6ff',
          'line-width': 12,
          'line-opacity': 0.45,
          'line-blur': 4,
        },
      });

      // Click on road
      map.on('click', 'hcmc-roads-line', (e) => {
        if (e.features && e.features.length > 0) {
          const roadId = e.features[0].properties?.id;
          if (roadId) {
            setSelectedRoadId(roadId);
          }
        }
      });

      map.on('mouseenter', 'hcmc-roads-line', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'hcmc-roads-line', () => {
        map.getCanvas().style.cursor = '';
      });

      // 4. Three.js 3D Road Flood Ribbon Layer
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

  // Update Three.js layer and GeoJSON when snapshots change
  useEffect(() => {
    if (threeLayerRef.current) {
      threeLayerRef.current.updateData(snapshots, activeLayers);
    }

    const map = mapRef.current;
    if (map && map.isStyleLoaded()) {
      if (map.getSource('hcmc-roads')) {
        const source = map.getSource('hcmc-roads') as maplibregl.GeoJSONSource;
        source.setData({
          type: 'FeatureCollection',
          features: snapshots.map((s) => ({
            type: 'Feature',
            id: s.road.id,
            properties: {
              id: s.road.id,
              roadName: s.road.properties.roadName,
              district: s.road.properties.district,
              riskLevel: s.road.properties.riskLevel,
              depthCm: s.road.properties.estimatedDepthCm,
            },
            geometry: s.road.geometry,
          })),
        });
      }

      // Update selected road filter
      if (map.getLayer('hcmc-roads-selected-glow')) {
        map.setFilter('hcmc-roads-selected-glow', [
          '==',
          ['get', 'id'],
          selectedRoadId || '',
        ]);
      }
    }

    updateMarkerPositions();
  }, [snapshots, activeLayers, selectedRoadId, updateMarkerPositions]);

  // Smooth camera flight when selectedRoadId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedRoadId) return;

    const target = snapshots.find((s) => s.road.id === selectedRoadId);
    if (target) {
      map.flyTo({
        center: target.road.properties.anchorPoint,
        zoom: 14.5,
        pitch: activeLayers.is3D ? 52 : 0,
        bearing: activeLayers.is3D ? -18 : 0,
        duration: 1000,
        essential: true,
      });
    }
  }, [selectedRoadId, activeLayers.is3D, snapshots]);

  // 3D / 2D toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      pitch: activeLayers.is3D ? 48 : 0,
      bearing: activeLayers.is3D ? -16 : 0,
      duration: 700,
    });
  }, [activeLayers.is3D]);

  // Camera reset
  useEffect(() => {
    if (cameraResetNonce === 0) return;
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [106.698, 10.782],
      zoom: 12.5,
      pitch: activeLayers.is3D ? 48 : 0,
      bearing: activeLayers.is3D ? -16 : 0,
      duration: 900,
      essential: true,
    });
  }, [cameraResetNonce, activeLayers.is3D]);

  return (
    <div
      className="map-stage-container"
      style={{ position: 'relative', width: '100%', height: '100%', background: '#07111f' }}
    >
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', background: '#07111f' }}
      />

      {/* Road Anchor Pins & Badges (Accurately anchored to road.anchorPoint) */}
      {activeLayers.weatherLabels &&
        screenMarkers.map((marker) => {
          if (!marker.visible) return null;
          const isSelected = marker.id === selectedRoadId;

          return (
            <div
              key={`pin-${marker.id}`}
              className={`road-anchor-pin ${isSelected ? 'selected' : ''} ${marker.riskLevel}`}
              style={{
                position: 'absolute',
                left: `${marker.x}px`,
                top: `${marker.y}px`,
                transform: `translate(-50%, -100%) scale(${isSelected ? 1.08 : 1})`,
                zIndex: isSelected ? 15 : 6,
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedRoadId(marker.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedRoadId(marker.id);
                }
              }}
              aria-label={`${marker.roadName}, ngập ${marker.depthCm} cm`}
            >
              <div className="road-pin-content">
                <span className="road-pin-depth">{marker.depthCm} cm</span>
                <span className="road-pin-name">{marker.roadName}</span>
              </div>
              <div className="road-pin-pointer" />
            </div>
          );
        })}
    </div>
  );
};
