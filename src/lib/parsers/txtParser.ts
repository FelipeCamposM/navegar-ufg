import { ParseResult, GraphNode, GraphEdge } from '../graph/types';

function circularLayout(n: number): { x: number; y: number }[] {
  return Array.from({ length: n }, (_, i) => ({
    x: 400 + 200 * Math.cos((2 * Math.PI * i) / n),
    y: 400 + 200 * Math.sin((2 * Math.PI * i) / n),
  }));
}

function parseStructured(lines: string[]): ParseResult {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();

  let section = '';
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper.startsWith('NODES') || upper.startsWith('VERTICES')) { section = 'nodes'; continue; }
    if (upper.startsWith('EDGES') || upper.startsWith('ARESTAS')) { section = 'edges'; continue; }

    const parts = line.split(/\s+/);

    if (section === 'nodes' && parts.length >= 3) {
      const node: GraphNode = { id: parts[0], label: parts[0], x: parseFloat(parts[1]), y: parseFloat(parts[2]) };
      nodes.push(node);
      nodeMap.set(node.id, node);
    } else if (section === 'nodes' && parts.length === 1) {
      const node: GraphNode = { id: parts[0], label: parts[0], x: 0, y: 0 };
      nodes.push(node);
      nodeMap.set(node.id, node);
    } else if (section === 'edges' && parts.length >= 2) {
      const weight = parts.length >= 3 ? parseFloat(parts[2]) : 1.0;
      const directed = parts.length >= 4 ? parts[3] === '1' || parts[3].toLowerCase() === 'true' : false;
      edges.push({ id: `e_${parts[0]}_${parts[1]}`, source: parts[0], target: parts[1], weight, directed });
      if (!nodeMap.has(parts[0])) {
        const n: GraphNode = { id: parts[0], label: parts[0], x: 0, y: 0 };
        nodes.push(n); nodeMap.set(parts[0], n);
      }
      if (!nodeMap.has(parts[1])) {
        const n: GraphNode = { id: parts[1], label: parts[1], x: 0, y: 0 };
        nodes.push(n); nodeMap.set(parts[1], n);
      }
    }
  }

  // Apply circular layout to nodes without coords
  const noCoords = nodes.filter(n => n.x === 0 && n.y === 0);
  if (noCoords.length > 0) {
    const positions = circularLayout(nodes.length);
    nodes.forEach((n, i) => { n.x = positions[i].x; n.y = positions[i].y; });
  }

  return { nodes, edges };
}

function parseSimple(lines: string[]): ParseResult {
  const edges: GraphEdge[] = [];
  const nodeSet = new Set<string>();

  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    const src = parts[0];
    const tgt = parts[1];
    const weight = parts.length >= 3 ? parseFloat(parts[2]) : 1.0;
    const directed = parts.length >= 4 ? parts[3] === '1' || parts[3].toLowerCase() === 'true' : false;
    nodeSet.add(src);
    nodeSet.add(tgt);
    edges.push({ id: `e_${src}_${tgt}`, source: src, target: tgt, weight, directed });
  }

  const nodeIds = [...nodeSet];
  const positions = circularLayout(nodeIds.length);
  const nodes: GraphNode[] = nodeIds.map((id, i) => ({
    id, label: id, x: positions[i].x, y: positions[i].y,
  }));

  return { nodes, edges };
}

function parseAdjacencyList(lines: string[]): ParseResult {
  const edges: GraphEdge[] = [];
  const nodeSet = new Set<string>();

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const src = line.slice(0, colonIdx).trim();
    const neighbors = line.slice(colonIdx + 1).trim().split(/\s+/).filter(Boolean);
    nodeSet.add(src);
    for (const nbr of neighbors) {
      nodeSet.add(nbr);
      edges.push({ id: `e_${src}_${nbr}`, source: src, target: nbr, weight: 1, directed: false });
    }
  }

  const nodeIds = [...nodeSet];
  const positions = circularLayout(nodeIds.length);
  const nodes: GraphNode[] = nodeIds.map((id, i) => ({
    id, label: id, x: positions[i].x, y: positions[i].y,
  }));

  return { nodes, edges };
}

export function parseTxt(content: string): ParseResult {
  try {
    const lines = content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

    if (content.toUpperCase().includes('NODES') || content.toUpperCase().includes('VERTICES') ||
        content.toUpperCase().includes('EDGES') || content.toUpperCase().includes('ARESTAS')) {
      return parseStructured(lines);
    }

    if (lines.some(l => /^\S+\s*:/.test(l))) {
      return parseAdjacencyList(lines);
    }

    return parseSimple(lines);
  } catch (err) {
    return { nodes: [], edges: [], error: `Erro ao parsear .txt: ${err}` };
  }
}
