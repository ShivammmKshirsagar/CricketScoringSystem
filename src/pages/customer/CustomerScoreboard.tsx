import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Card } from "@/components/Card";
import { useLiveScore } from "@/hooks/useLiveScore";
import { getMatch } from "@/lib/matchStore";
import { ScorecardTable } from "@/components/ScorecardTable";
import { PageTransition } from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchScoreHeader } from "@/components/match/MatchScoreHeader";
import { LiveTab } from "@/components/match/LiveTab";
import { OversTab } from "@/components/match/OversTab";
import { InfoTab } from "@/components/match/InfoTab";
import { Activity, Table, ListOrdered, Info } from "lucide-react";

export default function CustomerScoreboard() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState("live");

  const match = useMemo(() => (matchId ? getMatch(matchId) : null), [matchId]);
  const snapshot = useLiveScore(matchId ?? "");

  if (!matchId) {
    return <Navigate to="/" replace />;
  }

  if (!match) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto">
          <Card variant="default">
            <div className="font-semibold text-foreground">Match not found</div>
            <div className="mt-1 text-sm text-muted-foreground">It may have been deleted by admin.</div>
          </Card>
        </div>
      </PageTransition>
    );
  }

  if (!snapshot) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Basic Match Info when no snapshot */}
          <div className="flat-card">
            <div className="flex items-center gap-2 mb-4">
              {match.status === "upcoming" && (
                <span className="status-badge status-badge-upcoming">Upcoming</span>
              )}
              {match.status === "completed" && (
                <span className="status-badge status-badge-completed">Completed</span>
              )}
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-4">
              <div className="text-left">
                <div className="font-display font-semibold text-foreground">{match.team1.name}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">VS</span>
              </div>
              <div className="text-right">
                <div className="font-display font-semibold text-foreground">{match.team2.name}</div>
              </div>
            </div>
          </div>
          
          <Card variant="default">
            <div className="font-semibold text-foreground">Scoreboard not available yet</div>
            <div className="mt-1 text-sm text-muted-foreground">
              If this match is live, the admin has not started scoring.
            </div>
          </Card>
        </div>
      </PageTransition>
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
    <PageTransition>
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 space-y-3 sm:space-y-4">
        {/* Match Score Header */}
        <MatchScoreHeader match={match} snapshot={snapshot} />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-secondary/50 p-1 h-auto">
            <TabsTrigger 
              value="live" 
              className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs py-2 data-[state=active]:bg-background"
            >
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scorecard" 
              className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs py-2 data-[state=active]:bg-background"
            >
              <Table className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Scorecard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="overs" 
              className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs py-2 data-[state=active]:bg-background"
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Overs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="info" 
              className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs py-2 data-[state=active]:bg-background"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Tab */}
          <TabsContent value="live" className="mt-3 sm:mt-4">
            <LiveTab score={currentScore} teamName={battingTeam.name} />
          </TabsContent>

          {/* Scorecard Tab */}
          <TabsContent value="scorecard" className="mt-3 sm:mt-4">
            <div className="space-y-4 sm:space-y-6">
              {/* Current Innings Scorecard */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                  {battingTeam.name} - {snapshot.currentInnings === 1 ? "1st" : "2nd"} Innings
                </div>
                <ScorecardTable teamName={battingTeam.name} score={currentScore} />
              </div>

              {/* First Innings Scorecard (if 2nd innings) */}
              {snapshot.currentInnings === 2 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                    {match.tossDecision === "bat" ? match.team1.name : match.team2.name} - 1st Innings
                  </div>
                  <Card variant="default" className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Final Score</span>
                      <span className="score-display text-lg sm:text-xl font-display font-bold text-foreground">
                        {snapshot.innings1Score.runs}/{snapshot.innings1Score.wickets}
                      </span>
                    </div>
                  </Card>
                  <ScorecardTable
                    teamName={match.tossDecision === "bat" ? match.team1.name : match.team2.name}
                    score={snapshot.innings1Score}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Overs Tab */}
          <TabsContent value="overs" className="mt-3 sm:mt-4">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                  {battingTeam.name} - Over by Over
                </div>
                <OversTab score={currentScore} />
              </div>

              {snapshot.currentInnings === 2 && snapshot.innings1Score.ballEvents.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                    {match.tossDecision === "bat" ? match.team1.name : match.team2.name} - 1st Innings
                  </div>
                  <OversTab score={snapshot.innings1Score} />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="mt-3 sm:mt-4">
            <InfoTab match={match} lastUpdated={snapshot.updatedAt} />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
