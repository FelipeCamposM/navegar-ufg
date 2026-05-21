export type NodeId = string;

export type ToolMode = 'select' | 'addVertex' | 'addEdge' | 'move' | 'delete';

export type GraphType = 'directed' | 'undirected';

export interface GraphNode {
  id: NodeId;
  label?: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: NodeId;
  target: NodeId;
  weight: number;
  directed: boolean;
  roundabout?: boolean;
}

export interface DijkstraResult {
  path: NodeId[];
  cost: number;
  explored: number;
  timeMs: number;
  dist: Map<NodeId, number>;
  noPath: boolean;
}

export interface GraphSnapshot {
  nodes: Map<NodeId, GraphNode>;
  adjacency: Map<NodeId, GraphEdge[]>;
}

export interface ParseResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  error?: string;
}
