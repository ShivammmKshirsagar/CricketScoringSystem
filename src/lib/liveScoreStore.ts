import { ScoreState } from "@/types/score";

type LiveScoreSnapshot = {
  matchId: string;
  currentInnings: 1 | 2;
  innings1Score: ScoreState;
  innings2Score: ScoreState;
  updatedAt: string;
};

const STORAGE_PREFIX = "cricket_live_score:";
const EVENT_NAME = "cricket_live_score_changed";

// Cache for getLiveScore to prevent infinite loops
const cache = new Map<string, { snapshot: LiveScoreSnapshot | null; raw: string | null }>();

function storageKey(matchId: string) {
  return `${STORAGE_PREFIX}${matchId}`;
}

export function getLiveScore(matchId: string): LiveScoreSnapshot | null {
  const raw = localStorage.getItem(storageKey(matchId));
  const cached = cache.get(matchId);
  
  // Return cached result if data hasn't changed
  if (cached && cached.raw === raw) {
    return cached.snapshot;
  }
  
  // Parse new data
  let snapshot: LiveScoreSnapshot | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as LiveScoreSnapshot;
      if (parsed && parsed.matchId === matchId) {
        snapshot = parsed;
      }
    } catch {
      snapshot = null;
    }
  }
  
  // Cache the result
  cache.set(matchId, { snapshot, raw });
  
  return snapshot;
}

export function saveLiveScore(snapshot: Omit<LiveScoreSnapshot, "updatedAt">): void {
  const next: LiveScoreSnapshot = {
    ...snapshot,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(snapshot.matchId), JSON.stringify(next));
  // Clear cache when data changes
  cache.delete(snapshot.matchId);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function clearLiveScore(matchId: string): void {
  localStorage.removeItem(storageKey(matchId));
  // Clear cache when data is cleared
  cache.delete(matchId);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeLiveScore(callback: () => void): () => void {
  const onChange = () => {
    // Clear all caches when storage changes
    cache.clear();
    callback();
  };
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export type { LiveScoreSnapshot };
