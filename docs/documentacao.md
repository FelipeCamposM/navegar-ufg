# Documentação do Projeto — Sistema de Navegação Primitivo

**Disciplina:** Algoritmos e Estruturas de Dados 2 — INF/UFG 2026-1  
**Professor:** André L. Moura  
**Data de entrega:** 01/06/2026  

---

## Integrantes

> (Nomes completos em ordem alfabética — preencher com os membros definitivos do grupo)

1. _Integrante A_
2. _Integrante B_
3. _Integrante C_
4. _Integrante D_
5. _Integrante E_ _(opcional)_

---

## 1. Introdução

### 1.1 Objetivo do Documento

Este documento descreve a arquitetura, os requisitos, as decisões de design e os guias de uso e instalação do **Sistema de Navegação Primitivo**, trabalho final da disciplina AED2 2026-1. Seu propósito é registrar de forma técnica e estruturada o sistema desenvolvido, servindo como referência para a apresentação e para a manutenção futura do código.

### 1.2 Escopo do Projeto e Objetivos

O sistema é uma aplicação web que permite ao usuário:

- Importar mapas reais no formato OSM (OpenStreetMap) ou POLY e convertê-los em grafos navegáveis.
- Criar e editar grafos manualmente via interface gráfica.
- Selecionar um vértice de origem e um de destino.
- Calcular e visualizar o **menor caminho** entre os dois vértices usando o **Algoritmo de Dijkstra**.
- Visualizar estatísticas de execução do algoritmo (tempo, nós explorados, custo total).

O projeto utiliza como dados de entrada os arquivos do **Campus Samambaia da UFG e região** (`Campus2UFG&Regiao.osm` e `Campus2UFG&Regiao.poly`).

### 1.3 Visão Geral do Sistema

O sistema é composto por três camadas principais:

| Camada | Responsabilidade |
|--------|-----------------|
| **Apresentação (UI)** | Interface visual interativa, renderização do grafo, controles do usuário |
| **Domínio (Core)** | Estruturas de dados do grafo, algoritmo de Dijkstra, parsers de arquivos |
| **Utilitários (Utils)** | Conversão de coordenadas, cópia para clipboard, histórico de ações |

```
Usuário
   │
   ▼
Interface Web (Next.js)
   │
   ├──► GraphCanvas (Cytoscape.js)  ◄──── Estado do Grafo (Zustand)
   │                                             │
   ├──► Toolbar / ContextMenu                   │
   │                                             ▼
   └──► ImportExport ──────────► Parsers (OSM / POLY / TXT)
                                             │
                                             ▼
                                    Graph + Dijkstra (lib/core)
```

---

## 2. Arquitetura do Sistema

### 2.1 Visão Arquitetural

O sistema é uma **Single Page Application (SPA)** construída com **Next.js 15** (App Router). Toda a lógica de grafos é executada no lado do cliente (browser), sem necessidade de servidor back-end, garantindo baixa latência e simplicidade de deployment.

### 2.2 Descrição das Camadas

#### 2.2.1 Camada de Apresentação (UI)

Localizada em `src/components/`, contém todos os componentes React responsáveis pela interação com o usuário:

| Componente | Arquivo | Responsabilidade |
|---|---|---|
| GraphCanvas | `GraphCanvas.tsx` | Renderiza o grafo via Cytoscape.js; captura eventos de mouse para seleção, criação e remoção de vértices/arestas |
| Toolbar | `Toolbar.tsx` | Botões de controle: modo de edição, importar, exportar, calcular caminho, limpar |
| StatsPanel | `StatsPanel.tsx` | Exibe estatísticas após execução do Dijkstra (tempo, nós explorados, custo) |
| ImportExport | `ImportExport.tsx` | Upload e parsing de arquivos `.osm`, `.poly` e `.txt`; botão de cópia de imagem |
| ContextMenu | `ContextMenu.tsx` | Menu de contexto (clique direito) para operações em vértices e arestas |

#### 2.2.2 Camada de Domínio (Core)

Localizada em `src/lib/graph/` e `src/lib/parsers/`, contém a lógica central do sistema:

