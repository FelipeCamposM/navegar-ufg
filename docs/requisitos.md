# Requisitos do Sistema — Navegar UFG

**Projeto:** Sistema de Navegação Primitivo  
**Disciplina:** AED2 — INF/UFG 2026-1  
**Pontuação total:** 10,00 pontos

---

## Sumário de Pontuação

| Seção | Pontos |
|---|---|
| Documentação do Projeto | 2,00 |
| Requisitos Funcionais (RF01–RF08) | 6,00 |
| Requisitos Não Funcionais (RNF01–RNF08) | 2,00 |
| **Total** | **10,00** |

---

## 1. Documentação do Projeto (2,00 pontos)

A documentação deve seguir os formalismos da Engenharia de Software, incluindo:

- Identificação dos integrantes (ordem alfabética)
- Introdução, escopo e objetivos
- Arquitetura do sistema com descrição das camadas
- Detalhamento dos módulos
- Especificação de requisitos funcionais e não funcionais
- Formatos de dados de entrada
- Guia de instalação e execução
- Guia de uso da aplicação

**Artefatos entregues:**
- [`documentacao.md`](./documentacao.md) — Documento principal (formato apresentação)
- [`arquitetura.md`](./arquitetura.md) — Detalhamento arquitetural
- [`requisitos.md`](./requisitos.md) — Este documento
- [`estruturas-de-dados.md`](./estruturas-de-dados.md)
- [`formatos-dados.md`](./formatos-dados.md)
- [`guia-instalacao.md`](./guia-instalacao.md)
- [`guia-uso.md`](./guia-uso.md)

---

## 2. Requisitos Funcionais

### RF01 — Importação de Mapas Reais

**Pontuação:** 0,75  
**Módulos:** `src/lib/parsers/`, `src/components/ImportExport.tsx`

**Descrição:**  
O sistema deve permitir importar arquivos contendo coordenadas de vértices e arestas referentes a ruas, avenidas e rodovias, convertendo-os automaticamente em grafos navegáveis.

**Formatos suportados:**

| Formato | Extensão | Origem |
|---|---|---|
| OpenStreetMap | `.osm` / `.xml` | Exportado em openstreetmap.org |
| Grafo Cartesiano | `.poly` | Gerado por `ConverteMapaParaGrafo.c` |
| Lista de Adjacência | `.txt` | Formato texto simples |

**Critérios de aceitação:**
- [ ] Ao selecionar arquivo `.osm`, o grafo é carregado com nós e arestas do mapa
- [ ] Ao selecionar arquivo `.poly`, o grafo é carregado com coordenadas cartesianas e pesos
- [ ] Ao selecionar arquivo `.txt`, o grafo é carregado conforme o formato especificado
- [ ] O grafo renderizado visualmente corresponde à estrutura do arquivo importado
- [ ] Arquivos inválidos exibem mensagem de erro adequada

**Arquivo de teste:** `mapas/Campus2UFG&Regiao.osm` e `mapas/Campus2UFG&Regiao.poly`

---

### RF02 — Enumeração de Vértices e Rotulação de Arestas

**Pontuação:** 0,20  
**Módulos:** `src/components/GraphCanvas.tsx`, `src/lib/graph/Graph.ts`

**Descrição:**  
O sistema deve disponibilizar opção para exibir/ocultar os índices numéricos dos vértices e os pesos (distâncias em metros ou km) nas arestas.

**Critérios de aceitação:**
- [ ] Checkbox ou toggle "Mostrar rótulos" visível na Toolbar
- [ ] Quando ativado, cada vértice exibe seu ID/índice
- [ ] Quando ativado, cada aresta exibe seu peso formatado (ex: "1.2 km")
- [ ] A opção pode ser ativada/desativada a qualquer momento sem perder o estado do grafo

---

### RF03 — Seleção de Vértice de Origem e Destino

**Pontuação:** 0,20  
**Módulos:** `src/components/GraphCanvas.tsx`, `src/hooks/useGraph.ts`

**Descrição:**  
O sistema deve permitir ao usuário selecionar um vértice de origem e um de destino com marcação em cores distintas, além de permitir desfazer a seleção.

