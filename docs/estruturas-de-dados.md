# Estruturas de Dados — Navegar UFG

Documentação das estruturas de dados utilizadas no Sistema de Navegação Primitivo, conforme especificado no enunciado do Trabalho Final AED2 2026-1.

---

## 1. Representação do Grafo

### 1.1 Lista de Adjacência (escolha do projeto)

A **Lista de Adjacência** é a estrutura escolhida para representar o grafo. Para cada vértice `v`, armazena-se a lista de arestas que partem de `v`.

**Complexidade de espaço:** O(V + E)  
**Motivo da escolha:** Mapas reais são grafos esparsos (cada interseção de rua conecta poucos outros vértices). A Lista de Adjacência é significativamente mais eficiente que a Matriz de Adjacência nesse cenário.

**Comparação:**

| Estrutura | Espaço | Iteração sobre vizinhos | Verificar adjacência |
|---|---|---|---|
| Matriz de Adjacência | O(V²) | O(V) | O(1) |
| **Lista de Adjacência** | **O(V + E)** | **O(grau(v))** | O(grau(v)) |

**Para o Campus UFG (~5.000 nós, ~7.000 arestas):**
- Matriz: 5.000² = **25.000.000 células**
- Lista: 5.000 + 7.000 = **12.000 entradas** ← ~2.000x mais eficiente

### 1.2 Implementação TypeScript

```typescript
// src/lib/graph/types.ts

type NodeId = string;

interface GraphNode {
  id: NodeId;
  label?: string;
  x: number;       // coordenada cartesiana (UTM ou pixels)
  y: number;
}

interface GraphEdge {
  id: string;
  source: NodeId;
  target: NodeId;
  weight: number;  // distância em metros
  directed: boolean;
}

interface AdjacencyList {
  [nodeId: NodeId]: GraphEdge[];
}
```

```typescript
// src/lib/graph/Graph.ts

class Graph {
  private nodes: Map<NodeId, GraphNode> = new Map();
  private adjacency: Map<NodeId, GraphEdge[]> = new Map();

  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, []);
    }
  }

  addEdge(edge: GraphEdge): void {
    // Adiciona a aresta source → target
    this.adjacency.get(edge.source)!.push(edge);
    // Se não-direcionado, adiciona também target → source
    if (!edge.directed) {
      this.adjacency.get(edge.target)!.push({
        ...edge,
        id: `${edge.id}_rev`,
        source: edge.target,
        target: edge.source,
      });
    }
  }

  getNeighbors(id: NodeId): GraphEdge[] {
    return this.adjacency.get(id) ?? [];
  }

  removeNode(id: NodeId): void {
    this.nodes.delete(id);
    this.adjacency.delete(id);
    // Remove arestas que chegam neste nó
    for (const [, edges] of this.adjacency) {
      const filtered = edges.filter(e => e.target !== id);
      edges.length = 0;
      edges.push(...filtered);
    }
  }
}
```

### 1.3 Representação visual (exemplo)

```
Grafo:
  A --5--> B
  A --3--> C
  B --2--> D
  C --4--> D

Lista de Adjacência:
  A: [ (A→B, w=5), (A→C, w=3) ]
  B: [ (B→D, w=2) ]
  C: [ (C→D, w=4) ]
  D: [ ]
```

---

## 2. Fila de Prioridade — MinHeap

### 2.1 Descrição

O algoritmo de Dijkstra utiliza uma **Fila de Prioridade (MinHeap)** para sempre processar o vértice com a menor distância acumulada. Isso garante a corretude e eficiência do algoritmo.

**Operações e complexidades:**

| Operação | MinHeap | Array não-ordenado |
|---|---|---|
| Inserir | **O(log V)** | O(1) |
| Extrair mínimo | **O(log V)** | O(V) |
| Decrementar chave | O(log V) | O(V) |

**Complexidade total do Dijkstra com MinHeap:** O((V + E) log V)

### 2.2 Implementação TypeScript

```typescript
// src/lib/graph/dijkstra.ts — MinHeap embutido

type HeapEntry = { dist: number; nodeId: NodeId };

class MinHeap {
  private heap: HeapEntry[] = [];

  insert(entry: HeapEntry): void {
    this.heap.push(entry);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): HeapEntry | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].dist <= this.heap[i].dist) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.heap[left].dist < this.heap[smallest].dist) smallest = left;
      if (right < n && this.heap[right].dist < this.heap[smallest].dist) smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}
```

### 2.3 Visualização do MinHeap

```
Inserções: (10, A), (3, B), (7, C), (1, D)

Estado do heap após todas as inserções:
         (1, D)
        /       \
    (3, B)    (7, C)
    /
 (10, A)

Extrair mínimo retorna: (1, D)
```

---

## 3. Vetor de Distâncias (`dist[]`)

### 3.1 Descrição

Array ou Map que armazena a **menor distância conhecida** de cada nó até o nó de origem `s`. Inicializado com `∞` para todos os nós, exceto `dist[s] = 0`.

### 3.2 Implementação

```typescript
const dist = new Map<NodeId, number>();

// Inicialização
for (const nodeId of graph.nodes.keys()) {
  dist.set(nodeId, Infinity);
}
dist.set(source, 0);
```

### 3.3 Evolução durante o algoritmo (exemplo)

