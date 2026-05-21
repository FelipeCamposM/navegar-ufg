'use client';

import { create } from 'zustand';
import { Graph } from '@/lib/graph/Graph';
import { dijkstra } from '@/lib/graph/dijkstra';
import {
  NodeId, GraphNode, GraphEdge, GraphType, ToolMode,
  DijkstraResult, GraphSnapshot,
} from '@/lib/graph/types';

const HISTORY_MAX = 20;

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface GraphStore {
  graph: Graph;
  graphVersion: number; // increments on every graph mutation to trigger re-renders
  graphType: GraphType;
  mode: ToolMode;
  showLabels: boolean;
  showNodes: boolean;
  showRouteArrows: boolean;
  sourceId: NodeId | null;
  targetId: NodeId | null;
  dijkstraResult: DijkstraResult | null;
  past: GraphSnapshot[];
  future: GraphSnapshot[];
  notification: Notification | null;
  fitGraph: boolean;

  // Graph mutations
  importGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  addNode: (node: GraphNode) => void;
  addEdge: (edge: GraphEdge) => void;
  removeNode: (id: NodeId) => void;
  removeEdge: (id: string) => void;
  moveNode: (id: NodeId, x: number, y: number) => void;
  updateEdgeDirection: (id: string, directed: boolean) => void;
  clearGraph: () => void;

  // Tool
  setMode: (mode: ToolMode) => void;
  setGraphType: (type: GraphType) => void;
  setShowLabels: (show: boolean) => void;
  setShowNodes: (show: boolean) => void;
  setShowRouteArrows: (show: boolean) => void;

  // Selection
  selectNode: (id: NodeId) => void;
  clearSelection: () => void;

  // Algorithm
  runDijkstra: () => void;
  clearResult: () => void;

  // History
  undo: () => void;
  redo: () => void;

  // Notifications
  setNotification: (n: Notification | null) => void;
  setFitGraph: (fit: boolean) => void;

  // Navigation
  isNavigating: boolean;
  navIndex: number;
  startNavigation: () => void;
  stopNavigation: () => void;
  advanceNav: () => void;
}

function pushHistory(past: GraphSnapshot[], snapshot: GraphSnapshot): GraphSnapshot[] {
  const next = [snapshot, ...past];
  return next.slice(0, HISTORY_MAX);
}

