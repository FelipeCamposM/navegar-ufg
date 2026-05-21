import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentação — NAVEGAR UFG',
  description: 'Documentação técnica do sistema de navegação em grafos — AED2/UFG 2026-1',
};

// ── helpers ─────────────────────────────────────────────────────────────────

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 mb-16">
      {children}
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-white/[0.10] flex items-center gap-2">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white/90 mb-3 mt-6">{children}</h3>;
}

function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-white/60 leading-relaxed mb-3 ${className ?? ''}`}>{children}</p>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.05] border border-white/[0.10] rounded-2xl p-5 mb-4 ${className ?? ''}`}>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-black/40 border border-white/[0.09] rounded-xl p-4 text-xs text-emerald-300 font-mono overflow-x-auto mb-4 leading-relaxed">
      {children}
    </pre>
  );
}

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-white/[0.08] border border-white/[0.12] rounded px-1.5 py-0.5 text-xs font-mono text-amber-300">
      {children}
    </code>
  );
}

function Badge({ color, children }: { color: 'green' | 'blue' | 'orange' | 'purple' | 'red'; children: React.ReactNode }) {
  const cls = {
    green: 'bg-green-500/[0.18] border-green-400/40 text-green-300',
    blue: 'bg-blue-500/[0.18] border-blue-400/40 text-blue-300',
    orange: 'bg-orange-500/[0.18] border-orange-400/40 text-orange-300',
    purple: 'bg-purple-500/[0.18] border-purple-400/40 text-purple-300',
    red: 'bg-red-500/[0.18] border-red-400/40 text-red-300',
  }[color];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      {children}
    </span>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />;
}

const NAV_ITEMS = [
  { href: '#visao-geral',  label: 'Visão Geral' },
  { href: '#rf01',         label: 'RF01 · Importação' },
  { href: '#rf02',         label: 'RF02 · Rótulos' },
  { href: '#rf03',         label: 'RF03 · Seleção' },
  { href: '#rf04',         label: 'RF04 · Dijkstra' },
  { href: '#rf05',         label: 'RF05 · Edição' },
  { href: '#rf06',         label: 'RF06 · Direcionado' },
  { href: '#rf07',         label: 'RF07 · Estatísticas' },
  { href: '#rf08',         label: 'RF08 · Imagem' },
  { href: '#estruturas',   label: 'Estruturas de Dados' },
  { href: '#arquitetura',  label: 'Arquitetura' },
  { href: '#atalhos',      label: 'Atalhos' },
];

