'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── primitive UI ─────────────────────────────────────────────────────────────

function Orbs({ a = 'rgba(59,130,246,0.16)', b = 'rgba(139,92,246,0.12)' }: { a?: string; b?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: [
          `radial-gradient(ellipse at 15% 25%, ${a} 0%, transparent 55%)`,
          `radial-gradient(ellipse at 85% 75%, ${b} 0%, transparent 55%)`,
          'radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.07) 0%, transparent 50%)',
        ].join(','),
      }}
    />
  );
}

function GCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/[0.12] rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}

function Pill({
  color,
  children,
}: {
  color: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'white' | 'cyan';
  children: React.ReactNode;
}) {
  const cls = {
    orange: 'bg-orange-500/[0.20] border-orange-400/45 text-orange-200',
    blue:   'bg-blue-500/[0.20] border-blue-400/45 text-blue-200',
    green:  'bg-green-500/[0.20] border-green-400/45 text-green-200',
    purple: 'bg-purple-500/[0.20] border-purple-400/45 text-purple-200',
    red:    'bg-red-500/[0.20] border-red-400/45 text-red-200',
    white:  'bg-white/[0.09] border-white/[0.20] text-white/70',
    cyan:   'bg-cyan-500/[0.18] border-cyan-400/40 text-cyan-200',
  }[color];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {children}
    </span>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-black/50 border border-white/[0.08] rounded-xl px-4 py-3 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
      {children}
    </pre>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
      <span className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      <span className="text-xs text-white/60">{children}</span>
    </div>
  );
}

function SlideShell({
  accentFrom,
  accentTo,
  orbA,
  orbB,
  children,
}: {
  accentFrom: string;
  accentTo: string;
  orbA?: string;
  orbB?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070710]">
      <Orbs a={orbA} b={orbB} />
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: `linear-gradient(to right, ${accentFrom}, ${accentTo}, ${accentFrom})` }}
      />
      <div className="relative z-10 flex flex-col h-full px-12 py-10">{children}</div>
    </div>
  );
}

// ── SVG decoration ────────────────────────────────────────────────────────────

function GraphSvg() {
  const ns: [number, number, string][] = [
    [136, 60,  '#27AE60'],
    [240, 120, '#F39C12'],
    [200, 220, '#F39C12'],
    [80,  190, '#E74C3C'],
    [50,  100, '#4A90D9'],
    [170, 140, '#4A90D9'],
  ];
  const es: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[5,2],[1,5],
  ];
  return (
    <svg viewBox="0 0 288 288" className="w-full h-full opacity-55">
      {es.map(([a, b], i) => (
        <line
          key={i}
          x1={ns[a][0]} y1={ns[a][1]}
          x2={ns[b][0]} y2={ns[b][1]}
          stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
        />
      ))}
      {ns.map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="9" fill={c} />
      ))}
    </svg>
  );
}

// ── SLIDES ────────────────────────────────────────────────────────────────────

