import { Match } from "@/types/match";
import { cn } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

interface MatchHeaderProps {
  match: Match;
  className?: string;
}

export function MatchHeader({ match, className }: MatchHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-right flex-1">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {match.team1.name}
          </h2>
          <span className="text-sm text-muted-foreground">{match.team1.shortName}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-2xl font-display font-black text-muted-foreground">VS</span>
        </div>
        
        <div className="text-left flex-1">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {match.team2.name}
          </h2>
          <span className="text-sm text-muted-foreground">{match.team2.shortName}</span>
        </div>
      </div>
      
      
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{match.venue}</span>
        </div>
        <div className="h-4 w-px bg-border"></div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{match.overs} Overs</span>
        </div>
      </div>
      
      
      <div className="mt-3 text-sm">
        <span className="text-muted-foreground">Toss: </span>
        <span className="font-medium text-foreground">
          {match.tossWinner === match.team1.id ? match.team1.name : match.team2.name}
        </span>
        <span className="text-muted-foreground"> won and elected to </span>
        <span className="font-medium text-primary">{match.tossDecision}</span>
      </div>
    </div>
  );
}
