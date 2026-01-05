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
  return state.ballEvents.filter(b => b.isLegal).slice(-6);
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

  // Initialize stats for players who have faced balls
  state.ballEvents.forEach(ball => {
    if (ball.batterId) {
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

  // Mark active strikers
  if (state.currentStrikerId && stats[state.currentStrikerId]) {
    stats[state.currentStrikerId].isOnStrike = true;
  }

  // Handle wickets (TODO: associate wicket with batter more explicitly if needed)
  // For now, if wicket falls, we assume striker is out (simplification unless runout)

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

  state.ballEvents.forEach(ball => {
    if (ball.bowlerId) {
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