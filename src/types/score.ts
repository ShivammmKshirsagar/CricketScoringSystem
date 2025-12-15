import { BallEvent, Extras } from './match';

export interface ScoreState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: Extras;
  currentRunRate: number;
  requiredRunRate?: number;
  target?: number;
  ballEvents: BallEvent[];
  lastSixBalls: BallEvent[];
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
