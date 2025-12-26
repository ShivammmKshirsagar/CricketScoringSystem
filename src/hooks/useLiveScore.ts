import { useSyncExternalStore } from "react";
import { getLiveScore, subscribeLiveScore, LiveScoreSnapshot } from "@/lib/liveScoreStore";

export function useLiveScore(matchId: string): LiveScoreSnapshot | null {
  return useSyncExternalStore(
    subscribeLiveScore,
    () => getLiveScore(matchId),
    () => getLiveScore(matchId)
  );
}
