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