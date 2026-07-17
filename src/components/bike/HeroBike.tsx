"use client";

import { BikeSvg } from "./BikeSvg";
import { useBike } from "./BikeContext";

export function HeroBike() {
  const { bike, hasCustomized, openCustomizer } = useBike();

  return (
    <div className="flex flex-col items-center gap-1">
      <BikeSvg config={bike} className="w-40 md:w-52" />
      {/* platform */}
      <div className="h-1 w-44 rounded-full bg-ink/70 md:w-56" />
      <p className="mt-2 font-serif text-sm italic text-ink-soft">
        {hasCustomized && bike.signature ? `${bike.signature}’s visitor bike` : "Your visitor bike"}
      </p>
      <button
        type="button"
        onClick={openCustomizer}
        className="mt-1 rounded-full border border-ink/25 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-ink hover:bg-ink hover:text-paper"
      >
        Customize
      </button>
    </div>
  );
}
