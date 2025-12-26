import { useSyncExternalStore } from "react";
import { listMatches, subscribeMatches } from "@/lib/matchStore";
import { Match } from "@/types/match";

export function useMatches(): Match[] {
  return useSyncExternalStore(subscribeMatches, listMatches, listMatches);
}
