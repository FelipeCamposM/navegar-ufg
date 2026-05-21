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
        id: edgeId,
        source: srcId,
        target: tgtId,
        weight,
        directed: marker === 1,
      });
    }

    // y-flip + normalize to match OSM rendering orientation
    const nodes = normalizeCoords(rawNodes);
    return { nodes, edges };
  } catch (err) {
    return { nodes: [], edges: [], error: `Erro ao parsear .poly: ${err}` };
  }
}
