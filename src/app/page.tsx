'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import type Cytoscape from 'cytoscape';
import { Toolbar } from '@/components/Toolbar';
import { StatsPanel } from '@/components/StatsPanel';
import { NotificationToast } from '@/components/NotificationToast';
import { CompassOverlay } from '@/components/CompassOverlay';

// Cytoscape requires window — must be loaded client-side only
const GraphCanvas = dynamic(
  () => import('@/components/GraphCanvas').then(m => m.GraphCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#070710]" />,
  }
);

export default function Home() {
  const cyRef = useRef<Cytoscape.Core | null>(null);

  return (
    <main className="bg-orbs relative w-screen h-screen overflow-hidden bg-[#070710]">
      {/* Canvas fills entire screen */}
      <GraphCanvas cyRef={cyRef} />

      {/* Toolbar floats at top */}
      <Toolbar cyRef={cyRef} />

      {/* Stats panel floats at right */}
      <div className="fixed right-4 top-32 z-10">
        <StatsPanel />
      </div>

      <CompassOverlay />

      {/* Notification */}
      <NotificationToast />
    </main>
  );
}
