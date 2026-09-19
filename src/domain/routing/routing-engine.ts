import {
  CandidateOmissionReason,
  GraphRoadSegment,
  RoadNode,
  RouteCandidate,
  RoutePlanResult,
  RouteRequest,
  RouteStrategy,
} from '../../types';
import { HCMC_GRAPH_SEGMENTS, HCMC_ROAD_NODES } from '../../services/geodata/hcmc-graph-network';
import { VEHICLE_PROFILES } from './vehicle-profiles';
import { calculateSegmentCost, evaluateRoute } from './route-cost-engine';

interface GraphEdge {
  segment: GraphRoadSegment;
  targetNodeId: string;
}

export class RoutingEngine {
  private static instance: RoutingEngine;
  private nodes: Map<string, RoadNode> = new Map();
  private adjacency: Map<string, GraphEdge[]> = new Map();
  private segments: GraphRoadSegment[] = [];

  private constructor() {
    this.initGraph(HCMC_ROAD_NODES, HCMC_GRAPH_SEGMENTS);
  }

  public static getInstance(): RoutingEngine {
    if (!RoutingEngine.instance) {
      RoutingEngine.instance = new RoutingEngine();
    }
    return RoutingEngine.instance;
  }

  public initGraph(nodes: RoadNode[], segments: GraphRoadSegment[]) {
    this.nodes.clear();
    this.adjacency.clear();
    this.segments = segments;

    for (const node of nodes) {
      this.nodes.set(node.id, node);
      this.adjacency.set(node.id, []);
    }

    for (const seg of segments) {
      const fromEdges = this.adjacency.get(seg.fromNodeId) || [];
      fromEdges.push({ segment: seg, targetNodeId: seg.toNodeId });
      this.adjacency.set(seg.fromNodeId, fromEdges);

      if (seg.bidirectional) {
        const toEdges = this.adjacency.get(seg.toNodeId) || [];
        toEdges.push({ segment: seg, targetNodeId: seg.fromNodeId });
        this.adjacency.set(seg.toNodeId, toEdges);
      }
    }
  }

  public getNodes(): RoadNode[] {
    return Array.from(this.nodes.values());
  }

  public getNode(id: string): RoadNode | undefined {
    return this.nodes.get(id);
  }

  public getSegments(): GraphRoadSegment[] {
    return this.segments;
  }

