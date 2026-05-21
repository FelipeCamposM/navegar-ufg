'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  Upload, Map, Trash2, MousePointer2, CirclePlus, Spline,
  Move, Eraser, Circle, Tag, Zap, X, Undo2, Redo2,
  Camera, ArrowLeftRight, ArrowRight, Loader2, Navigation, Play, Square, Navigation2, BookOpen, Presentation,
} from 'lucide-react';
import { useGraph } from '@/hooks/useGraph';
import { glass, colors } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import { parseOSM } from '@/lib/parsers/osmParser';
import { parsePoly } from '@/lib/parsers/polyParser';
import { parseTxt } from '@/lib/parsers/txtParser';
import type { ToolMode } from '@/lib/graph/types';
import type Cytoscape from 'cytoscape';
import { copyGraphToClipboard } from '@/lib/utils/clipboard';

interface ToolbarProps {
  cyRef: React.RefObject<Cytoscape.Core | null>;
}

const MODES: { mode: ToolMode; Icon: React.ElementType; title: string }[] = [
  { mode: 'select',    Icon: MousePointer2, title: 'Selecionar ponto (S)' },
  { mode: 'addVertex', Icon: CirclePlus,    title: 'Adicionar vértice (V)' },
  { mode: 'addEdge',   Icon: Spline,        title: 'Adicionar aresta (E)' },
  { mode: 'move',      Icon: Move,          title: 'Mover vértice (M)' },
  { mode: 'delete',    Icon: Eraser,        title: 'Excluir elemento (Del)' },
];

const PRESET_MAPS = [
  { label: 'UFG .poly', url: '/maps/campus-ufg.poly', ext: 'poly', title: 'Campus UFG — .poly (rápido, coordenadas cartesianas)' },
  { label: 'UFG .osm',  url: '/maps/campus-ufg.osm',  ext: 'osm',  title: 'Campus UFG — .osm (OpenStreetMap, distâncias reais)' },
] as const;

function Divider() {
  return <div className={glass.divider} />;
}

interface TipButtonProps {
  title: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
  className?: string;
}

function TipButton({ title, onClick, active, disabled, danger, children, className }: TipButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        glass.button,
        active && glass.buttonActive,
        danger && glass.buttonDanger,
        disabled && glass.buttonDisabled,
        className
      )}
    >
      {children}
    </button>
  );
}

