import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useMatches } from "@/hooks/useMatches";
import { PageTransition } from "@/components/PageTransition";

function formatWhen(d?: Date) {
  if (!d) return "-";
  return format(d, "dd MMM yyyy, HH:mm");
}

export default function CustomerMatches() {
  const navigate = useNavigate();
  const matches = useMatches();

  const { live, upcoming } = useMemo(() => {
    const visible = matches.filter((m) => !m.archived);
    const liveMatches = visible.filter((m) => m.status === "live");
    const upcomingMatches = visible.filter((m) => m.status === "upcoming");

    upcomingMatches.sort((a, b) => {
      const aTime = (a.scheduledAt ?? a.createdAt).getTime();
      const bTime = (b.scheduledAt ?? b.createdAt).getTime();
      return aTime - bTime;
    });

    return { live: liveMatches, upcoming: upcomingMatches };
  }, [matches]);

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Matches</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">View live scores and upcoming fixtures.</p>
      </div>

      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-wide">Live Now</h2>
        </div>

        {live.length === 0 ? (
          <Card variant="default" className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No live matches right now</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {live.map((m) => (
              <Card key={m.id} variant="flat" className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="status-badge status-badge-live">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Live
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-foreground">
                      {m.team1.shortName} vs {m.team2.shortName}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.venue}</div>
                  </div>
                </div>

                <Button variant="hero" size="sm" onClick={() => navigate(`/match/${m.id}`)}>
                  Watch
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      
      <div className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-wide">Upcoming</h2>

        {upcoming.length === 0 ? (
          <Card variant="default" className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No upcoming matches scheduled</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((m) => (
              <Card key={m.id} variant="default" className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="status-badge status-badge-upcoming">Upcoming</div>
                  <div>
                    <div className="font-display text-base font-bold text-foreground">
                      {m.team1.shortName} vs {m.team2.shortName}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.venue}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{formatWhen(m.scheduledAt)}</div>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => navigate(`/match/${m.id}`)}>
                  Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}