export const useGraph = create<GraphStore>()((set, get) => ({
  graph: new Graph(),
  graphVersion: 0,
  graphType: 'undirected',
  mode: 'select',
  showLabels: false,
  showNodes: false,
  showRouteArrows: false,
  sourceId: null,
  targetId: null,
  dijkstraResult: null,
  past: [],
  future: [],
  notification: null,
  fitGraph: false,
  isNavigating: false,
  navIndex: 0,

  importGraph: (nodes, edges) => {
    const { graph, graphVersion } = get();
    graph.clear();
    for (const n of nodes) graph.addNode(n);
    for (const e of edges) graph.addEdge(e);
    set({ graphVersion: graphVersion + 1, past: [], future: [], sourceId: null, targetId: null, dijkstraResult: null, fitGraph: true, isNavigating: false, navIndex: 0 });
  },

  addNode: (node) => {
    const { graph, past, graphVersion } = get();
    const snapshot = graph.clone();
    graph.addNode(node);
    set({ graphVersion: graphVersion + 1, past: pushHistory(past, snapshot), future: [], dijkstraResult: null });
  },

  addEdge: (edge) => {
    const { graph, past, graphType, graphVersion } = get();
    const snapshot = graph.clone();
    graph.addEdge({ ...edge, directed: edge.directed ?? graphType === 'directed' });
    set({ graphVersion: graphVersion + 1, past: pushHistory(past, snapshot), future: [] });
  },

  removeNode: (id) => {
    const { graph, past, sourceId, targetId, graphVersion } = get();
    const snapshot = graph.clone();
    graph.removeNode(id);
    set({
      graphVersion: graphVersion + 1,
      past: pushHistory(past, snapshot),
      future: [],
      sourceId: sourceId === id ? null : sourceId,
      targetId: targetId === id ? null : targetId,
      dijkstraResult: null,
    });
  },

  removeEdge: (id) => {
    const { graph, past, graphVersion } = get();
    const snapshot = graph.clone();
    graph.removeEdge(id);
    set({ graphVersion: graphVersion + 1, past: pushHistory(past, snapshot), future: [] });
  },

  moveNode: (id, x, y) => {
    const { graph, graphVersion } = get();
    graph.moveNode(id, x, y);
    set({ graphVersion: graphVersion + 1 });
  },

  updateEdgeDirection: (id, directed) => {
    const { graph, past, graphVersion } = get();
    const snapshot = graph.clone();
    graph.updateEdgeDirection(id, directed);
    set({ graphVersion: graphVersion + 1, past: pushHistory(past, snapshot), future: [] });
  },

  clearGraph: () => {
    const { graph, graphVersion } = get();
    graph.clear();
    set({ graphVersion: graphVersion + 1, past: [], future: [], sourceId: null, targetId: null, dijkstraResult: null, isNavigating: false, navIndex: 0 });
  },

  setMode: (mode) => set({ mode }),

  setGraphType: (graphType) => set({ graphType }),

  setShowLabels: (showLabels) => set({ showLabels }),

  setShowNodes: (showNodes) => set({ showNodes }),

  setShowRouteArrows: (showRouteArrows) => set({ showRouteArrows }),

  selectNode: (id) => {
    const { sourceId, targetId } = get();

    if (id === sourceId) {
      // Deselect source
      set({ sourceId: null, dijkstraResult: null });
      return;
    }
    if (id === targetId) {
      // Deselect target
      set({ targetId: null, dijkstraResult: null });
      return;
    }
    if (sourceId === null) {
      // First pick → set source
      set({ sourceId: id, dijkstraResult: null });
      return;
    }
    if (targetId === null) {
      // Second pick → set target and auto-calculate
      set({ targetId: id, dijkstraResult: null });
      get().runDijkstra();
      return;
    }
    // Both set → new selection cycle: replace source, clear target and result
    set({ sourceId: id, targetId: null, dijkstraResult: null });
  },

  clearSelection: () => set({ sourceId: null, targetId: null, dijkstraResult: null, isNavigating: false, navIndex: 0 }),

  runDijkstra: () => {
    const { graph, sourceId, targetId } = get();
    if (!sourceId || !targetId) return;
    if (!graph.getNodes().has(sourceId) || !graph.getNodes().has(targetId)) return;

    const result: DijkstraResult = dijkstra(graph, sourceId, targetId);
    set({ dijkstraResult: result });

    if (result.noPath) {
      set({ notification: { message: 'Não há caminho entre os vértices selecionados.', type: 'error' } });
    }
  },

  clearResult: () => set({ dijkstraResult: null }),

  undo: () => {
    const { graph, past, future, graphVersion } = get();
    if (past.length === 0) return;
    const [prev, ...rest] = past;
    const currentSnap = graph.clone();
    graph.fromSnapshot(prev);
    set({ graphVersion: graphVersion + 1, past: rest, future: [currentSnap, ...future], sourceId: null, targetId: null, dijkstraResult: null });
  },

  redo: () => {
    const { graph, past, future, graphVersion } = get();
    if (future.length === 0) return;
    const [next, ...rest] = future;
    const currentSnap = graph.clone();
    graph.fromSnapshot(next);
    set({ graphVersion: graphVersion + 1, past: [currentSnap, ...past], future: rest, sourceId: null, targetId: null, dijkstraResult: null });
  },

  setNotification: (notification) => set({ notification }),
  setFitGraph: (fitGraph) => set({ fitGraph }),

  startNavigation: () => {
    const { dijkstraResult } = get();
    if (!dijkstraResult || dijkstraResult.noPath || dijkstraResult.path.length < 2) return;
    set({ isNavigating: true, navIndex: 0 });
  },

  stopNavigation: () => set({ isNavigating: false, navIndex: 0 }),

  advanceNav: () => {
    const { navIndex, dijkstraResult } = get();
    if (!dijkstraResult) return;
    if (navIndex >= dijkstraResult.path.length - 1) {
      set({ isNavigating: false, navIndex: 0 });
    } else {
      set({ navIndex: navIndex + 1 });
    }
  },
}));
