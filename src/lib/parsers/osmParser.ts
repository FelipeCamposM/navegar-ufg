import { ParseResult, GraphNode, GraphEdge } from '../graph/types';
import { latLonToUTM, normalizeCoords, haversineDistance } from '../utils/coordinates';

const VALID_HIGHWAYS = new Set([
  'motorway', 'trunk', 'primary', 'secondary', 'tertiary',
  'unclassified', 'residential', 'service', 'living_street',
  'pedestrian', 'footway', 'path', 'cycleway', 'road',
  'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link',
]);

interface RawOsmNode {
  id: string;
  lat: number;
  lon: number;
}

export function parseOSM(content: string): ParseResult {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    if (doc.querySelector('parsererror')) {
      return { nodes: [], edges: [], error: 'Arquivo OSM inválido: erro de XML' };
    }

    // Collect all raw OSM nodes
    const rawNodes = new Map<string, RawOsmNode>();
    for (const el of doc.querySelectorAll('node')) {
      const id = el.getAttribute('id');
      const lat = parseFloat(el.getAttribute('lat') ?? '');
      const lon = parseFloat(el.getAttribute('lon') ?? '');
      if (id && !isNaN(lat) && !isNaN(lon)) {
        rawNodes.set(id, { id, lat, lon });
      }
    }

    const referencedNodeIds = new Set<string>();
    const edges: GraphEdge[] = [];

    for (const way of doc.querySelectorAll('way')) {
      const wayId = way.getAttribute('id') ?? 'unknown';

      // Check highway tag
      let isHighway = false;
      let isOneway = false;
      let isRoundabout = false;

      for (const tag of way.querySelectorAll('tag')) {
        const k = tag.getAttribute('k');
        const v = tag.getAttribute('v') ?? '';
        if (k === 'highway' && VALID_HIGHWAYS.has(v)) isHighway = true;
        if (k === 'oneway' && (v === 'yes' || v === '1' || v === 'true')) isOneway = true;
        if (k === 'junction' && v === 'roundabout') isRoundabout = true;
      }

      if (!isHighway) continue;

      const ndRefs = [...way.querySelectorAll('nd')]
        .map(nd => nd.getAttribute('ref'))
        .filter((ref): ref is string => ref !== null && rawNodes.has(ref));

      for (let i = 0; i < ndRefs.length - 1; i++) {
        const srcId = ndRefs[i];
        const tgtId = ndRefs[i + 1];

        referencedNodeIds.add(srcId);
        referencedNodeIds.add(tgtId);

        const srcNode = rawNodes.get(srcId)!;
        const tgtNode = rawNodes.get(tgtId)!;
        const weight = haversineDistance(srcNode.lat, srcNode.lon, tgtNode.lat, tgtNode.lon);

        edges.push({
          id: `way${wayId}_${i}`,
          source: srcId,
          target: tgtId,
          weight,
          directed: isOneway || isRoundabout,
          roundabout: isRoundabout || undefined,
        });
      }
    }

    // Only include referenced nodes
    const rawNodeList = [...referencedNodeIds]
      .map(id => rawNodes.get(id)!)
      .filter(Boolean);

    // Convert lat/lon → UTM → normalize (matching C reference behavior)
    const withUTM = rawNodeList.map(n => {
      const { x, y } = latLonToUTM(n.lat, n.lon);
      return { id: n.id, x, y };
    });

    const normalized = normalizeCoords(withUTM);
    const nodeMap = new Map(normalized.map(n => [n.id, n]));

    const nodes: GraphNode[] = normalized.map(n => ({
      id: n.id,
      label: n.id,
      x: n.x,
      y: n.y,
    }));

    // Remove edges referencing nodes that didn't make it into normalized set
    const validEdges = edges.filter(
      e => nodeMap.has(e.source) && nodeMap.has(e.target)
    );

    return { nodes, edges: validEdges };
  } catch (err) {
    return { nodes: [], edges: [], error: `Erro ao parsear .osm: ${err}` };
  }
}
