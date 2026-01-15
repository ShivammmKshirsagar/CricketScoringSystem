import { Button } from "./ui/button";
import { ShotRegion } from "@/types/score";
import { cn } from "@/lib/utils";

interface WagonWheelInputProps {
  onSelect: (region: ShotRegion) => void;
  onSkip: () => void;
  selectedRegion: ShotRegion | null;
}

const shotRegions: { region: ShotRegion; label: string }[] = [
  { region: 'straight', label: 'Straight' },
  { region: 'mid-off', label: 'Mid-Off' },
  { region: 'cover', label: 'Cover' },
  { region: 'point', label: 'Point' },
  { region: 'third-man', label: 'Third Man' },
  { region: 'fine-leg', label: 'Fine Leg' },
  { region: 'square-leg', label: 'Square Leg' },
  { region: 'midwicket', label: 'Midwicket' },
  { region: 'mid-on', label: 'Mid-On' },
];

export function WagonWheelInput({ onSelect, onSkip, selectedRegion }: WagonWheelInputProps) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          Shot Direction (Optional)
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-xs"
        >
          Skip
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {shotRegions.map(({ region, label }) => (
          <Button
            key={region}
            variant={selectedRegion === region ? "default" : "outline"}
            onClick={() => onSelect(region)}
            className={cn(
              "h-9 text-xs",
              selectedRegion === region && "bg-accent text-accent-foreground"
            )}
          >
            {label}
          </Button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-3">
        Select where the shot was played for wagon wheel visualization
      </p>
    </div>
  );
}