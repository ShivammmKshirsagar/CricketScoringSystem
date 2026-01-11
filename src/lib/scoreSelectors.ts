import { ScoreState, BallEvent } from "@/types/score";

/* ---------- Basic selectors ---------- */

export function getTotalBalls(state: ScoreState): number {
  return state.overs * 6 + state.balls;
}

export function getOversDisplay(state: ScoreState): string {
  return `${state.overs}.${state.balls}`;
}

export function getCurrentRunRate(state: ScoreState): number {
  const balls = getTotalBalls(state);
  if (balls === 0) return 0;
  return Number((state.runs / (balls / 6)).toFixed(2));
}

export function getLastSixBalls(state: ScoreState): BallEvent[] {
  // FIXED: Return last 6 legal deliveries PLUS any illegals in current over
  // This ensures wides/no-balls appear in the over display
  
  const allBalls = state.ballEvents;
  if (allBalls.length === 0) return [];
  
  // Find balls in the current over (since last complete over)
  const currentOverBalls: BallEvent[] = [];
  let legalCount = 0;
  
  // Work backwards from the last ball
  for (let i = allBalls.length - 1; i >= 0; i--) {
    const ball = allBalls[i];
    currentOverBalls.unshift(ball); // Add to start
    
    if (ball.isLegal) {
      legalCount++;
      if (legalCount === 6) {
        // We've collected a complete over, stop here
        break;
      }
    }
  }
  
  return currentOverBalls;
}

/* ---------- Over summary ---------- */

export interface OverSummary {
  overNumber: number;
  balls: BallEvent[];
  runs: number;
  wickets: number;
}

export function getOverSummaries(state: ScoreState): OverSummary[] {
  const summaries: OverSummary[] = [];
  let currentOver: BallEvent[] = [];
  let overNumber = 1;

  for (const ball of state.ballEvents) {
    currentOver.push(ball);

    if (ball.isLegal && currentOver.filter(b => b.isLegal).length === 6) {
      summaries.push({
        overNumber,
        balls: currentOver,
        runs: currentOver.reduce(
          (sum, b) => sum + b.runsOffBat + b.extraRuns,
          0
        ),
        wickets: currentOver.filter(b => b.isWicket).length,
      });

      currentOver = [];
      overNumber++;
    }
  }

  if (currentOver.length > 0) {
    summaries.push({
      overNumber,
      balls: currentOver,
      runs: currentOver.reduce(
        (sum, b) => sum + b.runsOffBat + b.extraRuns,
        0
      ),
      wickets: currentOver.filter(b => b.isWicket).length,
    });
  }

  return summaries;
}

export function getBallDisplayText(ball: BallEvent): string {
  if (ball.isWicket) return "W";

  switch (ball.ballType) {
    case "wide":
      return `${ball.extraRuns}Wd`;
    case "no_ball":
      return `${ball.extraRuns}Nb`;
    case "bye":
      return `${ball.extraRuns}B`;
    case "leg_bye":
      return `${ball.extraRuns}Lb`;
    default:
      if (ball.runsOffBat === 6) return "6";
      if (ball.runsOffBat === 4) return "4";
      return ball.runsOffBat.toString();
  }
}

export function getRequiredRunRate(
  state: ScoreState,
  totalOvers: number
): number {
  if (!state.target) return 0;

  const totalBalls = totalOvers * 6;
  const ballsBowled = state.overs * 6 + state.balls;
  const ballsRemaining = totalBalls - ballsBowled;

  if (ballsRemaining <= 0) return 0;

  const runsNeeded = state.target - state.runs;
  return Number((runsNeeded / (ballsRemaining / 6)).toFixed(2));
}

export function getBattingStats(state: ScoreState, allPlayers: any[] = []) {
  const stats: Record<string, {
    id: string;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    isOut: boolean;
    isOnStrike: boolean;
  }> = {};

  // FIXED: Initialize stats for currently selected batters (even with 0 balls)
  const selectedBatterIds = new Set<string>();
  if (state.currentStrikerId) selectedBatterIds.add(state.currentStrikerId);
  if (state.currentNonStrikerId) selectedBatterIds.add(state.currentNonStrikerId);

  selectedBatterIds.forEach(batterId => {
    const player = allPlayers.find(p => p.id === batterId);
    stats[batterId] = {
      id: batterId,
      name: player?.name ?? 'Unknown',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      isOnStrike: batterId === state.currentStrikerId
    };
  });

  // Update stats from ball events
  state.ballEvents.forEach(ball => {
    if (ball.batterId) {
      // Initialize if not already present (for batters who are no longer active)
      if (!stats[ball.batterId]) {
        const player = allPlayers.find(p => p.id === ball.batterId);
        stats[ball.batterId] = {
          id: ball.batterId,
          name: player?.name ?? 'Unknown',
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
          isOnStrike: false
        };
      }

      if (ball.isLegal) {
        stats[ball.batterId].balls++;
      }
      stats[ball.batterId].runs += ball.runsOffBat;
      if (ball.runsOffBat === 4) stats[ball.batterId].fours++;
      if (ball.runsOffBat === 6) stats[ball.batterId].sixes++;
    }
  });

  // Mark current striker (already done in initialization, but update in case of rotation)
  Object.keys(stats).forEach(id => {
    stats[id].isOnStrike = id === state.currentStrikerId;
  });

  return Object.values(stats);
}

export function getBowlingStats(state: ScoreState, allPlayers: any[] = []) {
  const stats: Record<string, {
    id: string;
    name: string;
    overs: number;
    balls: number; // partial over balls
    maidens: number;
    runs: number;
    wickets: number;
    wides: number;
    noBalls: number;
  }> = {};

  // FIXED: Initialize stats for currently selected bowler (even with 0 balls)
  if (state.currentBowlerId) {
    const player = allPlayers.find(p => p.id === state.currentBowlerId);
    stats[state.currentBowlerId] = {
      id: state.currentBowlerId,
      name: player?.name ?? 'Unknown',
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      wides: 0,
      noBalls: 0
    };
  }

  // Update stats from ball events
  state.ballEvents.forEach(ball => {
    if (ball.bowlerId) {
      // Initialize if not already present (for bowlers who are no longer active)
      if (!stats[ball.bowlerId]) {
        const player = allPlayers.find(p => p.id === ball.bowlerId);
        stats[ball.bowlerId] = {
          id: ball.bowlerId,
          name: player?.name ?? 'Unknown',
          overs: 0,
          balls: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0
        };
      }

      const s = stats[ball.bowlerId];

      if (ball.ballType === 'wide') s.wides++;
      if (ball.ballType === 'no_ball') s.noBalls++;

      // Runs against bowler: runsOffBat + wides + no_balls (byes/legbyes don't count against bowler)
      s.runs += ball.runsOffBat;
      if (ball.ballType === 'wide' || ball.ballType === 'no_ball') {
        s.runs += ball.extraRuns;
      }

      if (ball.isWicket && ball.wicketType !== 'run_out') {
        s.wickets++;
      }

      if (ball.isLegal) {
        s.balls++;
        if (s.balls === 6) {
          s.overs++;
          s.balls = 0;
        }
      }
    }
  });

  return Object.values(stats);
}