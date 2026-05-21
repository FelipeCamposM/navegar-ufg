'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import type Cytoscape from 'cytoscape';
import { useGraph } from '@/hooks/useGraph';
import { ContextMenu, ContextMenuState } from './ContextMenu';
import type { NodeId } from '@/lib/graph/types';
import { colors } from '@/lib/design-tokens';

interface GraphCanvasProps {
  cyRef: React.RefObject<Cytoscape.Core | null>;
}

let nodeCounter = 0;

function findNearestNode(cy: Cytoscape.Core, pos: { x: number; y: number }): string | null {
  let minDist = Infinity;
  let nearestId: string | null = null;
  cy.nodes().forEach((node: Cytoscape.NodeSingular) => {
    const np = node.position();
    const d = (np.x - pos.x) ** 2 + (np.y - pos.y) ** 2;
    if (d < minDist) { minDist = d; nearestId = node.id(); }
  });
  return nearestId;
}

// Static stylesheet — only recomputed when showLabels/showNodes toggle.
// Dynamic visual states use CSS classes applied imperatively in useEffect,
// avoiding large ID-selector strings that force full Cytoscape re-styles.
function buildStylesheet(showLabels: boolean, showNodes: boolean, showRouteArrows: boolean): Cytoscape.StylesheetStyle[] {
  return [
    {
      selector: 'node',
      style: {
        'background-color': colors.nodeDefault,
        'border-width': showNodes ? 1 : 0,
        'border-color': 'rgba(255,255,255,0.22)',
        width: showNodes ? 6 : 4,
        height: showNodes ? 6 : 4,
        opacity: showNodes ? 0.9 : 0,
        label: showLabels && showNodes ? 'data(label)' : '',
        'font-size': 9,
        color: '#ffffff',
        'text-outline-color': '#000000',
        'text-outline-width': 2,
        'text-valign': 'top',
        'text-halign': 'center',
        'transition-property': 'background-color border-color width height opacity',
        'transition-duration': 200,
      } as Cytoscape.Css.Node,
    },
    {
      selector: 'edge',
      style: {
        width: 5,
        'line-color': '#4B5563',
        'line-cap': 'round',
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'none',
        'mid-target-arrow-shape': 'none',
        'curve-style': 'straight',
        label: showLabels ? 'data(label)' : '',
        'font-size': 8,
        color: 'rgba(255,255,255,0.45)',
        'text-outline-color': '#000',
        'text-outline-width': 1,
        'transition-property': 'line-color width',
        'transition-duration': 200,
      } as Cytoscape.Css.Edge,
    },
    ...(showRouteArrows ? [{
      // Vee arrows draw only a thin head at the road center, keeping the lane readable.
      selector: 'edge[?directed]',
      style: {
        'curve-style': 'straight',
        'mid-target-arrow-shape': 'vee',
        'mid-target-arrow-color': 'rgba(255,255,255,0.34)',
        'mid-arrow-scale': 0.5,
      } as Cytoscape.Css.Edge,
    }] : []),
    // ── Dynamic class selectors ──────────────────────────────────────
    {
      selector: '.visited',
      style: { 'background-color': colors.nodeVisited, width: 5, height: 5, opacity: 0.45, 'border-width': 0 } as Cytoscape.Css.Node,
    },
    {
      selector: '.path-node',
      style: { 'background-color': '#93C5FD', width: 5, height: 5, opacity: 0.6, 'border-width': 0, 'z-index': 8 } as Cytoscape.Css.Node,
    },
    {
      selector: '.path-edge',
      style: {
        'line-color': '#2563EB', 'target-arrow-color': '#2563EB',
        width: 7, 'line-cap': 'round',
        'underlay-color': '#93C5FD', 'underlay-opacity': 0.4, 'underlay-padding': 5,
        'z-index': 10,
      } as Cytoscape.Css.Edge,
    },
    // Route direction arrows (one-way streets inside the highlighted path)
    ...(showRouteArrows ? [{
      selector: 'edge.path-edge[?directed]',
      style: {
        'mid-target-arrow-shape': 'vee',
        'mid-target-arrow-color': 'rgba(219,234,254,0.68)',
        'mid-arrow-scale': 0.58,
      } as Cytoscape.Css.Edge,
    }] : []),
    {
      selector: '.traveled-edge',
      style: {
        'line-color': '#1E3A8A', 'target-arrow-color': '#1E3A8A',
        width: 4, 'underlay-opacity': 0, 'z-index': 11,
      } as Cytoscape.Css.Edge,
    },
    {
      selector: '.source',
      style: {
        'background-color': colors.nodeSource, 'border-color': 'rgba(255,255,255,0.8)', 'border-width': 3,
        width: 20, height: 20, opacity: 1,
        label: 'A', 'font-size': 10, color: '#ffffff',
        'text-outline-color': colors.nodeSource, 'text-outline-width': 2,
        'text-valign': 'center', 'text-halign': 'center',
        'underlay-color': colors.nodeSource, 'underlay-opacity': 0.35, 'underlay-padding': 6,
        'z-index': 20,
      } as Cytoscape.Css.Node,
    },
    {
      selector: '.target',
      style: {
        'background-color': colors.nodeTarget, 'border-color': 'rgba(255,255,255,0.8)', 'border-width': 3,
        width: 20, height: 20, opacity: 1,
        label: 'B', 'font-size': 10, color: '#ffffff',
        'text-outline-color': colors.nodeTarget, 'text-outline-width': 2,
        'text-valign': 'center', 'text-halign': 'center',
        'underlay-color': colors.nodeTarget, 'underlay-opacity': 0.35, 'underlay-padding': 6,
        'z-index': 20,
      } as Cytoscape.Css.Node,
    },
    {
      selector: '.nav',
      style: {
        'background-color': '#FFFFFF', 'border-color': '#93C5FD', 'border-width': 3,
        width: 18, height: 18, opacity: 1, label: '',
        'underlay-color': '#FFFFFF', 'underlay-opacity': 0.45, 'underlay-padding': 9,
        'z-index': 30,
      } as Cytoscape.Css.Node,
    },
  ];
}