**Critérios de aceitação:**
- [ ] No modo "Selecionar", clique em vértice define a origem (cor verde)
- [ ] Segundo clique em vértice diferente define o destino (cor vermelha)
- [ ] Clique no vértice de origem novamente desfaz a seleção de origem
- [ ] Clique no vértice de destino novamente desfaz a seleção de destino
- [ ] Somente um vértice pode ser origem e um pode ser destino por vez
- [ ] As cores de origem/destino são claramente distintas entre si e dos vértices comuns

**Esquema de cores:**

| Estado | Cor |
|---|---|
| Vértice padrão | Azul (`#4A90D9`) |
| Vértice de origem | Verde (`#27AE60`) |
| Vértice de destino | Vermelho (`#E74C3C`) |
| Vértice no caminho | Laranja (`#F39C12`) |
| Vértice visitado | Cinza claro (`#BDC3C7`) |

---

### RF04 — Cálculo e Exibição do Menor Caminho

**Pontuação:** 1,50  
**Módulos:** `src/lib/graph/dijkstra.ts`, `src/components/GraphCanvas.tsx`

**Descrição:**  
O sistema deve calcular e exibir, em cor diferenciada, a rota do menor caminho entre dois vértices selecionados, usando o **Algoritmo de Dijkstra**.

**Critérios de aceitação:**
- [ ] O botão "Calcular Menor Caminho" só é ativo quando origem e destino estão selecionados
- [ ] O algoritmo de Dijkstra é corretamente implementado (sem usar bibliotecas externas de algoritmos)
- [ ] O caminho calculado é de fato o menor (verificável com exemplos simples)
- [ ] Os vértices e arestas do caminho são destacados em cor diferenciada (laranja)
- [ ] Caso não exista caminho, o sistema exibe mensagem informativa
- [ ] O resultado do caminho permanece visível até nova seleção ou limpeza

**Algoritmo:**

```
Dijkstra(G, s, t):
  dist[v] = ∞ para todo v; dist[s] = 0
  prev[v] = null para todo v
  MinHeap Q com (0, s)
  visited = {}

  enquanto Q não vazio:
    (d, u) = Q.extrairMínimo()
    se u ∈ visited: continuar
    visited.add(u)
    se u == t: parar
    para cada aresta (u, v, w) em vizinhos(u):
      se dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        prev[v] = u
        Q.inserir(dist[v], v)

  retornar reconstruirCaminho(prev, s, t)
```

---

### RF05 — Criação e Edição de Grafos

**Pontuação:** 1,10  
**Módulos:** `src/components/GraphCanvas.tsx`, `src/components/ContextMenu.tsx`, `src/hooks/useHistory.ts`

**Descrição:**  
O sistema deve permitir criar e editar grafos interativamente, adicionando e removendo vértices e arestas com auxílio de clique do mouse.

**Critérios de aceitação:**
- [ ] Duplo clique no canvas vazio cria novo vértice na posição do clique
- [ ] Arrastar de um vértice para outro cria uma aresta entre eles
- [ ] Clique direito em vértice abre menu com opção "Remover Vértice"
- [ ] Clique direito em aresta abre menu com opção "Remover Aresta"
- [ ] Ao remover vértice, todas as suas arestas são também removidas
- [ ] `Ctrl+Z` desfaz a última operação
- [ ] `Ctrl+Y` refaz a operação desfeita
- [ ] O histórico suporta pelo menos 10 operações de undo/redo

**Operações e gestos:**

| Operação | Gesto |
|---|---|
| Criar vértice | Duplo clique no fundo |
| Criar aresta | Arrastar de vértice A para vértice B |
| Mover vértice | Arrastar o vértice |
| Remover | Clique direito → menu de contexto |
| Desfazer | `Ctrl+Z` |
| Refazer | `Ctrl+Y` |

---

### RF06 — Suporte a Diferentes Tipos de Grafo

**Pontuação:** 1,30  
**Módulos:** `src/lib/graph/Graph.ts`, `src/components/GraphCanvas.tsx`, `src/components/Toolbar.tsx`

**Descrição:**  
O sistema deve suportar grafos ponderados, direcionados (mão única) e não-direcionados (mão dupla), tratando corretamente as direções ao calcular caminhos.

