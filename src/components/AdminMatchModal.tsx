import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Match, Team } from "@/types/match";
import { X } from "lucide-react";

type AdminMatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMatch?: Match;
  onSave: (match: Match) => void;
};

function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function AdminMatchModal({ isOpen, onClose, initialMatch, onSave }: AdminMatchModalProps) {
  const isEdit = !!initialMatch;

  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [venue, setVenue] = useState("");
  const [overs, setOvers] = useState("20");
  const [tossWinner, setTossWinner] = useState<"team1" | "team2">("team1");
  const [tossDecision, setTossDecision] = useState<"bat" | "bowl">("bat");
  const [status, setStatus] = useState<Match["status"]>("upcoming");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const initialScheduledValue = useMemo(() => {
    if (!initialMatch?.scheduledAt) return "";
    return toDatetimeLocalValue(initialMatch.scheduledAt);
  }, [initialMatch]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialMatch) {
      setTeam1Name(initialMatch.team1.name);
      setTeam2Name(initialMatch.team2.name);
      setVenue(initialMatch.venue);
      setOvers(String(initialMatch.overs));
      setTossWinner(initialMatch.tossWinner === initialMatch.team1.id ? "team1" : "team2");
      setTossDecision(initialMatch.tossDecision);
      setStatus(initialMatch.status);
      setScheduledAt(initialScheduledValue);
    } else {
      setTeam1Name("");
      setTeam2Name("");
      setVenue("");
      setOvers("20");
      setTossWinner("team1");
      setTossDecision("bat");
      setStatus("upcoming");
      setScheduledAt("");
    }
  }, [isOpen, initialMatch, initialScheduledValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = initialMatch?.id ?? `match-${Date.now()}`;
    const createdAt = initialMatch?.createdAt ?? new Date();

    const team1: Team = initialMatch?.team1 ?? {
      id: `team-${Date.now()}-1`,
      name: team1Name,
      shortName: team1Name.slice(0, 3).toUpperCase(),
    };

    const team2: Team = initialMatch?.team2 ?? {
      id: `team-${Date.now()}-2`,
      name: team2Name,
      shortName: team2Name.slice(0, 3).toUpperCase(),
    };

    const next: Match = {
      id,
      team1: { ...team1, name: team1Name, shortName: team1Name.slice(0, 3).toUpperCase() },
      team2: { ...team2, name: team2Name, shortName: team2Name.slice(0, 3).toUpperCase() },
      venue,
      overs: parseInt(overs),
      tossWinner: tossWinner === "team1" ? team1.id : team2.id,
      tossDecision,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      archived: initialMatch?.archived ?? false,
      createdAt,
    };

    onSave(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <Card variant="glow" className="relative z-10 w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {isEdit ? "Update Match" : "Create / Schedule Match"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1</Label>
              <Input
                id="team1"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="e.g., Mumbai Indians"
                required
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team2">Team 2</Label>
              <Input
                id="team2"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="e.g., Chennai Super Kings"
                required
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g., Wankhede Stadium"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overs">Overs</Label>
              <Input
                id="overs"
                type="number"
                min="1"
                max="50"
                value={overs}
                onChange={(e) => setOvers(e.target.value)}
                required
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Match["status"])}
                className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Schedule Time (optional)</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <div className="space-y-3">
            <Label>Toss Winner</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={tossWinner === "team1" ? "default" : "outline"}
                onClick={() => setTossWinner("team1")}
                className="h-11"
              >
                {team1Name || "Team 1"}
              </Button>
              <Button
                type="button"
                variant={tossWinner === "team2" ? "default" : "outline"}
                onClick={() => setTossWinner("team2")}
                className="h-11"
              >
                {team2Name || "Team 2"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Elected to</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={tossDecision === "bat" ? "default" : "outline"}
                onClick={() => setTossDecision("bat")}
                className="h-11"
              >
                Bat First
              </Button>
              <Button
                type="button"
                variant={tossDecision === "bowl" ? "default" : "outline"}
                onClick={() => setTossDecision("bowl")}
                className="h-11"
              >
                Bowl First
              </Button>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full mt-6" size="lg">
            {isEdit ? "Save Changes" : "Create Match"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