| Módulo | Arquivo | Responsabilidade |
|---|---|---|
| Graph | `graph/Graph.ts` | Representação do grafo via Lista de Adjacência; operações de adicionar/remover vértices e arestas |
| Dijkstra | `graph/dijkstra.ts` | Implementação do algoritmo de Dijkstra com MinHeap; retorna caminho, custo e estatísticas |
| Types | `graph/types.ts` | Definições de tipos TypeScript (Node, Edge, GraphState, DijkstraResult) |
| OSM Parser | `parsers/osmParser.ts` | Lê XML do OpenStreetMap e extrai nós e vias para o formato interno do grafo |
| POLY Parser | `parsers/polyParser.ts` | Lê o formato `.poly` gerado pelo conversor em C e popula o grafo |
| TXT Parser | `parsers/txtParser.ts` | Lê lista de adjacência em formato texto simples |

#### 2.2.3 Módulos Utilitários

Localizados em `src/lib/utils/` e `src/hooks/`:

| Módulo | Arquivo | Responsabilidade |
|---|---|---|
| Coordinates | `utils/coordinates.ts` | Converte coordenadas geográficas (lat/lon) em coordenadas cartesianas (UTM) para posicionamento visual |
| Clipboard | `utils/clipboard.ts` | Exporta o canvas do grafo como imagem PNG para a área de transferência (RF08) |
| useGraph | `hooks/useGraph.ts` | Hook de estado global do grafo usando Zustand |
| useHistory | `hooks/useHistory.ts` | Hook de histórico para undo/redo das operações de edição (RF05) |

### 2.3 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Next.js** | 15 | Framework React, App Router, SSR/SSG |
| **TypeScript** | 5 | Tipagem estática |
| **Cytoscape.js** | 3.x | Visualização e interação com grafos |
| **react-cytoscapejs** | latest | Wrapper React para Cytoscape |
| **Tailwind CSS** | 4 | Estilização utilitária |
| **shadcn/ui** | latest | Componentes de interface acessíveis |
| **Zustand** | 5 | Gerenciamento de estado leve |
| **xml2js** / DOMParser | — | Parsing de arquivos OSM (XML) |

---

## 3. Detalhamento dos Módulos

### 3.1 Módulo Core (`src/lib/graph`)

O módulo central do sistema implementa as estruturas de dados e algoritmos conforme especificado no enunciado:

**Graph.ts** — Grafo representado como Lista de Adjacência:

```typescript
type NodeId = string;

interface GraphNode {
  id: NodeId;
  label?: string;
  x: number;
  y: number;
}

interface GraphEdge {
  id: string;
  source: NodeId;
  target: NodeId;
  weight: number;
  directed: boolean;
}

class Graph {
  nodes: Map<NodeId, GraphNode>;
  adjacency: Map<NodeId, GraphEdge[]>;

  addNode(node: GraphNode): void;
  removeNode(id: NodeId): void;
  addEdge(edge: GraphEdge): void;
  removeEdge(id: string): void;
  getNeighbors(id: NodeId): GraphEdge[];
}
```

**dijkstra.ts** — Algoritmo de Dijkstra com MinHeap:

```typescript
interface DijkstraResult {
  path: NodeId[];
  cost: number;
  explored: number;
  timeMs: number;
  dist: Map<NodeId, number>;
  prev: Map<NodeId, NodeId | null>;
}

function dijkstra(graph: Graph, source: NodeId, target: NodeId): DijkstraResult;
```

### 3.2 Módulo UI (`src/components`)

O componente `GraphCanvas` é o coração da interface. Ele monta a instância do Cytoscape.js com as seguintes configurações:

- **Estilo visual:** nós coloridos por estado (padrão, origem, destino, visitado, caminho), arestas com label de peso, setas para grafos direcionados.
- **Eventos:** `tap` para selecionar/criar vértices; `tapend` para criar arestas entre nós; `cxttap` para abrir o menu de contexto.
- **Highlight de caminho:** ao calcular Dijkstra, os elementos do caminho recebem classe CSS especial com cor diferenciada.

### 3.3 Módulos Utilitários (`src/lib/utils`, `src/hooks`)

**coordinates.ts** — Conversão de coordenadas geográficas para cartesianas (projeção UTM simplificada), necessária para posicionar os nós do mapa OSM no canvas visual.

