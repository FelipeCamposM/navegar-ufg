export const glass = {
  panel:
    'backdrop-blur-2xl saturate-200 bg-white/[0.07] border border-white/[0.13] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.15)]',

  panelHover:
    'hover:bg-white/[0.11] hover:border-white/[0.22] transition-all duration-300',

  panelSm:
    'backdrop-blur-xl saturate-150 bg-white/[0.07] border border-white/[0.13] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.10)]',

  button:
    'inline-flex items-center justify-center gap-2 backdrop-blur-sm bg-white/[0.09] border border-white/[0.18] rounded-xl px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.16] hover:border-white/[0.28] transition-all duration-200 cursor-pointer select-none',

  buttonActive:
    'bg-blue-500/[0.28] border-blue-400/[0.50] text-blue-200 hover:bg-blue-500/[0.38]',

  buttonDanger:
    'bg-red-500/[0.20] border-red-400/[0.40] text-red-300 hover:bg-red-500/[0.30] hover:border-red-400/[0.55]',

  buttonSuccess:
    'bg-green-500/[0.25] border-green-400/[0.45] text-green-200 hover:bg-green-500/[0.35]',

  buttonDisabled:
    'opacity-40 cursor-not-allowed pointer-events-none',

  iconButton:
    'inline-flex items-center justify-center w-8 h-8 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-lg text-white/70 hover:text-white hover:bg-white/[0.15] hover:border-white/[0.25] transition-all duration-200 cursor-pointer',

  iconButtonActive:
    'bg-blue-500/[0.28] border-blue-400/[0.50] text-blue-200',

  input:
    'w-full bg-white/[0.07] border border-white/[0.14] rounded-lg px-3 py-1.5 text-sm text-white/90 placeholder:text-white/35 backdrop-blur-md outline-none focus:ring-1 focus:ring-white/25 focus:border-white/28 transition-all duration-200',

  label: 'text-xs font-medium text-white/50 uppercase tracking-wider',

  divider: 'w-px h-5 bg-white/[0.15]',

  badge:
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/[0.10] border border-white/[0.15] text-white/70',
} as const;

export const colors = {
  nodeDefault: '#4A90D9',
  nodeSource: '#27AE60',
  nodeTarget: '#E74C3C',
  nodePath: '#F39C12',
  nodeVisited: '#6B7280',
  edgeDefault: '#4B5563',
  edgePath: '#F39C12',
  edgeArrow: '#6B7280',
} as const;
