import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { AdminMatchModal } from "@/components/AdminMatchModal";
import { useMatches } from "@/hooks/useMatches";
import { deleteMatch, upsertMatch, updateMatch } from "@/lib/matchStore";
import { getLiveScore, clearLiveScore } from "@/lib/liveScoreStore";
import { Match } from "@/types/match";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

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

  const handleDeleteMatch = (match: Match) => {
    const scoringStarted = !!getLiveScore(match.id);
    
    // Build confirmation message based on match state
    let confirmMessage = `Delete "${match.team1.shortName} vs ${match.team2.shortName}"?`;
    if (scoringStarted) {
      confirmMessage += "\n\n⚠️ This match has scoring data that will be permanently deleted.";
    }
    confirmMessage += "\n\nThis action cannot be undone.";

    if (window.confirm(confirmMessage)) {
      try {
        // Clear live score data if exists
        if (scoringStarted) {
          clearLiveScore(match.id);
        }
        
        // Delete the match
        deleteMatch(match.id);
        
        toast.success("Match deleted successfully");
      } catch (error) {
        console.error("Failed to delete match:", error);
        toast.error("Failed to delete match. Please try again.");
      }
    }
  };

  return (
    <PageTransition>
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Match Management</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Create, schedule, and manage matches.</p>
          <label className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded border-border"
            />
            Show archived matches
          </label>
        </div>

        <Button
          variant="hero"
          size="sm"
          onClick={() => {
            setEditingMatch(undefined);
            setIsModalOpen(true);
          }}
        >
          + New Match
        </Button>
      </div>

      {visible.length === 0 ? (
        <Card variant="default" className="py-10 text-center">
          <p className="text-sm text-muted-foreground">No matches yet. Create your first match to get started.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {visible.map((m) => {
            const scoringStarted = !!getLiveScore(m.id);
            const canEdit = !scoringStarted;
            const canScore = m.status === "live";

            const statusBadgeClass = 
              m.status === "live" ? "status-badge-live" : 
              m.status === "upcoming" ? "status-badge-upcoming" : 
              "status-badge-completed";

            return (
              <Card key={m.id} variant="default" className="flex flex-col gap-3 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`status-badge ${statusBadgeClass}`}>
                      {m.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                      {m.status}
                    </div>
                    <div>
                      <div className="font-display text-base font-bold text-foreground">
                        {m.team1.shortName} vs {m.team2.shortName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.venue} • {m.overs} overs
                      </div>
                      {scoringStarted && (
                        <div className="mt-1 text-xs text-primary/70">
                          Scoring in progress
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted-foreground">
                    {formatWhen(m.scheduledAt)}
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
                    onClick={() => handleDeleteMatch(m)}
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
    </PageTransition>
  );
}