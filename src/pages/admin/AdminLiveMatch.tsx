import { useMemo, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/Card";
import { LiveMatch } from "@/pages/LiveMatch";
import { getMatch, updateMatch } from "@/lib/matchStore";

export default function AdminLiveMatch() {
  const navigate = useNavigate();
  const { matchId } = useParams();

  const match = useMemo(() => (matchId ? getMatch(matchId) : null), [matchId]);

  useEffect(() => {
    if (match && match.status !== "live") {
      updateMatch(match.id, { status: "live" });
    }
  }, [match]);

  if (!matchId) {
    return <Navigate to="/admin/matches" replace />;
  }

  if (!match) {
    return (
      <Card variant="default">
        <div className="font-semibold text-foreground">Match not found</div>
        <div className="mt-1 text-sm text-muted-foreground">Please go back to matches list.</div>
      </Card>
    );
  }

  return (
    <LiveMatch
      match={match}
      persist
      backTo="/admin/matches"
      onEndMatch={() => {
        updateMatch(match.id, { status: "completed" });
        navigate("/admin/matches", { replace: true });
      }}
    />
  );
}
