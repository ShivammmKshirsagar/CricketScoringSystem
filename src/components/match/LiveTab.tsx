import { ScoreState } from "@/types/score";
import { getAllPlayers } from "@/lib/playerStore";
import { getBattingStats, getBowlingStats, getCurrentOverBalls, getBallDisplayText, getOverSummaries } from "@/lib/scoreSelectors";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

interface LiveTabProps {
  score: ScoreState;
  teamName: string;
}

export function LiveTab({ score, teamName }: LiveTabProps) {
  const allPlayers = getAllPlayers();
  const battingStats = getBattingStats(score, allPlayers);
  const bowlingStats = getBowlingStats(score, allPlayers);
  const currentOverBalls = getCurrentOverBalls(score);
  const overSummaries = getOverSummaries(score);

  // Get current partnership info
  const currentBatters = battingStats.filter(b => !b.isOut).slice(0, 2);
  const activeBowler = bowlingStats.find(b => b.id === score.currentBowlerId);

  // Calculate this over runs
  const thisOverRuns = currentOverBalls.reduce((sum, b) => sum + b.runsOffBat + b.extraRuns, 0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Current Batters */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="bg-muted/30 px-3 sm:px-4 py-2 border-b border-border/50">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Batters</h3>
        </div>
        <div className="divide-y divide-border/50 overflow-x-auto">
          <div className="grid grid-cols-[1fr_repeat(5,minmax(28px,auto))] gap-2 sm:gap-4 px-3 sm:px-4 py-2 text-xs text-muted-foreground font-medium min-w-[280px]">
            <span></span>
            <span className="text-right">R</span>
            <span className="text-right">B</span>
            <span className="text-right hidden xs:block">4s</span>
            <span className="text-right hidden xs:block">6s</span>
            <span className="text-right">SR</span>
          </div>
          {currentBatters.map((batter) => (
            <div key={batter.id} className="grid grid-cols-[1fr_repeat(5,minmax(28px,auto))] gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 items-center min-w-[280px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-medium text-foreground text-sm truncate">{batter.name}</span>
                {batter.isOnStrike && <span className="text-primary text-xs flex-shrink-0">*</span>}
              </div>
              <span className="text-right font-bold text-foreground text-sm">{batter.runs}</span>
              <span className="text-right text-muted-foreground text-sm">{batter.balls}</span>
              <span className="text-right text-muted-foreground text-sm hidden xs:block">{batter.fours}</span>
              <span className="text-right text-muted-foreground text-sm hidden xs:block">{batter.sixes}</span>
              <span className="text-right text-xs sm:text-sm">
                {batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(0) : "0"}
              </span>
            </div>
          ))}
          {currentBatters.length === 0 && (
            <div className="px-3 sm:px-4 py-4 text-center text-muted-foreground text-sm">
              No batters on crease
            </div>
          )}
        </div>
      </Card>

      {/* Current Bowler */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="bg-muted/30 px-3 sm:px-4 py-2 border-b border-border/50">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bowler</h3>
        </div>
        <div className="divide-y divide-border/50 overflow-x-auto">
          <div className="grid grid-cols-[1fr_repeat(5,minmax(28px,auto))] gap-2 sm:gap-4 px-3 sm:px-4 py-2 text-xs text-muted-foreground font-medium min-w-[280px]">
            <span></span>
            <span className="text-right">O</span>
            <span className="text-right hidden xs:block">M</span>
            <span className="text-right">R</span>
            <span className="text-right">W</span>
            <span className="text-right">ECO</span>
          </div>
          {activeBowler ? (
            <div className="grid grid-cols-[1fr_repeat(5,minmax(28px,auto))] gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 items-center min-w-[280px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-medium text-foreground text-sm truncate">{activeBowler.name}</span>
                <span className="text-primary text-xs flex-shrink-0">*</span>
              </div>
              <span className="text-right text-sm">{activeBowler.overs}.{activeBowler.balls}</span>
              <span className="text-right text-muted-foreground text-sm hidden xs:block">{activeBowler.maidens}</span>
              <span className="text-right text-sm">{activeBowler.runs}</span>
              <span className="text-right font-bold text-foreground text-sm">{activeBowler.wickets}</span>
              <span className="text-right text-xs sm:text-sm">
                {(activeBowler.overs * 6 + activeBowler.balls) > 0
                  ? (activeBowler.runs / ((activeBowler.overs * 6 + activeBowler.balls) / 6)).toFixed(1)
                  : "0.0"}
              </span>
            </div>
          ) : (
            <div className="px-3 sm:px-4 py-4 text-center text-muted-foreground text-sm">
              No active bowler
            </div>
          )}
        </div>
      </Card>

      {/* This Over */}
      <Card variant="default">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Over {score.overs + 1} {score.balls > 0 ? `(${score.balls}/6)` : ''}
          </span>
          <span className="text-sm font-medium text-foreground">{thisOverRuns} runs</span>
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {currentOverBalls.map((ball, index) => (
            <div
              key={index}
              className={cn(
                "min-w-[2.25rem] h-9 sm:min-w-[2.5rem] sm:h-10 px-1.5 rounded-lg flex items-center justify-center font-display font-bold text-xs sm:text-sm transition-all",
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
          {currentOverBalls.length === 0 && (
            <span className="text-muted-foreground text-sm">New over starting...</span>
          )}
        </div>
      </Card>

      {/* Recent Overs */}
      {overSummaries.length > 1 && (
        <Card variant="default">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Overs</div>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {overSummaries.slice().reverse().slice(0, 5).map((over, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground">Over {over.overNumber}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{over.runs} runs</span>
                  {over.wickets > 0 && (
                    <span className="text-xs text-destructive font-medium">{over.wickets}W</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Extras */}
      <Card variant="default">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extras</span>
          <span className="font-semibold text-foreground">
            {score.extras.wides + score.extras.noBalls + score.extras.byes + score.extras.legByes}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Wd {score.extras.wides} • Nb {score.extras.noBalls} • B {score.extras.byes} • Lb {score.extras.legByes}
        </div>
      </Card>
    </div>
  );
}
