"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { BikeConfig } from "@/lib/bike-types";
import { DEFAULT_BIKE } from "@/lib/bike-types";
import { joinPeloton, loadMyBike } from "@/lib/peloton";

interface BikeContextValue {
  bike: BikeConfig;
  hasCustomized: boolean;
  customizerOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  saveBike: (config: BikeConfig) => Promise<void>;
}

const BikeContext = createContext<BikeContextValue | null>(null);

export function BikeProvider({ children }: { children: React.ReactNode }) {
  const [bike, setBike] = useState<BikeConfig>(DEFAULT_BIKE);
  const [hasCustomized, setHasCustomized] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount; reading it during render
    // would mismatch the server-rendered default bike.
    const saved = loadMyBike();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBike(saved);
      setHasCustomized(true);
    }
  }, []);

  const saveBike = async (config: BikeConfig) => {
    setBike(config);
    setHasCustomized(true);
    setCustomizerOpen(false);
    await joinPeloton(config);
  };

  return (
    <BikeContext.Provider
      value={{
        bike,
        hasCustomized,
        customizerOpen,
        openCustomizer: () => setCustomizerOpen(true),
        closeCustomizer: () => setCustomizerOpen(false),
        saveBike,
      }}
    >
      {children}
    </BikeContext.Provider>
  );
}

export function useBike() {
  const ctx = useContext(BikeContext);
  if (!ctx) throw new Error("useBike must be used within BikeProvider");
  return ctx;
}
