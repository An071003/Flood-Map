import * as THREE from 'three';
import maplibregl, { CustomLayerInterface, Map as MapLibreMap } from 'maplibre-gl';
import { ActiveLayers, RoadFloodSnapshot } from '../../../types';
import { calculate3DHeight } from '../../../domain/road-flood-engine/engine';

interface Road3DEntry {
  ribbonMesh: THREE.Mesh;
  wallMesh: THREE.Mesh;
  topMaterial: THREE.MeshPhysicalMaterial;
  wallMaterial: THREE.MeshStandardMaterial;
  baseThickness: number;
  currentScale: number;
  targetScale: number;
  riskLevel: string;
}

export class ThreeFloodLayer implements CustomLayerInterface {
  public id = 'three-road-flood-layer';
  public type = 'custom' as const;
  public renderingMode = '3d' as const;

  private map: MapLibreMap | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.Camera = new THREE.Camera();

  private roadRibbons: Map<string, Road3DEntry> = new Map();

  // Rain particles
  private rainParticles: THREE.Points | null = null;
  private rainGeometry: THREE.BufferGeometry | null = null;
  private rainPositions: Float32Array | null = null;
  private rainCount = 1200;

  private activeLayers: ActiveLayers = {
    roadFlood: true,
    rain: true,
    weatherLabels: true,
    tide: true,
    is3D: true,
    hcmcBoundary: true,
  };

  private snapshots: RoadFloodSnapshot[] = [];
  private clock: THREE.Clock = new THREE.Clock();
  private elapsedTime = 0;

  public onAdd(map: MapLibreMap, gl: WebGLRenderingContext): void {
    this.map = map;

    // Lock camera matrix for MapLibre projection
    this.camera.matrixAutoUpdate = false;
    this.camera.matrixWorld.identity();
    this.camera.matrixWorldInverse.identity();

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;

    // Realistic outdoor lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.6);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    sunLight.position.set(0.6, -0.8, 1.2).normalize();
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
    rimLight.position.set(-0.6, 0.8, 0.9).normalize();
    this.scene.add(rimLight);

    this.initRoadRibbons();
    this.initRainParticles();
  }

  private initRoadRibbons(): void {
    if (this.snapshots.length === 0) return;

    this.snapshots.forEach((item) => {
      const road = item.road;
      const coords = road.geometry.coordinates;
      if (coords.length < 2) return;

      const mercatorPts = coords.map(([lng, lat]) =>
        maplibregl.MercatorCoordinate.fromLngLat([lng, lat])
      );

      const origin = mercatorPts[0];
      const meterUnits = origin.meterInMercatorCoordinateUnits();
      // Ribbon width: ~22 meters wide in Mercator units
      const halfWidth = 11 * meterUnits;

      // 3D elevation height from visual spec
      const depthCm = road.properties.estimatedDepthCm;
      const visualHeight = calculate3DHeight(depthCm);
      const elevationMeters = visualHeight * 260 * meterUnits;

      // Build ribbon vertices and faces
      const topVertices: number[] = [];
      const topIndices: number[] = [];
      const wallVertices: number[] = [];
      const wallIndices: number[] = [];

      for (let i = 0; i < mercatorPts.length; i++) {
        const curr = mercatorPts[i];
        let dirX = 0;
        let dirY = 0;

        if (i < mercatorPts.length - 1) {
          const next = mercatorPts[i + 1];
          dirX = next.x - curr.x;
          dirY = next.y - curr.y;
        } else {
          const prev = mercatorPts[i - 1];
          dirX = curr.x - prev.x;
          dirY = curr.y - prev.y;
        }

        const len = Math.hypot(dirX, dirY) || 1;
        const normX = -dirY / len;
        const normY = dirX / len;

        const leftX = curr.x - origin.x + normX * halfWidth;
        const leftY = curr.y - origin.y + normY * halfWidth;
        const rightX = curr.x - origin.x - normX * halfWidth;
        const rightY = curr.y - origin.y - normY * halfWidth;

        // Top water surface (elevated)
        topVertices.push(leftX, leftY, elevationMeters);
        topVertices.push(rightX, rightY, elevationMeters);

        // Side walls (from ground to elevated water surface)
        wallVertices.push(leftX, leftY, 0.00001);
        wallVertices.push(leftX, leftY, elevationMeters);
        wallVertices.push(rightX, rightY, 0.00001);
        wallVertices.push(rightX, rightY, elevationMeters);

        if (i < mercatorPts.length - 1) {
          const base = i * 2;
          topIndices.push(base, base + 1, base + 2);
          topIndices.push(base + 1, base + 3, base + 2);

          const wBase = i * 4;
          // Left wall
          wallIndices.push(wBase, wBase + 1, wBase + 4);
          wallIndices.push(wBase + 1, wBase + 5, wBase + 4);
          // Right wall
          wallIndices.push(wBase + 2, wBase + 6, wBase + 3);
          wallIndices.push(wBase + 3, wBase + 6, wBase + 7);
        }
      }

      const topGeo = new THREE.BufferGeometry();
      topGeo.setAttribute('position', new THREE.Float32BufferAttribute(topVertices, 3));
      topGeo.setIndex(topIndices);
      topGeo.computeVertexNormals();

      const wallGeo = new THREE.BufferGeometry();
      wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallVertices, 3));
      wallGeo.setIndex(wallIndices);
      wallGeo.computeVertexNormals();

      const colors = this.getColorsByRisk(road.properties.riskLevel);

      const topMaterial = new THREE.MeshPhysicalMaterial({
        color: colors.topColor,
        roughness: 0.15,
        metalness: 0.15,
        transmission: 0.45,
        transparent: true,
        opacity: colors.opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const wallMaterial = new THREE.MeshStandardMaterial({
        color: colors.wallColor,
        roughness: 0.35,
        transparent: true,
        opacity: Math.min(0.9, colors.opacity + 0.15),
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const topMesh = new THREE.Mesh(topGeo, topMaterial);
      const wallMesh = new THREE.Mesh(wallGeo, wallMaterial);

      topMesh.position.set(origin.x, origin.y, 0);
      wallMesh.position.set(origin.x, origin.y, 0);

      this.scene.add(wallMesh);
      this.scene.add(topMesh);

      this.roadRibbons.set(road.id, {
        ribbonMesh: topMesh,
        wallMesh,
        topMaterial,
        wallMaterial,
        baseThickness: elevationMeters,
        currentScale: 1.0,
        targetScale: 1.0,
        riskLevel: road.properties.riskLevel,
      });
    });
  }

  private getColorsByRisk(risk: string) {
    if (risk === 'severe') {
      return { topColor: 0x1d4ed8, wallColor: 0x0f2b75, opacity: 0.82 };
    }
    if (risk === 'warning') {
      return { topColor: 0x2563eb, wallColor: 0x1e3a8a, opacity: 0.72 };
    }
    if (risk === 'watch') {
      return { topColor: 0x38bdf8, wallColor: 0x0369a1, opacity: 0.58 };
    }
    return { topColor: 0x2fd39a, wallColor: 0x0f766e, opacity: 0.38 };
  }

  private initRainParticles(): void {
    const centerMercator = maplibregl.MercatorCoordinate.fromLngLat([106.69, 10.78]);
    const radius = 0.08;

    this.rainPositions = new Float32Array(this.rainCount * 3);

    for (let i = 0; i < this.rainCount; i++) {
      const i3 = i * 3;
      this.rainPositions[i3] = centerMercator.x + (Math.random() - 0.5) * radius;
      this.rainPositions[i3 + 1] = centerMercator.y + (Math.random() - 0.5) * radius;
      this.rainPositions[i3 + 2] = Math.random() * 0.012 + 0.0003;
    }

    this.rainGeometry = new THREE.BufferGeometry();
    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));

    const rainMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 2.2,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.rainParticles = new THREE.Points(this.rainGeometry, rainMaterial);
    this.scene.add(this.rainParticles);
  }

