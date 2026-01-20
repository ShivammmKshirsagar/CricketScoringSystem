import { Match } from "@/types/match";
import { Card } from "@/components/Card";
import { MapPin, Calendar, Clock, Trophy, Users } from "lucide-react";

interface InfoTabProps {
  match: Match;
  lastUpdated: string;
}

export function InfoTab({ match, lastUpdated }: InfoTabProps) {
  const tossWinnerName = match.tossWinner === match.team1.id ? match.team1.name : match.team2.name;

  return (
    <div className="space-y-4">
      
      <Card variant="default">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Match Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Format</div>
              <div className="font-medium text-foreground">{match.overs} Overs Match</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Venue</div>
              <div className="font-medium text-foreground">{match.venue}</div>
            </div>
          </div>

          {match.scheduledAt && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium text-foreground">
                  {new Date(match.scheduledAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="font-medium text-foreground">
                {new Date(lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </Card>

      
      <Card variant="default">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Toss</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🪙</span>
          </div>
          <div>
            <div className="font-medium text-foreground">{tossWinnerName}</div>
            <div className="text-sm text-muted-foreground">
              elected to {match.tossDecision} first
            </div>
          </div>
        </div>
      </Card>

      
      <Card variant="default">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Teams</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">{match.team1.name}</div>
              <div className="text-xs text-muted-foreground">{match.team1.shortName}</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="px-3 py-1 bg-secondary rounded text-xs text-muted-foreground">VS</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="font-medium text-foreground">{match.team2.name}</div>
              <div className="text-xs text-muted-foreground">{match.team2.shortName}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
