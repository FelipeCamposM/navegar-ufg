'use client';

import { glass } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function GlassPanel({ children, className, hover = false, padding = true }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative',
        glass.panel,
        hover && glass.panelHover,
        padding && 'p-4',
        className
      )}
    >
      {/* Specular highlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.10] via-transparent to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlassPanelSm({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative', glass.panelSm, className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.09] via-transparent to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
