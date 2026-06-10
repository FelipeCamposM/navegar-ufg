'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import type Cytoscape from 'cytoscape';
import { Toolbar } from '@/components/Toolbar';
import { StatsPanel } from '@/components/StatsPanel';
import { NotificationToast } from '@/components/NotificationToast';
import { CompassOverlay } from '@/components/CompassOverlay';

const GraphCanvas = dynamic(
  () => import('@/components/GraphCanvas').then(m => m.GraphCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#070710]" />,
  }
);

export function GraphApp() {
  const cyRef = useRef<Cytoscape.Core | null>(null);

  return (
    <main className="bg-orbs relative w-screen h-screen overflow-hidden bg-[#070710]">
      <GraphCanvas cyRef={cyRef} />
      <Toolbar cyRef={cyRef} />
      <div className="fixed right-4 top-32 z-10">
        <StatsPanel />
      </div>
      <CompassOverlay />
      <NotificationToast />
    </main>
  );
}
