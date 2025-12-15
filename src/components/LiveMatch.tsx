'use client'

import { useState, useCallback } from "react";
// Removed useNavigate from react-router-dom
import { Scoreboard } from "@/components/Scoreboard";
import { BallInputPanel } from "@/components/BallInputPanel";
import { MatchHeader } from "@/components/MatchHeader";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { Match, BallEvent } from "@/types/match";
import { ScoreState } from "@/types/score";
import { createInitialScoreState, processBallEvent } from "@/lib/scoreEngine";
import { ArrowLeft, Flag } from "lucide-react"; // Removed RotateCcw unused here
import { toast } from "sonner";

interface LiveMatchProps {
  match: Match;
  onEndMatch: () => void;
}

export function LiveMatch({ match, onEndMatch }: LiveMatchProps) {
  // const navigate = useNavigate(); // Not needed if conditional rendering in page.tsx
  const [currentInnings, setCurrentInnings] = useState<1 | 2>(1);
  const [innings1Score, setInnings1Score] = useState<ScoreState>(createInitialScoreState());
  const [innings2Score, setInnings2Score] = useState<ScoreState>(() => ({
    ...createInitialScoreState(),
    target: undefined,
  }));
  
  const battingTeam = currentInnings === 1 
    ? (match.tossDecision === 'bat' ? match.team1 : match.team2)
    : (match.tossDecision === 'bat' ? match.team2 : match.team1);

  const currentScore = currentInnings === 1 ? innings1Score : innings2Score;
  const setCurrentScore = currentInnings === 1 ? setInnings1Score : setInnings2Score;

  const handleBallRecorded = useCallback((event: Partial<BallEvent>) => {
    const newScore = processBallEvent(currentScore, event);
    setCurrentScore(newScore);

    // Check for innings end conditions
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
        // Match complete
        const result = newScore.runs >= (innings1Score.runs + 1) 
          ? `${battingTeam.name} wins!`
          : `${match.tossDecision === 'bat' ? match.team1.name : match.team2.name} wins!`;
        toast.success(`Match Complete! ${result}`);
      }
    }

    // Check if target achieved in second innings
    if (currentInnings === 2 && innings2Score.target && newScore.runs >= innings2Score.target) {
      toast.success(`${battingTeam.name} wins by ${10 - newScore.wickets} wickets!`);
    }

    // Announce boundaries and wickets
    if (event.isWicket) {
      toast.error("WICKET!", { duration: 2000 });
    } else if (event.runs === 6) {
      toast.success("SIX! 🏏", { duration: 1500 });
    } else if (event.runs === 4) {
      toast.success("FOUR!", { duration: 1500 });
    }
  }, [currentScore, currentInnings, match, battingTeam, innings1Score.runs, innings2Score.target]);

  const handleUndo = useCallback(() => {
    if (currentScore.ballEvents.length === 0) return;
    
    // Remove last ball and recalculate
    const newEvents = currentScore.ballEvents.slice(0, -1);
    let newScore = createInitialScoreState();
    if (currentInnings === 2) {
      newScore.target = innings1Score.runs + 1;
    }
    
    newEvents.forEach(event => {
      newScore = processBallEvent(newScore, event);
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
      {/* Hero glow effect */}
      <div className="hero-glow" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEndMatch} // Changed from navigate("/") to onEndMatch for SPA behavior
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
        {/* Match Header */}
        <MatchHeader match={match} className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scoreboard */}
          <div className="space-y-6">
            <Scoreboard
              teamName={battingTeam.name}
              score={currentScore}
              isLive={true}
              target={currentInnings === 2 ? innings2Score.target : undefined}
            />

            {/* First innings summary in second innings */}
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

            {/* Over-by-over summary */}
            {currentScore.ballEvents.length > 0 && (
              <Card variant="default">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Over Summary
                </h3>
                <div className="max-h-48 overflow-y-auto scrollbar-hide space-y-2">
                  {Array.from({ length: currentScore.overs + 1 }).map((_, overIndex) => {
                    const overBalls = currentScore.ballEvents.filter(
                      e => e.overNumber === overIndex + 1 || 
                           (overIndex === currentScore.overs && e.overNumber === overIndex)
                    );
                    if (overBalls.length === 0) return null;
                    
                    const overRuns = overBalls.reduce((sum, b) => sum + (b.runs || 0) + (b.isWide ? 1 : 0) + (b.isNoBall ? 1 : 0), 0);
                    
                    return (
                      <div key={overIndex} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-sm text-muted-foreground">Over {overIndex + 1}</span>
                        <span className="font-medium text-foreground">{overRuns} runs</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Ball Input Panel */}
          <div>
            <BallInputPanel
              onBallRecorded={handleBallRecorded}
              onUndo={handleUndo}
            />
          </div>
        </div>
      </main>
    </div>
  );
}