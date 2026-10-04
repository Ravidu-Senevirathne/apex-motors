"use client";
import { useSyncExternalStore } from "react";

export const PAINTS = [
  { name: "Inferno Red", hex: "#c8102e", price: 0 },
  { name: "Obsidian", hex: "#0d0e12", price: 1200 },
  { name: "Glacier Pearl", hex: "#e9ecef", price: 1800 },
  { name: "Volt Lime", hex: "#a8e10c", price: 2400 },
  { name: "Abyss Blue", hex: "#0a3d91", price: 1500 },
  { name: "Solar Orange", hex: "#ff5a1f", price: 2100 },
] as const;

export const RIMS = [
  { name: "Gloss Black", hex: "#141414", price: 0 },
  { name: "Forged Silver", hex: "#c9ccd1", price: 2900 },
  { name: "Bronze", hex: "#a0773f", price: 3400 },
] as const;

type State = { paint: number; rim: number };

let state: State = { paint: 0, rim: 0 };
const listeners = new Set<() => void>();

export const carStore = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useCar() {
  return useSyncExternalStore(carStore.subscribe, carStore.get, carStore.get);
}
