"use client";

import { useEffect, useState } from "react";
import { BikeSvg } from "@/components/bike/BikeSvg";
import { useBike } from "@/components/bike/BikeContext";
import { fetchPeloton, hasSupabase } from "@/lib/peloton";
import type { PelotonBike } from "@/lib/bike-types";

const RIDE_LEADER: PelotonBike = {
  id: "ride-leader",
  createdAt: "",
  frame: "road",
  wheels: "deep",
  paint: "#2fa872",
  accent: "#1c1b18",
  decal: "stripes",
  signature: "Neel",
};

export default function Peloton() {
  const { openCustomizer, hasCustomized } = useBike();
  const [bikes, setBikes] = useState<PelotonBike[] | null>(null);

  useEffect(() => {
    fetchPeloton().then(setBikes);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-serif text-5xl italic">The Peloton</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Every visitor who customized a bike rides here. {" "}
        {!hasCustomized && (
          <button
            type="button"
            onClick={openCustomizer}
            className="underline decoration-ink/30 hover:decoration-ink"
          >
            Build yours and join the ride.
          </button>
        )}
      </p>
      {!hasSupabase && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
          Running locally — bikes are stored in this browser until Supabase is connected.
        </p>
      )}

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <figure className="rounded-xl border-2 border-accent bg-paper p-4">
          <BikeSvg config={RIDE_LEADER} className="w-full" />
          <figcaption className="mt-2 flex items-baseline justify-between">
            <span className="font-script text-lg">Neel</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
              ride leader
            </span>
          </figcaption>
        </figure>

        {bikes === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-ink/10 bg-ink/5" />
          ))}

        {bikes?.map((b) => (
          <figure key={b.id} className="rounded-xl border border-ink/10 bg-paper p-4">
            <BikeSvg config={b} className="w-full" />
            <figcaption className="mt-2 flex items-baseline justify-between">
              <span className="font-script text-lg">{b.signature || "Anonymous rider"}</span>
              {b.createdAt && (
                <span className="font-mono text-[9px] text-ink-soft">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {bikes?.length === 0 && (
        <p className="mt-8 text-center font-serif italic text-ink-soft">
          The peloton is forming — be the first wheel.
        </p>
      )}
    </div>
  );
}
