import { BallEvent, Extras } from '@/types/score';
import { ScoreState } from '@/types/score';

export function calculateBallRuns(event: BallEvent): number {
  return event.runsOffBat + event.extraRuns;
}


export function isLegalDelivery(event: BallEvent): boolean {
  return event.isLegal;
}


export function formatOvers(balls: number): string {
  const completedOvers = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return `${completedOvers}.${remainingBalls}`;
}


export function oversToTotalBalls(overs: number, balls: number): number {
  return overs * 6 + balls;
}


export function calculateRunRate(runs: number, totalBalls: number): number {
  if (totalBalls === 0) return 0;
  const overs = totalBalls / 6;
  return Number((runs / overs).toFixed(2));
}


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


export function getLastSixBalls(events: BallEvent[]): BallEvent[] {
  return events.filter(e => e.isLegal).slice(-6);
}


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

export function applyBall(
  prevState: ScoreState,
  ball: BallEvent
): ScoreState {

  let extraRuns = ball.extraRuns;
  if (ball.ballType === 'no_ball') {
    extraRuns = Math.max(1, ball.extraRuns);
  }

  
  let actualWicket = ball.isWicket;
  let actualRunsOffBat = ball.runsOffBat;

  
  if (ball.ballType === 'no_ball' && ball.isWicket && ball.wicketType !== 'run_out') {
    actualWicket = false;
  }

  
  if (prevState.isFreeHit && ball.isWicket && ball.wicketType !== 'run_out') {
    actualWicket = false;
  }

  
  if (actualWicket && ball.wicketType !== 'run_out') {
    actualRunsOffBat = 0;
  }

  
  const runsFromBall = actualRunsOffBat + extraRuns;
  const isLegal = isLegalDelivery(ball);

  
  let overs = prevState.overs;
  let balls = prevState.balls;

  if (isLegal) {
    balls += 1;
    if (balls === 6) {
      overs += 1;
      balls = 0;
    }
  }

  
  let nextFreeHit = false;
  
  if (ball.ballType === 'no_ball') {
    nextFreeHit = true;
  } else if (isLegal) {
    nextFreeHit = false;
  } else {
    nextFreeHit = prevState.isFreeHit;
  }

  const newRuns = prevState.runs + runsFromBall;
  const newWickets = prevState.wickets + (actualWicket ? 1 : 0);

  
  const recordedBall: BallEvent = {
    ...ball,
    runsOffBat: actualRunsOffBat,
    extraRuns,
    isWicket: actualWicket,
    wasFreeHit: prevState.isFreeHit,
  };

  const newBallEvents = [...prevState.ballEvents, recordedBall];

  
  let currentStrikerId = prevState.currentStrikerId;
  let currentNonStrikerId = prevState.currentNonStrikerId;

  
  if (actualRunsOffBat % 2 !== 0) {
    [currentStrikerId, currentNonStrikerId] = [currentNonStrikerId, currentStrikerId];
  }

  
  if (isLegal && balls === 0 && overs > prevState.overs) {
    [currentStrikerId, currentNonStrikerId] = [currentNonStrikerId, currentStrikerId];
  }

  return {
    runs: newRuns,
    wickets: newWickets,
    overs,
    balls,
    extras: calculateExtras(newBallEvents),
    target: prevState.target,
    ballEvents: newBallEvents,
    currentStrikerId,
    currentNonStrikerId,
    currentBowlerId: prevState.currentBowlerId,
    isFreeHit: nextFreeHit,
  };
}