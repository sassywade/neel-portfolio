"use client";

import { useEffect, useState } from "react";
import { BikeSvg } from "./BikeSvg";
import { useBike } from "./BikeContext";
import { DECALS, FRAMES, PAINTS, WHEELS, type BikeConfig } from "@/lib/bike-types";

function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[11px] uppercase tracking-widest text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              value === o.id
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-transparent hover:border-ink/60"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Swatches({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[11px] uppercase tracking-widest text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {PAINTS.map((p) => (
          <button
            key={p.id}
            type="button"
            title={p.label}
            aria-label={p.label}
            onClick={() => onChange(p.id)}
            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
              value === p.id ? "border-ink" : "border-ink/15"
            }`}
            style={{ backgroundColor: p.id }}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function CustomizerModal() {
  const { customizerOpen } = useBike();
  // Mounting fresh each open lets draft state initialize from the saved bike.
  if (!customizerOpen) return null;
  return <CustomizerDialog />;
}

function CustomizerDialog() {
  const { bike, closeCustomizer, saveBike } = useBike();
  const [draft, setDraft] = useState<BikeConfig>(bike);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCustomizer();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [closeCustomizer]);

  const set = <K extends keyof BikeConfig>(key: K, value: BikeConfig[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={closeCustomizer}
      role="dialog"
      aria-modal="true"
      aria-label="Customize your visitor bike"
    >
      <div
        className="grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-2xl border border-ink/10 bg-paper shadow-2xl md:grid-cols-[1.1fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center border-b border-ink/10 p-8 md:border-b-0 md:border-r">
          <BikeSvg config={draft} className="w-full max-w-[340px]" />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
            {FRAMES.find((f) => f.id === draft.frame)?.blurb}
          </p>
        </div>
        <div className="flex flex-col gap-6 p-8">
          <div className="flex items-start justify-between">
            <h2 className="font-serif text-2xl italic">Build your bike</h2>
            <button
              type="button"
              onClick={closeCustomizer}
              aria-label="Close"
              className="-mr-2 -mt-1 rounded-full p-2 text-ink-soft hover:text-ink"
            >
              ✕
            </button>
          </div>
          <OptionRow label="Frame" options={FRAMES} value={draft.frame} onChange={(v) => set("frame", v)} />
          <OptionRow label="Wheels" options={WHEELS} value={draft.wheels} onChange={(v) => set("wheels", v)} />
          <Swatches label="Paint" value={draft.paint} onChange={(v) => set("paint", v)} />
          <Swatches label="Decal color" value={draft.accent} onChange={(v) => set("accent", v)} />
          <OptionRow label="Decals" options={DECALS} value={draft.decal} onChange={(v) => set("decal", v)} />
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              Sign it (optional)
            </span>
            <input
              type="text"
              maxLength={24}
              value={draft.signature}
              onChange={(e) => set("signature", e.target.value)}
              placeholder="Your name on the top tube"
              className="w-full rounded-lg border border-ink/20 bg-transparent px-3 py-2 font-script text-lg outline-none focus:border-ink"
            />
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await saveBike(draft);
              } finally {
                setSaving(false);
              }
            }}
            className="mt-auto rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {saving ? "Rolling out…" : "Save & join the Peloton"}
          </button>
        </div>
      </div>
    </div>
  );
}
