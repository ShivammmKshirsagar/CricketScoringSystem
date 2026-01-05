
export interface ScoreState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: Extras;
  target?: number;
  ballEvents: BallEvent[];
  // Active player tracking
  currentStrikerId?: string;
  currentNonStrikerId?: string;
  currentBowlerId?: string;
}

export interface BatterStats {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOnStrike: boolean;
  isOut: boolean;
}

export interface BowlerStats {
  playerId: string;
  playerName: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
}

export interface PartnershipStats {
  runs: number;
  balls: number;
  batter1: string;
  batter2: string;
}

export interface OverSummary {
  overNumber: number;
  runs: number;
  wickets: number;
  balls: BallEvent[];
}

//One single definition of Ball
export interface BallEvent {
  runsOffBat: number;
  ballType: BallType;
  extraRuns: number;
  isLegal: boolean;
  isWicket: boolean;
  wicketType?: WicketType;
  // New fields for detailed tracking (Optional for backward compatibility)
  batterId?: string;
  bowlerId?: string;
}

export type WicketType =
  | 'bowled'
  | 'caught'
  | 'lbw'
  | 'run_out'
  | 'stumped'
  | 'hit_wicket'
  | 'caught_behind'
  | 'caught_and_bowled';

export type BallType = 'normal' | 'wide' | 'no_ball' | 'bye' | 'leg_bye';

export interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
}

export interface PlayerStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}