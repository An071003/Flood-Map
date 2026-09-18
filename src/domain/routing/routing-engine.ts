import {
  GraphRoadSegment,
  RoadNode,
  RouteCandidate,
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
   * Find routes for origin -> destination with 3 strategies
   */
  public findRoutes(req: RouteRequest): RouteCandidate[] {
    const { originNodeId, destinationNodeId, vehicle, departureHour } = req;
    if (originNodeId === destinationNodeId) {
      return [];
    }

    const profile = VEHICLE_PROFILES[vehicle];
    const strategies: RouteStrategy[] = ['LEAST_FLOOD', 'BALANCED', 'FASTEST'];
    const candidates: RouteCandidate[] = [];

    // Track unique segment sequences to prevent fake duplicates
    const seenSignatures = new Set<string>();

    for (const strategy of strategies) {
      const pathSegments = this.dijkstra(
        originNodeId,
        destinationNodeId,
        strategy,
        departureHour,
        profile
      );

      if (pathSegments && pathSegments.length > 0) {
        const signature = pathSegments.map((s) => s.id).join('->');
        if (!seenSignatures.has(signature)) {
          seenSignatures.add(signature);
          const candidate = evaluateRoute(pathSegments, strategy, departureHour, profile);
          candidates.push(candidate);
        }
      }
    }

    return candidates;
  }

  /**
   * Dijkstra shortest-path search parameterized by strategy cost
   */
  private dijkstra(
    startNodeId: string,
    endNodeId: string,
    strategy: RouteStrategy,
    hour: number,
    profile = VEHICLE_PROFILES.motorbike
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

        const edgeCost = calculateSegmentCost(edge.segment, profile, hour, strategy);
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
