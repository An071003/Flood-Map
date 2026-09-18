import * as THREE from 'three';
import maplibregl, { CustomLayerInterface, Map as MapLibreMap } from 'maplibre-gl';
import { AreaSnapshot, ActiveLayers } from '../../../types';

export class ThreeFloodLayer implements CustomLayerInterface {
  public id = 'three-flood-water-layer';
  public type = 'custom' as const;
  public renderingMode = '3d' as const;

  private map: MapLibreMap | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.Camera = new THREE.Camera();
  private waterMeshes: Map<string, {
    mesh: THREE.Mesh;
    material: THREE.MeshStandardMaterial;
    baseHeight: number;
    currentHeight: number;
    targetHeight: number;
  }> = new Map();

  private rainParticles: THREE.Points | null = null;
  private rainGeometry: THREE.BufferGeometry | null = null;
  private rainMaterial: THREE.PointsMaterial | null = null;
  private rainCount = 1200;
  private rainPositions: Float32Array | null = null;

  private activeLayers: ActiveLayers = {
    flood: true,
    rain: true,
    weather: true,
    tide: true,
    is3D: true,
  };

  private snapshots: AreaSnapshot[] = [];
  private clock: THREE.Clock = new THREE.Clock();

  public onAdd(map: MapLibreMap, gl: WebGLRenderingContext): void {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;

    // Ambient and directional lighting for water reflections
    const ambientLight = new THREE.AmbientLight(0xd5eaff, 1.4);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x39c6ff, 2.0);
    dirLight1.position.set(0.5, -0.8, 1).normalize();
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-0.5, 0.8, 1).normalize();
    this.scene.add(dirLight2);

    this.initWaterSurfaces();
    this.initRainParticles();
  }

  private initWaterSurfaces(): void {
    if (this.snapshots.length === 0) return;

    this.snapshots.forEach((snapshot) => {
      if (snapshot.polygon.length < 3) return;

      // Convert polygon to Mercator coordinates
      const mercatorCoords = snapshot.polygon.map(([lng, lat]) =>
        maplibregl.MercatorCoordinate.fromLngLat([lng, lat])
      );

      // Centroid reference point
      const origin = mercatorCoords[0];
      const meterUnits = origin.meterInMercatorCoordinateUnits();

      const shape = new THREE.Shape();
      mercatorCoords.forEach((pt, index) => {
        const x = pt.x - origin.x;
        const y = pt.y - origin.y;
        if (index === 0) {
          shape.moveTo(x, y);
        } else {
          shape.lineTo(x, y);
        }
      });

      // Extrusion height based on depth cm
      const visualDepthMeters = (0.2 + snapshot.flood.estimatedDepthCm * 3.5);
      const extrusionThickness = Math.max(0.00001, visualDepthMeters * meterUnits * 300);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrusionThickness,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.000005,
        bevelThickness: 0.000005,
      });

      // Severity color mapping
      let waterColor = 0x39c6ff;
      let opacity = 0.55;
      if (snapshot.flood.severity === 'safe') {
        waterColor = 0x2fd39a;
        opacity = 0.35;
      } else if (snapshot.flood.severity === 'watch') {
        waterColor = 0x39c6ff;
        opacity = 0.52;
      } else if (snapshot.flood.severity === 'warning') {
        waterColor = 0x397bff;
        opacity = 0.65;
      } else if (snapshot.flood.severity === 'severe') {
        waterColor = 0x174dcb;
        opacity = 0.78;
      }

      const material = new THREE.MeshStandardMaterial({
        color: waterColor,
        roughness: 0.12,
        metalness: 0.25,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(origin.x, origin.y, 0.00002);

      this.scene.add(mesh);
      this.waterMeshes.set(snapshot.areaId, {
        mesh,
        material,
        baseHeight: extrusionThickness,
        currentHeight: extrusionThickness,
        targetHeight: extrusionThickness,
      });
    });
  }

  private initRainParticles(): void {
    const centerMercator = maplibregl.MercatorCoordinate.fromLngLat([106.68, 10.78]);
    const radius = 0.08;

    this.rainPositions = new Float32Array(this.rainCount * 3);

    for (let i = 0; i < this.rainCount; i++) {
      const i3 = i * 3;
      this.rainPositions[i3] = centerMercator.x + (Math.random() - 0.5) * radius;
      this.rainPositions[i3 + 1] = centerMercator.y + (Math.random() - 0.5) * radius;
      this.rainPositions[i3 + 2] = Math.random() * 0.01 + 0.0005; // Altitude
    }

    this.rainGeometry = new THREE.BufferGeometry();
    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));

    this.rainMaterial = new THREE.PointsMaterial({
      color: 0x8b9dff,
      size: 2.2,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    this.rainParticles = new THREE.Points(this.rainGeometry, this.rainMaterial);
    this.scene.add(this.rainParticles);
  }

  public updateData(snapshots: AreaSnapshot[], activeLayers: ActiveLayers): void {
    this.snapshots = snapshots;
    this.activeLayers = activeLayers;

    if (this.waterMeshes.size === 0) {
      this.initWaterSurfaces();
    }

    // Update target water heights and visibility
    snapshots.forEach((snapshot) => {
      const entry = this.waterMeshes.get(snapshot.areaId);
      if (entry) {
        entry.mesh.visible = activeLayers.flood;

        // Color update based on severity
        let waterColor = 0x39c6ff;
        let opacity = 0.55;
        if (snapshot.flood.severity === 'safe') {
          waterColor = 0x2fd39a;
          opacity = 0.35;
        } else if (snapshot.flood.severity === 'watch') {
          waterColor = 0x39c6ff;
          opacity = 0.52;
        } else if (snapshot.flood.severity === 'warning') {
          waterColor = 0x397bff;
          opacity = 0.68;
        } else if (snapshot.flood.severity === 'severe') {
          waterColor = 0x174dcb;
          opacity = 0.82;
        }

        entry.material.color.setHex(waterColor);
        entry.material.opacity = opacity;

        // Dynamic scale factor based on depth cm
        const targetScale = Math.max(0.2, (snapshot.flood.estimatedDepthCm + 5) / 30);
        entry.targetHeight = targetScale;
      }
    });

    if (this.rainParticles) {
      this.rainParticles.visible = activeLayers.rain;
    }

    this.map?.triggerRepaint();
  }

  public render(_gl: WebGLRenderingContext | WebGL2RenderingContext, options: maplibregl.CustomRenderMethodInput): void {
    const m = new THREE.Matrix4().fromArray(options.modelViewProjectionMatrix);
    this.camera.projectionMatrix = m;

    const delta = Math.min(this.clock.getDelta(), 0.05);

    // Smoothly interpolate water scale towards targetHeight
    this.waterMeshes.forEach((entry) => {
      entry.currentHeight += (entry.targetHeight - entry.currentHeight) * 0.12;
      entry.mesh.scale.set(1, 1, Math.max(0.1, entry.currentHeight));
    });

    // Update rain particles falling animation
    if (this.rainParticles && this.rainPositions && this.activeLayers.rain) {
      const fallSpeed = delta * 0.008;
      for (let i = 0; i < this.rainCount; i++) {
        const i3 = i * 3 + 2; // z altitude
        this.rainPositions[i3] -= fallSpeed;
        if (this.rainPositions[i3] < 0.0001) {
          this.rainPositions[i3] = 0.01;
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

    // Keep repaint going if rain or motion active
    if (this.activeLayers.rain || this.map?.isMoving()) {
      this.map?.triggerRepaint();
    }
  }

  public onRemove(): void {
    this.waterMeshes.forEach((entry) => {
      entry.mesh.geometry.dispose();
      entry.material.dispose();
      this.scene.remove(entry.mesh);
    });
    this.waterMeshes.clear();

    if (this.rainParticles) {
      this.rainGeometry?.dispose();
      this.rainMaterial?.dispose();
      this.scene.remove(this.rainParticles);
      this.rainParticles = null;
    }

    this.renderer?.dispose();
    this.renderer = null;
    this.map = null;
  }
}