**useHistory.ts** — Implementa pilha de undo/redo armazenando snapshots do estado do grafo. Limitado a 50 snapshots para controle de memória (RNF05).

---

## 4. Funcionalidades Detalhadas

### 4.1 Requisitos Funcionais

| ID | Descrição | Pontuação | Módulo |
|---|---|---|---|
| **RF01** | Importar mapas reais (`.osm`, `.poly`, `.txt`) e converter para grafos | 0,75 | `parsers/`, `ImportExport` |
| **RF02** | Enumerar vértices e rotular arestas com pesos (distâncias) | 0,20 | `GraphCanvas`, `Graph` |
| **RF03** | Selecionar/desfazer seleção de vértice de origem e destino com cores distintas | 0,20 | `GraphCanvas`, `useGraph` |
| **RF04** | Calcular e exibir rota do menor caminho em cor diferenciada | 1,50 | `dijkstra`, `GraphCanvas` |
| **RF05** | Criar e editar grafos (adicionar/remover vértices e arestas via mouse) | 1,10 | `GraphCanvas`, `useHistory` |
| **RF06** | Suporte a grafos direcionados e não-direcionados (mão única e mão dupla) | 1,30 | `Graph`, `GraphCanvas` |
| **RF07** | Exibir estatísticas: tempo de processamento, nós explorados, custo total | 0,75 | `StatsPanel`, `dijkstra` |
| **RF08** | Copiar imagem do grafo para a área de transferência a qualquer momento | 0,20 | `clipboard`, `Toolbar` |
| | **Total** | **6,00** | |

#### RF01 — Importação de Mapas

O usuário pode arrastar ou selecionar um arquivo via `ImportExport`. O sistema detecta a extensão e direciona para o parser correspondente:
- `.osm` / `.xml` → `osmParser`: lê elementos `<node>` e `<way>` do XML
- `.poly` → `polyParser`: lê vértices e arestas no formato do conversor em C
- `.txt` → `txtParser`: lê lista de adjacência linha a linha

#### RF04 — Cálculo do Menor Caminho

Fluxo:
1. Usuário clica em um nó (origem — marcado em verde)
2. Usuário clica em outro nó (destino — marcado em vermelho)
3. Usuário clica em "Calcular Caminho"
4. `dijkstra()` executa e retorna `DijkstraResult`
5. Os nós e arestas do caminho recebem classe `path-highlight` (cor laranja)
6. `StatsPanel` exibe tempo, nós explorados e custo

#### RF05 — Edição Interativa

- **Adicionar vértice:** clique duplo no canvas vazio
- **Adicionar aresta:** arrastar de um nó para outro
- **Remover elemento:** clique direito → menu de contexto → "Remover"
- **Desfazer/Refazer:** `Ctrl+Z` / `Ctrl+Y`

#### RF06 — Tipos de Grafo

A `Toolbar` oferece alternância entre modo **direcionado** e **não-direcionado**. Ao importar OSM, vias com `oneway=yes` são tratadas como arestas direcionadas. Visualmente, arestas direcionadas exibem seta e as não-direcionadas são bidirecionais.

### 4.2 Requisitos Não Funcionais

| ID | Descrição | Pontuação | Como atendido |
|---|---|---|---|
| **RNF01** | Vértices e arestas com cores distintas | 0,25 | Stylesheet Cytoscape com variáveis de cor por estado |
| **RNF02** | Diferenciação visual de mão única vs mão dupla | 0,25 | Seta nas arestas direcionadas; linha dupla nas bidirecionais |
| **RNF03** | Otimizado para grandes grafos (milhares de nós) | 0,25 | Cytoscape.js com renderização canvas nativo; carregamento por batch |
| **RNF04** | Tempo de resposta < 2s para ~500 nós | 0,25 | Dijkstra com MinHeap O((V+E) log V); execução assíncrona em Web Worker |
| **RNF05** | Uso eficiente de memória | 0,25 | Lista de adjacência O(V+E); limite de 50 snapshots no histórico |
| **RNF06** | Interface intuitiva para usuários não técnicos | 0,25 | Toolbar clara, tooltips, feedback visual imediato |
| **RNF07** | Suporte a Windows e Linux | 0,25 | Aplicação web — funciona em qualquer OS com browser moderno |
| **RNF08** | Código modular e bem documentado | 0,25 | Separação em camadas; JSDoc nos módulos críticos |
| | **Total** | **2,00** | |

