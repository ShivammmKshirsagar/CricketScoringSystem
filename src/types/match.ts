// match.ts
import type { BallEvent, Extras, BallType, WicketType } from './score';

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
  scheduledAt?: Date;
  archived?: boolean;
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