// ── page ────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-[#070710] text-white"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* background orbs */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse at 10% 20%, rgba(59,130,246,0.14) 0%, transparent 55%)',
            'radial-gradient(ellipse at 85% 70%, rgba(139,92,246,0.10) 0%, transparent 55%)',
            'radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.07) 0%, transparent 50%)',
          ].join(','),
        }}
      />

      {/* top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#070710]/80 border-b border-white/[0.08] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white/90 tracking-wide">NAVEGAR</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">AED2 · UFG · 2026-1</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Entrega: 01/06/2026</span>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-xl bg-blue-500/[0.20] border border-blue-400/40 text-blue-300 hover:bg-blue-500/[0.30] transition-all duration-200"
          >
            ← Abrir App
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex max-w-[1200px] mx-auto">
        {/* sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto py-10 pr-4 pl-6">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Conteúdo</p>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs text-white/45 hover:text-white/85 py-1.5 px-2 rounded-lg hover:bg-white/[0.06] transition-all duration-150"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* main content */}
        <main className="flex-1 min-w-0 px-8 py-10 pb-24 max-w-3xl">

          {/* ── HERO ──────────────────────────────────────────────────── */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <Badge color="blue">AED2 · UFG · 2026-1</Badge>
              <Badge color="green">Implementado</Badge>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              NAVEGAR UFG
            </h1>
            <p className="text-base text-white/55 leading-relaxed max-w-xl">
              Sistema de navegação em grafos — importa mapas reais (OpenStreetMap), permite construção e
              edição de grafos e executa o algoritmo de Dijkstra para encontrar o caminho mínimo.
              100% client-side, sem servidor.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Requisitos', value: '8 / 8', tone: 'green' as const },
                { label: 'Pontuação máx.', value: '6,00 pts', tone: 'orange' as const },
                { label: 'Complexidade', value: 'O((V+E) log V)', tone: 'blue' as const },
                { label: 'Mapa UFG', value: '~5k nós / ~7k arestas', tone: 'purple' as const },
              ].map(({ label, value, tone }) => {
                const bg = { green: 'bg-green-500/[0.10] border-green-400/30', orange: 'bg-orange-500/[0.10] border-orange-400/30', blue: 'bg-blue-500/[0.10] border-blue-400/30', purple: 'bg-purple-500/[0.10] border-purple-400/30' }[tone];
                const text = { green: 'text-green-200', orange: 'text-orange-200', blue: 'text-blue-200', purple: 'text-purple-200' }[tone];
                return (
                  <div key={label} className={`rounded-xl border px-3 py-3 ${bg}`}>
                    <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">{label}</p>
                    <p className={`text-sm font-semibold ${text}`}>{value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── VISÃO GERAL ───────────────────────────────────────────── */}
          <Section id="visao-geral">
            <H2>
              <span className="text-white/35 text-sm font-mono mr-1">00</span>
              Visão Geral dos Requisitos
            </H2>

            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">ID</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">Funcionalidade</th>
                    <th className="text-right text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">Pontos</th>
                    <th className="text-right text-white/35 uppercase tracking-wider py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { id: 'RF04', label: 'Calcular e exibir caminho mínimo (Dijkstra)', pts: 1.50 },
                    { id: 'RF06', label: 'Suporte a grafos direcionados e não-direcionados', pts: 1.30 },
                    { id: 'RF05', label: 'Criar e editar grafos (vértices e arestas)', pts: 1.10 },
                    { id: 'RF01', label: 'Importar mapas (.osm, .poly, .txt)', pts: 0.75 },
                    { id: 'RF07', label: 'Exibir estatísticas: tempo, explorados, custo', pts: 0.75 },
                    { id: 'RF02', label: 'Enumerar vértices e rotular arestas com pesos', pts: 0.20 },
                    { id: 'RF03', label: 'Seleção de origem/destino com cores distintas', pts: 0.20 },
                    { id: 'RF08', label: 'Copiar imagem do grafo para a área de transferência', pts: 0.20 },
                  ].map(({ id, label, pts }) => (
                    <tr key={id}>
                      <td className="py-2.5 pr-4">
                        <a href={`#${id.toLowerCase()}`} className="font-mono text-blue-400 hover:text-blue-300">
                          {id}
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 text-white/70">{label}</td>
                      <td className="py-2.5 pr-4 text-right font-semibold text-orange-300">{pts.toFixed(2)}</td>
                      <td className="py-2.5 text-right">
                        <Badge color="green">✓ Feito</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/[0.10]">
                    <td colSpan={2} className="pt-3 text-white/40 text-xs">Total</td>
                    <td className="pt-3 text-right text-sm font-bold text-orange-200">6,00</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </Card>
          </Section>

          {/* ── RF01 ──────────────────────────────────────────────────── */}
          <Section id="rf01">
            <H2>
              <Badge color="orange">0,75 pt</Badge>
              <span className="ml-2">RF01 — Importação de Mapas</span>
            </H2>
            <Prose>
              O sistema suporta três formatos de entrada. O parser é selecionado automaticamente
              pela extensão do arquivo (<Inline>.osm</Inline>, <Inline>.poly</Inline>, <Inline>.txt</Inline>).
              Dois mapas pré-carregados do Campus UFG estão disponíveis com um clique na barra de ferramentas.
            </Prose>

            <H3>Formato .osm — OpenStreetMap XML</H3>
            <Prose>
              Processado via <Inline>DOMParser</Inline>. Apenas vias com tag <Inline>highway</Inline> de tipos
              relevantes (motorway, primary, residential, footway, etc.) são incluídas. Pesos calculados pela
              fórmula de Haversine (distância geodésica em metros). Coordenadas geográficas convertidas para
              UTM Zona 23S e normalizadas para o espaço Cytoscape.
            </Prose>
            <Code>{`<!-- Estrutura OSM relevante -->
<node id="123456" lat="-16.683" lon="-49.255" />
<way id="789">
  <nd ref="123456" />
  <nd ref="123457" />
  <tag k="highway" v="residential" />
  <tag k="oneway"  v="yes" />        <!-- → aresta direcionada -->
</way>`}</Code>
            <Prose>
              Tipos de highway aceitos:{' '}
              <Inline>motorway</Inline>, <Inline>trunk</Inline>, <Inline>primary</Inline>, <Inline>secondary</Inline>,{' '}
              <Inline>tertiary</Inline>, <Inline>unclassified</Inline>, <Inline>residential</Inline>, <Inline>service</Inline>,{' '}
              <Inline>living_street</Inline>, <Inline>pedestrian</Inline>, <Inline>footway</Inline>, <Inline>path</Inline>,{' '}
              <Inline>cycleway</Inline>, <Inline>road</Inline> e variantes <Inline>*_link</Inline>.
            </Prose>

            <H3>Fórmula de Haversine</H3>
            <Code>{`function haversineDistance(lat1, lon1, lat2, lon2): number {
  const R = 6_371_000; // raio da Terra em metros
  const dLat = (lat2 - lat1) * DEG2RAD;
  const dLon = (lon2 - lon1) * DEG2RAD;
  const a = sin(dLat/2)² + cos(lat1) · cos(lat2) · sin(dLon/2)²;
  return R · 2 · atan2(√a, √(1−a));
}`}</Code>

            <H3>Projeção UTM → Normalização</H3>
            <Prose>
              Coordenadas geográficas (lat/lon) são convertidas para UTM Zona 23S (parâmetros WGS84)
              e depois normalizadas via <Inline>reduzirEscala()</Inline> — espelhando o comportamento
              do código C de referência <Inline>ConverteMapaParaGrafo.c</Inline> fornecido pelo professor.
              O eixo Y é invertido para correspondência com a orientação do canvas.
            </Prose>

            <H3>Formato .poly — Coordenadas Cartesianas</H3>
            <Prose>
              Formato binário colunar usado pelo professor. Pesos são calculados como distância Euclidiana
              a partir das coordenadas originais (antes da normalização). O quarto campo da linha de aresta
              indica direção: <Inline>0</Inline> = não-direcionada, <Inline>1</Inline> = direcionada.
            </Prose>
            <Code>{`<numVértices>
<id> <x> <y>
...
<numArestas>
<id> <src> <dst> <direção>
...`}</Code>

            <H3>Formato .txt — Lista de Adjacência</H3>
            <Prose>
              O parser detecta automaticamente três sub-formatos:
            </Prose>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                {
                  title: 'Simples',
                  desc: 'Uma aresta por linha',
                  example: 'A B 4.5\nB C 2.0 1',
                },
                {
                  title: 'Estruturado',
                  desc: 'Seções NODES/EDGES',
                  example: 'NODES\nA 10 20\nB 30 40\nEDGES\nA B 5.0',
                },
                {
                  title: 'Lista de Adj.',
                  desc: 'Formato "nó: vizinhos"',
                  example: 'A: B C\nB: A D\nC: A',
                },
              ].map(({ title, desc, example }) => (
                <div key={title} className="bg-black/30 border border-white/[0.08] rounded-xl p-3">
                  <p className="text-xs font-semibold text-white/80 mb-0.5">{title}</p>
                  <p className="text-[10px] text-white/40 mb-2">{desc}</p>
                  <pre className="text-[10px] text-emerald-400 font-mono">{example}</pre>
                </div>
              ))}
            </div>
          </Section>

          {/* ── RF02 ──────────────────────────────────────────────────── */}
          <Section id="rf02">
            <H2>
              <Badge color="orange">0,20 pt</Badge>
              <span className="ml-2">RF02 — Enumeração e Rotulagem</span>
            </H2>
            <Prose>
              Vértices possuem IDs únicos visíveis via rótulo. A barra de ferramentas expõe dois
              toggles de visualização independentes:
            </Prose>
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-1">Botão &quot;Vértices&quot;</p>
                  <Prose className="mb-0">
                    Alterna a visibilidade dos nós (círculos) no canvas. Útil ao trabalhar com
                    o mapa do Campus UFG (~5.000 nós) para reduzir o ruído visual mantendo
                    apenas as arestas visíveis.
                  </Prose>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-1">Botão &quot;Pesos&quot;</p>
                  <Prose className="mb-0">
                    Exibe o peso de cada aresta em metros (OSM/POLY) ou na unidade do arquivo
                    (TXT) como rótulo flutuante sobre a aresta no canvas Cytoscape.
                  </Prose>
                </div>
              </div>
            </Card>
          </Section>

          {/* ── RF03 ──────────────────────────────────────────────────── */}
          <Section id="rf03">
            <H2>
              <Badge color="orange">0,20 pt</Badge>
              <span className="ml-2">RF03 — Seleção com Cores Distintas</span>
            </H2>
            <Prose>
              No modo <Inline>Selecionar</Inline>, cada clique alterna o estado do nó. O primeiro
              clique define a origem; o segundo define o destino e executa o Dijkstra automaticamente.
              Um terceiro clique inicia um novo ciclo de seleção.
            </Prose>
            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">Estado</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">Cor</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 font-medium">Hex</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { estado: 'Padrão', color: '#4A90D9', label: 'Azul' },
                    { estado: 'Origem (A)', color: '#27AE60', label: 'Verde' },
                    { estado: 'Destino (B)', color: '#E74C3C', label: 'Vermelho' },
                    { estado: 'Caminho mínimo', color: '#F39C12', label: 'Laranja' },
                    { estado: 'Visitado (explorado)', color: '#6B7280', label: 'Cinza' },
                    { estado: 'Rota (aresta)', color: '#2563EB', label: 'Azul royal' },
                  ].map(({ estado, color, label }) => (
                    <tr key={estado}>
                      <td className="py-2.5 pr-4 text-white/70">{estado}</td>
                      <td className="py-2.5 pr-4 flex items-center gap-2">
                        <Dot color={color} />
                        <span className="text-white/60">{label}</span>
                      </td>
                      <td className="py-2.5 font-mono text-white/40">{color}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          {/* ── RF04 ──────────────────────────────────────────────────── */}
          <Section id="rf04">
            <H2>
              <Badge color="orange">1,50 pts</Badge>
              <span className="ml-2">RF04 — Algoritmo de Dijkstra</span>
            </H2>
            <Prose>
              Implementação completa em <Inline>src/lib/graph/dijkstra.ts</Inline> usando MinHeap
              próprio (sem biblioteca externa). Termina antecipadamente quando o nó destino é
              extraído do heap — garantindo a menor exploração possível.
            </Prose>

            <H3>Pseudocódigo</H3>
            <Code>{`function dijkstra(graph, source, target):
  dist[v] ← ∞  para todo v ∈ V
  dist[source] ← 0
  heap.insert({ dist: 0, node: source })

  enquanto heap não vazio:
    u ← heap.extractMin()
    se u já visitado: continue
    marcar u como visitado
    explored++

    se u == target: break   ← terminação antecipada

    para cada aresta (u → v, peso w):
      se dist[u] + w < dist[v]:
        dist[v] ← dist[u] + w
        prev[v] ← u
        heap.insert({ dist: dist[v], node: v })

  reconstruir caminho via prev[]
  retornar { path, cost, explored, timeMs }`}</Code>

            <H3>Complexidade</H3>
            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-8 font-medium">Operação</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-8 font-medium">Complexidade</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 font-medium">Justificativa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { op: 'Dijkstra total', c: 'O((V + E) log V)', j: 'cada vértice extraído uma vez; cada aresta insere no heap' },
                    { op: 'MinHeap.insert', c: 'O(log n)', j: 'bubbleUp até a raiz' },
                    { op: 'MinHeap.extractMin', c: 'O(log n)', j: 'sinkDown após troca com último' },
                    { op: 'Reconstrução do caminho', c: 'O(V)', j: 'percorre prev[] de target a source' },
                  ].map(({ op, c, j }) => (
                    <tr key={op}>
                      <td className="py-2.5 pr-8 text-white/70">{op}</td>
                      <td className="py-2.5 pr-8 font-mono text-blue-300">{c}</td>
                      <td className="py-2.5 text-white/45">{j}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <H3>MinHeap — Implementação</H3>
            <Prose>
              Heap binário mínimo baseado em array. Propriedade: <Inline>heap[i] ≤ heap[2i+1]</Inline> e{' '}
              <Inline>heap[i] ≤ heap[2i+2]</Inline>. Chave de ordenação: <Inline>dist</Inline> (distância acumulada).
            </Prose>
            <Code>{`class MinHeap {
  private heap: { dist: number; nodeId: string }[] = [];

  insert(entry): void {
    this.heap.push(entry);
    this.bubbleUp(this.heap.length - 1); // O(log n)
  }

  extractMin(): entry | undefined {
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0); // O(log n)
    }
    return min;
  }
}`}</Code>

            <H3>Retorno da função</H3>
            <Code>{`interface DijkstraResult {
  path:     NodeId[];  // sequência de IDs do caminho mínimo
  cost:     number;    // custo total (metros para .osm/.poly)
  explored: number;    // número de nós extraídos do heap
  timeMs:   number;    // tempo de execução (performance.now)
  dist:     Map<NodeId, number>; // distâncias finais (para debug)
  noPath:   boolean;  // true se target inacessível
}`}</Code>

            <H3>Performance — Campus UFG</H3>
            <Card>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Nós do grafo', value: '~5.000' },
                  { label: 'Arestas', value: '~7.000' },
                  { label: 'Tempo típico', value: '< 10 ms' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-lg font-bold text-blue-300 mb-1">{value}</p>
                    <p className="text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Section>

          {/* ── RF05 ──────────────────────────────────────────────────── */}
          <Section id="rf05">
            <H2>
              <Badge color="orange">1,10 pts</Badge>
              <span className="ml-2">RF05 — Criação e Edição de Grafos</span>
            </H2>
            <Prose>
              Todas as mutações do grafo passam pelo store Zustand (<Inline>useGraph</Inline>) que
              mantém versionamento e histórico de desfazer/refazer.
            </Prose>
            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">Modo</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-4 font-medium">Atalho</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 font-medium">Comportamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { mode: 'Adicionar Vértice', key: 'V', action: 'Clique no canvas cria nó na posição do cursor' },
                    { mode: 'Adicionar Aresta', key: 'E', action: 'Clique em nó A, clique em nó B → cria aresta A→B com peso Euclidiano' },
                    { mode: 'Mover', key: 'M', action: 'Arrastar nó reposiciona; coordenadas atualizadas no grafo' },
                    { mode: 'Excluir', key: 'Del', action: 'Clique em nó remove nó + todas suas arestas; clique em aresta remove apenas ela' },
                    { mode: 'Selecionar', key: 'S', action: 'Define origem/destino para Dijkstra; clique duplo no fundo limpa seleção' },
                  ].map(({ mode, key, action }) => (
                    <tr key={mode}>
                      <td className="py-2.5 pr-4 text-white/80 font-medium">{mode}</td>
                      <td className="py-2.5 pr-4">
                        <kbd className="bg-white/[0.08] border border-white/[0.14] rounded px-1.5 py-0.5 text-[10px] font-mono text-amber-300">
                          {key}
                        </kbd>
                      </td>
                      <td className="py-2.5 text-white/55">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <H3>Desfazer / Refazer</H3>
            <Prose>
              Stack de histórico com capacidade máxima de 20 snapshots. Cada snapshot é uma cópia
              profunda (<Inline>graph.clone()</Inline>) do estado dos nós e adjacências. Acionado
              apenas por mutações estruturais (add/remove nó ou aresta; reposicionamento não gera snapshot).
            </Prose>
            <Code>{`// Snapshot salvo antes de cada mutação estrutural
addNode: (node) => {
  const snapshot = graph.clone();  // cópia profunda
  graph.addNode(node);
  set({ past: [snapshot, ...past].slice(0, 20), future: [] });
}

// Undo restaura o snapshot mais recente
undo: () => {
  const [prev, ...rest] = past;
  const current = graph.clone();
  graph.fromSnapshot(prev);
  set({ past: rest, future: [current, ...future] });
}`}</Code>
          </Section>

          {/* ── RF06 ──────────────────────────────────────────────────── */}
          <Section id="rf06">
            <H2>
              <Badge color="orange">1,30 pts</Badge>
              <span className="ml-2">RF06 — Grafos Direcionados e Não-Direcionados</span>
            </H2>
            <Prose>
              O tipo de grafo opera em dois níveis: (1) configuração global via toggle na toolbar
              e (2) por aresta individualmente. Arestas não-direcionadas são armazenadas
              bidirecionalmente — a aresta reversa recebe sufixo <Inline>_rev</Inline> e é
              filtrada na renderização para evitar duplicação visual.
            </Prose>

            <H3>Detecção automática por formato de arquivo</H3>
            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-6 font-medium">Formato</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 font-medium">Regra de detecção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { fmt: '.osm', rule: 'tag oneway=yes/1/true → direcionada; tag junction=roundabout → direcionada (sentido horário)' },
                    { fmt: '.poly', rule: 'quarta coluna da aresta: 0 = não-direcionada, 1 = direcionada' },
                    { fmt: '.txt', rule: 'quarta coluna: 0/false = não-direcionada, 1/true = direcionada; default: não-direcionada' },
                  ].map(({ fmt, rule }) => (
                    <tr key={fmt}>
                      <td className="py-2.5 pr-6 font-mono text-amber-300">{fmt}</td>
                      <td className="py-2.5 text-white/60">{rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <H3>Armazenamento no Grafo</H3>
            <Code>{`addEdge(edge: GraphEdge): void {
  // aresta base sempre adicionada em src → tgt
  this.adjacency.get(edge.source).push(edge);

  if (!edge.directed) {
    // aresta reversa para percurso bidirecional
    this.adjacency.get(edge.target).push({
      ...edge,
      id: \`\${edge.id}_rev\`,
      source: edge.target,
      target: edge.source,
    });
  }
}`}</Code>

            <Prose>
              Menu de contexto (botão direito sobre aresta) permite alternar a direção de uma
              aresta individual após a importação/criação. O método <Inline>updateEdgeDirection</Inline>{' '}
              adiciona ou remove a aresta <Inline>_rev</Inline> conforme necessário.
            </Prose>
          </Section>

          {/* ── RF07 ──────────────────────────────────────────────────── */}
          <Section id="rf07">
            <H2>
              <Badge color="orange">0,75 pt</Badge>
              <span className="ml-2">RF07 — Estatísticas do Algoritmo</span>
            </H2>
            <Prose>
              O painel lateral direito (<Inline>StatsPanel</Inline>) exibe em tempo real as
              métricas do último Dijkstra executado. O painel pode ser minimizado e restaurado
              sem perder os dados.
            </Prose>
            <Card>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Distância total', desc: 'Custo acumulado em km (cost / 1000)', tone: 'orange' },
                  { label: 'Pontos no caminho', desc: 'Número de vértices em path[]', tone: 'blue' },
                  { label: 'Tempo de execução', desc: 'performance.now() em milissegundos (2 casas)', tone: 'neutral' },
                  { label: 'Nós explorados', desc: 'Contador de extrações do MinHeap', tone: 'neutral' },
                  { label: 'Vértices do grafo', desc: 'graph.nodeCount — atualizado em tempo real', tone: 'green' },
                  { label: 'Arestas do grafo', desc: 'graph.edgeCount (exclui _rev)', tone: 'neutral' },
                ].map(({ label, desc, tone }) => {
                  const border = { orange: 'border-orange-400/25 bg-orange-500/[0.08]', blue: 'border-blue-400/25 bg-blue-500/[0.08]', green: 'border-green-400/25 bg-green-500/[0.08]', neutral: 'border-white/[0.09] bg-white/[0.04]' }[tone];
                  return (
                    <div key={label} className={`rounded-xl border px-3 py-2.5 ${border}`}>
                      <p className="text-xs font-semibold text-white/80 mb-0.5">{label}</p>
                      <p className="text-[10px] text-white/40">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Prose>
              Quando o destino é inacessível (<Inline>noPath: true</Inline>), o painel exibe
              um alerta vermelho e uma notificação toast é mostrada ao usuário.
            </Prose>
          </Section>

          {/* ── RF08 ──────────────────────────────────────────────────── */}
          <Section id="rf08">
            <H2>
              <Badge color="orange">0,20 pt</Badge>
              <span className="ml-2">RF08 — Copiar Imagem para Área de Transferência</span>
            </H2>
            <Prose>
              Botão de câmera na toolbar exporta o canvas Cytoscape como PNG e copia para
              a área de transferência via <Inline>Clipboard API</Inline> (requer HTTPS ou localhost).
            </Prose>
            <Code>{`// src/lib/utils/clipboard.ts
export async function copyGraphToClipboard(cy: Cytoscape.Core): Promise<void> {
  const dataUrl = cy.png({ output: 'base64uri', full: true, bg: '#070710' });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ]);
}`}</Code>
          </Section>

          {/* ── ESTRUTURAS ────────────────────────────────────────────── */}
          <Section id="estruturas">
            <H2>
              <span className="text-white/35 text-sm font-mono mr-1">09</span>
              Estruturas de Dados
            </H2>

            <H3>Grafo — Lista de Adjacência</H3>
            <Prose>
              O grafo é representado por dois <Inline>Map</Inline> separados. Operações de
              inserção e remoção de vértices e arestas são O(1) amortizado (exceto remoção de
              nó, que varre todas as listas de adjacência — O(V + E)).
            </Prose>
            <Code>{`class Graph {
  private nodes:     Map<NodeId, GraphNode>   // metadados dos nós
  private adjacency: Map<NodeId, GraphEdge[]> // listas de adj.

  // O(1) — insere nó e lista vazia
  addNode(node: GraphNode): void

  // O(1) amortizado — empurra na lista do source (e target se não-dir.)
  addEdge(edge: GraphEdge): void

  // O(V + E) — remove nó + varre todas as listas de adj.
  removeNode(id: NodeId): void

  // O(V + E) — varre todas as listas para remover base + _rev
  removeEdge(id: string): void

  // O(V + E) — cópia profunda para snapshot de histórico
  clone(): GraphSnapshot
}`}</Code>

            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-6 font-medium">Operação</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 font-medium">Complexidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { op: 'addNode', c: 'O(1)' },
                    { op: 'addEdge (não-direcionada)', c: 'O(1) — 2 pushes' },
                    { op: 'removeNode', c: 'O(V + E) — limpa listas de adj.' },
                    { op: 'removeEdge', c: 'O(V + E) — filtra id e id_rev' },
                    { op: 'getNeighbors', c: 'O(1) — acesso direto ao Map' },
                    { op: 'clone (snapshot)', c: 'O(V + E) — cópia profunda' },
                  ].map(({ op, c }) => (
                    <tr key={op}>
                      <td className="py-2.5 pr-6 font-mono text-amber-300">{op}</td>
                      <td className="py-2.5 font-mono text-blue-300">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <H3>MinHeap — Heap Binário Mínimo</H3>
            <Prose>
              Array com propriedade heap-min. Índice do pai: <Inline>(i-1) &gt;&gt; 1</Inline>.
              Filhos: <Inline>2i+1</Inline> e <Inline>2i+2</Inline>.
              Lazy deletion: nós já visitados são ignorados ao serem extraídos
              (o heap pode conter entradas obsoletas — <Inline>if visited: continue</Inline>).
            </Prose>
            <Card>
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { op: 'insert', c: 'O(log n)' },
                  { op: 'extractMin', c: 'O(log n)' },
                  { op: 'peek (min)', c: 'O(1)' },
                  { op: 'build heap', c: 'O(n)' },
                ].map(({ op, c }) => (
                  <div key={op} className="bg-black/20 rounded-xl py-3">
                    <p className="text-sm font-bold text-blue-300 mb-1 font-mono">{c}</p>
                    <p className="text-[10px] text-white/35 font-mono">{op}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Section>

          {/* ── ARQUITETURA ───────────────────────────────────────────── */}
          <Section id="arquitetura">
            <H2>
              <span className="text-white/35 text-sm font-mono mr-1">10</span>
              Arquitetura
            </H2>
            <Prose>
              Separação em três camadas: UI → Domínio → Utilitários.
              Estado global centralizado no store Zustand.
            </Prose>
            <Code>{`src/
├── app/
│   ├── page.tsx          ← raiz da SPA (monta canvas + toolbar)
│   └── docs/page.tsx     ← esta página
│
├── components/           ← CAMADA UI
│   ├── GraphCanvas.tsx   ← wrapper Cytoscape.js (SSR desabilitado)
│   ├── Toolbar.tsx       ← barra de ferramentas + importação
│   ├── StatsPanel.tsx    ← painel de estatísticas do Dijkstra
│   ├── ContextMenu.tsx   ← menu de contexto (botão direito)
│   ├── CompassOverlay.tsx← bússola decorativa no canto
│   └── GlassPanel.tsx    ← componente base para painéis glass
│
├── hooks/
│   └── useGraph.ts       ← STORE ZUSTAND (estado global)
│
└── lib/
    ├── graph/            ← CAMADA DOMÍNIO
    │   ├── Graph.ts      ← lista de adjacência
    │   ├── dijkstra.ts   ← MinHeap + Dijkstra
    │   └── types.ts      ← interfaces TypeScript
    ├── parsers/          ← CAMADA DOMÍNIO
    │   ├── osmParser.ts  ← DOMParser → Haversine → UTM
    │   ├── polyParser.ts ← formato cartesiano do professor
    │   └── txtParser.ts  ← 3 sub-formatos
    └── utils/
        ├── coordinates.ts← UTM Zone 23S + normalização
        └── clipboard.ts  ← Cytoscape → PNG → Clipboard API`}</Code>

            <H3>Fluxo de Dados</H3>
            <Code>{`Arquivo .osm/.poly/.txt
        ↓ parsers/
ParseResult { nodes[], edges[] }
        ↓ useGraph.importGraph()
Graph (lista de adjacência) + graphVersion++
        ↓ GraphCanvas (useMemo on graphVersion)
Cytoscape elements[] → renderização no canvas
        ↓ seleção de origin/target (modo Select)
useGraph.runDijkstra()
        ↓ dijkstra(graph, source, target)
DijkstraResult { path, cost, explored, timeMs }
        ↓ Cytoscape stylesheet update
Colorização do caminho + StatsPanel`}</Code>

            <H3>Re-render por Versão</H3>
            <Prose>
              O objeto <Inline>graph</Inline> é mutado in-place (sem substituição de referência).
              O campo <Inline>graphVersion: number</Inline> no store é incrementado a cada mutação
              e é a única dependência do <Inline>useMemo</Inline> no <Inline>GraphCanvas</Inline> —
              garantindo re-render preciso sem re-criação desnecessária do objeto grafo.
            </Prose>
          </Section>

          {/* ── ATALHOS ───────────────────────────────────────────────── */}
          <Section id="atalhos">
            <H2>
              <span className="text-white/35 text-sm font-mono mr-1">11</span>
              Atalhos de Teclado e Referência Rápida
            </H2>
            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 pr-8 font-medium">Tecla</th>
                    <th className="text-left text-white/35 uppercase tracking-wider py-2 font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[
                    { key: 'S', action: 'Modo Selecionar (define origem/destino)' },
                    { key: 'V', action: 'Modo Adicionar Vértice' },
                    { key: 'E', action: 'Modo Adicionar Aresta' },
                    { key: 'M', action: 'Modo Mover Vértice' },
                    { key: 'Del', action: 'Modo Excluir Elemento' },
                    { key: 'Ctrl+Z', action: 'Desfazer (undo, máx. 20 passos)' },
                    { key: 'Ctrl+Y', action: 'Refazer (redo)' },
                    { key: 'Esc', action: 'Limpar seleção de origem/destino / parar navegação' },
                    { key: 'Scroll', action: 'Zoom in/out no canvas' },
                    { key: 'Drag canvas', action: 'Pan (navegação pelo mapa)' },
                    { key: 'Clique direito', action: 'Menu de contexto (nó ou aresta)' },
                  ].map(({ key, action }) => (
                    <tr key={key}>
                      <td className="py-2.5 pr-8">
                        <kbd className="bg-white/[0.08] border border-white/[0.14] rounded px-2 py-1 text-[10px] font-mono text-amber-300">
                          {key}
                        </kbd>
                      </td>
                      <td className="py-2.5 text-white/60">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <H3>Stack Tecnológico</H3>
            <Card>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { tech: 'Next.js 15', desc: 'App Router, SSR off para Cytoscape' },
                  { tech: 'TypeScript 5', desc: 'Tipagem estrita em todo o domínio' },
                  { tech: 'Cytoscape.js', desc: 'Renderização e interação do grafo' },
                  { tech: 'Zustand 5', desc: 'Estado global com store tipado' },
                  { tech: 'Tailwind CSS 4', desc: 'Estilização + design system glass' },
                  { tech: 'DOMParser', desc: 'Parse de OSM XML nativo no browser' },
                ].map(({ tech, desc }) => (
                  <div key={tech} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                    <p className="font-semibold text-white/80 mb-0.5">{tech}</p>
                    <p className="text-[10px] text-white/35">{desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Section>

          {/* footer */}
          <div className="border-t border-white/[0.08] pt-8 mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/30">NAVEGAR UFG · AED2 2026-1</p>
              <p className="text-[10px] text-white/20 mt-0.5">Entrega: 01/06/2026</p>
            </div>
            <Link
              href="/"
              className="text-xs px-4 py-2 rounded-xl bg-blue-500/[0.20] border border-blue-400/40 text-blue-300 hover:bg-blue-500/[0.30] transition-all duration-200"
            >
              Abrir o App →
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
