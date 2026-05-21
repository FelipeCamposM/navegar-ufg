import { NodeId, DijkstraResult } from './types';
import { Graph } from './Graph';

interface HeapEntry {
  dist: number;
  nodeId: NodeId;
}

class MinHeap {
  private heap: HeapEntry[] = [];

  insert(entry: HeapEntry): void {
    this.heap.push(entry);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): HeapEntry | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].dist <= this.heap[i].dist) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l].dist < this.heap[smallest].dist) smallest = l;
      if (r < n && this.heap[r].dist < this.heap[smallest].dist) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

function reconstructPath(
  prev: Map<NodeId, NodeId | null>,
  source: NodeId,
  target: NodeId
): NodeId[] {
  const path: NodeId[] = [];
  let current: NodeId | null = target;
  while (current !== null && current !== source) {
    path.unshift(current);
    current = prev.get(current) ?? null;
  }
  if (current === source) path.unshift(source);
  return path;
}

export function dijkstra(
  graph: Graph,
  source: NodeId,
  target: NodeId
): DijkstraResult {
  const startTime = performance.now();

  const dist = new Map<NodeId, number>();
  const prev = new Map<NodeId, NodeId | null>();
  const visited = new Set<NodeId>();
  const heap = new MinHeap();
  let explored = 0;

  for (const nodeId of graph.getNodes().keys()) {
    dist.set(nodeId, Infinity);
    prev.set(nodeId, null);
  }

  dist.set(source, 0);
  heap.insert({ dist: 0, nodeId: source });

  while (heap.size > 0) {
    const { dist: d, nodeId: u } = heap.extractMin()!;

    if (visited.has(u)) continue;
    visited.add(u);
    explored++;

    if (u === target) break;

    const currentDist = dist.get(u)!;
    if (d > currentDist) continue;

    for (const edge of graph.getNeighbors(u)) {
      const v = edge.target;
      if (visited.has(v)) continue;

      const newDist = currentDist + edge.weight;
      if (newDist < (dist.get(v) ?? Infinity)) {
        dist.set(v, newDist);
        prev.set(v, u);
        heap.insert({ dist: newDist, nodeId: v });
      }
    }
  }

  const cost = dist.get(target) ?? Infinity;
  const noPath = cost === Infinity;
  const path = noPath ? [] : reconstructPath(prev, source, target);
  const timeMs = performance.now() - startTime;

  return { path, cost, explored, timeMs, dist, noPath };
}