function S01Cover() {
  return (
    <SlideShell
      accentFrom="rgba(59,130,246,0.8)"
      accentTo="rgba(139,92,246,0.8)"
      orbA="rgba(59,130,246,0.18)"
      orbB="rgba(139,92,246,0.14)"
    >
      <div className="flex-1 flex items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
            <Pill color="blue">AED2 · UFG · 2026-1</Pill>
            <Pill color="green">Entrega 01/06/2026</Pill>
          </div>

          <h1 className="text-[5.5rem] font-black leading-none tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-75">
            <span className="text-white">NAVEGAR</span>
            <span className="text-blue-400">UFG</span>
          </h1>

          <p className="text-2xl text-white/55 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-150">
            Sistema de Navegação em Grafos
          </p>
          <p className="text-base text-white/30 mb-10 animate-in fade-in duration-500 fill-mode-both delay-150">
            Algoritmos e Estruturas de Dados 2
          </p>

          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both delay-300">
            {[
              'Dijkstra c/ MinHeap próprio — < 10 ms',
              'Importa mapas OpenStreetMap reais',
              'Grafos direcionados + não-direcionados',
              '100% no browser · sem servidor',
              'Campus UFG: ~5.000 nós, ~7.000 arestas',
            ].map(t => (
              <span
                key={t}
                className="text-sm text-white/45 bg-white/[0.05] border border-white/[0.09] rounded-full px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden xl:block w-64 h-64 flex-shrink-0 animate-in fade-in zoom-in-95 duration-700 fill-mode-both delay-300">
          <GraphSvg />
        </div>
      </div>

      <p className="text-[10px] text-white/20 uppercase tracking-widest text-center pb-2 animate-in fade-in duration-500 fill-mode-both delay-500">
        → ou espaço para avançar
      </p>
    </SlideShell>
  );
}

function S02Reqs() {
  const rows = [
    { id: 'RF04', desc: 'Calcular caminho mínimo com terminação antecipada ao encontrar o destino',   tone: 'border-orange-400/50 bg-orange-500/[0.10]' },
    { id: 'RF06', desc: 'Suportar grafos direcionados e não-direcionados detectados automaticamente', tone: 'border-yellow-400/40 bg-yellow-500/[0.08]' },
    { id: 'RF05', desc: 'Criar, editar e excluir vértices e arestas com undo/redo ilimitado',        tone: 'border-amber-400/40 bg-amber-500/[0.08]' },
    { id: 'RF01', desc: 'Importar mapas reais nos formatos .osm, .poly e .txt',                      tone: 'border-blue-400/30 bg-blue-500/[0.07]' },
    { id: 'RF07', desc: 'Exibir tempo de execução, nós explorados e custo total do caminho',         tone: 'border-blue-400/30 bg-blue-500/[0.07]' },
    { id: 'RF02', desc: 'Alternar visibilidade de vértices e rótulos de peso nas arestas',           tone: 'border-white/[0.14] bg-white/[0.04]' },
    { id: 'RF03', desc: 'Marcar origem (verde), destino (vermelho) e caminho (laranja) com cores',   tone: 'border-white/[0.14] bg-white/[0.04]' },
    { id: 'RF08', desc: 'Exportar captura do grafo como PNG direto para a área de transferência',    tone: 'border-white/[0.14] bg-white/[0.04]' },
  ];

  return (
    <SlideShell
      accentFrom="rgba(251,146,60,0.8)"
      accentTo="rgba(245,158,11,0.8)"
      orbA="rgba(251,146,60,0.12)"
      orbB="rgba(245,158,11,0.10)"
    >
      <div className="mb-5 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Visão Geral</p>
        <h2 className="text-3xl font-bold text-white">Requisitos Funcionais</h2>
        <p className="text-white/35 text-sm mt-1">8 requisitos · todos implementados</p>
      </div>

      <div className="grid grid-cols-4 gap-3 flex-1 content-start">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={`rounded-2xl border px-4 py-3 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300 fill-mode-both ${r.tone}`}
            style={{ animationDelay: `${75 + i * 50}ms` }}
          >
            <div>
              <span className="text-[10px] font-mono text-white/35 mb-2 block">{r.id}</span>
              <p className="text-sm text-white/75 leading-snug">{r.desc}</p>
            </div>
            <p className="text-[10px] text-green-400/80 font-semibold mt-3">✓ Implementado</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

function S03Dijkstra() {
  return (
    <SlideShell
      accentFrom="rgba(59,130,246,0.8)"
      accentTo="rgba(6,182,212,0.8)"
      orbA="rgba(59,130,246,0.18)"
      orbB="rgba(6,182,212,0.12)"
    >
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">RF04</p>
        <h2 className="text-3xl font-bold text-white">Algoritmo de Dijkstra</h2>
        <p className="text-white/40 text-sm mt-1">
          Garante caminho ótimo em grafos com pesos não-negativos — implementado do zero sem biblioteca externa
        </p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* left */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <GCard className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-75">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Complexidade',  value: 'O((V+E) log V)',  color: 'text-blue-300' },
                { label: 'Estrutura',     value: 'MinHeap próprio', color: 'text-purple-300' },
                { label: 'Terminação',    value: 'Antecipada',      color: 'text-green-300' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className={`text-sm font-bold ${color} mb-0.5`}>{value}</p>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </GCard>

          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-150">
            <Code>{`class MinHeap {
  insert({ dist, nodeId }): void  // O(log n) — sobe para o pai (bubbleUp)
  extractMin(): entry             // O(log n) — desce pelos filhos (sinkDown)
}

// dijkstra.ts — termina assim que encontra o destino
while (heap.size > 0) {
  const u = heap.extractMin();
  if (visited(u)) continue;
  if (u === target) break;        // ← não processa o resto do grafo

  for (const edge of graph.getNeighbors(u)) {
    const d = dist[u] + edge.weight;
    if (d < dist[v]) {
      dist[v] = d; prev[v] = u;   // relaxamento da aresta
      heap.insert({ dist: d, nodeId: v });
    }
  }
}
// retorna: { path, cost, explored, timeMs, noPath }`}</Code>
          </div>

          <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-300">
            {[
              { label: 'heap.insert',    c: 'O(log n)', desc: 'bubbleUp ao pai' },
              { label: 'heap.extract',   c: 'O(log n)', desc: 'sinkDown filhos' },
              { label: 'reconstrução',   c: 'O(V)',     desc: 'percorre prev[]' },
            ].map(({ label, c, desc }) => (
              <GCard key={label} className="text-center">
                <p className="text-sm font-bold text-blue-300 font-mono">{c}</p>
                <p className="text-[10px] text-white/35 font-mono mt-0.5">{label}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{desc}</p>
              </GCard>
            ))}
          </div>
        </div>

        {/* right — steps */}
        <div className="w-56 flex flex-col gap-2 justify-between animate-in fade-in slide-in-from-right-3 duration-500 fill-mode-both delay-150">
          <div className="flex flex-col gap-2">
            {[
              'dist[source] = 0, demais = ∞',
              'Inserir source no MinHeap',
              'Extrair nó u com menor dist',
              'u já visitado? → ignorar',
              'u = target? → parar ✓',
              'Relaxar cada vizinho de u',
              'Inserir vizinhos melhorados',
              'Reconstruir caminho via prev[]',
            ].map((t, i) => <Step key={i} n={i + 1}>{t}</Step>)}
          </div>

          <GCard className="text-center bg-blue-500/[0.08] border-blue-400/25">
            <p className="text-3xl font-black text-blue-300 mb-1">{'< 10 ms'}</p>
            <p className="text-[10px] text-white/35 uppercase tracking-wider leading-relaxed">
              Campus UFG<br />~5.000 nós · ~7.000 arestas
            </p>
          </GCard>
        </div>
      </div>
    </SlideShell>
  );
}

function S04Directed() {
  return (
    <SlideShell
      accentFrom="rgba(139,92,246,0.8)"
      accentTo="rgba(167,139,250,0.8)"
      orbA="rgba(139,92,246,0.14)"
      orbB="rgba(109,40,217,0.12)"
    >
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">RF06</p>
        <h2 className="text-3xl font-bold text-white">Grafos Direcionados e Não-Direcionados</h2>
        <p className="text-white/40 text-sm mt-1">Detecção automática por parser — sem configuração manual</p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                ext: '.osm',
                border: 'border-green-400/35 bg-green-500/[0.07]',
                delay: 75,
                items: [
                  'oneway=yes → direcionada',
                  'oneway=1 → direcionada',
                  'junction=roundabout → direcionada',
                  'Padrão → não-direcionada',
                ],
              },
              {
                ext: '.poly',
                border: 'border-blue-400/35 bg-blue-500/[0.07]',
                delay: 150,
                items: [
                  '4ª coluna = 0 → bidirecional',
                  '4ª coluna = 1 → direcionada',
                  'Formato oficial do professor UFG',
                ],
              },
              {
                ext: '.txt',
                border: 'border-amber-400/35 bg-amber-500/[0.07]',
                delay: 225,
                items: [
                  '4ª col. = 0/false → bidirecional',
                  '4ª col. = 1/true → direcionada',
                  'Omitida → padrão bidirecional',
                ],
              },
            ].map(({ ext, border, delay, items }) => (
              <div
                key={ext}
                className={`rounded-2xl border px-4 py-3 animate-in fade-in zoom-in-95 duration-400 fill-mode-both ${border}`}
                style={{ animationDelay: `${delay}ms` }}
              >
                <p className="text-xl font-mono font-bold text-white/85 mb-2">{ext}</p>
                {items.map(item => (
                  <p key={item} className="text-xs text-white/55 py-0.5 leading-snug">{item}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-300">
            <Code>{`// Graph.ts — aresta não-direcionada gera 2 entradas na adjacência
addEdge(edge: GraphEdge): void {
  this.adjacency.get(edge.source).push(edge);          // A → B

  if (!edge.directed) {
    this.adjacency.get(edge.target).push({
      ...edge,
      id: edge.id + '_rev',   // sufixo _rev identifica aresta reversa
      source: edge.target,    // B → A (direção invertida)
      target: edge.source,
    });
  }
}
// No GraphCanvas: arestas _rev são filtradas — sem duplicata visual
// Menu de contexto (botão direito): alterna direção de qualquer aresta`}</Code>
          </div>
        </div>

        <div className="w-60 flex flex-col gap-3 animate-in fade-in slide-in-from-right-3 duration-500 fill-mode-both delay-200">
          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-3">Toggle Global na Toolbar</p>
            {[
              { label: 'Bidirecional', icon: '⇄', on: true },
              { label: 'Direcionado',  icon: '→', on: false },
            ].map(({ label, icon, on }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 mb-2 ${
                  on
                    ? 'bg-blue-500/20 border border-blue-400/40 text-blue-200'
                    : 'bg-white/[0.04] border border-white/[0.10] text-white/45'
                }`}
              >
                <span className="text-base w-5 text-center">{icon}</span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </GCard>
          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Edição por aresta</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Clique direito sobre qualquer aresta para inverter sua direção individualmente — sem precisar reimportar o mapa.
            </p>
          </GCard>
          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Detecção automática</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Cada parser lê a direção direto do arquivo — o Dijkstra respeita a direcionalidade na travessia do grafo.
            </p>
          </GCard>
        </div>
      </div>
    </SlideShell>
  );
}

function S05Editing() {
  const modes = [
    { mode: 'Selecionar',        key: 'S',   icon: '↖', desc: 'Define origem e destino para o Dijkstra', border: 'border-blue-400/35 bg-blue-500/[0.07]' },
    { mode: 'Adicionar Vértice', key: 'V',   icon: '⊕', desc: 'Clique no canvas cria um nó na posição',   border: 'border-green-400/35 bg-green-500/[0.07]' },
    { mode: 'Adicionar Aresta',  key: 'E',   icon: '⌒', desc: 'Clica em A, clica em B → aresta criada',  border: 'border-purple-400/35 bg-purple-500/[0.07]' },
    { mode: 'Mover',             key: 'M',   icon: '✥', desc: 'Arrasta vértice para reposicioná-lo',      border: 'border-amber-400/35 bg-amber-500/[0.07]' },
    { mode: 'Excluir',           key: 'Del', icon: '✕', desc: 'Remove nó e todas as suas arestas',        border: 'border-red-400/35 bg-red-500/[0.07]' },
  ];

  return (
    <SlideShell
      accentFrom="rgba(16,185,129,0.8)"
      accentTo="rgba(52,211,153,0.8)"
      orbA="rgba(16,185,129,0.13)"
      orbB="rgba(5,150,105,0.10)"
    >
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">RF05</p>
        <h2 className="text-3xl font-bold text-white">Criação e Edição de Grafos</h2>
        <p className="text-white/40 text-sm mt-1">5 modos de interação + histórico de desfazer/refazer</p>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="grid grid-cols-5 gap-3">
          {modes.map(({ mode, key, icon, desc, border }, i) => (
            <div
              key={mode}
              className={`rounded-2xl border px-3 py-3 text-center animate-in fade-in zoom-in-95 duration-300 fill-mode-both ${border}`}
              style={{ animationDelay: `${75 + i * 60}ms` }}
            >
              <p className="text-2xl mb-2">{icon}</p>
              <p className="text-xs font-semibold text-white/80 mb-1.5 leading-tight">{mode}</p>
              <kbd className="bg-white/[0.08] border border-white/[0.14] rounded px-2 py-0.5 text-[10px] font-mono text-amber-300">
                {key}
              </kbd>
              <p className="text-[10px] text-white/40 mt-2 leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-300">
          <GCard>
            <p className="text-sm font-semibold text-white/80 mb-3">Desfazer / Refazer</p>
            <div className="flex gap-2 mb-3">
              {['Ctrl+Z', 'Ctrl+Y'].map(k => (
                <kbd key={k} className="bg-white/[0.08] border border-white/[0.14] rounded px-2 py-1 text-xs font-mono text-amber-300">
                  {k}
                </kbd>
              ))}
            </div>
            <p className="text-xs text-white/45 leading-relaxed">
              Stack de <strong className="text-white/70">20 snapshots</strong> — cópia profunda do grafo
              antes de cada mutação estrutural. Apenas adicionar/remover vértice ou aresta gera snapshot.
              Reposicionar nós não grava histórico.
            </p>
          </GCard>

          <Code>{`// Snapshot salvo antes de cada mutação estrutural
addNode: (node) => {
  const snap = graph.clone(); // O(V+E) cópia profunda
  graph.addNode(node);
  set({ past: [snap, ...past].slice(0, 20),
        future: [] });
}

// Undo: restaura anterior, empurra atual em future[]
undo: () => {
  const [prev, ...rest] = past;
  graph.fromSnapshot(prev);
  set({ past: rest, future: [current, ...future] });
}`}</Code>
        </div>
      </div>
    </SlideShell>
  );
}

function S06Import() {
  const formats = [
    {
      ext: '.osm', title: 'OpenStreetMap XML',
      border: 'border-green-400/35 bg-green-500/[0.07]',
      delay: 75,
      items: [
        'DOMParser nativo — sem dependência externa',
        '18 tipos de highway aceitos',
        'Distância via fórmula de Haversine',
        'Coordenadas lat/lon → UTM Zona 23S',
        'oneway/roundabout → aresta direcionada',
      ],
    },
    {
      ext: '.poly', title: 'Cartesiano (UFG)',
      border: 'border-blue-400/35 bg-blue-500/[0.07]',
      delay: 150,
      items: [
        'Formato oficial do professor',
        'Peso: distância Euclidiana direta',
        'Flag de direção por aresta (col. 4)',
        'normalizeCoords + Y-flip para Cytoscape',
        'Campus UFG: ~5k nós, ~7k arestas',
      ],
    },
    {
      ext: '.txt', title: '3 sub-formatos',
      border: 'border-amber-400/35 bg-amber-500/[0.07]',
      delay: 225,
      items: [
        'Auto-detecção de formato na leitura',
        '① "src dst peso [dir]" por linha',
        '② blocos NODES / EDGES',
        '③ lista de adjacência "nó: vizinhos"',
        'Layout circular automático para .txt',
      ],
    },
  ];

  return (
    <SlideShell
      accentFrom="rgba(6,182,212,0.8)"
      accentTo="rgba(14,165,233,0.8)"
      orbA="rgba(6,182,212,0.13)"
      orbB="rgba(14,165,233,0.10)"
    >
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">RF01</p>
        <h2 className="text-3xl font-bold text-white">Importação de Mapas</h2>
        <p className="text-white/40 text-sm mt-1">3 formatos suportados — parsing 100% client-side, sem servidor</p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="grid grid-cols-3 gap-4">
            {formats.map(({ ext, title, border, delay, items }) => (
              <div
                key={ext}
                className={`rounded-2xl border px-4 py-3 animate-in fade-in zoom-in-95 duration-400 fill-mode-both ${border}`}
                style={{ animationDelay: `${delay}ms` }}
              >
                <p className="text-xl font-mono font-bold text-white/85 mb-0.5">{ext}</p>
                <p className="text-[10px] text-white/35 mb-3">{title}</p>
                {items.map(item => <p key={item} className="text-xs text-white/55 py-0.5">{item}</p>)}
              </div>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-300">
            <Code>{`// osmParser.ts — Haversine para distância geográfica real
const dist = haversineDistance(lat1, lon1, lat2, lon2);
//   = R · 2 · atan2(√a, √(1−a))   onde a = sin²(Δlat/2) + cos·cos·sin²(Δlon/2)

const { x, y } = latLonToUTM(lat, lon);  // WGS84 → metros (zona 23S, Goiânia)
const nodes    = normalizeCoords(utm);    // escala + Y-flip (ref: ConverteMapaParaGrafo.c)`}</Code>
          </div>
        </div>

        <div className="w-52 flex flex-col gap-3 animate-in fade-in slide-in-from-right-3 duration-500 fill-mode-both delay-200">
          {[
            { val: '~5.000', sub: 'nós · campus.osm',      color: 'text-green-300',  border: 'border-green-400/30 bg-green-500/[0.08]' },
            { val: '~7.000', sub: 'arestas · campus.poly',  color: 'text-blue-300',   border: 'border-blue-400/30 bg-blue-500/[0.08]' },
            { val: '< 2 s',  sub: 'parse + render',         color: 'text-orange-300', border: 'border-orange-400/30 bg-orange-500/[0.08]' },
          ].map(({ val, sub, color, border }) => (
            <GCard key={val} className={`text-center ${border}`}>
              <p className={`text-3xl font-black ${color} mb-1`}>{val}</p>
              <p className="text-[10px] text-white/35 uppercase tracking-wider leading-relaxed">{sub}</p>
            </GCard>
          ))}
          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Mapas pré-carregados</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Campus UFG disponível com um clique na toolbar — formatos .osm e .poly prontos para uso imediato.
            </p>
          </GCard>
        </div>
      </div>
    </SlideShell>
  );
}

function S07Stats() {
  const stats = [
    { label: 'Distância Total',    value: '2.847 m',  sub: 'cost acumulado do caminho',      tone: 'border-orange-400/40 bg-orange-500/[0.10] text-orange-200' },
    { label: 'Nós no Caminho',     value: '47',        sub: 'path.length — vértices visitados', tone: 'border-blue-400/40 bg-blue-500/[0.10] text-blue-200' },
    { label: 'Tempo de Execução',  value: '3,24 ms',   sub: 'performance.now() — alta precisão', tone: 'border-white/[0.12] bg-white/[0.05] text-white/90' },
    { label: 'Nós Explorados',     value: '312',        sub: 'extrações do MinHeap',             tone: 'border-white/[0.12] bg-white/[0.05] text-white/90' },
    { label: 'Vértices do Grafo',  value: '4.987',      sub: 'graph.nodeCount',                 tone: 'border-green-400/40 bg-green-500/[0.10] text-green-200' },
    { label: 'Arestas do Grafo',   value: '7.043',      sub: 'graph.edgeCount (sem _rev)',       tone: 'border-white/[0.12] bg-white/[0.05] text-white/90' },
  ];

  return (
    <SlideShell
      accentFrom="rgba(99,102,241,0.8)"
      accentTo="rgba(139,92,246,0.8)"
      orbA="rgba(99,102,241,0.13)"
      orbB="rgba(139,92,246,0.11)"
    >
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">RF07</p>
        <h2 className="text-3xl font-bold text-white">Estatísticas em Tempo Real</h2>
        <p className="text-white/40 text-sm mt-1">Painel lateral atualizado a cada execução do Dijkstra</p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        <div className="flex-1 grid grid-cols-3 gap-3 content-start">
          {stats.map(({ label, value, sub, tone }, i) => (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-4 animate-in fade-in zoom-in-95 duration-300 fill-mode-both ${tone}`}
              style={{ animationDelay: `${75 + i * 50}ms` }}
            >
              <p className="text-2xl font-black mb-1 tabular-nums">{value}</p>
              <p className="text-xs font-semibold mb-0.5">{label}</p>
              <p className="text-[10px] opacity-45 font-mono">{sub}</p>
            </div>
          ))}
        </div>

        <div className="w-60 flex flex-col gap-3 animate-in fade-in slide-in-from-right-3 duration-500 fill-mode-both delay-200">
          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-3">Seleção Ativa</p>
            {[
              { label: 'Origem',  tag: '123456', c: 'bg-green-500/20 border-green-400/40 text-green-300' },
              { label: 'Destino', tag: '789012', c: 'bg-red-500/20 border-red-400/40 text-red-300' },
            ].map(({ label, tag, c }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-xs text-white/45">{label}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-lg border ${c}`}>{tag}</span>
              </div>
            ))}
          </GCard>

          <GCard className="border-red-400/25 bg-red-500/[0.07]">
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Sem caminho</p>
            <p className="text-xs font-medium text-red-200 leading-relaxed">
              Alerta vermelho + toast de notificação quando o destino é inacessível a partir da origem.
            </p>
          </GCard>

          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Painel minimizável</p>
            <p className="text-xs text-white/45 leading-relaxed">
              Colapsa com um clique para liberar espaço no canvas; restaurado sem perda de dados.
            </p>
          </GCard>
        </div>
      </div>
    </SlideShell>
  );
}

function S08Minor() {
  return (
    <SlideShell
      accentFrom="rgba(244,63,94,0.8)"
      accentTo="rgba(251,113,133,0.8)"
      orbA="rgba(244,63,94,0.11)"
      orbB="rgba(159,18,57,0.10)"
    >
      <div className="mb-5 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <h2 className="text-3xl font-bold text-white">Requisitos Complementares</h2>
        <p className="text-white/35 text-sm mt-1">RF02 · RF03 · RF08 — interface visual e exportação</p>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 content-start">
        {/* RF02 */}
        <div
          className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
          style={{ animationDelay: '75ms' }}
        >
          <span className="text-[10px] font-mono text-white/30">RF02</span>
          <GCard>
            <p className="text-base font-semibold text-white/85 mb-4">Enumeração e Rotulagem</p>
            {[
              { icon: '○', key: 'Vértices', desc: 'alterna visibilidade dos IDs nos nós do canvas' },
              { icon: '⌗', key: 'Pesos',    desc: 'exibe o peso de cada aresta como rótulo flutuante' },
            ].map(({ icon, key, desc }) => (
              <div key={key} className="flex items-start gap-2 mb-3 bg-blue-500/[0.06] border border-blue-400/20 rounded-xl px-3 py-2">
                <span className="text-base leading-none mt-0.5">{icon}</span>
                <div>
                  <span className="text-xs font-mono text-amber-300 font-semibold">{key}</span>
                  <p className="text-[11px] text-white/45 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-white/30 leading-relaxed">
              No mapa UFG com ~5.000 nós, ocultar IDs mantém as arestas legíveis.
            </p>
          </GCard>
        </div>

        {/* RF03 */}
        <div
          className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
          style={{ animationDelay: '150ms' }}
        >
          <span className="text-[10px] font-mono text-white/30">RF03</span>
          <GCard>
            <p className="text-base font-semibold text-white/85 mb-4">Cores Distintas por Estado</p>
            {[
              { color: '#27AE60', label: 'Origem (A)' },
              { color: '#E74C3C', label: 'Destino (B)' },
              { color: '#F39C12', label: 'Caminho mínimo' },
              { color: '#6B7280', label: 'Nós explorados' },
              { color: '#2563EB', label: 'Arestas da rota' },
              { color: '#4A90D9', label: 'Padrão' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 py-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-white/55">{label}</span>
                <span className="text-[10px] font-mono text-white/20 ml-auto">{color}</span>
              </div>
            ))}
          </GCard>
        </div>

        {/* RF08 */}
        <div
          className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
          style={{ animationDelay: '225ms' }}
        >
          <span className="text-[10px] font-mono text-white/30">RF08</span>
          <GCard>
            <p className="text-base font-semibold text-white/85 mb-3">Exportar Imagem PNG</p>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Botão de câmera na toolbar captura o canvas inteiro do Cytoscape como PNG
              e envia direto para a área de transferência via Clipboard API — pronto para colar.
            </p>
            <Code>{`cy.png({ full: true,
         bg: '#070710' })
 → fetch(dataUrl) → Blob
 → new ClipboardItem({
     'image/png': blob
   })
 → navigator.clipboard
     .write([item])`}</Code>
          </GCard>
        </div>
      </div>
    </SlideShell>
  );
}

function S09Arch() {
  return (
    <SlideShell
      accentFrom="rgba(100,116,139,0.6)"
      accentTo="rgba(148,163,184,0.6)"
      orbA="rgba(100,116,139,0.10)"
      orbB="rgba(71,85,105,0.08)"
    >
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Implementação</p>
        <h2 className="text-3xl font-bold text-white">Arquitetura em Camadas</h2>
        <p className="text-white/40 text-sm mt-1">UI → Domínio → Utils — cada camada com responsabilidade única</p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-75">
          <Code>{`src/
├── app/
│   ├── page.tsx              ← SPA root — monta canvas + toolbar
│   ├── docs/page.tsx         ← documentação técnica interativa
│   └── slides/page.tsx       ← esta apresentação
│
├── components/               ── CAMADA UI ──────────────────────
│   ├── GraphCanvas.tsx       ← Cytoscape.js wrapper (ssr: false)
│   ├── Toolbar.tsx           ← modos de interação + importação
│   ├── StatsPanel.tsx        ← resultados do Dijkstra
│   └── ContextMenu.tsx       ← menu de contexto (botão direito)
│
├── hooks/
│   └── useGraph.ts           ── STORE ZUSTAND ─ estado + undo/redo
│
└── lib/
    ├── graph/                ── DOMÍNIO ────────────────────────
    │   ├── Graph.ts          ← adjacency list Map<NodeId, Edge[]>
    │   ├── dijkstra.ts       ← MinHeap + terminação antecipada
    │   └── types.ts          ← interfaces TypeScript compartilhadas
    ├── parsers/              ── DOMÍNIO ────────────────────────
    │   ├── osmParser.ts      ← DOMParser + Haversine + UTM 23S
    │   ├── polyParser.ts     ← formato cartesiano do professor
    │   └── txtParser.ts      ← 3 sub-formatos com auto-detecção
    └── utils/
        ├── coordinates.ts    ← UTM Zona 23S + normalizeCoords
        └── clipboard.ts      ← Cytoscape PNG → Clipboard API`}</Code>
        </div>

        <div className="w-60 flex flex-col gap-3 animate-in fade-in slide-in-from-right-3 duration-500 fill-mode-both delay-150">
          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-3">Princípios de design</p>
            <div className="space-y-2">
              {[
                { icon: '◈', label: 'UI só fala com hooks', c: 'text-blue-300' },
                { icon: '◈', label: 'Domínio sem React',    c: 'text-purple-300' },
                { icon: '◈', label: 'Parsers stateless',    c: 'text-green-300' },
              ].map(({ icon, label, c }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`text-xs ${c}`}>{icon}</span>
                  <span className="text-xs text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </GCard>

          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Re-render preciso</p>
            <p className="text-xs text-white/45 leading-relaxed">
              <span className="font-mono text-amber-300">graphVersion++</span> a cada mutação.
              Única dependência do <span className="font-mono text-amber-300">useMemo</span> no
              GraphCanvas — evita re-render sem motivo.
            </p>
          </GCard>

          <GCard>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">SSR desabilitado</p>
            <p className="text-xs text-white/45 leading-relaxed">
              Cytoscape.js acessa <span className="font-mono text-amber-300">window</span> no load —
              carregado com <span className="font-mono text-amber-300">dynamic(ssr: false)</span> para
              funcionar no Next.js App Router.
            </p>
          </GCard>
        </div>
      </div>
    </SlideShell>
  );
}

function S10Stack() {
  const techs = [
    {
      name: 'Next.js 15',
      icon: '▲',
      desc: 'App Router com SSR desabilitado no canvas — roteamento zero-config',
      color: 'border-white/20 bg-white/[0.06]',
      iconColor: 'text-white',
    },
    {
      name: 'TypeScript 5',
      icon: '{ }',
      desc: 'Tipagem estrita end-to-end — interfaces compartilhadas entre parsers, domínio e UI',
      color: 'border-blue-400/30 bg-blue-500/[0.07]',
      iconColor: 'text-blue-300',
    },
    {
      name: 'Cytoscape.js',
      icon: '◉',
      desc: 'Renderiza 5.000 nós e 7.000 arestas sem travar — estilo FluidGlass via stylesheet',
      color: 'border-purple-400/30 bg-purple-500/[0.07]',
      iconColor: 'text-purple-300',
    },
    {
      name: 'Zustand 5',
      icon: '⊛',
      desc: 'Estado global do grafo + stack de undo/redo com 20 snapshots por store única',
      color: 'border-orange-400/30 bg-orange-500/[0.07]',
      iconColor: 'text-orange-300',
    },
    {
      name: 'Tailwind CSS 4',
      icon: '◈',
      desc: 'FluidGlass design system — backdrop-blur, gradientes e glass tokens sem CSS manual',
      color: 'border-cyan-400/30 bg-cyan-500/[0.07]',
      iconColor: 'text-cyan-300',
    },
    {
      name: 'shadcn/ui',
      icon: '◻',
      desc: 'Componentes acessíveis como base — customizados para o tema escuro FluidGlass',
      color: 'border-green-400/30 bg-green-500/[0.07]',
      iconColor: 'text-green-300',
    },
  ];

  return (
    <SlideShell
      accentFrom="rgba(148,163,184,0.6)"
      accentTo="rgba(226,232,240,0.7)"
      orbA="rgba(59,130,246,0.10)"
      orbB="rgba(139,92,246,0.08)"
    >
      <div className="mb-5 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Tecnologias</p>
        <h2 className="text-3xl font-bold text-white">Stack Tecnológico</h2>
        <p className="text-white/40 text-sm mt-1">Cada ferramenta escolhida por uma razão específica</p>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 content-start">
        {techs.map(({ name, icon, desc, color, iconColor }, i) => (
          <div
            key={name}
            className={`rounded-2xl border px-5 py-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-400 fill-mode-both ${color}`}
            style={{ animationDelay: `${75 + i * 70}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-black font-mono leading-none ${iconColor}`}>{icon}</span>
              <span className="text-base font-bold text-white/90">{name}</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Vercel deploy banner */}
      <div
        className="mt-4 rounded-2xl border border-white/[0.16] bg-white/[0.04] px-6 py-4 flex items-center gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
        style={{ animationDelay: '570ms' }}
      >
        <span className="text-3xl font-black text-white leading-none">▲</span>
        <div>
          <p className="text-sm font-bold text-white/85">Hospedado na Vercel</p>
          <p className="text-xs text-white/40 mt-0.5">Deploy automático via Git push — zero configuração de servidor</p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap justify-end">
          {['Edge Network global', 'HTTPS automático', 'Preview por branch', 'Zero cold start'].map(f => (
            <span
              key={f}
              className="text-[10px] text-white/35 bg-white/[0.05] border border-white/[0.10] rounded-full px-3 py-1"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

function S11Demo() {
  return (
    <SlideShell
      accentFrom="rgba(59,130,246,0.8)"
      accentTo="rgba(139,92,246,0.8)"
      orbA="rgba(59,130,246,0.18)"
      orbB="rgba(139,92,246,0.14)"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-0">
          <Pill color="green">8 / 8 Requisitos</Pill>
          <Pill color="white">▲ Vercel</Pill>
          <Pill color="blue">AED2 · UFG · 2026-1</Pill>
        </div>

        <h1 className="text-[5rem] font-black text-white leading-none mb-3 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-75">
          Demonstração
        </h1>
        <p className="text-lg text-white/45 mb-12 max-w-md leading-relaxed animate-in fade-in duration-500 fill-mode-both delay-150">
          Carregue o Campus UFG, selecione dois pontos e veja o Dijkstra encontrar o caminho mínimo em tempo real.
        </p>

        <div className="flex gap-4 justify-center mb-14 animate-in fade-in zoom-in-95 duration-400 fill-mode-both delay-300">
          <Link
            href="/"
            className="px-10 py-4 rounded-2xl bg-blue-500/[0.28] border border-blue-400/55 text-blue-100 text-base font-semibold hover:bg-blue-500/[0.40] transition-all duration-200"
          >
            Abrir App →
          </Link>
          <Link
            href="/docs"
            className="px-10 py-4 rounded-2xl bg-white/[0.07] border border-white/[0.15] text-white/60 text-base font-semibold hover:bg-white/[0.12] hover:text-white/80 transition-all duration-200"
          >
            Ver Documentação
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-500">
          {[
            { label: 'Dijkstra',   value: 'O((V+E) log V)', color: 'text-blue-300' },
            { label: 'MinHeap',    value: 'O(log n)',        color: 'text-purple-300' },
            { label: 'Execução',   value: '< 10 ms',        color: 'text-green-300' },
            { label: 'Campus UFG', value: '5.000 nós',      color: 'text-orange-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.05] border border-white/[0.10] rounded-2xl px-4 py-4 text-center">
              <p className={`text-base font-bold ${color} mb-1`}>{value}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

// ── slide registry ────────────────────────────────────────────────────────────

const SLIDES: { Component: () => React.ReactNode; title: string }[] = [
  { Component: S01Cover,    title: 'Capa' },
  { Component: S02Reqs,     title: 'Requisitos' },
  { Component: S03Dijkstra, title: 'RF04 · Dijkstra' },
  { Component: S04Directed, title: 'RF06 · Dirigido' },
  { Component: S05Editing,  title: 'RF05 · Edição' },
  { Component: S06Import,   title: 'RF01 · Importação' },
  { Component: S07Stats,    title: 'RF07 · Estatísticas' },
  { Component: S08Minor,    title: 'RF02/03/08' },
  { Component: S09Arch,     title: 'Arquitetura' },
  { Component: S10Stack,    title: 'Stack · Vercel' },
  { Component: S11Demo,     title: 'Demo' },
];

// ── page ─────────────────────────────────────────────────────────────────────

export default function SlidesPage() {
  const [cur, setCur] = useState(0);
  const total = SLIDES.length;

  const prev = useCallback(() => setCur(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCur(c => Math.min(SLIDES.length - 1, c + 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        next();
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        prev();
      }
      if (e.key === 'Home') { e.preventDefault(); setCur(0); }
      if (e.key === 'End')  { e.preventDefault(); setCur(total - 1); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, total]);

  const { Component } = SLIDES[cur];

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[#070710]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* slide area */}
      <div key={cur} className="absolute inset-0 animate-in fade-in duration-200">
        <Component />
      </div>

      {/* left click zone */}
      <button
        onClick={prev}
        disabled={cur === 0}
        className="absolute left-0 top-14 bottom-14 w-16 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 disabled:pointer-events-none"
        aria-label="Slide anterior"
      >
        <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.15] transition-all duration-200">
          <ChevronLeft size={18} />
        </div>
      </button>

      {/* right click zone */}
      <button
        onClick={next}
        disabled={cur === total - 1}
        className="absolute right-0 top-14 bottom-14 w-16 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 disabled:pointer-events-none"
        aria-label="Próximo slide"
      >
        <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.15] transition-all duration-200">
          <ChevronRight size={18} />
        </div>
      </button>

      {/* bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-3 bg-gradient-to-t from-black/30 to-transparent">
        {/* dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`rounded-full transition-all duration-200 ${
                i === cur
                  ? 'w-5 h-1.5 bg-white/70'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>

        {/* slide title + counter */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/25 uppercase tracking-widest">
            {SLIDES[cur].title}
          </span>
          <span className="text-xs font-mono text-white/30">
            {cur + 1} / {total}
          </span>
        </div>

        {/* nav hint */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[10px] text-white/25 hover:text-white/55 uppercase tracking-widest transition-colors duration-150"
          >
            App
          </Link>
          <Link
            href="/docs"
            className="text-[10px] text-white/25 hover:text-white/55 uppercase tracking-widest transition-colors duration-150"
          >
            Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