export function GraphCanvas({ cyRef }: GraphCanvasProps) {
  const storeRef = useRef(useGraph.getState());

  const {
    graph, graphVersion, mode, showLabels, showNodes, showRouteArrows, sourceId, targetId, dijkstraResult,
    addNode, addEdge, removeNode, removeEdge, moveNode,
    selectNode, undo, redo, clearSelection,
    fitGraph, setFitGraph, graphType,
    isNavigating, navIndex, advanceNav,
  } = useGraph();

  useEffect(() => { storeRef.current = useGraph.getState(); });

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const draggingFrom = useRef<NodeId | null>(null);
  const prevNavNodeRef = useRef<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Accumulated heading — never jumps through ±180° discontinuity
  const prevHeadingRef = useRef(0);

  const elements = useMemo(() => {
    const els: Cytoscape.ElementDefinition[] = [];
    for (const node of graph.getNodes().values()) {
      els.push({
        group: 'nodes',
        data: { id: node.id, label: node.label ?? node.id },
        position: { x: node.x, y: node.y },
      });
    }
    for (const edgeList of graph.getAdjacency().values()) {
      for (const edge of edgeList) {
        if (edge.id.endsWith('_rev')) continue;
        els.push({
          group: 'edges',
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: showLabels
              ? edge.weight >= 1000
                ? `${(edge.weight / 1000).toFixed(2)}km`
                : `${edge.weight.toFixed(0)}m`
              : '',
            directed: edge.directed,
            roundabout: edge.roundabout ?? false,
          },
        });
      }
    }
    return els;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphVersion, showLabels]);

  // Static stylesheet — only changes when labels/nodes toggles flip
  const stylesheet = useMemo(() => buildStylesheet(showLabels, showNodes, showRouteArrows), [showLabels, showNodes, showRouteArrows]);

  useEffect(() => {
    if (fitGraph && cyRef.current) {
      const cy = cyRef.current;
      setTimeout(() => { cy.fit(undefined, 60); setFitGraph(false); }, 150);
    }
  }, [fitGraph, cyRef, setFitGraph]);

  // Apply path/visited/source/target classes.
  // Does NOT run on navIndex changes → no full rebuild during navigation.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().removeClass('source target visited path-node path-edge');

      if (sourceId) cy.$(`#${sourceId}`).addClass('source');
      if (targetId) cy.$(`#${targetId}`).addClass('target');

      if (!dijkstraResult || dijkstraResult.noPath) return;

      const path = dijkstraResult.path;
      const pathNodeSet = new Set(path);

      // Single pass over cy nodes — O(n) with no repeated cy.$ lookups
      const visitedSet = new Set<string>();
      for (const [nodeId, d] of dijkstraResult.dist) {
        if (d < Infinity && !pathNodeSet.has(nodeId) && nodeId !== sourceId && nodeId !== targetId) {
          visitedSet.add(nodeId);
        }
      }
      cy.nodes().forEach((n: Cytoscape.NodeSingular) => {
        if (visitedSet.has(n.id())) n.addClass('visited');
      });

      for (const nodeId of path) cy.$(`#${nodeId}`).addClass('path-node');

      const { graph: g } = storeRef.current;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = g.getNeighbors(path[i]).find(e => e.target === path[i + 1]);
        if (edge) {
          const baseId = edge.id.endsWith('_rev') ? edge.id.slice(0, -4) : edge.id;
          cy.$(`#${baseId}`).addClass('path-edge');
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceId, targetId, dijkstraResult, cyRef]);

  // Navigation: O(1) per step — only moves the nav dot + marks one edge as traveled
  useEffect(() => {
    const cy = cyRef.current;

    if (!isNavigating || !dijkstraResult || dijkstraResult.noPath) {
      if (cy) {
        cy.batch(() => {
          if (prevNavNodeRef.current) {
            cy.$(`#${prevNavNodeRef.current}`).removeClass('nav');
            prevNavNodeRef.current = null;
          }
          cy.edges().removeClass('traveled-edge');
        });
      }
      return;
    }

    if (!cy) return;
    const path = dijkstraResult.path;
    const currentNodeId = path[navIndex];

    cy.batch(() => {
      // Move nav dot (only touch prev + current — not all nodes)
      if (prevNavNodeRef.current) cy.$(`#${prevNavNodeRef.current}`).removeClass('nav');
      if (currentNodeId) cy.$(`#${currentNodeId}`).addClass('nav');
      prevNavNodeRef.current = currentNodeId ?? null;

      // Mark the edge just traversed as traveled
      if (navIndex > 0) {
        const src = path[navIndex - 1];
        const edge = storeRef.current.graph.getNeighbors(src).find(e => e.target === currentNodeId);
        if (edge) {
          const baseId = edge.id.endsWith('_rev') ? edge.id.slice(0, -4) : edge.id;
          cy.$(`#${baseId}`).addClass('traveled-edge');
        }
      }
    });

    // Camera follow — heading-up 2D rotation (Maps style, no 3D tilt)
    const currentEl = cy.$(`#${currentNodeId}`);
    const nextId = path[navIndex + 1];
    if (currentEl.length) {
      const pos = currentEl.position();
      const container = cy.container();
      if (container) {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        const BASE_ZOOM = 3;
        let offsetX = 0, offsetY = 0;
        // Default: keep previous heading (no next node = end of route)
        let headingDeg = prevHeadingRef.current;

        if (nextId) {
          const nextEl = cy.$(`#${nextId}`);
          if (nextEl.length) {
            const np = nextEl.position();
            const dx = np.x - pos.x;
            const dy = np.y - pos.y;
            const dist = Math.sqrt(dx ** 2 + dy ** 2);
            if (dist > 0) {
              offsetX = (dx / dist) * 50;
              offsetY = (dy / dist) * 50;
              // Angle that places travel direction at screen-up (-y axis)
              const rawHeading = -Math.atan2(dx, -dy) * (180 / Math.PI);
              // Shortest arc — prevents CSS from spinning through ±180°
              let delta = rawHeading - prevHeadingRef.current;
              while (delta > 180) delta -= 360;
              while (delta < -180) delta += 360;
              headingDeg = prevHeadingRef.current + delta;
              prevHeadingRef.current = headingDeg;
            }
          }
        }

        // Scale so rotated rect's corners stay inside container — prevents clipping
        const hr = (headingDeg * Math.PI) / 180;
        const ac = Math.abs(Math.cos(hr));
        const as = Math.abs(Math.sin(hr));
        const scale = Math.min(w / (w * ac + h * as), h / (w * as + h * ac)) * 0.96;
        // Zoom compensates for scale so visual road size stays constant
        const navZoom = BASE_ZOOM / scale;

        if (wrapperRef.current) {
          wrapperRef.current.style.transition = 'transform 0.28s ease-out';
          wrapperRef.current.style.transformOrigin = 'center center';
          wrapperRef.current.style.transform =
            `rotate(${headingDeg.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        }

        // Pan target corrected for CSS-scale offset so node lands at visual 62%
        const targetCanvasY = h / 2 + (0.62 * h - h / 2) / scale;
        cy.animate({
          pan: {
            x: w / 2 - (pos.x + offsetX) * navZoom,
            y: targetCanvasY - (pos.y + offsetY) * navZoom,
          },
          zoom: navZoom,
          duration: 270,
          easing: 'ease-in-out-cubic',
        });
      }
    }

    const timer = setTimeout(() => advanceNav(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigating, navIndex, dijkstraResult]);

  // Reset rotation + accumulated heading when navigation ends
  useEffect(() => {
    if (!isNavigating) {
      prevHeadingRef.current = 0;
      if (wrapperRef.current) {
        wrapperRef.current.style.transition = 'transform 0.5s ease-in-out';
        wrapperRef.current.style.transform = 'none';
        wrapperRef.current.style.transformOrigin = '';
      }
    }
  }, [isNavigating]);

  // Keyboard shortcuts
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const s = storeRef.current;
      if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); s.undo(); }
      if (e.ctrlKey && e.key.toLowerCase() === 'y') { e.preventDefault(); s.redo(); }
      if (e.key === 'Escape') s.clearSelection();
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey) {
        const cy = cyRef.current;
        if (!cy) return;
        cy.$(':selected').forEach((el: Cytoscape.SingularElementReturnValue) => {
          if (el.isNode()) s.removeNode(el.id());
          if (el.isEdge()) s.removeEdge(el.id());
        });
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cytoscape event listeners — re-register on mode/graphType change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.removeAllListeners();

    cy.on('tap', (evt) => {
      setContextMenu(null);
      const s = storeRef.current;
      if (s.mode !== 'select') return;
      const nearest = findNearestNode(cy, evt.position);
      if (nearest) s.selectNode(nearest);
    });

    cy.on('tap', 'node', (evt) => {
      const s = storeRef.current;
      if (s.mode === 'delete') { evt.stopPropagation(); s.removeNode(evt.target.id()); }
    });

    cy.on('tap', 'edge', (evt) => {
      const s = storeRef.current;
      if (s.mode === 'delete') { evt.stopPropagation(); s.removeEdge(evt.target.id()); }
    });

    cy.on('tap', (evt) => {
      if (evt.target !== cy) return;
      const s = storeRef.current;
      if (s.mode === 'addVertex') {
        const pos = evt.position;
        nodeCounter++;
        const id = `v${nodeCounter}`;
        s.addNode({ id, label: id, x: pos.x, y: pos.y });
      }
    });

    cy.on('dbltap', (evt) => {
      if (evt.target === cy) cy.fit(undefined, 60);
    });

    cy.on('cxttap', 'node', (evt) => {
      const rp = evt.renderedPosition;
      setContextMenu({ x: rp.x, y: rp.y, targetId: evt.target.id(), targetType: 'node' });
    });

    cy.on('cxttap', 'edge', (evt) => {
      const rp = evt.renderedPosition;
      setContextMenu({ x: rp.x, y: rp.y, targetId: evt.target.id(), targetType: 'edge' });
    });

    cy.on('mousedown', 'node', (evt) => {
      if (storeRef.current.mode === 'addEdge') draggingFrom.current = evt.target.id();
    });

    cy.on('mouseup', 'node', (evt) => {
      const s = storeRef.current;
      if (s.mode === 'addEdge' && draggingFrom.current && draggingFrom.current !== evt.target.id()) {
        const srcId = draggingFrom.current;
        const tgtId = evt.target.id() as NodeId;
        const srcNode = s.graph.getNodes().get(srcId);
        const tgtNode = s.graph.getNodes().get(tgtId);
        if (srcNode && tgtNode) {
          const defaultWeight = Math.sqrt((srcNode.x - tgtNode.x) ** 2 + (srcNode.y - tgtNode.y) ** 2);
          const raw = window.prompt('Peso da aresta (metros):', defaultWeight.toFixed(2));
          if (raw !== null) {
            const weight = parseFloat(raw) || defaultWeight;
            s.addEdge({
              id: `e_${srcId}_${tgtId}_${Date.now()}`,
              source: srcId,
              target: tgtId,
              weight,
              directed: s.graphType === 'directed',
            });
          }
        }
      }
      draggingFrom.current = null;
    });

    cy.on('mouseup', (evt) => {
      if (evt.target === cy) draggingFrom.current = null;
    });

    cy.on('dragfree', 'node', (evt) => {
      if (storeRef.current.mode === 'move') {
        const pos = evt.target.position();
        storeRef.current.moveNode(evt.target.id(), pos.x, pos.y);
      }
    });
  }, [mode, graphType, cyRef]);

  // Hover cursor hint
  useEffect(() => {
    const container = cyRef.current?.container();
    if (!container) return;
    container.style.cursor = mode === 'select' ? 'crosshair' : 'default';
  }, [mode, cyRef]);

  // Middle mouse button drag → pan
  useEffect(() => {
    const container = cyRef.current?.container();
    if (!container) return;

    let active = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 1) return;
      e.preventDefault();
      active = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.style.cursor = 'grabbing';
    };
    const onMove = (e: MouseEvent) => {
      if (!active || !cyRef.current) return;
      cyRef.current.panBy({ x: e.clientX - lastX, y: e.clientY - lastY });
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: MouseEvent) => {
      if (e.button !== 1) return;
      active = false;
      container.style.cursor = mode === 'select' ? 'crosshair' : 'default';
    };

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      container.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cyRef]);

  return (
    <div ref={wrapperRef} className="cy-container">
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        style={{ width: '100%', height: '100%', background: '#111827' }}
        cy={(cy: Cytoscape.Core) => {
          (cyRef as React.MutableRefObject<Cytoscape.Core | null>).current = cy;
        }}
        wheelSensitivity={1.8}
        minZoom={0.02}
        maxZoom={10}
        autoungrabify={mode !== 'move' && mode !== 'addEdge'}
        boxSelectionEnabled={false}
        panningEnabled
        userPanningEnabled={mode !== 'addVertex'}
      />
      {contextMenu && (
        <ContextMenu state={contextMenu} onClose={() => setContextMenu(null)} />
      )}
    </div>
  );
}
