# Arquitetura do Sistema — Navegar UFG

## Visão Geral

O sistema é uma **Single Page Application (SPA)** em **Next.js 15** (App Router), executada inteiramente no browser do cliente. Não há back-end dedicado — toda a lógica de grafos, parsing e algoritmos roda no lado do cliente, garantindo:

- Latência mínima (sem round-trips de rede para cálculos)
- Deployment simples (exportação estática)
- Compatibilidade com Windows e Linux (RNF07)

---

## Diagrama de Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                    │
│                                                              │
│  GraphCanvas   Toolbar   StatsPanel   ImportExport           │
│  (Cytoscape)             (Dijkstra)   (OSM/POLY/TXT)         │
│                  ContextMenu                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │  eventos / estado (Zustand)
┌─────────────────────────▼───────────────────────────────────┐
│                      CAMADA DE DOMÍNIO                       │
│                                                              │
│   Graph.ts          dijkstra.ts          types.ts            │
│ (Lista de Adj.)   (MinHeap + Dijkstra)  (Interfaces TS)      │
│                                                              │
│   osmParser.ts    polyParser.ts    txtParser.ts              │
│   (XML/OSM)       (formato C)      (lista simples)           │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    MÓDULOS UTILITÁRIOS                       │
│                                                              │
│   coordinates.ts        clipboard.ts                         │
│   (geo → UTM)           (canvas → PNG)                       │
│                                                              │
│   useGraph.ts           useHistory.ts                        │
│   (estado Zustand)      (undo/redo stack)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura de Pastas

```
navegar-ufg/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página principal — monta a UI completa
│   │   ├── layout.tsx            # Layout raiz (fontes, metadata, providers)
│   │   └── globals.css           # Estilos globais + variáveis CSS
│   │
│   ├── components/
│   │   ├── GraphCanvas.tsx       # Canvas principal Cytoscape.js
│   │   ├── Toolbar.tsx           # Barra de ferramentas superior
│   │   ├── StatsPanel.tsx        # Painel de estatísticas (RF07)
│   │   ├── ImportExport.tsx      # Importação de arquivos e exportação de imagem
│   │   └── ContextMenu.tsx       # Menu de contexto (clique direito)
│   │
│   ├── lib/
│   │   ├── graph/
│   │   │   ├── Graph.ts          # Estrutura do grafo (Lista de Adjacência)
│   │   │   ├── dijkstra.ts       # Algoritmo de Dijkstra + MinHeap
│   │   │   └── types.ts          # Interfaces TypeScript do domínio
│   │   │
│   │   ├── parsers/
│   │   │   ├── osmParser.ts      # Parser XML do OpenStreetMap
│   │   │   ├── polyParser.ts     # Parser do formato .poly (conversor C)
│   │   │   └── txtParser.ts      # Parser de lista de adjacência .txt
│   │   │
│   │   └── utils/
│   │       ├── coordinates.ts    # Conversão lat/lon → UTM (coordenadas cartesianas)
│   │       └── clipboard.ts      # Exportar canvas como PNG para clipboard (RF08)
│   │
│   └── hooks/
│       ├── useGraph.ts           # Estado global do grafo (Zustand store)
│       └── useHistory.ts         # Stack de undo/redo
│
├── docs/                         # Documentação do projeto
├── scripts/
│   └── convert_pdfs.py           # Converte PDFs de instrução para MD (docling)
├── pdfs_instrucoes/              # PDFs originais do professor
├── mapas/                        # Arquivos OSM e POLY do campus UFG
│   ├── Campus2UFG&Regiao.osm
│   └── Campus2UFG&Regiao.poly
└── funcoes em C/                 # Referências em C fornecidas pelo professor
    ├── ConverteMapaParaGrafo.c
    ├── LeArqOSM_e_GeraArqPoly.c
    └── MenorCaminhoDijkstrav2.c
```

---

## Fluxo de Dados

### Importação de Mapa OSM

```
Usuário seleciona arquivo .osm
        │
        ▼
ImportExport.tsx
  detecta extensão → osmParser.ts
        │
        ▼
osmParser.ts
  1. DOMParser lê o XML
  2. Extrai <node> → GraphNode { id, lat, lon }
  3. Extrai <way> → lista de pares de nós consecutivos
  4. Para cada par: calcula distância (Haversine)
  5. Detecta oneway → directed: true/false
  6. Chama coordinates.ts para converter lat/lon → x/y cartesiano
        │
        ▼
useGraph.ts (Zustand)
  graph.addNode() e graph.addEdge() para cada elemento
        │
        ▼
GraphCanvas.tsx
  Cytoscape.js re-renderiza com os novos elementos
```

