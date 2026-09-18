import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '../../stores/app-store';
import { RoadWeatherService } from '../../services/road-weather-service';
import { ThreeFloodLayer } from './three/ThreeFloodLayer';
import {
  HCMC_BOUNDARY_LINE_GEOJSON,
  HCMC_BOUNDARY_POLYGON_GEOJSON,
  HCMC_OUTSIDE_MASK_GEOJSON,
  HCMC_OVERVIEW_CENTER,
  HCMC_OVERVIEW_ZOOM,
} from '../../services/geodata/hcmc-boundary';

// Open-source dark vector basemap with zero API keys and zero watermarks
// Complies with docs/19-BASEMAP-BOUNDARY-HARDENING.md
const DARK_BASEMAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';

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
  const isRoutePlannerOpen = useAppStore((s) => s.isRoutePlannerOpen);
  const routeCandidates = useAppStore((s) => s.routeCandidates);
  const selectedRouteCandidateId = useAppStore((s) => s.selectedRouteCandidateId);

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
      style: DARK_BASEMAP_STYLE,
      center: [106.698, 10.782],
      zoom: 12.5,
      pitch: activeLayers.is3D ? 48 : 0,
      bearing: activeLayers.is3D ? -16 : 0,
      maxBounds: [
        [106.25, 10.30],
        [107.18, 11.28],
      ],
      attributionControl: {
        compact: true,
        customAttribution: '© OpenFreeMap, © OpenStreetMap contributors',
      },
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
          'fill-opacity': 0.72,
        },
      });

      // 2. HCMC Administrative Boundary Transparent Fill (visual hierarchy)
      map.addSource('hcmc-boundary-polygon', {
        type: 'geojson',
        data: HCMC_BOUNDARY_POLYGON_GEOJSON,
      });

      map.addLayer({
        id: 'hcmc-boundary-fill',
        type: 'fill',
        source: 'hcmc-boundary-polygon',
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': 0.04,
        },
      });

      // 3. HCMC Administrative Boundary Stroke
      map.addSource('hcmc-boundary-line', {
        type: 'geojson',
        data: HCMC_BOUNDARY_LINE_GEOJSON,
      });

      map.addLayer({
        id: 'hcmc-boundary-stroke',
        type: 'line',
        source: 'hcmc-boundary-line',
        paint: {
          'line-color': '#22d3ee',
          'line-width': 2.2,
          'line-opacity': 0.85,
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

      // 4. V4 Route Planner Layers
      map.addSource('hcmc-route-alternatives', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'hcmc-route-alternatives-line',
        type: 'line',
        source: 'hcmc-route-alternatives',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#94a3b8',
          'line-width': 5,
          'line-opacity': 0.45,
          'line-dasharray': [2, 2],
        },
      });

      map.addSource('hcmc-route-selected', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'hcmc-route-selected-casing',
        type: 'line',
        source: 'hcmc-route-selected',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#020914',
          'line-width': 12,
          'line-opacity': 0.9,
        },
      });
      map.addLayer({
        id: 'hcmc-route-selected-glow',
        type: 'line',
        source: 'hcmc-route-selected',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 9,
          'line-opacity': 0.4,
          'line-blur': 2,
        },
      });
      map.addLayer({
        id: 'hcmc-route-selected-line',
        type: 'line',
        source: 'hcmc-route-selected',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
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
            'safe',
            '#2fd39a',
            '#94a3b8',
          ],
          'line-width': 6,
          'line-opacity': 0.95,
        },
      });

      map.addSource('hcmc-route-endpoints', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'hcmc-route-endpoints-circle',
        type: 'circle',
        source: 'hcmc-route-endpoints',
        paint: {
          'circle-radius': 9,
          'circle-color': [
            'match',
            ['get', 'role'],
            'origin',
            '#2fd39a',
            'destination',
            '#ff5d73',
            '#38bdf8',
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });

      // 5. Three.js 3D Road Flood Ribbon Layer
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

  // Camera reset / City overview
  useEffect(() => {
    if (cameraResetNonce === 0) return;
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: HCMC_OVERVIEW_CENTER,
      zoom: HCMC_OVERVIEW_ZOOM,
      pitch: activeLayers.is3D ? 36 : 0,
      bearing: activeLayers.is3D ? -12 : 0,
      duration: 1000,
      essential: true,
    });
  }, [cameraResetNonce, activeLayers.is3D]);

  // V4 Route Map Sync & Camera Fit
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const altSource = map.getSource('hcmc-route-alternatives') as maplibregl.GeoJSONSource | undefined;
    const selSource = map.getSource('hcmc-route-selected') as maplibregl.GeoJSONSource | undefined;
    const endSource = map.getSource('hcmc-route-endpoints') as maplibregl.GeoJSONSource | undefined;

    if (!altSource || !selSource || !endSource) return;

    if (!isRoutePlannerOpen || routeCandidates.length === 0) {
      altSource.setData({ type: 'FeatureCollection', features: [] });
      selSource.setData({ type: 'FeatureCollection', features: [] });
      endSource.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const selectedCandidate =
      routeCandidates.find((c) => c.id === selectedRouteCandidateId) || routeCandidates[0];

    if (!selectedCandidate) return;

    // 1. Alternatives: geometry of other candidate routes
    const altFeatures = routeCandidates
      .filter((c) => c.id !== selectedCandidate.id)
      .map((c) => ({
        type: 'Feature' as const,
        properties: { id: c.id, strategy: c.strategy },
        geometry: c.geometry,
      }));
    altSource.setData({ type: 'FeatureCollection', features: altFeatures });

    // 2. Selected Route: segment by segment with flood properties
    const selFeatures = selectedCandidate.segments.map((seg) => {
      const floodState = seg.floodForecast[timelineHour] || seg.floodForecast[0];
      return {
        type: 'Feature' as const,
        properties: {
          id: seg.id,
          roadName: seg.roadName,
          riskLevel: floodState?.status === 'unknown' ? 'unknown' : floodState?.riskLevel || 'safe',
          depthCm: floodState?.estimatedDepthCm ?? 0,
        },
        geometry: seg.geometry,
      };
    });
    selSource.setData({ type: 'FeatureCollection', features: selFeatures });

    // 3. Endpoints A & B
    const coords = selectedCandidate.geometry.coordinates;
    const endpoints = [];
    if (coords.length > 0) {
      endpoints.push({
        type: 'Feature' as const,
        properties: { role: 'origin', label: 'A' },
        geometry: { type: 'Point' as const, coordinates: coords[0] },
      });
      endpoints.push({
        type: 'Feature' as const,
        properties: { role: 'destination', label: 'B' },
        geometry: { type: 'Point' as const, coordinates: coords[coords.length - 1] },
      });
    }
    endSource.setData({ type: 'FeatureCollection', features: endpoints });

    // 4. Fit camera bounds
    if (coords.length >= 2) {
      let minLng = coords[0][0];
      let maxLng = coords[0][0];
      let minLat = coords[0][1];
      let maxLat = coords[0][1];

      for (const [lng, lat] of coords) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }

      const isMobile = window.innerWidth <= 700;
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: isMobile
            ? { top: 80, bottom: 260, left: 40, right: 40 }
            : { top: 100, bottom: 100, left: 440, right: 100 },
          duration: 900,
          essential: true,
        }
      );
    }
  }, [isRoutePlannerOpen, routeCandidates, selectedRouteCandidateId, timelineHour]);

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
