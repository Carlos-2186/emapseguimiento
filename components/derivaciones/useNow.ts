'use client';

import { useSyncExternalStore } from 'react';

const TICK_MS = 60_000;

let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
let kickoff: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  current = Date.now();
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  if (timer === null) {
    timer = setInterval(emit, TICK_MS);
    kickoff = setTimeout(emit, 0);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
      if (kickoff !== null) {
        clearTimeout(kickoff);
        kickoff = null;
      }
    }
  };
};

const getSnapshot = () => current;
const getServerSnapshot = () => current;

/**
 * Returns the current timestamp, or `null` until the component has mounted on
 * the client. Time-derived UI (countdowns, overdue state) must stay behind this
 * `null` guard so the server-rendered markup and the first client render match.
 */
export function useNow(): number | null {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return now === 0 ? null : now;
}
