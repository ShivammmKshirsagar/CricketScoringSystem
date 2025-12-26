import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { AdminMatchModal } from "@/components/AdminMatchModal";
import { useMatches } from "@/hooks/useMatches";
import { deleteMatch, upsertMatch, updateMatch } from "@/lib/matchStore";
import { getLiveScore } from "@/lib/liveScoreStore";
import { Match } from "@/types/match";

function formatWhen(d?: Date) {
  if (!d) return "-";
  return format(d, "dd MMM yyyy, HH:mm");
}

export default function AdminMatches() {
  const navigate = useNavigate();
  const matches = useMatches();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [showArchived, setShowArchived] = useState(false);

  const sorted = useMemo(() => {
    return [...matches].sort((a, b) => {
      const aTime = (a.scheduledAt ?? a.createdAt).getTime();
      const bTime = (b.scheduledAt ?? b.createdAt).getTime();
      return bTime - aTime;
    });
  }, [matches]);

  const visible = useMemo(() => {
    if (showArchived) return sorted;
    return sorted.filter((m) => !m.archived);
  }, [sorted, showArchived]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-foreground">Admin</h1>
          <p className="mt-1 text-muted-foreground">Create, schedule, and manage matches.</p>
          <label className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived
          </label>
        </div>

        <Button
          variant="hero"
          onClick={() => {
            setEditingMatch(undefined);
            setIsModalOpen(true);
          }}
        >
          Create Match
        </Button>
      </div>

      {visible.length === 0 ? (
        <Card variant="default">
          <p className="text-muted-foreground">No matches yet. Create your first match.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {visible.map((m) => {
            const scoringStarted = !!getLiveScore(m.id);
            const canEdit = !scoringStarted;
            const canDelete = !scoringStarted;
            const canScore = m.status === "live";

            return (
              <Card key={m.id} variant="default" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-xl font-bold text-foreground">
                      {m.team1.shortName} vs {m.team2.shortName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {m.team1.name} vs {m.team2.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {m.venue} • {m.overs} overs
                    </div>
                    {scoringStarted && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Scoring started (match details locked)
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Status</div>
                    <div className="mt-1 font-semibold text-foreground">{m.status}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Scheduled: {formatWhen(m.scheduledAt)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canEdit}
                    onClick={() => {
                      setEditingMatch(m);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  {m.status === "upcoming" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateMatch(m.id, { status: "live" })}
                    >
                      Set Live
                    </Button>
                  )}

                  {m.status === "live" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={scoringStarted}
                        onClick={() => updateMatch(m.id, { status: "upcoming" })}
                      >
                        Set Upcoming
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateMatch(m.id, { status: "completed" })}
                      >
                        Mark Completed
                      </Button>
                    </>
                  )}

                  {m.status === "completed" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMatch(m.id, { status: "live" })}
                      >
                        Reopen Live
                      </Button>

                      {m.archived ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateMatch(m.id, { archived: false })}
                        >
                          Restore
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateMatch(m.id, { archived: true })}
                        >
                          Archive
                        </Button>
                      )}
                    </>
                  )}

                  {canScore && (
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() => navigate(`/admin/matches/${m.id}/live`)}
                    >
                      Start Scoring
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!canDelete}
                    onClick={() => deleteMatch(m.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AdminMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMatch={editingMatch}
        onSave={(match) => {
          upsertMatch(match);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
