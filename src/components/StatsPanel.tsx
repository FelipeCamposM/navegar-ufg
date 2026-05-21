'use client';

import { useGraph } from '@/hooks/useGraph';
import { GlassPanel } from './GlassPanel';
import { glass } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-white/50">{label}</span>
      <span className={cn('text-sm font-medium tabular-nums', highlight ? 'text-orange-300' : 'text-white/85')}>
        {value}
      </span>
    </div>
  );
}

export function StatsPanel() {
  const { dijkstraResult, sourceId, targetId, graph } = useGraph();

  return (
    <GlassPanel className="w-64">
      <div className="flex flex-col gap-3">
        <div>
          <p className={cn(glass.label, 'mb-2')}>Algoritmo</p>
          {dijkstraResult === null ? (
            <p className="text-xs text-white/40 italic">Execute o algoritmo para ver as estatísticas.</p>
          ) : dijkstraResult.noPath ? (
            <p className="text-xs text-red-300 font-medium">
              Não há caminho entre os vértices selecionados.
            </p>
          ) : (
            <div className="divide-y divide-white/[0.07]">
              <StatRow label="Tempo" value={`${dijkstraResult.timeMs.toFixed(2)} ms`} />
              <StatRow label="Nós explorados" value={String(dijkstraResult.explored)} />
              <StatRow
                label="Custo total"
                value={`${(dijkstraResult.cost / 1000).toFixed(3)} km`}
                highlight
              />
              <StatRow label="Vértices no caminho" value={String(dijkstraResult.path.length)} />
            </div>
          )}
        </div>

        {(sourceId || targetId) && (
          <div>
            <p className={cn(glass.label, 'mb-2')}>Seleção</p>
            <div className="divide-y divide-white/[0.07]">
              {sourceId && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-white/50">Origem</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-green-500/20 border border-green-400/30 text-green-300">
                    {sourceId}
                  </span>
                </div>
              )}
              {targetId && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-white/50">Destino</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 border border-red-400/30 text-red-300">
                    {targetId}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <p className={cn(glass.label, 'mb-2')}>Grafo</p>
          <div className="divide-y divide-white/[0.07]">
            <StatRow label="Vértices" value={String(graph.nodeCount)} />
            <StatRow label="Arestas" value={String(graph.edgeCount)} />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
