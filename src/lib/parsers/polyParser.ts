import { ParseResult, GraphNode, GraphEdge } from '../graph/types';
import { normalizeCoords } from '../utils/coordinates';

export function parsePoly(content: string): ParseResult {
  try {
    const lines = content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('#'));

    let i = 0;

    const headerParts = lines[i++].split(/\s+/);
    const numVertices = parseInt(headerParts[0], 10);
    if (isNaN(numVertices)) return { nodes: [], edges: [], error: 'Formato .poly inválido: cabeçalho de vértices não encontrado' };

    // nodeMap keeps original coords for Euclidean weight calculation
    const nodeMap = new Map<string, GraphNode>();
    const rawNodes: GraphNode[] = [];

    for (let v = 0; v < numVertices; v++) {
      const parts = lines[i++]?.split(/\s+/);
      if (!parts || parts.length < 3) continue;
      const node: GraphNode = {
        id: parts[0],
        label: parts[0],
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
      };
      rawNodes.push(node);
      nodeMap.set(node.id, node);
    }

    const edgeHeader = lines[i++]?.split(/\s+/);
    const numEdges = parseInt(edgeHeader?.[0] ?? '', 10);
    if (isNaN(numEdges)) return { nodes: rawNodes, edges: [], error: 'Formato .poly inválido: cabeçalho de arestas não encontrado' };

    const edges: GraphEdge[] = [];

    for (let e = 0; e < numEdges; e++) {
      const raw = lines[i++];
      if (!raw) break;
      const parts = raw.split(/\s+/);
      if (parts.length < 4) continue;

      const edgeId = parts[0];
      const srcId = parts[1];
      const tgtId = parts[2];
      const marker = parseInt(parts[3], 10);

      const src = nodeMap.get(srcId);
      const tgt = nodeMap.get(tgtId);
      if (!src || !tgt) continue;

      // Weight from original (unscaled) coords — approximately meters
      const weight = Math.sqrt((src.x - tgt.x) ** 2 + (src.y - tgt.y) ** 2);

      edges.push({
        id: `e_${edgeId}`,
        source: srcId,
        target: tgtId,
        weight,
        directed: marker === 1,
      });
    }

    // Snap: add edges between nodes that are spatially close but unconnected.
    // Fixes segments orphaned when the C converter (MAX_NODES=10000) dropped
    // intersection nodes, leaving street ends within meters of each other.
    const SNAP_DIST = 5.0; // coordinate units ≈ 10 m (coords are UTM/2 from ConverteMapaParaGrafo.c)
    const cellSize = SNAP_DIST;

    const adjSet = new Set<string>();
    for (const edge of edges) {
      adjSet.add(`${edge.source}|${edge.target}`);
      if (!edge.directed) adjSet.add(`${edge.target}|${edge.source}`);
    }

    const snapGrid = new Map<string, string[]>();
    for (const node of rawNodes) {
      const cx = Math.floor(node.x / cellSize);
      const cy = Math.floor(node.y / cellSize);
      const key = `${cx},${cy}`;
      const cell = snapGrid.get(key);
      if (cell) cell.push(node.id);
      else snapGrid.set(key, [node.id]);
    }

    let snapIdx = 0;
    for (const node of rawNodes) {
      const cx = Math.floor(node.x / cellSize);
      const cy = Math.floor(node.y / cellSize);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (const otherId of snapGrid.get(`${cx + dx},${cy + dy}`) ?? []) {
            if (otherId === node.id) continue;
            if (adjSet.has(`${node.id}|${otherId}`)) continue;
            const other = nodeMap.get(otherId)!;
            const d = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
            if (d <= SNAP_DIST) {
              edges.push({
                id: `e_snap_${snapIdx++}`,
                source: node.id,
                target: otherId,
                weight: Math.max(d, 0.1),
                directed: false,
              });
              adjSet.add(`${node.id}|${otherId}`);
              adjSet.add(`${otherId}|${node.id}`);
            }
          }
        }
      }
    }

    // y-flip + normalize to match OSM rendering orientation
    const nodes = normalizeCoords(rawNodes);
    return { nodes, edges };
  } catch (err) {
    return { nodes: [], edges: [], error: `Erro ao parsear .poly: ${err}` };
  }
}