**Critérios de aceitação:**
- [ ] Toggle na Toolbar alterna entre modo "Direcionado" e "Não-direcionado" para criação de novas arestas
- [ ] Arestas direcionadas exibem seta na ponta de destino
- [ ] Arestas não-direcionadas não exibem setas (ou exibem símbolo de mão dupla)
- [ ] O algoritmo de Dijkstra respeita a direção: aresta A→B não permite percorrer B→A
- [ ] Ao importar OSM, vias com tag `oneway=yes` são carregadas como arestas direcionadas
- [ ] Ao importar OSM, demais vias são carregadas como não-direcionadas (ambos os sentidos)
- [ ] É possível editar a direção de uma aresta existente pelo menu de contexto

**Representação visual:**

| Tipo | Representação |
|---|---|
| Mão dupla (não-direcionado) | Linha sólida sem setas |
| Mão única (direcionado) | Linha com seta na ponta do destino |

---

### RF07 — Estatísticas de Execução do Algoritmo

**Pontuação:** 0,75  
**Módulos:** `src/lib/graph/dijkstra.ts`, `src/components/StatsPanel.tsx`

**Descrição:**  
O sistema deve exibir estatísticas sobre a execução do algoritmo de Dijkstra após cada cálculo.

**Estatísticas exibidas:**

| Métrica | Descrição |
|---|---|
| Tempo de processamento | Duração em milissegundos do algoritmo |
| Número de nós explorados | Quantos vértices foram processados pelo Dijkstra |
| Custo total | Soma dos pesos das arestas do caminho encontrado |

**Critérios de aceitação:**
- [ ] O painel `StatsPanel` exibe as 3 estatísticas após cada cálculo
- [ ] O tempo é medido com `performance.now()` para precisão
- [ ] O painel é visível sem necessitar de scroll
- [ ] As estatísticas são limpas ao selecionar novo par origem/destino

---

### RF08 — Cópia de Imagem para Área de Transferência

**Pontuação:** 0,20  
**Módulos:** `src/lib/utils/clipboard.ts`, `src/components/Toolbar.tsx`

**Descrição:**  
O sistema deve permitir ao usuário copiar a imagem atual do grafo para a área de transferência em qualquer momento.

**Critérios de aceitação:**
- [ ] Botão "Copiar Imagem" na Toolbar está sempre disponível
- [ ] Ao clicar, a imagem PNG do canvas (incluindo highlights atuais) é copiada
- [ ] Uma notificação confirma o sucesso da cópia
- [ ] Funciona nos navegadores Chrome, Firefox e Edge

**Implementação:** usa a API `ClipboardItem` com `canvas.toBlob()` do elemento Cytoscape.

---

## 3. Requisitos Não Funcionais

### RNF01 — Cores Distintas para Vértices e Arestas

**Pontuação:** 0,25

**Descrição:** Vértices e arestas devem ter cores distintas entre si e em relação ao fundo.

**Critérios de aceitação:**
- [ ] Vértices e arestas têm cores visivelmente distintas
- [ ] O contraste atende ao mínimo de acessibilidade (WCAG AA)
- [ ] As cores são consistentes em toda a aplicação

---

### RNF02 — Diferenciação Visual de Mão Única e Mão Dupla

**Pontuação:** 0,25

**Descrição:** A representação visual deve distinguir claramente arestas direcionadas de não-direcionadas.

**Critérios de aceitação:**
- [ ] Arestas de mão única têm seta indicando direção
- [ ] Arestas de mão dupla não têm seta (ou têm representação claramente diferente)
- [ ] A distinção é imediatamente perceptível sem necessitar de legenda

---

### RNF03 — Otimização para Grandes Grafos

**Pontuação:** 0,25

**Descrição:** A execução do programa deve ser otimizada para grafos com milhares de vértices e arestas.

**Estratégias implementadas:**
- Cytoscape.js usa canvas nativo (não SVG) para renderização — muito mais eficiente para > 500 nós
- Carregamento de arquivo OSM feito em batches para não bloquear a thread principal
- Dijkstra pode ser executado em Web Worker para grafos grandes (sem travar a UI)
- Lista de Adjacência usa `Map` nativa do JavaScript (O(1) de acesso)

**Critérios de aceitação:**
- [ ] Grafo com 1000+ nós carrega sem travar a interface
- [ ] Pan e zoom funcionam fluidamente com grafos grandes

---

### RNF04 — Tempo de Resposta < 2 Segundos

**Pontuação:** 0,25

