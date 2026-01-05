import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./Card";
import { BallEvent, WicketType, BallType } from "@/types/score";
import { cn } from "@/lib/utils";
import { X, RotateCcw, Check, Zap } from "lucide-react";

interface BallInputPanelProps {
  onBallRecorded: (event: BallEvent) => void;
  onUndo?: () => void;
  disabled?: boolean;
  className?: string;
  isFreeHit?: boolean;
}

type ExtraType = 'wide' | 'no_ball' | 'bye' | 'leg_bye' | null;

export function BallInputPanel({ 
  onBallRecorded, 
  onUndo,
  disabled = false,
  className,
  isFreeHit = false,
}: BallInputPanelProps) {
  const [selectedRuns, setSelectedRuns] = useState<number | null>(null);
  const [extraType, setExtraType] = useState<ExtraType>(null);
  const [isWicket, setIsWicket] = useState(false);
  const [wicketType, setWicketType] = useState<WicketType | null>(null);

  const handleRunSelect = (runs: number) => {
    if (disabled) return;
    setSelectedRuns(runs);
  };

  const handleExtraToggle = (type: ExtraType) => {
    if (disabled) return;
    setExtraType(extraType === type ? null : type);
  };

  const handleWicketToggle = () => {
    if (disabled) return;
    // On free hit, only allow run-out
    if (isFreeHit) {
      setIsWicket(!isWicket);
      if (!isWicket) {
        setWicketType('run_out');
      } else {
        setWicketType(null);
      }
    } else {
      setIsWicket(!isWicket);
      if (isWicket) {
        setWicketType(null);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedRuns === null && !isWicket && !extraType) return;

    let ballType: BallType = 'normal';
    let extraRuns = 0;
    let isLegal = true;

    if (extraType) {
      ballType = extraType;
      
      // For no-ball: extraRuns from selection, but engine will ensure minimum +1
      // For wide: extraRuns from selection (default 1)
      // For bye/leg-bye: extraRuns from selection
      extraRuns = selectedRuns ?? (extraType === 'wide' ? 1 : 0);
      
      isLegal = extraType === 'bye' || extraType === 'leg_bye';
    }

    const ball: BallEvent = {
      runsOffBat: extraType ? 0 : selectedRuns ?? 0,
      ballType,
      extraRuns,
      isLegal,
      isWicket,
      wicketType: isWicket ? wicketType ?? undefined : undefined,
      wasFreeHit: isFreeHit,
    };

    onBallRecorded(ball);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedRuns(null);
    setExtraType(null);
    setIsWicket(false);
    setWicketType(null);
  };

  const wicketTypes: WicketType[] = [
    'bowled', 'caught', 'lbw', 'run_out', 'stumped', 'hit_wicket', 'caught_behind', 'caught_and_bowled'
  ];

  const hasSelection = selectedRuns !== null || isWicket || extraType;

  return (
    <Card variant="glass" className={cn("", className)}>
      {/* Free Hit Indicator */}
      {isFreeHit && (
        <div className="mb-6 p-4 rounded-xl bg-accent/20 border-2 border-accent animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <span className="font-display text-lg font-bold text-accent uppercase tracking-wider">
              Free Hit
            </span>
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">
            Batter cannot be dismissed (except run-out)
          </p>
        </div>
      )}

      {/* Runs selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Runs
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((run) => (
            <Button
              key={run}
              variant={selectedRuns === run ? "scoreActive" : "score"}
              onClick={() => handleRunSelect(run)}
              disabled={disabled}
              className={cn(
                "ball-button",
                run === 4 && selectedRuns === 4 && "!bg-primary !text-primary-foreground shadow-glow",
                run === 6 && selectedRuns === 6 && "!bg-accent !text-accent-foreground"
              )}
            >
              {run}
            </Button>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Extras
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { type: 'wide' as ExtraType, label: 'Wide' },
            { type: 'no_ball' as ExtraType, label: 'No Ball' },
            { type: 'bye' as ExtraType, label: 'Bye' },
            { type: 'leg_bye' as ExtraType, label: 'Leg Bye' },
          ].map(({ type, label }) => (
            <Button
              key={type}
              variant={extraType === type ? "default" : "extra"}
              onClick={() => handleExtraToggle(type)}
              disabled={disabled}
              className="ball-button h-11 text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
        {extraType === 'no_ball' && (
          <p className="mt-2 text-xs text-muted-foreground">
            ℹ️ No-ball adds +1 run automatically (plus any runs off bat)
          </p>
        )}
      </div>

      {/* Wicket */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Wicket
        </h3>
        <Button
          variant={isWicket ? "wicket" : "outline"}
          onClick={handleWicketToggle}
          disabled={disabled}
          className={cn("w-full ball-button h-12 text-base", isWicket && "shadow-lg")}
        >
          <X className={cn("h-5 w-5", isWicket && "text-destructive-foreground")} />
          Wicket {isFreeHit && "(Run-out only)"}
        </Button>
        
        {isWicket && (
          <div className="mt-3 grid grid-cols-4 gap-2 animate-slide-up">
            {wicketTypes.map((type) => (
              <Button
                key={type}
                variant={wicketType === type ? "wicket" : "outline"}
                onClick={() => setWicketType(type)}
                disabled={disabled || (isFreeHit && type !== 'run_out')}
                className={cn(
                  "ball-button text-xs h-9 capitalize",
                  isFreeHit && type !== 'run_out' && "opacity-30 cursor-not-allowed"
                )}
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/50">
        {onUndo && (
          <Button
            variant="ghost"
            onClick={onUndo}
            disabled={disabled}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Undo
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={resetSelection}
          disabled={disabled || !hasSelection}
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          variant="hero"
          onClick={handleConfirm}
          disabled={disabled || !hasSelection}
          className="flex-[2]"
        >
          <Check className="h-4 w-4 mr-2" />
          Record Ball
        </Button>
      </div>

      {/* Current selection preview */}
      {hasSelection && (
        <div className="mt-4 p-3 rounded-xl bg-secondary/50 border border-border/50 animate-fade-in">
          <div className="text-sm text-muted-foreground">
            Recording: 
            <span className="font-semibold text-foreground ml-2">
              {selectedRuns !== null && `${selectedRuns} run${selectedRuns !== 1 ? 's' : ''}`}
              {extraType && ` + ${extraType.replace('_', ' ')}`}
              {extraType === 'no_ball' && ' (+1 auto)'}
              {isWicket && ` + Wicket${wicketType ? ` (${wicketType})` : ''}`}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}