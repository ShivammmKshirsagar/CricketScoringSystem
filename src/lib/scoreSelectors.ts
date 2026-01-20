import { ScoreState, BallEvent } from "@/types/score";

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

export function getCurrentOverBalls(state: ScoreState): BallEvent[] {
  
  
  const allBalls = state.ballEvents;
  if (allBalls.length === 0) return [];
  
 
  const currentOverBalls: BallEvent[] = [];
  let legalCount = 0;
  
  
  for (let i = allBalls.length - 1; i >= 0; i--) {
    const ball = allBalls[i];
    
    if (ball.isLegal) {
      legalCount++;
    }
    
    
    if (legalCount > state.balls && state.balls > 0) {
      break;
    }
    
    
    if (state.balls === 0 && legalCount > 0) {
      break;
    }
    
    currentOverBalls.unshift(ball);
  }
  
  return currentOverBalls;
}


export function getLastSixBalls(state: ScoreState): BallEvent[] {
  return getCurrentOverBalls(state);
}



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

  
  const totalRuns = ball.runsOffBat + ball.extraRuns;

  switch (ball.ballType) {
    case "wide":
      
      return `${totalRuns}Wd`;
    case "no_ball":
      
      if (ball.runsOffBat > 0) {
        return `${ball.runsOffBat}+Nb`;
      }
      return `${totalRuns}Nb`;
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
    balls: number; 
    maidens: number;
    runs: number;
    wickets: number;
    wides: number;
    noBalls: number;
  }> = {};

  
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


export function getWagonWheelShots(
  state: ScoreState,
  allPlayers: any[] = [],
  batterId?: string
): import("@/types/score").WagonWheelShot[] {
  const shots = state.ballEvents
    .filter(ball => {
      
      if (!ball.wagonWheel) return false;
      
      if (ball.runsOffBat === 0) return false;
      
      if (batterId && ball.batterId !== batterId) return false;
      return true;
    })
    .map(ball => {
      const player = ball.batterId ? allPlayers.find(p => p.id === ball.batterId) : null;
      
      
      const regionAngles: Record<string, number> = {
        'straight': 0,
        'mid-off': 30,
        'cover': 60,
        'point': 90,
        'third-man': 120,
        'fine-leg': 150,
        'square-leg': 180,
        'midwicket': 210,
        'mid-on': 330,
      };
      
      return {
        runs: ball.runsOffBat,
        region: ball.wagonWheel!.region,
        angle: ball.wagonWheel!.angle ?? regionAngles[ball.wagonWheel!.region] ?? 0,
        batterId: ball.batterId,
        batterName: player?.name,
      };
    });
  
  return shots;
}