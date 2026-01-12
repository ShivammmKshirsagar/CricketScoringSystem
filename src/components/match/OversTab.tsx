import { ScoreState } from "@/types/score";
import { getOverSummaries, getBallDisplayText } from "@/lib/scoreSelectors";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

interface OversTabProps {
  score: ScoreState;
}

export function OversTab({ score }: OversTabProps) {
  const overSummaries = getOverSummaries(score);

  if (overSummaries.length === 0) {
    return (
      <Card variant="default">
        <div className="text-center text-muted-foreground py-8">
          No overs bowled yet
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {overSummaries.slice().reverse().map((over) => (
        <Card key={over.overNumber} variant="default" className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-primary">{over.overNumber}</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Over {over.overNumber}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-bold text-foreground text-sm">{over.runs} runs</span>
              {over.wickets > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-destructive/20 text-destructive rounded text-xs font-medium">
                  {over.wickets}W
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {over.balls.map((ball, index) => (
              <div
                key={index}
                className={cn(
                  "min-w-[2rem] h-8 sm:min-w-[2.25rem] sm:h-9 px-1 rounded-lg flex items-center justify-center font-display font-bold text-xs transition-all",
                  ball.isWicket
                    ? "bg-destructive/20 text-destructive border border-destructive/30"
                    : ball.runsOffBat === 6
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : ball.runsOffBat === 4
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : ball.ballType === "wide" || ball.ballType === "no_ball"
                          ? "bg-info/20 text-info border border-info/30"
                          : "bg-secondary text-foreground"
                )}
              >
                {getBallDisplayText(ball)}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