  /**
   * Snaps a geographic coordinate (lng, lat) to the nearest RoadNode in the graph.
   * Returns the node and distance in meters.
   */
  public findNearestNode(
    lng: number,
    lat: number,
    maxDistanceMeters = 4000
  ): { node: RoadNode; distanceMeters: number } | null {
    let bestNode: RoadNode | null = null;
    let minDistance = Infinity;

    for (const node of this.nodes.values()) {
      const dLat = ((node.lat - lat) * Math.PI) / 180;
      const dLng = ((node.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((node.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distMeters = 6371000 * c;

      if (distMeters < minDistance) {
        minDistance = distMeters;
        bestNode = node;
      }
    }

    if (bestNode && minDistance <= maxDistanceMeters) {
      return { node: bestNode, distanceMeters: Math.round(minDistance) };
    }
    return null;
  }

  private lastOmissionNote: string | null = null;
  private lastOmissionReason: CandidateOmissionReason | null = null;

  public getLastOmissionNote(): string | null {
    return this.lastOmissionNote;
  }

  public getLastOmissionReason(): CandidateOmissionReason | null {
    return this.lastOmissionReason;
  }

  /**
   * Find alternative routes with complete planning result including omission reasons
   */
  public findRoutesWithPlan(req: RouteRequest): RoutePlanResult {
    const candidates = this.findRoutes(req);
    return {
      candidates,
      omissionReason: this.lastOmissionReason || undefined,
      omissionNote: this.lastOmissionNote || undefined,
    };
  }

  /**
   * Find alternative routes for origin -> destination using Diversity Penalty Search
   * Guaranteed to discover distinct corridors when they exist, without inventing fake duplicates.
   */
  public findRoutes(req: RouteRequest): RouteCandidate[] {
    const { originNodeId, destinationNodeId, vehicle, departureHour } = req;
    this.lastOmissionNote = null;
    this.lastOmissionReason = null;

    if (originNodeId === destinationNodeId) {
      return [];
    }

    const profile = VEHICLE_PROFILES[vehicle];
    const threshold = req.diversityThreshold ?? 0.75;
    const edgePenalties = new Map<string, number>();

    // 1. Primary search: LEAST_FLOOD on unpenalized graph
    const path1 = this.dijkstra(
      originNodeId,
      destinationNodeId,
      'LEAST_FLOOD',
      departureHour,
      profile,
      edgePenalties
    );

    if (!path1 || path1.length === 0) {
      this.lastOmissionReason = 'disconnected';
      this.lastOmissionNote = 'Không tìm thấy lộ trình liên thông giữa hai điểm đã chọn.';
      return [];
    }

    const distinctPaths: GraphRoadSegment[][] = [path1];
    let omissionReason: CandidateOmissionReason | null = null;

    // Helper: compute overlap ratio by segment length (Phase 4 Spec)
    const computeOverlap = (pA: GraphRoadSegment[], pB: GraphRoadSegment[]): number => {
      const setA = new Set(pA.map((s) => s.id));
      let overlapLen = 0;
      let lenA = 0;
      let lenB = 0;
      for (const s of pA) lenA += s.lengthMeters;
      for (const s of pB) {
        lenB += s.lengthMeters;
        if (setA.has(s.id)) overlapLen += s.lengthMeters;
      }
      const minLen = Math.min(lenA, lenB);
      return minLen > 0 ? overlapLen / minLen : 1;
    };

    // 2. Secondary search: Add diversity penalty (2.5x) to edges in path1, search with BALANCED
    for (const seg of path1) {
      edgePenalties.set(seg.id, (edgePenalties.get(seg.id) || 1) * 2.5);
    }

    const path2 = this.dijkstra(
      originNodeId,
      destinationNodeId,
      'BALANCED',
      departureHour,
      profile,
      edgePenalties
    );

    if (path2 && path2.length > 0) {
      if (computeOverlap(path1, path2) < threshold) {
        distinctPaths.push(path2);
        // Penalize path2 edges for path3 search
        for (const seg of path2) {
          edgePenalties.set(seg.id, (edgePenalties.get(seg.id) || 1) * 2.5);
        }
      } else {
        omissionReason = 'duplicate';
      }
    } else {
      omissionReason = 'no_distinct_alternative';
    }

    // 3. Tertiary search: Search with FASTEST on heavily penalized graph
    const path3 = this.dijkstra(
      originNodeId,
      destinationNodeId,
      'FASTEST',
      departureHour,
      profile,
      edgePenalties
    );

    if (path3 && path3.length > 0) {
      const overlapWithAll = distinctPaths.every(
        (existing) => computeOverlap(existing, path3) < threshold
      );
      if (overlapWithAll) {
        distinctPaths.push(path3);
      } else {
        omissionReason = 'duplicate';
      }
    } else {
      if (!omissionReason) {
        omissionReason = 'no_distinct_alternative';
      }
    }

    // Generate user-facing omission note if fewer than 3 candidates found (Phase 5 Spec)
    let omissionNote: string | undefined = undefined;
    if (distinctPaths.length < 3) {
      this.lastOmissionReason = omissionReason || 'no_distinct_alternative';
      if (distinctPaths.length === 2) {
        omissionNote =
          departureHour > 0
            ? `Chỉ tìm được 2 tuyến khác biệt tại mốc +${departureHour}h do tuyến nhanh nhất trùng lặp trên ${Math.round(threshold * 100)}% hành lang.`
            : `Chỉ tìm được 2 tuyến khác biệt. Tuyến thứ 3 bị loại do trùng lặp trên ${Math.round(threshold * 100)}% hành lang di chuyển.`;
      } else if (distinctPaths.length === 1) {
        omissionNote =
          'Chỉ tìm được 1 tuyến khả dụng duy nhất liên thông giữa hai điểm này theo điều kiện giao thông và ngập nước hiện tại.';
      }
      this.lastOmissionNote = omissionNote || null;
    }

    // 4. Evaluate and assign strategies to each distinct path
    const candidates: RouteCandidate[] = [];

    if (distinctPaths.length === 1) {
      // Exactly 1 physical corridor exists
      const cand = evaluateRoute(distinctPaths[0], 'LEAST_FLOOD', departureHour, profile, 0);
      cand.omissionNote = omissionNote;
      cand.omissionReason = this.lastOmissionReason || undefined;
      candidates.push(cand);
    } else if (distinctPaths.length === 2) {
      // 2 distinct corridors: Drier one is LEAST_FLOOD, faster one is BALANCED
      const cand1 = evaluateRoute(distinctPaths[0], 'LEAST_FLOOD', departureHour, profile, 0);
      const cand2 = evaluateRoute(distinctPaths[1], 'BALANCED', departureHour, profile, 1);
      cand1.omissionNote = omissionNote;
      cand1.omissionReason = this.lastOmissionReason || undefined;
      cand2.omissionNote = omissionNote;
      cand2.omissionReason = this.lastOmissionReason || undefined;
      candidates.push(cand1, cand2);
    } else {
      // 3 distinct corridors: LEAST_FLOOD, BALANCED, FASTEST
      const cand1 = evaluateRoute(distinctPaths[0], 'LEAST_FLOOD', departureHour, profile, 0);
      const cand2 = evaluateRoute(distinctPaths[1], 'BALANCED', departureHour, profile, 1);
      const cand3 = evaluateRoute(distinctPaths[2], 'FASTEST', departureHour, profile, 2);
      candidates.push(cand1, cand2, cand3);
    }

    // Re-rank candidates by routeScore descending (most vehicle-appropriate first)
    candidates.sort((a, b) => b.routeScore - a.routeScore);

    return candidates;
  }

  /**
   * Dijkstra shortest-path search parameterized by strategy cost and diversity penalty
   */
  private dijkstra(
    startNodeId: string,
    endNodeId: string,
    strategy: RouteStrategy,
    hour: number,
    profile = VEHICLE_PROFILES.motorbike,
    edgePenalties = new Map<string, number>()
  ): GraphRoadSegment[] | null {
    const distances = new Map<string, number>();
    const previous = new Map<
      string,
      { nodeId: string; segment: GraphRoadSegment } | null
    >();
    const unvisited = new Set<string>();

    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
      unvisited.add(nodeId);
    }

    distances.set(startNodeId, 0);

    while (unvisited.size > 0) {
      // Pick node with lowest distance
      let currentId: string | null = null;
      let minDistance = Infinity;

      for (const id of unvisited) {
        const d = distances.get(id) ?? Infinity;
        if (d < minDistance) {
          minDistance = d;
          currentId = id;
        }
      }

      if (currentId === null || minDistance === Infinity) {
        break;
      }

      if (currentId === endNodeId) {
        // Reconstruct path
        const result: GraphRoadSegment[] = [];
        let curr = endNodeId;
        while (curr !== startNodeId) {
          const prev = previous.get(curr);
          if (!prev) break;
          result.unshift(prev.segment);
          curr = prev.nodeId;
        }
        return result;
      }

      unvisited.delete(currentId);

      const edges = this.adjacency.get(currentId) || [];
      for (const edge of edges) {
        if (!unvisited.has(edge.targetNodeId)) continue;

        const baseCost = calculateSegmentCost(edge.segment, profile, hour, strategy);
        const diversityMultiplier = edgePenalties.get(edge.segment.id) || 1;
        const edgeCost = baseCost * diversityMultiplier;
        const newDist = minDistance + edgeCost;

        if (newDist < (distances.get(edge.targetNodeId) ?? Infinity)) {
          distances.set(edge.targetNodeId, newDist);
          previous.set(edge.targetNodeId, {
            nodeId: currentId,
            segment: edge.segment,
          });
        }
      }
    }

    return null;
  }
}
