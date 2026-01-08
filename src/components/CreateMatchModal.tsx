import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./Card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Match, Team } from "@/types/match";
import { X } from "lucide-react";

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMatch: (match: Match) => void;
}

export function CreateMatchModal({ isOpen, onClose, onCreateMatch }: CreateMatchModalProps) {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [venue, setVenue] = useState("");
  const [overs, setOvers] = useState("20");
  const [tossWinner, setTossWinner] = useState<"team1" | "team2">("team1");
  const [tossDecision, setTossDecision] = useState<"bat" | "bowl">("bat");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const team1: Team = {
      id: `team-${Date.now()}-1`,
      name: team1Name,
      shortName: team1Name.slice(0, 3).toUpperCase(),
    };
    
    const team2: Team = {
      id: `team-${Date.now()}-2`,
      name: team2Name,
      shortName: team2Name.slice(0, 3).toUpperCase(),
    };

    const match: Match = {
      id: `match-${Date.now()}`,
      team1,
      team2,
      venue,
      overs: parseInt(overs),
      tossWinner: tossWinner === "team1" ? team1.id : team2.id,
      tossDecision,
      status: "live",
      createdAt: new Date(),
    };

    onCreateMatch(match);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card variant="flat" className="relative z-10 w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Create New Match
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Teams */}
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

          {/* Venue */}
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g., Wankhede Stadium, Mumbai"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* Overs */}
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

          {/* Toss */}
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

          {/* Toss Decision */}
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

          {/* Submit */}
          <Button type="submit" variant="hero" className="w-full mt-6" size="lg">
            Start Match
          </Button>
        </form>
      </Card>
    </div>
  );
}
