import { BallEvent, Extras, WicketType } from '@/types/match';
import { ScoreState, OverSummary } from '@/types/score';

/**
 * Score Engine - Handles all cricket scoring calculations
 * Isolated business logic for cricket match scoring
 */

// Calculate total runs from a ball event
export function calculateBallRuns(event: Partial<BallEvent>): number {
  let runs = event.runs || 0;
  
  // Wide adds 1 run plus any runs scored
  if (event.isWide) {
    runs += 1;
  }
  
  // No ball adds 1 run plus any runs scored
  if (event.isNoBall) {
    runs += 1;
  }
  
  return runs;
}

// Check if ball counts towards over
export function isLegalDelivery(event: Partial<BallEvent>): boolean {
  return !event.isWide && !event.isNoBall;
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

// Get over summary from ball events
export function getOverSummary(events: BallEvent[], overNumber: number): OverSummary {
  const overBalls = events.filter(e => e.overNumber === overNumber);
  
  return {
    overNumber,
    runs: overBalls.reduce((sum, e) => sum + calculateBallRuns(e), 0),
    wickets: overBalls.filter(e => e.isWicket).length,
    balls: overBalls,
  };
}

// Calculate extras from events
export function calculateExtras(events: BallEvent[]): Extras {
  return events.reduce(
    (extras, event) => ({
      wides: extras.wides + (event.isWide ? 1 + (event.runs || 0) : 0),
      noBalls: extras.noBalls + (event.isNoBall ? 1 : 0),
      byes: extras.byes + (event.isBye ? event.runs || 0 : 0),
      legByes: extras.legByes + (event.isLegBye ? event.runs || 0 : 0),
      penalty: extras.penalty,
    }),
    { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 }
  );
}

// Get last 6 legal deliveries (for this over display)
export function getLastSixBalls(events: BallEvent[]): BallEvent[] {
  const legalBalls = events.filter(isLegalDelivery);
  return legalBalls.slice(-6);
}

// Create initial score state
export function createInitialScoreState(): ScoreState {
  return {
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    currentRunRate: 0,
    ballEvents: [],
    lastSixBalls: [],
  };
}

// Process a new ball event and return updated score state
export function processBallEvent(
  currentState: ScoreState,
  event: Partial<BallEvent>
): ScoreState {
  const runs = calculateBallRuns(event);
  const isLegal = isLegalDelivery(event);
  
  // Calculate new balls count
  let newBalls = currentState.balls;
  let newOvers = currentState.overs;
  
  if (isLegal) {
    newBalls = currentState.balls + 1;
    if (newBalls >= 6) {
      newOvers = currentState.overs + 1;
      newBalls = 0;
    }
  }
  
  const totalBalls = oversToTotalBalls(newOvers, newBalls);
  const totalRuns = currentState.runs + runs;
  const newWickets = currentState.wickets + (event.isWicket ? 1 : 0);
  
  // Create the full ball event
  const fullEvent: BallEvent = {
    id: `ball-${Date.now()}`,
    inningsId: '',
    overNumber: event.isWide || event.isNoBall ? currentState.overs : newOvers,
    ballNumber: isLegal ? (newBalls === 0 ? 6 : newBalls) : currentState.balls,
    runs: event.runs || 0,
    isWicket: event.isWicket || false,
    wicketType: event.wicketType,
    isWide: event.isWide || false,
    isNoBall: event.isNoBall || false,
    isBye: event.isBye || false,
    isLegBye: event.isLegBye || false,
    isBoundary: event.runs === 4,
    isSix: event.runs === 6,
    timestamp: new Date(),
  };
  
  const newEvents = [...currentState.ballEvents, fullEvent];
  
  return {
    runs: totalRuns,
    wickets: newWickets,
    overs: newOvers,
    balls: newBalls,
    extras: calculateExtras(newEvents),
    currentRunRate: calculateRunRate(totalRuns, totalBalls),
    requiredRunRate: currentState.target 
      ? calculateRequiredRunRate(currentState.target, totalRuns, (currentState.target ? 120 : 0) - totalBalls)
      : undefined,
    target: currentState.target,
    ballEvents: newEvents,
    lastSixBalls: getLastSixBalls(newEvents),
  };
}

// Get ball display text (for over summary)
export function getBallDisplayText(event: BallEvent): string {
  if (event.isWicket) return 'W';
  if (event.isWide) return `${event.runs}Wd`;
  if (event.isNoBall) return `${event.runs}Nb`;
  if (event.isBye) return `${event.runs}B`;
  if (event.isLegBye) return `${event.runs}Lb`;
  if (event.isSix) return '6';
  if (event.isBoundary) return '4';
  return event.runs.toString();
}

// Get wicket type display
export function getWicketTypeDisplay(type: WicketType): string {
  const displays: Record<WicketType, string> = {
    bowled: 'Bowled',
    caught: 'Caught',
    lbw: 'LBW',
    run_out: 'Run Out',
    stumped: 'Stumped',
    hit_wicket: 'Hit Wicket',
    caught_behind: 'Caught Behind',
    caught_and_bowled: 'C & B',
  };
  return displays[type];
}