---

## 5. Formatos de Dados de Entrada

### 5.1 Arquivo `.txt` (Lista de Adjacência)

Formato simples linha a linha. Cada linha representa uma aresta:

```
# Formato: <origem> <destino> <peso>
# Linhas com # são comentários
0 1 5.2
0 2 3.1
1 3 7.8
2 3 2.4
```

Ou no formato de definição de nós + arestas:

```
NODES 4
0 100.0 200.0
1 150.0 250.0
2 200.0 200.0
3 250.0 250.0
EDGES
0 1 5.2
1 2 4.0
2 3 3.5
```

### 5.2 Arquivo `.osm` (OpenStreetMap)

XML gerado pela ferramenta OpenStreetMap Export. Elementos relevantes:

```xml
<osm version="0.6">
  <!-- Vértices do grafo -->
  <node id="123456" lat="-16.6027" lon="-49.2700"/>
  <node id="123457" lat="-16.6035" lon="-49.2712"/>

  <!-- Arestas do grafo (ruas/vias) -->
  <way id="789">
    <nd ref="123456"/>
    <nd ref="123457"/>
    <tag k="highway" v="residential"/>
    <tag k="oneway" v="yes"/>  <!-- aresta direcionada -->
    <tag k="name" v="Rua das Flores"/>
  </way>
</osm>
```

O `osmParser` calcula o peso (distância) de cada aresta usando a **fórmula de Haversine** para distância entre coordenadas geográficas, depois converte para UTM via `coordinates.ts`.

### 5.3 Arquivo `.poly`

Formato gerado pelo programa `ConverteMapaParaGrafo.c` (incluído na pasta `funcoes em C/`). Contém vértices com coordenadas cartesianas e arestas com pesos já calculados:

```
VERTICES <n>
<id> <x> <y>
...
EDGES <m>
<id_origem> <id_destino> <peso> <direcionado: 0|1>
...
```

---

## 6. Guia de Instalação e Execução

> Veja o arquivo completo em [`guia-instalacao.md`](./guia-instalacao.md)

### 6.1 Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x (ou pnpm/yarn)
- Navegador moderno (Chrome, Firefox, Edge — versões recentes)

### 6.2 Passos para Instalação

```bash
# 1. Clonar/extrair o projeto
cd navegar-ufg

# 2. Instalar dependências
npm install

# 3. Executar em desenvolvimento
npm run dev

# 4. Acessar no navegador
# http://localhost:3000
```

### 6.3 Build de Produção

```bash
npm run build
npm start
```

---

## 7. Guia de Uso da Aplicação

> Veja o arquivo completo em [`guia-uso.md`](./guia-uso.md)

### 7.1 Interação com o Canvas

| Ação | Gesto |
|---|---|
| Criar vértice | Duplo clique no canvas |
| Criar aresta | Arrastar de um vértice para outro |
| Selecionar origem | Clique simples em um vértice (modo seleção ativo) |
| Selecionar destino | Clique em segundo vértice após selecionar origem |
| Remover elemento | Clique direito → "Remover" |
| Mover vértice | Arrastar o vértice |
| Pan do mapa | Arrastar o fundo |
| Zoom | Scroll do mouse |

### 7.2 Encontrar Caminho Mínimo

1. Ative o modo **Selecionar** na Toolbar
2. Clique no vértice de **origem** (ficará verde)
3. Clique no vértice de **destino** (ficará vermelho)
4. Clique em **"Calcular Menor Caminho"**
5. O caminho mínimo é destacado em laranja
6. As estatísticas aparecem no painel lateral

### 7.3 Importação, Edição e Exportação

- **Importar:** clique em "Importar" na Toolbar, selecione um arquivo `.osm`, `.poly` ou `.txt`
- **Editar:** use as ferramentas da Toolbar para adicionar/remover elementos
- **Exportar imagem:** clique em "Copiar Imagem" (copia o canvas para a área de transferência)
- **Undo/Redo:** `Ctrl+Z` / `Ctrl+Y` para desfazer/refazer alterações
