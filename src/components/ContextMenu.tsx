'use client';

import { useEffect, useRef } from 'react';
import { useGraph } from '@/hooks/useGraph';
import { glass } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export interface ContextMenuState {
  x: number;
  y: number;
  targetId: string;
  targetType: 'node' | 'edge';
}

interface ContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
}

export function ContextMenu({ state, onClose }: ContextMenuProps) {
  const { removeNode, removeEdge, updateEdgeDirection, graph } = useGraph();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const menuItems =
    state.targetType === 'node'
      ? [
          {
            label: 'Remover Vértice',
            danger: true,
            action: () => { removeNode(state.targetId); onClose(); },
          },
        ]
      : [
          {
            label: 'Remover Aresta',
            danger: true,
            action: () => { removeEdge(state.targetId); onClose(); },
          },
          {
            label: 'Tornar Direcionada',
            danger: false,
            action: () => { updateEdgeDirection(state.targetId, true); onClose(); },
          },
          {
            label: 'Tornar Bidirecional',
            danger: false,
            action: () => { updateEdgeDirection(state.targetId, false); onClose(); },
          },
        ];

  return (
    <div
      ref={ref}
      style={{ top: state.y, left: state.x }}
      className={cn(
        'fixed z-50 min-w-44',
        glass.panel,
        'p-1.5'
      )}
    >
      {/* Specular highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.10] via-transparent to-transparent"
      />
      <div className="relative z-10 flex flex-col gap-0.5">
        {menuItems.map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              'context-menu-item w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150',
              item.danger
                ? 'text-red-300 hover:bg-red-500/15'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
