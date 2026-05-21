'use client';

import { useState } from 'react';
import { Activity, BarChart3, ChevronRight, MapPin, Network, Route, X } from 'lucide-react';
import { useGraph } from '@/hooks/useGraph';
import { GlassPanel } from './GlassPanel';
import { colors, glass } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-white/50">{label}</span>
      <span className={cn('text-sm font-medium tabular-nums', highlight ? 'text-orange-300' : 'text-white/85')}>
        {value}
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'blue' | 'orange' | 'green';
}) {
  const toneClass = {
    neutral: 'border-white/[0.09] bg-white/[0.045] text-white/90',
    blue: 'border-blue-300/20 bg-blue-500/[0.10] text-blue-100',
    orange: 'border-orange-300/25 bg-orange-500/[0.12] text-orange-100',
    green: 'border-green-300/20 bg-green-500/[0.10] text-green-100',
  }[tone];

  return (
    <div className={cn('rounded-xl border px-3 py-2.5', toneClass)}>
      <p className="text-[10px] uppercase tracking-wider text-white/42">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function StatsPanel() {
  const { dijkstraResult, sourceId, targetId, graph } = useGraph();
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);

  const hasRoute = !!dijkstraResult && !dijkstraResult.noPath;
  const routeDistance = hasRoute ? `${(dijkstraResult.cost / 1000).toFixed(3)} km` : '--';

  function showPanel() {
    setClosing(false);
    setOpen(true);
  }

  function hidePanel() {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 170);
  }

  if (!open) {
    return (
      <button
        type="button"
        title="Mostrar painel do algoritmo"
        onClick={showPanel}
        className={cn(
          'group relative flex h-12 w-12 items-center justify-center rounded-2xl',
          'border border-blue-300/25 bg-blue-500/[0.18] text-blue-100',
          'backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.14)]',
          'transition-all duration-200 hover:border-blue-200/45 hover:bg-blue-500/[0.26] hover:text-white',
          'animate-in fade-in zoom-in-90 slide-in-from-right-3'
        )}
      >
        <BarChart3 size={19} />
        <ChevronRight
          size={13}
          className="absolute -left-1 rounded-full bg-blue-400 text-slate-950 opacity-90 transition-transform group-hover:translate-x-0.5"
        />
      </button>
    );
  }

  return (
    <GlassPanel
      className={cn(
        'w-[19rem] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden p-0',
        closing
          ? 'animate-out fade-out zoom-out-95 slide-out-to-right-3 duration-150'
          : 'animate-in fade-in zoom-in-95 slide-in-from-right-4 duration-200'
      )}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.28),transparent_62%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 pb-3 pt-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-300/25 bg-blue-500/[0.16] text-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              <Route size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/92">Algoritmo</p>
              <p className="mt-0.5 truncate text-xs text-white/42">Dijkstra em tempo real</p>
            </div>
          </div>

          <button
            type="button"
            title="Esconder painel"
            onClick={hidePanel}
            className={cn(glass.iconButton, 'h-8 w-8 rounded-xl')}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard label="Distância" value={routeDistance} tone={hasRoute ? 'orange' : 'neutral'} />
            <MetricCard
              label="Caminho"
              value={hasRoute ? `${dijkstraResult.path.length} pts` : '--'}
              tone={hasRoute ? 'blue' : 'neutral'}
            />
          </div>

          {dijkstraResult === null ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3">
              <p className="text-xs leading-relaxed text-white/45">Execute o algoritmo para ver as estatísticas.</p>
            </div>
          ) : dijkstraResult.noPath ? (
            <div className="rounded-xl border border-red-300/20 bg-red-500/[0.10] px-3 py-3">
              <p className="text-xs font-medium leading-relaxed text-red-200">
                Não há caminho entre os vértices selecionados.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-black/10 px-3 py-1 divide-y divide-white/[0.07]">
              <StatRow label="Tempo" value={`${dijkstraResult.timeMs.toFixed(2)} ms`} />
              <StatRow label="Nós explorados" value={String(dijkstraResult.explored)} />
              <StatRow label="Custo total" value={routeDistance} highlight />
              <StatRow label="Vértices no caminho" value={String(dijkstraResult.path.length)} />
            </div>
          )}

          {(sourceId || targetId) && (
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <MapPin size={12} className="text-white/38" />
                <p className={glass.label}>Seleção</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-1 divide-y divide-white/[0.07]">
                {sourceId && (
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-xs text-white/50">Origem</span>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-lg border text-green-300"
                      style={{ backgroundColor: `${colors.nodeSource}2a`, borderColor: `${colors.nodeSource}66` }}
                    >
                      {sourceId}
                    </span>
                  </div>
                )}
                {targetId && (
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-xs text-white/50">Destino</span>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-lg border text-red-300"
                      style={{ backgroundColor: `${colors.nodeTarget}2a`, borderColor: `${colors.nodeTarget}66` }}
                    >
                      {targetId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Network size={12} className="text-white/38" />
              <p className={glass.label}>Grafo</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="Vértices" value={String(graph.nodeCount)} tone="green" />
              <MetricCard label="Arestas" value={String(graph.edgeCount)} />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
            <Activity size={13} className={hasRoute ? 'text-green-300' : 'text-white/35'} />
            <div className="min-w-0 flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className={cn('h-full rounded-full transition-all duration-300', hasRoute ? 'bg-green-300' : 'bg-white/20')}
                  style={{ width: hasRoute ? '100%' : dijkstraResult?.noPath ? '35%' : '12%' }}
                />
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-white/38">
              {hasRoute ? 'Pronto' : dijkstraResult?.noPath ? 'Falha' : 'Ocioso'}
            </span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
