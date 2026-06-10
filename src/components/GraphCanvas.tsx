'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import type Cytoscape from 'cytoscape';
import { useShallow } from 'zustand/react/shallow';
import { useGraph } from '@/hooks/useGraph';
import { ContextMenu, ContextMenuState } from './ContextMenu';
import type { NodeId } from '@/lib/graph/types';
import { colors, glass } from '@/lib/design-tokens';

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
function buildStylesheet(
  showLabels: boolean,
  showNodes: boolean,
  showRouteArrows: boolean,
  performanceMode: boolean
): Cytoscape.StylesheetStyle[] {
  const renderLabels = showLabels && !performanceMode;
  const renderGlobalArrows = showRouteArrows;
  const transitionDuration = performanceMode ? 0 : 200;

  return [
    {
      selector: 'node',
      style: {
        'background-color': colors.nodeDefault,
        'border-width': showNodes && !performanceMode ? 1 : 0,
        'border-color': 'rgba(255,255,255,0.22)',
        width: showNodes ? (performanceMode ? 2 : 6) : 2,
        height: showNodes ? (performanceMode ? 2 : 6) : 2,
        opacity: showNodes ? (performanceMode ? 0.75 : 0.9) : 0,
        label: renderLabels && showNodes ? 'data(label)' : '',
        'font-size': 9,
        color: '#ffffff',
        'text-outline-color': '#000000',
        'text-outline-width': 2,
        'text-valign': 'top',
        'text-halign': 'center',
        'transition-property': 'background-color border-color width height opacity',
        'transition-duration': transitionDuration,
      } as Cytoscape.Css.Node,
    },
    {
      selector: 'edge',
      style: {
        width: performanceMode ? 1.25 : 5,
        'line-color': '#4B5563',
        'line-cap': 'round',
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'none',
        'mid-target-arrow-shape': 'none',
        'curve-style': 'straight',
        label: renderLabels ? 'data(label)' : '',
        'font-size': 8,
        color: 'rgba(255,255,255,0.45)',
        'text-outline-color': '#000',
        'text-outline-width': 1,
        'transition-property': 'line-color width',
        'transition-duration': transitionDuration,
      } as Cytoscape.Css.Edge,
    },
    ...(renderGlobalArrows ? [{
      // Vee arrows draw only a thin head at the road center, keeping the lane readable.
      selector: 'edge[?directed]',
      style: {
        'curve-style': 'straight',
        'mid-target-arrow-shape': 'vee',
        'mid-target-arrow-color': performanceMode
          ? 'rgba(255,255,255,0.24)'
          : 'rgba(255,255,255,0.38)',
        'mid-arrow-scale': performanceMode ? 0.16 : 0.22,
      } as Cytoscape.Css.Edge,
    }] : []),
    // ── Dynamic class selectors ──────────────────────────────────────
    {
      selector: '.visited',
      style: { 'background-color': colors.nodeVisited, width: performanceMode ? 3 : 5, height: performanceMode ? 3 : 5, opacity: showNodes ? (performanceMode ? 0.25 : 0.45) : 0, 'border-width': 0 } as Cytoscape.Css.Node,
    },
    {
      selector: '.path-node',
      style: { 'background-color': '#93C5FD', width: performanceMode ? 4 : 5, height: performanceMode ? 4 : 5, opacity: 0.7, 'border-width': 0, 'z-index': 8 } as Cytoscape.Css.Node,
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
        'mid-target-arrow-color': 'rgba(219,234,254,0.55)',
        'mid-arrow-scale': 0.28,
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
      selector: '.edge-src',
      style: {
        'background-color': '#8B5CF6', 'border-color': 'rgba(255,255,255,0.9)', 'border-width': 3,
        width: 20, height: 20, opacity: 1,
        'underlay-color': '#8B5CF6', 'underlay-opacity': 0.4, 'underlay-padding': 6,
        'z-index': 20,
      } as Cytoscape.Css.Node,
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
    fitGraph, setFitGraph, graphType,
    isNavigating, navIndex, advanceNav,
  } = useGraph(useShallow((state) => ({
    graph: state.graph,
    graphVersion: state.graphVersion,
    mode: state.mode,
    showLabels: state.showLabels,
    showNodes: state.showNodes,
    showRouteArrows: state.showRouteArrows,
    sourceId: state.sourceId,
    targetId: state.targetId,
    dijkstraResult: state.dijkstraResult,
    fitGraph: state.fitGraph,
    setFitGraph: state.setFitGraph,
    graphType: state.graphType,
    isNavigating: state.isNavigating,
    navIndex: state.navIndex,
    advanceNav: state.advanceNav,
  })));

  const graphSize = useMemo(() => {
    void graphVersion;
    return {
      nodes: graph.nodeCount,
      edges: graph.edgeCount,
    };
  }, [graph, graphVersion]);
  const performanceMode = graphSize.nodes > 5000 || graphSize.edges > 10000;
  const renderLabels = showLabels && !performanceMode;

  useEffect(() => { storeRef.current = useGraph.getState(); });

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [edgeDialog, setEdgeDialog] = useState<{ srcId: NodeId; tgtId: NodeId; defaultWeight: number } | null>(null);
  const [edgeWeightInput, setEdgeWeightInput] = useState('');
  const edgeSrcId = useRef<NodeId | null>(null);
  const prevNavNodeRef = useRef<string | null>(null);

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
            label: renderLabels
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
  }, [graphVersion, renderLabels]);

  // Static stylesheet — only changes when labels/nodes toggles flip
  const stylesheet = useMemo(
    () => buildStylesheet(showLabels, showNodes, showRouteArrows, performanceMode),
    [showLabels, showNodes, showRouteArrows, performanceMode]
  );

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

    // Camera follow: keep the map north-up and move ahead along the route.
    // Rotating the Cytoscape wrapper clips the canvas because the rendered
    // viewport remains bounded by its original rectangular element.
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
            }
          }
        }

        // Keep the navigation marker slightly below center so the route ahead is visible.
        const navZoom = BASE_ZOOM;
        const targetCanvasY = 0.62 * h;
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

    // All taps: dismiss context menu, select mode (fires even on node taps), addVertex on background
    cy.on('tap', (evt) => {
      setContextMenu(null);

      // Cancel pending edge source only when clicking empty background
      if (evt.target === cy && edgeSrcId.current) {
        cy.$(`#${edgeSrcId.current}`).removeClass('edge-src');
        edgeSrcId.current = null;
      }

      const s = storeRef.current;
      if (s.mode === 'select') {
        const nearest = findNearestNode(cy, evt.position);
        if (nearest) s.selectNode(nearest);
      }
      if (s.mode === 'addVertex' && evt.target === cy) {
        const pos = evt.position;
        nodeCounter++;
        const id = `v${nodeCounter}`;
        s.addNode({ id, label: id, x: pos.x, y: pos.y });
      }
    });

    // Node tap: delete, addEdge click-click, or context dismiss
    cy.on('tap', 'node', (evt) => {
      setContextMenu(null);
      const s = storeRef.current;

      if (s.mode === 'delete') {
        evt.stopPropagation();
        s.removeNode(evt.target.id());
        return;
      }

      if (s.mode === 'addEdge') {
        evt.stopPropagation();
        const clickedId = evt.target.id() as NodeId;

        if (!edgeSrcId.current) {
          // First click — mark source
          edgeSrcId.current = clickedId;
          cy.$(`#${clickedId}`).addClass('edge-src');
        } else if (edgeSrcId.current === clickedId) {
          // Clicked same node — cancel
          cy.$(`#${clickedId}`).removeClass('edge-src');
          edgeSrcId.current = null;
        } else {
          // Second click — create edge
          const srcId = edgeSrcId.current;
          const tgtId = clickedId;
          cy.$(`#${srcId}`).removeClass('edge-src');
          edgeSrcId.current = null;

          const srcNode = s.graph.getNodes().get(srcId);
          const tgtNode = s.graph.getNodes().get(tgtId);
          if (srcNode && tgtNode) {
            const defaultWeight = Math.sqrt(
              (srcNode.x - tgtNode.x) ** 2 + (srcNode.y - tgtNode.y) ** 2
            );
            setEdgeWeightInput(defaultWeight.toFixed(2));
            setEdgeDialog({ srcId, tgtId, defaultWeight });
          }
        }
        return;
      }
    });

    cy.on('tap', 'edge', (evt) => {
      setContextMenu(null);
      const s = storeRef.current;
      if (s.mode === 'delete') { evt.stopPropagation(); s.removeEdge(evt.target.id()); }
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

    cy.on('dragfree', 'node', (evt) => {
      if (storeRef.current.mode === 'move') {
        const pos = evt.target.position();
        storeRef.current.moveNode(evt.target.id(), pos.x, pos.y);
      }
    });
  }, [mode, graphType, cyRef]);

  // Clear pending edge source when switching away from addEdge mode
  useEffect(() => {
    if (mode !== 'addEdge' && edgeSrcId.current && cyRef.current) {
      cyRef.current.$(`#${edgeSrcId.current}`).removeClass('edge-src');
      edgeSrcId.current = null;
    }
  }, [mode, cyRef]);

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

  function confirmEdge() {
    if (!edgeDialog) return;
    const { srcId, tgtId, defaultWeight } = edgeDialog;
    const weight = parseFloat(edgeWeightInput) || defaultWeight;
    storeRef.current.addEdge({
      id: `e_${srcId}_${tgtId}_${Date.now()}`,
      source: srcId,
      target: tgtId,
      weight,
      directed: storeRef.current.graphType === 'directed',
    });
    setEdgeDialog(null);
  }

  function cancelEdge() {
    setEdgeDialog(null);
  }

  return (
    <div className="cy-container">
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
        pixelRatio={performanceMode ? 1 : 'auto'}
        textureOnViewport={performanceMode}
        hideEdgesOnViewport={false}
        autoungrabify={mode !== 'move'}
        boxSelectionEnabled={false}
        panningEnabled
        userPanningEnabled={mode !== 'addVertex'}
      />
      {contextMenu && (
        <ContextMenu state={contextMenu} onClose={() => setContextMenu(null)} />
      )}
      {edgeDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className={`relative ${glass.panel} p-6 w-72 flex flex-col gap-4`}>
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col gap-4">
              <p className={glass.label}>Peso da aresta</p>
              <input
                autoFocus
                type="number"
                step="0.01"
                className={glass.input}
                value={edgeWeightInput}
                onChange={e => setEdgeWeightInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') confirmEdge();
                  if (e.key === 'Escape') cancelEdge();
                }}
              />
              <div className="flex gap-2 justify-end">
                <button className={glass.button} onClick={cancelEdge}>Cancelar</button>
                <button className={`${glass.button} ${glass.buttonSuccess}`} onClick={confirmEdge}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