**Descrição:** O tempo de resposta para cálculos deve ser inferior a 2 segundos para grafos médios (~500 nós).

**Complexidade do Dijkstra com MinHeap:**
- **Tempo:** O((V + E) log V)
- **Para 500 nós / 2000 arestas:** ~500 × log(500) ≈ ~4.500 operações — execução em microsegundos

**Critérios de aceitação:**
- [ ] `StatsPanel` exibe tempo < 2000ms para grafos com ~500 nós
- [ ] A UI não trava durante o cálculo (uso de Web Worker quando necessário)

---

### RNF05 — Uso Eficiente de Memória

**Pontuação:** 0,25

**Descrição:** O sistema deve usar memória de forma eficiente para evitar sobrecarga em grafos extensos.

**Estratégias:**
- Lista de Adjacência: O(V + E) de espaço vs O(V²) da Matriz
- Histórico de undo/redo limitado a 50 snapshots (configurável)
- Dados OSM brutos descartados após parsing

**Critérios de aceitação:**
- [ ] A aplicação não apresenta vazamento de memória ao importar múltiplos arquivos
- [ ] O uso de memória para o grafo do campus UFG (~5.000 nós) fica abaixo de 100MB

---

### RNF06 — Interface Intuitiva

**Pontuação:** 0,25

**Descrição:** A interface deve ser intuitiva e de fácil manipulação para usuários não técnicos.

**Estratégias:**
- Toolbar com ícones e labels claros
- Tooltips em todos os botões
- Feedback visual imediato (cores, animações)
- Mensagens de erro descritivas

**Critérios de aceitação:**
- [ ] Usuário sem conhecimento técnico consegue importar um mapa e calcular um caminho em menos de 2 minutos
- [ ] Todos os botões têm tooltip descritivo
- [ ] Erros são comunicados com mensagens em português

---

### RNF07 — Suporte a Windows e Linux

**Pontuação:** 0,25

**Descrição:** O programa deve funcionar em Windows e Linux.

**Como atendido:** Por ser uma aplicação web, funciona em qualquer sistema operacional com navegador moderno (Chrome 90+, Firefox 88+, Edge 90+). O build do Next.js pode ser executado em ambos os sistemas operacionais.

**Critérios de aceitação:**
- [ ] Testado e funcionando no Windows 10/11
- [ ] Testado e funcionando no Ubuntu 22.04+

---

### RNF08 — Código Modular e Bem Documentado

**Pontuação:** 0,25

**Descrição:** O código deve ser modular e bem documentado para facilitar a manutenção.

**Estratégias:**
- Separação clara em camadas: UI / Core / Utils / Hooks
- Interfaces TypeScript documentam os contratos entre módulos
- JSDoc nos módulos críticos (`dijkstra.ts`, `Graph.ts`, parsers)
- Nomes de variáveis e funções descritivos em inglês

**Critérios de aceitação:**
- [ ] Cada módulo tem responsabilidade única (Single Responsibility)
- [ ] Funções críticas têm comentário JSDoc com parâmetros e retorno
- [ ] Nenhum arquivo tem mais de 300 linhas

---

## 4. Rastreabilidade Requisitos × Módulos

| Requisito | Componente UI | Módulo Core | Hook |
|---|---|---|---|
| RF01 | `ImportExport.tsx` | `parsers/*.ts` | `useGraph` |
| RF02 | `GraphCanvas.tsx` | `Graph.ts` | — |
| RF03 | `GraphCanvas.tsx` | — | `useGraph` |
| RF04 | `GraphCanvas.tsx` | `dijkstra.ts` | `useGraph` |
| RF05 | `GraphCanvas.tsx`, `ContextMenu.tsx` | `Graph.ts` | `useHistory` |
| RF06 | `GraphCanvas.tsx`, `Toolbar.tsx` | `Graph.ts` | `useGraph` |
| RF07 | `StatsPanel.tsx` | `dijkstra.ts` | — |
| RF08 | `Toolbar.tsx` | — | — |
| RNF01–RNF02 | `GraphCanvas.tsx` (stylesheet) | — | — |
| RNF03–RNF05 | — | `Graph.ts`, `dijkstra.ts` | `useHistory` |
| RNF06 | Todos os componentes | — | — |
| RNF07 | — | — | — |
| RNF08 | — | Todos os módulos | — |