  public updateData(snapshots: RoadFloodSnapshot[], activeLayers: ActiveLayers): void {
    this.snapshots = snapshots;
    this.activeLayers = activeLayers;

    if (this.roadRibbons.size === 0) {
      this.initRoadRibbons();
    }

    snapshots.forEach((item) => {
      const entry = this.roadRibbons.get(item.road.id);
      if (entry) {
        const visible = activeLayers.roadFlood;
        entry.ribbonMesh.visible = visible;
        entry.wallMesh.visible = visible;

        const colors = this.getColorsByRisk(item.road.properties.riskLevel);
        entry.topMaterial.color.setHex(colors.topColor);
        entry.topMaterial.opacity = colors.opacity;
        entry.wallMaterial.color.setHex(colors.wallColor);

        // Visual target height
        const depth = item.road.properties.estimatedDepthCm;
        const targetScale = Math.max(0.2, (depth + 4) / 26);
        entry.targetScale = targetScale;
      }
    });

    if (this.rainParticles) {
      this.rainParticles.visible = activeLayers.rain;
    }

    this.map?.triggerRepaint();
  }

  public render(
    _gl: WebGLRenderingContext | WebGL2RenderingContext,
    options: maplibregl.CustomRenderMethodInput
  ): void {
    const m = new THREE.Matrix4().fromArray(options.modelViewProjectionMatrix);
    this.camera.projectionMatrix = m;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.elapsedTime += delta;

    // Smoothly scale road ribbons
    this.roadRibbons.forEach((entry) => {
      entry.currentScale += (entry.targetScale - entry.currentScale) * 0.12;
      entry.ribbonMesh.scale.set(1, 1, Math.max(0.1, entry.currentScale));
      entry.wallMesh.scale.set(1, 1, Math.max(0.1, entry.currentScale));
    });

    // Animate rain falling
    if (this.rainParticles && this.rainPositions && this.activeLayers.rain) {
      const fallSpeed = delta * 0.008;
      for (let i = 0; i < this.rainCount; i++) {
        const i3 = i * 3 + 2;
        this.rainPositions[i3] -= fallSpeed;
        if (this.rainPositions[i3] < 0.0001) {
          this.rainPositions[i3] = 0.012;
        }
      }
      if (this.rainGeometry) {
        this.rainGeometry.attributes.position.needsUpdate = true;
      }
    }

    if (this.renderer) {
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
    }

    if (this.activeLayers.rain || this.activeLayers.roadFlood || this.map?.isMoving()) {
      this.map?.triggerRepaint();
    }
  }

  public onRemove(): void {
    this.roadRibbons.forEach((entry) => {
      entry.ribbonMesh.geometry.dispose();
      entry.wallMesh.geometry.dispose();
      entry.topMaterial.dispose();
      entry.wallMaterial.dispose();
      this.scene.remove(entry.ribbonMesh);
      this.scene.remove(entry.wallMesh);
    });
    this.roadRibbons.clear();

    if (this.rainParticles) {
      this.rainGeometry?.dispose();
      this.scene.remove(this.rainParticles);
      this.rainParticles = null;
    }

    this.renderer?.dispose();
    this.renderer = null;
    this.map = null;
  }
}
