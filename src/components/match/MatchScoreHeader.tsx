import { Match } from "@/types/match";
import { ScoreState } from "@/types/score";
import { formatOvers } from "@/lib/scoreEngine";
import { getCurrentRunRate } from "@/lib/scoreSelectors";
import { MapPin, Calendar, Trophy } from "lucide-react";

interface MatchScoreHeaderProps {
  match: Match;
  snapshot: {
    currentInnings: number;
    innings1Score: ScoreState;
    innings2Score: ScoreState;
    updatedAt: string;
  };
}

export function MatchScoreHeader({ match, snapshot }: MatchScoreHeaderProps) {
  const team1BattingFirst = match.tossDecision === "bat";
  
  const team1Score = team1BattingFirst ? snapshot.innings1Score : snapshot.innings2Score;
  const team2Score = team1BattingFirst ? snapshot.innings2Score : snapshot.innings1Score;
  
  const team1Overs = formatOvers(team1Score.overs * 6 + team1Score.balls);
  const team2Overs = formatOvers(team2Score.overs * 6 + team2Score.balls);
  
  const currentBattingTeam = snapshot.currentInnings === 1 
    ? (team1BattingFirst ? match.team1 : match.team2)
    : (team1BattingFirst ? match.team2 : match.team1);

  const isTeam1Batting = (snapshot.currentInnings === 1 && team1BattingFirst) || 
                         (snapshot.currentInnings === 2 && !team1BattingFirst);

  return (
    <div className="flat-card space-y-3 sm:space-y-4">
      {/* Match Info Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
        {match.status === "live" && (
          <span className="status-badge status-badge-live">
            <span className="live-pulse" />
            Live
          </span>
        )}
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-[100px] sm:max-w-none">{match.venue}</span>
        </div>
        <div className="h-3 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          <span>{match.overs} Overs</span>
        </div>
        {match.scheduledAt && (
          <>
            <div className="h-3 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(match.scheduledAt).toLocaleDateString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Toss Info */}
      <div className="text-xs text-muted-foreground">
        <span className="text-foreground font-medium">Toss:</span>{" "}
        {match.tossWinner === match.team1.id ? match.team1.name : match.team2.name} elected to{" "}
        {match.tossDecision} first
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center py-2">
        {/* Team 1 */}
        <div className={`text-left ${isTeam1Batting ? "" : "opacity-70"}`}>
          <div className="font-display font-semibold text-xs sm:text-sm text-foreground mb-1 truncate">
            {match.team1.name}
          </div>
          {(team1BattingFirst ? snapshot.currentInnings >= 1 : snapshot.currentInnings >= 2) ? (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1">
              <span className="score-display text-2xl sm:text-3xl font-display font-black text-foreground">
                {team1Score.runs}/{team1Score.wickets}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({team1Overs})
              </span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground italic">Yet to bat</span>
          )}
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">VS</span>
          </div>
        </div>

        {/* Team 2 */}
        <div className={`text-right ${!isTeam1Batting ? "" : "opacity-70"}`}>
          <div className="font-display font-semibold text-xs sm:text-sm text-foreground mb-1 truncate">
            {match.team2.name}
          </div>
          {(!team1BattingFirst ? snapshot.currentInnings >= 1 : snapshot.currentInnings >= 2) ? (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1 justify-end">
              <span className="score-display text-2xl sm:text-3xl font-display font-black text-foreground">
                {team2Score.runs}/{team2Score.wickets}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({team2Overs})
              </span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground italic">Yet to bat</span>
          )}
        </div>
      </div>

      {/* Current batting team indicator & run rate */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{currentBattingTeam.name}</span>
          {" "}batting
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">CRR: </span>
            <span className="font-semibold text-primary">
              {getCurrentRunRate(snapshot.currentInnings === 1 ? snapshot.innings1Score : snapshot.innings2Score).toFixed(2)}
            </span>
          </div>
          {snapshot.currentInnings === 2 && snapshot.innings2Score.target && (
            <div>
              <span className="text-muted-foreground">Target: </span>
              <span className="font-semibold text-accent">{snapshot.innings2Score.target}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