```
Grafo: A→B(5), A→C(3), B→D(2), C→D(4)
Origem: A, Destino: D

Iteração 0 (inicial):
  dist = { A:0, B:∞, C:∞, D:∞ }

Iteração 1 (processa A):
  Relaxa A→B: dist[B] = min(∞, 0+5) = 5
  Relaxa A→C: dist[C] = min(∞, 0+3) = 3
  dist = { A:0, B:5, C:3, D:∞ }

Iteração 2 (processa C, menor dist=3):
  Relaxa C→D: dist[D] = min(∞, 3+4) = 7
  dist = { A:0, B:5, C:3, D:7 }

Iteração 3 (processa B, dist=5):
  Relaxa B→D: dist[D] = min(7, 5+2) = 7 (sem melhora)
  dist = { A:0, B:5, C:3, D:7 }

Iteração 4 (processa D, destino atingido):
  Custo total = 7
```

---

## 4. Vetor de Predecessores (`prev[]`)

### 4.1 Descrição

Map que armazena o **nó anterior no caminho mais curto** para cada nó. Permite reconstruir o caminho completo após o algoritmo terminar, percorrendo o mapa de predecessores de `t` até `s`.

### 4.2 Implementação

```typescript
const prev = new Map<NodeId, NodeId | null>();

// Inicialização
for (const nodeId of graph.nodes.keys()) {
  prev.set(nodeId, null);
}

// Atualização durante relaxamento
if (newDist < dist.get(v)!) {
  dist.set(v, newDist);
  prev.set(v, u);  // u é o predecessor de v no caminho ótimo
}

// Reconstrução do caminho (de t até s)
function reconstructPath(prev: Map<NodeId, NodeId | null>, source: NodeId, target: NodeId): NodeId[] {
  const path: NodeId[] = [];
  let current: NodeId | null = target;

  while (current !== null) {
    path.unshift(current);
    current = prev.get(current) ?? null;
    if (current === source) {
      path.unshift(source);
      break;
    }
  }

  return path;
}
```

### 4.3 Exemplo de reconstrução

```
Após Dijkstra:
  prev = { A:null, B:A, C:A, D:C }

Reconstrução de D para A:
  D → prev[D]=C → prev[C]=A → prev[A]=null (origem)
  Caminho: [ A, C, D ]
  Custo: dist[D] = 7
```

---

## 5. Conjunto de Nós Visitados (`visited`)

### 5.1 Descrição

Conjunto (`Set`) que marca os nós cujas distâncias finais já foram determinadas e que não devem ser processados novamente. Garante que cada nó seja processado exatamente uma vez.

### 5.2 Implementação

```typescript
const visited = new Set<NodeId>();

// Durante o loop principal do Dijkstra
const { dist: currentDist, nodeId: u } = heap.extractMin()!;

// Se já visitado, pular (pode haver entradas duplicadas no heap)
if (visited.has(u)) continue;
visited.add(u);

// Parada antecipada ao atingir o destino
if (u === target) break;
```

**Observação:** Como usamos lazy deletion (entradas obsoletas no heap são ignoradas ao verificar `visited`), o heap pode conter entradas duplicadas para o mesmo nó. O conjunto `visited` garante que apenas a primeira extração (de menor distância) seja processada.

---

## 6. Algoritmo de Dijkstra Completo

```typescript
// src/lib/graph/dijkstra.ts

interface DijkstraResult {
  path: NodeId[];           // caminho de source até target
  cost: number;             // custo total do caminho
  explored: number;         // número de nós explorados
  timeMs: number;           // tempo de execução em ms
  dist: Map<NodeId, number>; // distâncias calculadas (para depuração)
}

export function dijkstra(
  graph: Graph,
  source: NodeId,
  target: NodeId
): DijkstraResult {
  const startTime = performance.now();

  // 1. Inicialização das estruturas
  const dist = new Map<NodeId, number>();
  const prev = new Map<NodeId, NodeId | null>();
  const visited = new Set<NodeId>();
  const heap = new MinHeap();
  let explored = 0;

  for (const nodeId of graph.nodes.keys()) {
    dist.set(nodeId, Infinity);
    prev.set(nodeId, null);
  }
  dist.set(source, 0);
  heap.insert({ dist: 0, nodeId: source });

  // 2. Loop principal
  while (heap.size > 0) {
    const { dist: d, nodeId: u } = heap.extractMin()!;

    if (visited.has(u)) continue;
    visited.add(u);
    explored++;

    // Parada antecipada
    if (u === target) break;

    const currentDist = dist.get(u)!;

    // 3. Relaxamento de arestas
    for (const edge of graph.getNeighbors(u)) {
      const v = edge.target;
      if (visited.has(v)) continue;

      const newDist = currentDist + edge.weight;
      if (newDist < dist.get(v)!) {
        dist.set(v, newDist);
        prev.set(v, u);
        heap.insert({ dist: newDist, nodeId: v });
      }
    }
  }

  // 4. Reconstrução do caminho
  const path = reconstructPath(prev, source, target);
  const cost = dist.get(target) ?? Infinity;
  const timeMs = performance.now() - startTime;

  return { path, cost, explored, timeMs, dist };
}
```

---

## 7. Resumo das Estruturas

| Estrutura | Tipo TS | Complexidade | Responsabilidade |
|---|---|---|---|
| Grafo | `Map<NodeId, GraphNode>` + `Map<NodeId, GraphEdge[]>` | O(V+E) espaço | Representa o mapa como grafo |
| MinHeap | Classe `MinHeap` (array binário) | O(log V) inserção/extração | Seleciona próximo nó a processar |
| dist[] | `Map<NodeId, number>` | O(V) | Menor distância conhecida de cada nó |
| prev[] | `Map<NodeId, NodeId \| null>` | O(V) | Predecessor no caminho ótimo |
| visited | `Set<NodeId>` | O(V) | Nós já processados definitivamente |
