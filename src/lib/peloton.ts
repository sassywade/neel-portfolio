import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BikeConfig, PelotonBike } from "./bike-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
if (url && anonKey) {
  client = createClient(url, anonKey);
}

export const hasSupabase = Boolean(client);

const LOCAL_PELOTON_KEY = "peloton-bikes";
const LOCAL_MINE_KEY = "my-visitor-bike";

/* Local fallback keeps the same shape as the Supabase-backed store so the
   swap is invisible to the UI. */
function readLocalPeloton(): PelotonBike[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_PELOTON_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function loadMyBike(): BikeConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_MINE_KEY);
    return raw ? (JSON.parse(raw) as BikeConfig) : null;
  } catch {
    return null;
  }
}

export function saveMyBikeLocally(config: BikeConfig) {
  window.localStorage.setItem(LOCAL_MINE_KEY, JSON.stringify(config));
}

export async function joinPeloton(config: BikeConfig): Promise<void> {
  saveMyBikeLocally(config);
  if (client) {
    await client.from("bikes").insert({
      signature: config.signature || null,
      frame_type: config.frame,
      wheel_type: config.wheels,
      paint: config.paint,
      accent_color: config.accent,
      decal: config.decal,
    });
    return;
  }
  const bikes = readLocalPeloton();
  bikes.unshift({ ...config, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  window.localStorage.setItem(LOCAL_PELOTON_KEY, JSON.stringify(bikes.slice(0, 500)));
}

export async function fetchPeloton(): Promise<PelotonBike[]> {
  if (client) {
    const { data, error } = await client
      .from("bikes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return [];
    return data.map((row) => ({
      id: String(row.id),
      createdAt: row.created_at,
      frame: row.frame_type,
      wheels: row.wheel_type,
      paint: row.paint,
      accent: row.accent_color,
      decal: row.decal,
      signature: row.signature ?? "",
    }));
  }
  return readLocalPeloton();
}
