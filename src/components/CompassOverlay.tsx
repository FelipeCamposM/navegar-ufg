'use client';

export function CompassOverlay() {
  return (
    <div
      className="fixed bottom-5 right-5 z-20 flex h-[74px] w-[74px] items-center justify-center rounded-full border border-white/15 bg-black/35 shadow-[0_10px_30px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
      aria-label="Bussola"
      title="Norte"
    >
      <div className="absolute inset-2 rounded-full border border-white/10 bg-white/[0.04]" />
      <div className="absolute inset-[15px] rounded-full border border-white/[0.07]" />

      <span className="absolute top-[6px] text-[10px] font-bold leading-none text-red-200">N</span>
      <span className="absolute bottom-[6px] text-[9px] font-semibold leading-none text-white/45">S</span>
      <span className="absolute right-[7px] text-[9px] font-semibold leading-none text-white/45">E</span>
      <span className="absolute left-[7px] text-[9px] font-semibold leading-none text-white/45">W</span>

      <div className="relative h-11 w-11">
        <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[22px] border-x-transparent border-b-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.45)]" />
        <div className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[18px] border-x-transparent border-t-white/45" />
        <div className="absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[4px] border-r-[17px] border-y-transparent border-r-white/30" />
        <div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[4px] border-l-[17px] border-y-transparent border-l-white/30" />

        <div className="absolute left-[7px] top-[7px] h-0 w-0 -rotate-45 border-x-[3px] border-b-[12px] border-x-transparent border-b-white/18" />
        <div className="absolute right-[7px] top-[7px] h-0 w-0 rotate-45 border-x-[3px] border-b-[12px] border-x-transparent border-b-white/18" />
        <div className="absolute bottom-[7px] left-[7px] h-0 w-0 -rotate-[135deg] border-x-[3px] border-b-[12px] border-x-transparent border-b-white/18" />
        <div className="absolute bottom-[7px] right-[7px] h-0 w-0 rotate-[135deg] border-x-[3px] border-b-[12px] border-x-transparent border-b-white/18" />

        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[#101827] shadow-[0_0_0_3px_rgba(255,255,255,0.04)]" />
      </div>
    </div>
  );
}
