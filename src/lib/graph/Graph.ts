import { NodeId, GraphNode, GraphEdge, GraphSnapshot } from './types';

export class Graph {
  private nodes: Map<NodeId, GraphNode> = new Map();
  private adjacency: Map<NodeId, GraphEdge[]> = new Map();
  version = 0;

  addNode(node: GraphNode): void {
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, []);
    }
    this.nodes.set(node.id, node);
    this.version++;
  }

  removeNode(id: NodeId): void {
    this.nodes.delete(id);
    this.adjacency.delete(id);
    for (const [, edges] of this.adjacency) {
      const filtered = edges.filter(e => e.source !== id && e.target !== id);
      edges.length = 0;
      edges.push(...filtered);
    }
    this.version++;
  }

  addEdge(edge: GraphEdge): void {
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) return;

    const srcList = this.adjacency.get(edge.source) ?? [];
    srcList.push(edge);
    this.adjacency.set(edge.source, srcList);

    if (!edge.directed) {
      const tgtList = this.adjacency.get(edge.target) ?? [];
      tgtList.push({
        ...edge,
        id: `${edge.id}_rev`,
        source: edge.target,
        target: edge.source,
      });
      this.adjacency.set(edge.target, tgtList);
    }

    this.version++;
  }

  removeEdge(id: string): void {
    const baseId = id.endsWith('_rev') ? id.slice(0, -4) : id;
    const revId = `${baseId}_rev`;

    for (const [, edges] of this.adjacency) {
      const filtered = edges.filter(e => e.id !== baseId && e.id !== revId);
      edges.length = 0;
      edges.push(...filtered);
    }
    this.version++;
  }

  updateEdgeDirection(id: string, directed: boolean): void {
    const baseId = id.endsWith('_rev') ? id.slice(0, -4) : id;
    let foundEdge: GraphEdge | null = null;

    for (const [, edges] of this.adjacency) {
      const edge = edges.find(e => e.id === baseId);
      if (edge) {
        edge.directed = directed;
        foundEdge = edge;
        break;
      }
    }

    if (!foundEdge) return;

    const revId = `${baseId}_rev`;

    if (directed) {
      for (const [, edges] of this.adjacency) {
        const idx = edges.findIndex(e => e.id === revId);
        if (idx !== -1) edges.splice(idx, 1);
      }
    } else {
      const tgtList = this.adjacency.get(foundEdge.target) ?? [];
      if (!tgtList.find(e => e.id === revId)) {
        tgtList.push({
          ...foundEdge,
          id: revId,
          source: foundEdge.target,
          target: foundEdge.source,
        });
        this.adjacency.set(foundEdge.target, tgtList);
      }
    }

    this.version++;
  }

  moveNode(id: NodeId, x: number, y: number): void {
    const node = this.nodes.get(id);
    if (node) {
      node.x = x;
      node.y = y;
      this.version++;
    }
  }

  getNodes(): Map<NodeId, GraphNode> {
    return this.nodes;
  }

  getAdjacency(): Map<NodeId, GraphEdge[]> {
    return this.adjacency;
  }

  getNeighbors(id: NodeId): GraphEdge[] {
    return this.adjacency.get(id) ?? [];
  }

  get nodeCount(): number {
    return this.nodes.size;
  }

  get edgeCount(): number {
    let count = 0;
    for (const [, edges] of this.adjacency) {
      count += edges.filter(e => !e.id.endsWith('_rev')).length;
    }
    return count;
  }

  clear(): void {
    this.nodes.clear();
    this.adjacency.clear();
    this.version++;
  }

  clone(): GraphSnapshot {
    const nodes = new Map<NodeId, GraphNode>();
    for (const [id, node] of this.nodes) {
      nodes.set(id, { ...node });
    }
    const adjacency = new Map<NodeId, GraphEdge[]>();
    for (const [id, edges] of this.adjacency) {
      adjacency.set(id, edges.map(e => ({ ...e })));
    }
    return { nodes, adjacency };
  }

  fromSnapshot(snapshot: GraphSnapshot): void {
    this.nodes = new Map(
      [...snapshot.nodes.entries()].map(([k, v]) => [k, { ...v }])
    );
    this.adjacency = new Map(
      [...snapshot.adjacency.entries()].map(([k, v]) => [k, v.map(e => ({ ...e }))])
    );
    this.version++;
  }
}
