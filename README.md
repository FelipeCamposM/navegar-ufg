# NAVEGAR UFG

Sistema de navegação em grafos desenvolvido para o Trabalho Final de **Algoritmos e Estruturas de Dados 2 (AED2)** — INF/UFG 2026-1.

Importa mapas reais do OpenStreetMap, constrói grafos interativos e calcula o caminho mínimo com **Dijkstra + MinHeap próprio**, tudo 100% no browser — sem servidor.

---

## Funcionalidades

| Requisito | O que faz |
|-----------|-----------|
| **RF04** | Dijkstra com MinHeap implementado do zero — terminação antecipada ao encontrar o destino |
| **RF06** | Grafos direcionados e não-direcionados — detecção automática por parser |
| **RF05** | Criar, editar e excluir vértices e arestas — undo/redo com 20 snapshots |
| **RF01** | Importar mapas `.osm`, `.poly` e `.txt` — parsing 100% client-side |
| **RF07** | Exibir tempo de execução, nós explorados e custo total do caminho |
| **RF02** | Alternar visibilidade de IDs e rótulos de peso nas arestas |
| **RF03** | Cores distintas para origem, destino, caminho mínimo e nós explorados |
| **RF08** | Exportar o canvas como PNG direto para a área de transferência |

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript 5 |
| Visualização | Cytoscape.js 3.33 + react-cytoscapejs |
| Estado | Zustand 5 (store única + undo/redo) |
| Estilização | Tailwind CSS 4 + shadcn/ui (FluidGlass design system) |
| Deploy | Vercel |

---

## Início rápido

```bash
npm install
npm run dev      # localhost:3000
```

```bash
npm run build    # build de produção
npm run lint     # ESLint
npm start        # serve o build
```

**Node.js 18+** necessário.

---

## Formatos de mapa suportados

### `.osm` — OpenStreetMap XML
Arquivo padrão exportado do OpenStreetMap. Aceita 18 tipos de `highway`. Pesos calculados via fórmula de **Haversine**. Coordenadas convertidas para UTM Zona 23S. Arestas `oneway=yes` / `junction=roundabout` importadas como direcionadas.

### `.poly` — Cartesiano (formato do professor)
Dois blocos: `VERTICES (id x y)` e `EDGES (src dst weight dirFlag)`. Pesos via distância Euclidiana. Flag `0` = bidirecional, `1` = direcionada.

### `.txt` — 3 sub-formatos (auto-detectados)
- `src dst peso [dir]` por linha
- Blocos `NODES` / `EDGES`
- Lista de adjacência `nó: vizinhos`

---

## Arquitetura

```
src/
├── app/                    # Next.js App Router
├── components/             # Camada UI
│   ├── GraphCanvas.tsx     # Cytoscape.js wrapper (ssr: false)
│   ├── Toolbar.tsx         # Modos de edição + importação
│   ├── StatsPanel.tsx      # Resultados do Dijkstra
│   └── ContextMenu.tsx     # Menu de contexto (botão direito)
├── hooks/
│   └── useGraph.ts         # Zustand store — estado global + undo/redo
└── lib/
    ├── graph/
    │   ├── Graph.ts        # Adjacency list: Map<NodeId, GraphEdge[]>
    │   ├── dijkstra.ts     # MinHeap + Dijkstra com terminação antecipada
    │   └── types.ts        # Interfaces TypeScript compartilhadas
    ├── parsers/
    │   ├── osmParser.ts    # DOMParser + Haversine + UTM Zona 23S
    │   ├── polyParser.ts   # Formato cartesiano do professor
    │   └── txtParser.ts    # 3 sub-formatos com auto-detecção
    └── utils/
        ├── coordinates.ts  # UTM Zona 23S + normalizeCoords
        └── clipboard.ts    # Cytoscape PNG → Clipboard API
```

**Separação em 3 camadas:** UI (components) → Domínio (lib/graph, lib/parsers) → Utils. O domínio não importa React. Os parsers são stateless.

**Re-render controlado:** `graphVersion` no Zustand store incrementa a cada mutação e é a única dependência do `useMemo` no `GraphCanvas` — sem re-render desnecessário.

---

## Mapas incluídos

| Arquivo | Conteúdo |
|---------|----------|
| `mapas/Campus2UFG&Regiao.osm` | Campus Samambaia UFG — ~5.000 nós, ~7.000 arestas |
| `mapas/Campus2UFG&Regiao.poly` | Mesmo campus no formato cartesiano do professor |

Ambos disponíveis com um clique na toolbar — sem precisar carregar arquivo.

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [`docs/arquitetura.md`](docs/arquitetura.md) | Camadas, fluxos de dados e decisões de design |
| [`docs/estruturas-de-dados.md`](docs/estruturas-de-dados.md) | Grafo, MinHeap e análise de complexidade |
| [`docs/formatos-dados.md`](docs/formatos-dados.md) | Especificação dos formatos `.osm`, `.poly` e `.txt` |
| [`docs/requisitos.md`](docs/requisitos.md) | RF01–RF08 com critérios de aceitação |
| [`docs/guia-uso.md`](docs/guia-uso.md) | Como usar o canvas, importar mapas e rodar o Dijkstra |
| [`docs/guia-instalacao.md`](docs/guia-instalacao.md) | Pré-requisitos, instalação e solução de problemas |

---

## Contexto acadêmico

**Disciplina:** Algoritmos e Estruturas de Dados 2  
**Professor:** André L. Moura — INF/UFG  
**Período:** 2026-1  
**Entrega:** 01/06/2026
