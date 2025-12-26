import { cn } from "@/lib/utils";
import { ScoreState } from "@/types/score";
import { formatOvers } from "@/lib/scoreEngine";
import { Card } from "./Card";
import {
  getBallDisplayText,
  getCurrentRunRate,
  getLastSixBalls,
  getRequiredRunRate
} from "@/lib/scoreSelectors"

interface ScoreboardProps {
  teamName: string;
  score: ScoreState;
  totalOvers: number;
  isLive?: boolean;
  target?: number;
  className?: string;
}

export function Scoreboard({
  teamName,
  score,
  totalOvers,
  isLive = false,
  target,
  className
}: ScoreboardProps) {
  const oversDisplay = formatOvers(score.overs * 6 + score.balls);

  return (
    <Card variant="glow" className={cn("relative overflow-hidden", className)}>
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
          <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Team name */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-medium text-muted-foreground">
          {teamName}
        </h2>
      </div>

      {/* Main score display */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="score-display text-7xl font-display font-black text-foreground tracking-tight">
          {score.runs}
        </span>
        <span className="text-4xl font-display font-bold text-muted-foreground">/</span>
        <span className="score-display text-5xl font-display font-bold text-muted-foreground">
          {score.wickets}
        </span>
      </div>

      {/* Overs */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Overs</span>
          <span className="score-display text-2xl font-display font-bold text-foreground">
            {oversDisplay}
          </span>
        </div>
        <div className="h-4 w-px bg-border"></div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">RR</span>
          <span className="score-display text-xl font-display font-semibold text-primary">
            {getCurrentRunRate(score).toFixed(2)}
          </span>
        </div>
        {target && getRequiredRunRate(score, totalOvers) && (
          <>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">RRR</span>
              <span className="score-display text-xl font-display font-semibold text-accent">
                {getRequiredRunRate(score, totalOvers).toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* This over */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">This Over</span>
          <span className="text-sm text-muted-foreground">
            {getLastSixBalls(score).reduce(
              (sum, b) => sum + b.runsOffBat + b.extraRuns,
              0
            )
            } runs
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, index) => {
            const ball = getLastSixBalls(score)[index];
            return (
              <div
                key={index}
                className={cn(
                  "flex-1 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm transition-all",
                  ball ? (
                    ball.isWicket
                      ? "bg-destructive/20 text-destructive border border-destructive/30"
                      : ball.runsOffBat === 6
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : ball.runsOffBat === 4
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : ball.ballType === "wide" || ball.ballType === "no_ball"
                            ? "bg-info/20 text-info border border-info/30"
                            : "bg-secondary text-foreground"
                  ) : "bg-secondary/50 text-muted-foreground border border-border/30"
                )}
              >
                {ball ? getBallDisplayText(ball) : '•'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Extras summary */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Extras:</span>
          <span className="font-medium text-foreground">
            {score.extras.wides + score.extras.noBalls + score.extras.byes + score.extras.legByes}
          </span>
          <span className="text-muted-foreground text-xs">
            (Wd {score.extras.wides}, Nb {score.extras.noBalls}, B {score.extras.byes}, Lb {score.extras.legByes})
          </span>
        </div>
      </div>

      {/* Target info */}
      {target && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Target</span>
            <div className="text-right">
              <span className="score-display text-xl font-display font-bold text-accent">
                {target}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                Need {target - score.runs} from {120 - (score.overs * 6 + score.balls)} balls
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
