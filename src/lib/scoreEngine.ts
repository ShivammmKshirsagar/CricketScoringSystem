import { BallEvent, Extras } from '@/types/score';
import { ScoreState } from '@/types/score';

/**
 * Score Engine - Handles all cricket scoring calculations
 * Isolated business logic for cricket match scoring
 */

// Calculate total runs from a ball event
export function calculateBallRuns(event: BallEvent): number {
  return event.runsOffBat + event.extraRuns;
}

// Check if ball counts towards over
export function isLegalDelivery(event: BallEvent): boolean {
  return event.isLegal;
}

// Format overs display (e.g., "4.3" for 4 overs and 3 balls)
export function formatOvers(balls: number): string {
  const completedOvers = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return `${completedOvers}.${remainingBalls}`;
}

// Parse overs string to total balls
export function oversToTotalBalls(overs: number, balls: number): number {
  return overs * 6 + balls;
}

// Calculate current run rate
export function calculateRunRate(runs: number, totalBalls: number): number {
  if (totalBalls === 0) return 0;
  const overs = totalBalls / 6;
  return Number((runs / overs).toFixed(2));
}

// Calculate required run rate
export function calculateRequiredRunRate(
  target: number,
  currentRuns: number,
  ballsRemaining: number
): number {
  if (ballsRemaining <= 0) return 0;
  const runsNeeded = target - currentRuns;
  const oversRemaining = ballsRemaining / 6;
  return Number((runsNeeded / oversRemaining).toFixed(2));
}

// Calculate extras from events
export function calculateExtras(events: BallEvent[]): Extras {
  return events.reduce(
    (extras, event) => {
      switch (event.ballType) {
        case 'wide':
          extras.wides += event.extraRuns;
          break;
        case 'no_ball':
          extras.noBalls += event.extraRuns;
          break;
        case 'bye':
          extras.byes += event.extraRuns;
          break;
        case 'leg_bye':
          extras.legByes += event.extraRuns;
          break;
      }
      return extras;
    },
    { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 }
  );
}

// Get last 6 legal deliveries (for this over display)
export function getLastSixBalls(events: BallEvent[]): BallEvent[] {
  return events.filter(e => e.isLegal).slice(-6);
}

// Create initial score state
export function createInitialScoreState(): ScoreState {
  return {
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    ballEvents: [],
    isFreeHit: false,
  };
}

/**
 * Apply a ball event to the score state
 * Implements proper cricket scoring rules:
 * - No-balls automatically add +1 run as extra
 * - No-balls trigger free hit for next legal delivery
 * - Wickets cannot fall on free hit (except run-out)
 * - Free hit continues through illegal deliveries
 */
export function applyBall(
  prevState: ScoreState,
  ball: BallEvent
): ScoreState {
  // CRICKET RULE: No-ball always adds +1 run automatically
  let extraRuns = ball.extraRuns;
  if (ball.ballType === 'no_ball') {
    // If extra runs not specified, default to 1
    // If specified, ensure minimum of 1
    extraRuns = Math.max(1, ball.extraRuns);
  }

  // Calculate total runs from this ball
  const runsFromBall = ball.runsOffBat + extraRuns;
  const isLegal = isLegalDelivery(ball);

  // CRICKET RULE: Wicket cannot fall on free hit (except run-out)
  let actualWicket = ball.isWicket;
  if (prevState.isFreeHit && ball.isWicket && ball.wicketType !== 'run_out') {
    actualWicket = false; // Nullify non-run-out dismissals on free hit
  }

  // Update balls / overs (only for legal deliveries)
  let overs = prevState.overs;
  let balls = prevState.balls;

  if (isLegal) {
    balls += 1;
    if (balls === 6) {
      overs += 1;
      balls = 0;
    }
  }

  // CRICKET RULE: Free hit logic
  // - Set free hit after no-ball
  // - Consume free hit after legal delivery
  // - Free hit persists through illegal deliveries (wide, no-ball)
  let nextFreeHit = false;
  
  if (ball.ballType === 'no_ball') {
    // No-ball triggers free hit for next legal delivery
    nextFreeHit = true;
  } else if (isLegal) {
    // Legal delivery consumes free hit
    nextFreeHit = false;
  } else {
    // Illegal deliveries (wide) preserve free hit state
    nextFreeHit = prevState.isFreeHit;
  }

  const newRuns = prevState.runs + runsFromBall;
  const newWickets = prevState.wickets + (actualWicket ? 1 : 0);

  // Create the ball event with free hit flag
  const recordedBall: BallEvent = {
    ...ball,
    extraRuns,
    isWicket: actualWicket,
    wasFreeHit: prevState.isFreeHit,
  };

  const newBallEvents = [...prevState.ballEvents, recordedBall];

  return {
    runs: newRuns,
    wickets: newWickets,
    overs,
    balls,
    extras: calculateExtras(newBallEvents),
    target: prevState.target,
    ballEvents: newBallEvents,
    isFreeHit: nextFreeHit,
  };
}