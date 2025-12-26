import { Match } from "@/types/match";

type StoredMatch = Omit<Match, "createdAt" | "scheduledAt"> & {
  createdAt: string;
  scheduledAt?: string;
};

const STORAGE_KEY = "cricket_matches";
const EVENT_NAME = "cricket_matches_changed";

// Cache for listMatches to prevent infinite loops
let cachedMatches: Match[] | null = null;
let cachedRawData: string | null = null;

function toStored(match: Match): StoredMatch {
  return {
    ...match,
    createdAt: match.createdAt.toISOString(),
    scheduledAt: match.scheduledAt ? match.scheduledAt.toISOString() : undefined,
  };
}

function fromStored(match: StoredMatch): Match | null {
  try {
    return {
      ...match,
      createdAt: new Date(match.createdAt),
      scheduledAt: match.scheduledAt ? new Date(match.scheduledAt) : undefined,
      archived: match.archived ?? false,
    };
  } catch (error) {
    console.error("Error parsing stored match:", error);
    return null;
  }
}

function readAllStored(): StoredMatch[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredMatch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAllStored(matches: StoredMatch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  // Clear cache when data changes
  cachedMatches = null;
  cachedRawData = null;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function listMatches(): Match[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  
  // Return cached result if data hasn't changed
  if (cachedMatches !== null && cachedRawData === raw) {
    return cachedMatches;
  }
  
  // Parse and cache new data
  const stored = raw ? (() => {
    try {
      const parsed = JSON.parse(raw) as StoredMatch[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })() : [];
  
  const matches = stored
    .map(fromStored)
    .filter((m): m is Match => m !== null)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // Cache the result
  cachedMatches = matches;
  cachedRawData = raw;
  
  return matches;
}

export function getMatch(matchId: string): Match | null {
  const found = readAllStored().find((m) => m.id === matchId);
  if (!found) return null;
  const parsed = fromStored(found);
  return parsed;
}

export function upsertMatch(match: Match): void {
  const stored = readAllStored();
  const idx = stored.findIndex((m) => m.id === match.id);
  const next = toStored(match);

  if (idx >= 0) {
    stored[idx] = next;
  } else {
    stored.push(next);
  }

  writeAllStored(stored);
}

export function updateMatch(matchId: string, patch: Partial<Match>): Match | null {
  const match = getMatch(matchId);
  if (!match) return null;

  const next: Match = {
    ...match,
    ...patch,
  };

  upsertMatch(next);
  return next;
}

export function deleteMatch(matchId: string): void {
  const stored = readAllStored().filter((m) => m.id !== matchId);
  writeAllStored(stored);
}

export function subscribeMatches(callback: () => void): () => void {
  const onChange = () => {
    // Clear cache when storage changes
    cachedMatches = null;
    cachedRawData = null;
    callback();
  };
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener("storage", onChange);
  };
}
