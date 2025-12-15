export interface Team {
  id: string;
  name: string;
  shortName: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  venue: string;
  overs: number;
  status: 'upcoming' | 'live' | 'completed';
  createdAt: Date;
}

export interface Innings {
  id: string;
  matchId: string;
  battingTeamId: string;
  bowlingTeamId: string;
  inningsNumber: 1 | 2;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  totalBalls: number;
  extras: Extras;
  isCompleted: boolean;
}

export interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
}

export interface BallEvent {
  id: string;
  inningsId: string;
  overNumber: number;
  ballNumber: number;
  runs: number;
  isWicket: boolean;
  wicketType?: WicketType;
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  isBoundary: boolean;
  isSix: boolean;
  timestamp: Date;
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