export function Toolbar({ cyRef }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  const {
    graph,
    mode, setMode, graphType, setGraphType,
    showLabels, setShowLabels,
    showNodes, setShowNodes,
    showRouteArrows, setShowRouteArrows,
    sourceId, targetId, dijkstraResult,
    runDijkstra, clearSelection, clearGraph,
    importGraph, setNotification,
    past, future, undo, redo,
    isNavigating, startNavigation, stopNavigation,
  } = useGraph();

  async function handleLoadPreset(map: typeof PRESET_MAPS[number]) {
    if (loadingPreset) return;
    setLoadingPreset(map.ext);
    try {
      const res = await fetch(map.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();

      const result = map.ext === 'osm' ? parseOSM(content) : parsePoly(content);

      if (result.error) { setNotification({ message: result.error, type: 'error' }); return; }

      importGraph(result.nodes, result.edges);
      setNotification({
        message: `Mapa UFG carregado: ${result.nodes.length} vértices, ${result.edges.length} arestas`,
        type: 'success',
      });
    } catch (err) {
      setNotification({ message: `Erro ao carregar mapa: ${err}`, type: 'error' });
    } finally {
      setLoadingPreset(null);
    }
  }

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase();
      const result =
        ext === 'osm' || ext === 'xml' ? parseOSM(content) :
        ext === 'poly' ? parsePoly(content) : parseTxt(content);

      if (result.error) { setNotification({ message: result.error, type: 'error' }); return; }

      importGraph(result.nodes, result.edges);
      setNotification({
        message: `Importado: ${result.nodes.length} vértices, ${result.edges.length} arestas`,
        type: 'success',
      });
    } catch (err) {
      setNotification({ message: `Erro ao importar: ${err}`, type: 'error' });
    }
    e.target.value = '';
  }

  async function handleCopyImage() {
    if (!cyRef.current) return;
    try {
      await copyGraphToClipboard(cyRef.current);
      setNotification({ message: 'Imagem copiada para a área de transferência!', type: 'success' });
    } catch {
      setNotification({ message: 'Não foi possível copiar a imagem.', type: 'error' });
    }
  }

  const canCalculate = !!sourceId && !!targetId;

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".osm,.poly,.txt,.xml" className="hidden" onChange={handleFileImport} />

      <div className="fixed top-0 left-0 right-0 z-20 px-4 py-3 pointer-events-none">
        <div className={cn('pointer-events-auto relative flex items-center gap-2 px-4 py-2', glass.panel, 'flex-wrap')}>
          {/* Specular highlight */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />

          {/* Title */}
          <div className="relative z-10 flex items-center gap-2 mr-1">
            <Navigation size={14} className="text-blue-400" />
            <span className="text-sm font-semibold text-white/90 tracking-wide">NAVEGAR</span>
            <span className="text-[10px] text-white/35 uppercase tracking-widest hidden sm:block">AED2 · UFG</span>
          </div>

          {/* Contextual hint */}
          {mode === 'select' && !sourceId && graph.nodeCount > 0 && (
            <span className="relative z-10 hidden xl:block text-[10px] text-white/30 italic">
              clique no mapa para definir origem
            </span>
          )}
          {mode === 'select' && sourceId && !targetId && (
            <span className="relative z-10 hidden xl:block text-[10px] text-green-400/55 italic">
              origem definida · clique para destino
            </span>
          )}

          <Divider />

          {/* Import / Presets / Clear */}
          <div className="relative z-10 flex items-center gap-1.5">
            <TipButton title="Importar mapa (.osm, .poly, .txt)" onClick={() => fileInputRef.current?.click()}>
              <Upload size={13} />
              <span className="text-xs hidden sm:inline">Importar</span>
            </TipButton>

            {PRESET_MAPS.map(map => (
              <TipButton key={map.ext} title={map.title} disabled={!!loadingPreset} onClick={() => handleLoadPreset(map)}>
                {loadingPreset === map.ext
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Map size={13} />
                }
                <span className="text-xs hidden md:inline">
                  {loadingPreset === map.ext ? 'Carregando…' : map.label}
                </span>
              </TipButton>
            ))}

            <TipButton title="Limpar grafo" danger onClick={clearGraph}>
              <Trash2 size={13} />
            </TipButton>
          </div>

          <Divider />

          {/* Mode buttons */}
          <div className="relative z-10 flex items-center gap-1">
            {MODES.map(({ mode: m, Icon, title }) => (
              <TipButton
                key={m}
                title={title}
                active={mode === m}
                onClick={() => setMode(m)}
                className="w-8 h-8 px-0"
              >
                <Icon size={14} />
              </TipButton>
            ))}
          </div>

          <Divider />

          {/* Graph type */}
          <div className="relative z-10 flex items-center gap-1">
            <TipButton
              title="Grafo não-direcionado (bidirecional)"
              active={graphType === 'undirected'}
              onClick={() => setGraphType('undirected')}
              className="text-xs gap-1.5"
            >
              <ArrowLeftRight size={13} />
              <span className="hidden lg:inline">Bidirecional</span>
            </TipButton>
            <TipButton
              title="Grafo direcionado (sentido único)"
              active={graphType === 'directed'}
              onClick={() => setGraphType('directed')}
              className="text-xs gap-1.5"
            >
              <ArrowRight size={13} />
              <span className="hidden lg:inline">Direcionado</span>
            </TipButton>
          </div>

          <Divider />

          {/* View toggles */}
          <div className="relative z-10 flex items-center gap-1">
            <TipButton
              title="Mostrar/ocultar vértices (interseções)"
              active={showNodes}
              onClick={() => setShowNodes(!showNodes)}
              className="text-xs gap-1.5"
            >
              <Circle size={13} />
              <span className="hidden lg:inline">Vértices</span>
            </TipButton>
            <TipButton
              title="Mostrar/ocultar rótulos de distância"
              active={showLabels}
              onClick={() => setShowLabels(!showLabels)}
              className="text-xs gap-1.5"
            >
              <Tag size={13} />
              <span className="hidden lg:inline">Pesos</span>
            </TipButton>
            <TipButton
              title="Mostrar sentido das ruas no trajeto (mão da via)"
              active={showRouteArrows}
              onClick={() => setShowRouteArrows(!showRouteArrows)}
              className="text-xs gap-1.5"
            >
              <Navigation2 size={13} />
              <span className="hidden lg:inline">Setas</span>
            </TipButton>
          </div>

          <Divider />

          {/* Route actions */}
          <div className="relative z-10 flex items-center gap-1.5">
            <TipButton
              title={canCalculate ? 'Recalcular rota' : 'Selecione origem e destino no mapa'}
              disabled={!canCalculate}
              onClick={runDijkstra}
              className={cn('gap-1.5', canCalculate && 'bg-blue-500/20 border-blue-400/40 text-blue-200')}
            >
              <Zap size={13} />
              <span className="text-xs hidden sm:inline">Recalcular</span>
            </TipButton>
            <TipButton
              title={isNavigating ? 'Parar navegação (Esc)' : 'Iniciar navegação pela rota'}
              disabled={!dijkstraResult || !!dijkstraResult.noPath}
              onClick={isNavigating ? stopNavigation : startNavigation}
              className={cn('gap-1.5', isNavigating && 'bg-green-500/20 border-green-400/40 text-green-200')}
            >
              {isNavigating ? <Square size={13} /> : <Play size={13} />}
              <span className="text-xs hidden sm:inline">{isNavigating ? 'Parar' : 'Navegar'}</span>
            </TipButton>
            <TipButton
              title="Limpar rota (Esc)"
              disabled={!sourceId && !targetId}
              onClick={clearSelection}
              className="gap-1.5"
            >
              <X size={13} />
              <span className="text-xs hidden sm:inline">Rota</span>
            </TipButton>
          </div>

          <Divider />

          {/* History + Copy */}
          <div className="relative z-10 flex items-center gap-1">
            <TipButton title="Desfazer (Ctrl+Z)" disabled={past.length === 0} onClick={undo} className="w-8 h-8 px-0">
              <Undo2 size={13} />
            </TipButton>
            <TipButton title="Refazer (Ctrl+Y)" disabled={future.length === 0} onClick={redo} className="w-8 h-8 px-0">
              <Redo2 size={13} />
            </TipButton>
            <TipButton title="Copiar imagem do grafo (PNG)" onClick={handleCopyImage} className="w-8 h-8 px-0">
              <Camera size={13} />
            </TipButton>
          </div>

          {/* Docs + Slides links */}
          <div className="relative z-10 flex items-center gap-1">
            <Link
              href="/slides"
              title="Slides de apresentação"
              className={cn(glass.button, 'w-8 h-8 px-0')}
            >
              <Presentation size={13} />
            </Link>
            <Link
              href="/docs"
              title="Documentação do projeto"
              className={cn(glass.button, 'w-8 h-8 px-0')}
            >
              <BookOpen size={13} />
            </Link>
          </div>

          {/* Color legend */}
          <div className="relative z-10 ml-auto hidden xl:flex items-center gap-3">
            {[
              { color: colors.nodeSource, label: 'A — Origem' },
              { color: colors.nodeTarget, label: 'B — Destino' },
              { color: '#2563EB',          label: 'Rota' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
