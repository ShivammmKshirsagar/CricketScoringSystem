import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Card } from "@/components/Card";
import { MatchHeader } from "@/components/MatchHeader";
import { Scoreboard } from "@/components/Scoreboard";
import { useLiveScore } from "@/hooks/useLiveScore";
import { getMatch } from "@/lib/matchStore";

export default function CustomerScoreboard() {
  const { matchId } = useParams();

  const match = useMemo(() => (matchId ? getMatch(matchId) : null), [matchId]);
  const snapshot = useLiveScore(matchId ?? "");

  if (!matchId) {
    return <Navigate to="/" replace />;
  }

  if (!match) {
    return (
      <Card variant="default">
        <div className="font-semibold text-foreground">Match not found</div>
        <div className="mt-1 text-sm text-muted-foreground">It may have been deleted by admin.</div>
      </Card>
    );
  }

  if (!snapshot) {
    return (
      <div className="space-y-6">
        <MatchHeader match={match} />
        <Card variant="default">
          <div className="font-semibold text-foreground">Scoreboard not available yet</div>
          <div className="mt-1 text-sm text-muted-foreground">
            If this match is live, the admin has not started scoring.
          </div>
        </Card>
      </div>
    );
  }

  const battingTeam =
    snapshot.currentInnings === 1
      ? match.tossDecision === "bat"
        ? match.team1
        : match.team2
      : match.tossDecision === "bat"
        ? match.team2
        : match.team1;

  const currentScore = snapshot.currentInnings === 1 ? snapshot.innings1Score : snapshot.innings2Score;

  return (
    <div className="space-y-6">
      <MatchHeader match={match} />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Scoreboard
            teamName={battingTeam.name}
            score={currentScore}
            isLive={match.status === "live"}
            target={snapshot.currentInnings === 2 ? snapshot.innings2Score.target : undefined}
            totalOvers={match.overs}
          />

          {snapshot.currentInnings === 2 && (
            <Card variant="default" className="animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {match.tossDecision === "bat" ? match.team1.name : match.team2.name} (1st Innings)
                </span>
                <span className="score-display text-xl font-display font-bold text-foreground">
                  {snapshot.innings1Score.runs}/{snapshot.innings1Score.wickets}
                </span>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card variant="default">
            <div className="text-sm text-muted-foreground">Last updated</div>
            <div className="mt-1 font-medium text-foreground">
              {new Date(snapshot.updatedAt).toLocaleString()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}