### Cálculo do Menor Caminho

```
Usuário clica "Calcular Menor Caminho"
        │
        ▼
GraphCanvas detecta source e target selecionados
        │
        ▼
dijkstra(graph, source, target)
  1. Inicializa dist[] = ∞, dist[source] = 0
  2. Inicializa prev[] = null
  3. MinHeap com (0, source)
  4. Loop: extrai mínimo, relax arestas, atualiza heap
  5. Para ao atingir target
  6. Reconstrói caminho via prev[]
  7. Retorna { path, cost, explored, timeMs }
        │
        ▼
GraphCanvas.tsx
  Aplica classe CSS "path-highlight" nos elementos do caminho
        │
        ▼
StatsPanel.tsx
  Exibe: tempo (ms), nós explorados, custo total
```

### Edição Interativa do Grafo

```
Duplo clique no canvas vazio
        │
        ▼
GraphCanvas: evento "dbltap" no background
  → cria GraphNode com coordenadas do clique
  → useHistory.push(snapshot anterior)
  → useGraph.addNode(node)
        │
        ▼
Cytoscape re-renderiza automaticamente
```

---

## Decisões de Design

### Por que Cytoscape.js?

| Critério | Cytoscape.js | React Flow | D3.js |
|---|---|---|---|
| Performance (> 1000 nós) | Excelente (canvas nativo) | Boa (SVG) | Boa (SVG) |
| Suporte a grafos dirigidos | Nativo | Parcial | Manual |
| API de algoritmos de grafo | Nativa (Dijkstra built-in) | Nenhuma | Manual |
| Interatividade com mouse | Completa | Completa | Manual |
| Curva de aprendizado | Média | Baixa | Alta |
| **Adequação ao projeto** | **Melhor** | Boa | Boa |

Cytoscape.js foi escolhido por ser uma biblioteca construída especificamente para visualização de redes/grafos, com renderização em canvas nativo (ideal para RNF03/RNF04) e suporte a grafos direcionados/não-direcionados de forma nativa.

### Por que Zustand?

Zustand é uma solução de gerenciamento de estado leve (~1KB), sem boilerplate, ideal para o tamanho e complexidade do projeto. O estado global do grafo (nós, arestas, origem, destino, resultado do Dijkstra) é gerenciado em um único store acessível por todos os componentes.

### Por que Lista de Adjacência?

Conforme especificado no enunciado, a **Lista de Adjacência** é a estrutura ideal para o algoritmo de Dijkstra em grafos esparsos:
- **Espaço:** O(V + E) — muito menor que Matriz de Adjacência O(V²) para mapas reais
- **Iteração sobre vizinhos:** O(grau do vértice) — eficiente para o relaxamento do Dijkstra
- Mapas reais (OSM) são tipicamente esparsos (cada rua conecta poucos vértices)

---

## Diagrama de Componentes

```
┌─────────────────────── page.tsx ──────────────────────────┐
│                                                            │
│  ┌──────────┐  ┌──────────────────────────────────────┐  │
│  │ Toolbar  │  │          GraphCanvas                  │  │
│  │          │  │  ┌────────────────────────────────┐  │  │
│  │[Importar]│  │  │        Cytoscape Instance      │  │  │
│  │[Calcular]│  │  │   (nós, arestas, highlights)   │  │  │
│  │[Editar]  │  │  └────────────────────────────────┘  │  │
│  │[Copiar]  │  └──────────────────────────────────────┘  │
│  └──────────┘                                            │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │   StatsPanel     │  │      ImportExport             │  │
│  │                  │  │  (upload de arquivo)          │  │
│  │ Tempo: 12ms      │  └──────────────────────────────┘  │
│  │ Nós: 47          │                                    │
│  │ Custo: 3.2km     │  ┌──────────────────────────────┐  │
│  └──────────────────┘  │      ContextMenu              │  │
│                        │  (remover / editar elemento)  │  │
│                        └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                               │
                    useGraph (Zustand Store)
                               │
              ┌────────────────┴─────────────┐
              │                              │
         Graph.ts                     dijkstra.ts
    (Lista de Adjacência)           (MinHeap + Dijkstra)
```
