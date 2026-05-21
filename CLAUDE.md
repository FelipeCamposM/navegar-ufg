# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic graph navigation SPA for AED2/UFG 2026-1. Users import real maps (OpenStreetMap format), build/edit graphs, and run Dijkstra's shortest path algorithm — all client-side in the browser. Delivery: 01/06/2026.

## Commands

```bash
npm run dev       # dev server at localhost:3000
npm run build     # production build
npm run lint      # ESLint
npm start         # serve production build
```

No test runner configured in the docs — add vitest if needed.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript 5 |
| Graph viz | Cytoscape.js + react-cytoscapejs |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State | Zustand 5 |
| Parsing | Native DOMParser (OSM XML) |

## Architecture

3-layer separation — **UI → Domain → Utils**:

```
src/
├── app/                    # Next.js App Router (page.tsx, layout.tsx)
├── components/
│   ├── GraphCanvas.tsx     # Cytoscape.js wrapper — main graph view
│   ├── Toolbar.tsx         # Mode selector (Select/AddVertex/AddEdge/Move/Delete)
│   ├── StatsPanel.tsx      # Dijkstra stats display
│   ├── ImportExport.tsx    # File upload + clipboard image export
│   └── ContextMenu.tsx     # Right-click menu
├── lib/
│   ├── graph/
│   │   ├── Graph.ts        # Adjacency list: Map<NodeId, GraphEdge[]>
│   │   ├── dijkstra.ts     # MinHeap + Dijkstra, returns DijkstraResult
│   │   └── types.ts        # Shared TypeScript interfaces
│   ├── parsers/
│   │   ├── osmParser.ts    # DOMParser → Haversine dist → UTM coords
│   │   ├── polyParser.ts   # .poly: VERTICES/EDGES sections
│   │   └── txtParser.ts    # .txt: simple "source dest weight" lines
│   └── utils/
│       ├── coordinates.ts  # Geographic → Cartesian (UTM projection)
│       └── clipboard.ts    # Canvas → PNG → Clipboard API
└── hooks/
    ├── useGraph.ts         # Zustand store — global graph state
    └── useHistory.ts       # Undo/redo stack (max 50 snapshots)
```

## Core Domain Rules

**Graph representation:** `Map<NodeId, GraphNode>` + `Map<NodeId, GraphEdge[]>` (adjacency list). Undirected edges stored bidirectionally (reverse edge id gets `_rev` suffix). Campus UFG map: ~5,000 nodes, ~7,000 edges.

**Dijkstra:** `dijkstra(graph, source, target): DijkstraResult` — early termination when target extracted from MinHeap. Returns `{ path, cost, explored, timeMs, dist, prev }`. Target: <2s for ~500 nodes.

**Directed vs undirected:** `.osm` files detect `oneway=yes` tag on `<way>` elements. `.poly` files use a direction flag (0=undirected, 1=directed).

**Node colors:** default `#4A90D9` blue | origin `#27AE60` green | destination `#E74C3C` red | path `#F39C12` orange | visited `#BDC3C7` gray.

**Undo/redo:** Ctrl+Z / Ctrl+Y — history triggered only by structural changes (add/remove vertex or edge).

## Functional Requirements (with scoring weight)

| ID | Feature | Points |
|---|---|---|
| RF04 | Calculate & display shortest path (Dijkstra) | 1.50 |
| RF06 | Directed & undirected graph support | 1.30 |
| RF05 | Create & edit graphs (add/remove vertices/edges) | 1.10 |
| RF01 | Import maps (.osm, .poly, .txt) | 0.75 |
| RF07 | Show stats: time, nodes explored, path cost | 0.75 |
| RF02 | Enumerate vertices + label edges with weights | 0.20 |
| RF03 | Origin/destination selection with distinct colors | 0.20 |
| RF08 | Copy graph image to clipboard | 0.20 |

## Input File Formats

- **`.osm`** — OpenStreetMap XML. Parse `<node id lat lon>` and `<way>` with `<nd ref>` children. Calculate edge weights via Haversine formula. Convert coords to UTM for Cytoscape display.
- **`.poly`** — Cartesian graph. Two sections: `VERTICES` (id x y) and `EDGES` (src dst weight directionFlag).
- **`.txt`** — Simple adjacency list: `source dest weight` per line, or `NODES`/`EDGES` section blocks.

Reference C implementations in `funcoes em C/` (from professor) — useful for understanding expected parsing behavior.

## Map Data

Pre-included in `mapas/`: `Campus2UFG&Regiao.osm` (~11,456 OSM nodes → ~5,000 graph nodes) and `Campus2UFG&Regiao.poly` (~5,000 nodes, ~7,000 edges). Use these for testing import and Dijkstra performance.

## FluidGlass Design System

All UI panels use `<GlassPanel>` from `components/GlassPanel.tsx`. All CSS tokens in `lib/design-tokens.ts` — never hardcode glass values inline. All graph colors in `design-tokens.ts` `colors` export.

**Background:** `#070710` base + `.bg-orbs` class on `<main>` activates radial gradient colored orbs via `::before`.

**Glass formula:** `backdrop-blur-2xl saturate-200 bg-white/[0.07] border border-white/[0.13]` + multi-layer shadow + diagonal specular highlight overlay (`bg-gradient-to-br from-white/[0.10] via-transparent`).

**Hover:** `bg-white/[0.12] border-white/[0.22]` with `transition-all duration-300`.

**Rules:**
- No white or light backgrounds
- Never remove `backdrop-filter`/`backdrop-blur`
- Every interactive element needs the hover transition
- Shadows always paired with `inset_0_1px_0_rgba(255,255,255,0.12)`

## State / Re-render Pattern

`graph` object is mutated in place. `graphVersion: number` in the Zustand store is incremented on every mutation and is the dependency for `useMemo` in `GraphCanvas`. Always increment `graphVersion` when calling any `graph.*` method in the store.

## Cytoscape Notes

- `GraphCanvas` is loaded via `dynamic(..., { ssr: false })` — Cytoscape requires `window`.
- Cytoscape stylesheet uses `StylesheetStyle[]` (with `style` key, not `css` key).
- `transition-duration` is a `number` (ms), not a string like `'200ms'`.
- Reverse edges have id suffix `_rev` — filtered out when building elements.
- Event listeners registered in `useEffect([mode, graphType])`, not inline in `cy` prop callback.

## Documentation

Full specs in `docs/` (Portuguese):
- `arquitetura.md` — detailed layer design + data flow diagrams
- `requisitos.md` — acceptance criteria per requirement
- `estruturas-de-dados.md` — Graph + MinHeap complexity analysis
- `formatos-dados.md` — exact file format specs
