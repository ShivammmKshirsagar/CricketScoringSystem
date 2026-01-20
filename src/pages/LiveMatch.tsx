import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Scoreboard } from "@/components/Scoreboard";
import { BallInputPanel } from "@/components/BallInputPanel";
import { MatchHeader } from "@/components/MatchHeader";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { BallEvent } from "@/types/score";
import { Match } from "@/types/match";
import { ScoreState } from "@/types/score";
import { createInitialScoreState, applyBall } from "@/lib/scoreEngine";
import { ArrowLeft, RotateCcw, Flag } from "lucide-react";
import { toast } from "sonner";
import { getOverSummaries } from "@/lib/scoreSelectors";
import { getLiveScore, saveLiveScore } from "@/lib/liveScoreStore";
import { PlayerSelect } from "@/components/PlayerSelect";

interface LiveMatchProps {
  match: Match;
  onEndMatch: () => void;
  persist?: boolean;
  backTo?: string;
}

export function LiveMatch({ match, onEndMatch, persist = false, backTo }: LiveMatchProps) {
  const navigate = useNavigate();
  const persisted = useMemo(() => (persist ? getLiveScore(match.id) : null), [persist, match.id]);
  const [currentInnings, setCurrentInnings] = useState<1 | 2>(() => persisted?.currentInnings ?? 1);
  const [innings1Score, setInnings1Score] = useState<ScoreState>(() => persisted?.innings1Score ?? createInitialScoreState());
  const [innings2Score, setInnings2Score] = useState<ScoreState>(() => {
    if (persisted?.innings2Score) return persisted.innings2Score;
    return {
      ...createInitialScoreState(),
      target: undefined,
    };
  });

  useEffect(() => {
    if (!persist) return;
    saveLiveScore({
      matchId: match.id,
      currentInnings,
      innings1Score,
      innings2Score,
    });
  }, [persist, match.id, currentInnings, innings1Score, innings2Score]);

  const battingTeam = currentInnings === 1
    ? (match.tossDecision === 'bat' ? match.team1 : match.team2)
    : (match.tossDecision === 'bat' ? match.team2 : match.team1);

  const bowlingTeam = currentInnings === 1
    ? (match.tossDecision === 'bat' ? match.team2 : match.team1)
    : (match.tossDecision === 'bat' ? match.team1 : match.team2);

  const currentScore = currentInnings === 1 ? innings1Score : innings2Score;
  const setCurrentScore = currentInnings === 1 ? setInnings1Score : setInnings2Score;
  const overSummaries = useMemo(
    () => getOverSummaries(currentScore),
    [currentScore]
  );

  const handleBallRecorded = useCallback((event: BallEvent) => {
    
    const eventWithPlayers = {
      ...event,
      batterId: currentScore.currentStrikerId,
      bowlerId: currentScore.currentBowlerId,
    };

    const newScore = applyBall(currentScore, eventWithPlayers);
    setCurrentScore(newScore);

    
    const maxBalls = match.overs * 6;
    const totalBalls = newScore.overs * 6 + newScore.balls;

    if (newScore.wickets >= 10 || totalBalls >= maxBalls) {
      if (currentInnings === 1) {
        toast.success("Innings complete! Starting second innings.");
        setCurrentInnings(2);
        setInnings2Score(prev => ({
          ...prev,
          target: newScore.runs + 1,
        }));
      } else {
        
        const result = newScore.runs >= (innings1Score.runs + 1)
          ? `${battingTeam.name} wins!`
          : `${match.tossDecision === 'bat' ? match.team1.name : match.team2.name} wins!`;
        toast.success(`Match Complete! ${result}`);
      }
    }

    
    if (currentInnings === 2 && innings2Score.target && newScore.runs >= innings2Score.target) {
      toast.success(`${battingTeam.name} wins by ${10 - newScore.wickets} wickets!`);
    }

    
    if (event.ballType === 'no_ball') {
      toast.error("NO BALL! Free Hit next delivery.", { duration: 2500 });
    }

    
    if (event.isWicket) {
      toast.error("WICKET!", { duration: 2000 });
    } else if (event.runsOffBat === 6) {
      toast.success("SIX! 🔥", { duration: 1500 });
    } else if (event.runsOffBat === 4) {
      toast.success("FOUR!", { duration: 1500 });
    }
  }, [currentScore, currentInnings, match, battingTeam, innings1Score.runs, innings2Score.target]);

  const handleUndo = useCallback(() => {
    if (currentScore.ballEvents.length === 0) return;

    
    const newEvents = currentScore.ballEvents.slice(0, -1);
    let newScore = createInitialScoreState();
    if (currentInnings === 2) {
      newScore.target = innings1Score.runs + 1;
    }

    newEvents.forEach(event => {
      newScore = applyBall(newScore, event);
    });

    setCurrentScore(newScore);
    toast.info("Ball undone");
  }, [currentScore, currentInnings, innings1Score.runs, setCurrentScore]);

  const handleEndInnings = () => {
    if (currentInnings === 1) {
      setCurrentInnings(2);
      setInnings2Score(prev => ({
        ...prev,
        target: innings1Score.runs + 1,
      }));
      toast.success("Starting second innings");
    } else {
      onEndMatch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(backTo ?? "/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Logo size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Innings {currentInnings} of 2
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEndInnings}
              >
                <Flag className="h-4 w-4 mr-2" />
                End Innings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        <MatchHeader match={match} className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <Scoreboard
              teamName={battingTeam.name}
              score={currentScore}
              isLive={true}
              target={currentInnings === 2 ? innings2Score.target : undefined}
              totalOvers={match.overs}
            />

            
            {currentInnings === 2 && (
              <Card variant="default" className="animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {match.tossDecision === 'bat' ? match.team1.name : match.team2.name} (1st Innings)
                  </span>
                  <span className="score-display text-xl font-display font-bold text-foreground">
                    {innings1Score.runs}/{innings1Score.wickets}
                  </span>
                </div>
              </Card>
            )}

            
            {overSummaries.length > 0 && (
              <Card variant="default">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Over Summary
                </h3>

                <div className="space-y-2">
                  {overSummaries.map(over => (
                    <div
                      key={over.overNumber}
                      className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        Over {over.overNumber}
                      </span>
                      <span className="font-medium text-foreground">
                        {over.runs} runs
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          
          <div className="space-y-6">
            <Card variant="default">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Active Players
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <PlayerSelect
                  label="Striker"
                  teamId={battingTeam.id}
                  value={currentScore.currentStrikerId}
                  onChange={(id) => setCurrentScore(prev => ({ ...prev, currentStrikerId: id }))}
                  excludeIds={currentScore.currentNonStrikerId ? [currentScore.currentNonStrikerId] : []}
                />
                <PlayerSelect
                  label="Non-Striker"
                  teamId={battingTeam.id}
                  value={currentScore.currentNonStrikerId}
                  onChange={(id) => setCurrentScore(prev => ({ ...prev, currentNonStrikerId: id }))}
                  excludeIds={currentScore.currentStrikerId ? [currentScore.currentStrikerId] : []}
                />
                <div className="col-span-2">
                  <PlayerSelect
                    label="Bowler"
                    teamId={bowlingTeam.id}
                    value={currentScore.currentBowlerId}
                    onChange={(id) => setCurrentScore(prev => ({ ...prev, currentBowlerId: id }))}
                  />
                </div>
              </div>
            </Card>

            <BallInputPanel
              onBallRecorded={handleBallRecorded}
              onUndo={handleUndo}
              isFreeHit={currentScore.isFreeHit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}