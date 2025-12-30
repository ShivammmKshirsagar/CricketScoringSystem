import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useMatches } from "@/hooks/useMatches";

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
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-black text-foreground">Matches</h1>
        <p className="mt-1 text-muted-foreground">View live scores and upcoming fixtures.</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">Live</h2>

        {live.length === 0 ? (
          <Card variant="default">
            <p className="text-muted-foreground">No live matches right now.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {live.map((m) => (
              <Card key={m.id} variant="glow" className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-xl font-bold text-foreground">
                    {m.team1.shortName} vs {m.team2.shortName}
                  </div>
                  <div className="text-sm text-muted-foreground">{m.venue}</div>
                </div>

                <Button variant="hero" size="sm" onClick={() => navigate(`/match/${m.id}`)}>
                  View Live
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">Upcoming</h2>

        {upcoming.length === 0 ? (
          <Card variant="default">
            <p className="text-muted-foreground">No upcoming matches scheduled.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcoming.map((m) => (
              <Card key={m.id} variant="default" className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-xl font-bold text-foreground">
                    {m.team1.shortName} vs {m.team2.shortName}
                  </div>
                  <div className="text-sm text-muted-foreground">{m.team1.name} vs {m.team2.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{m.venue}</div>
                  <div className="mt-1 text-sm text-muted-foreground">Scheduled: {formatWhen(m.scheduledAt)}</div>
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
  );
}