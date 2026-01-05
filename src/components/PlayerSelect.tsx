import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check } from "lucide-react";
import { usePlayers } from "@/hooks/usePlayers";
import { addPlayer } from "@/lib/playerStore";

interface PlayerSelectProps {
    teamId: string;
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    excludeIds?: string[];
    disabled?: boolean;
}

export function PlayerSelect({
    teamId,
    value,
    onChange,
    label,
    placeholder = "Select player...",
    excludeIds = [],
    disabled = false,
}: PlayerSelectProps) {
    const players = usePlayers(teamId);
    const [isAdding, setIsAdding] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState("");

    const filteredPlayers = players.filter((p) => !excludeIds.includes(p.id));

    const handleAddPlayer = () => {
        if (!newPlayerName.trim()) return;
        const player = addPlayer(teamId, newPlayerName.trim());
        onChange(player.id); // Auto-select new player
        setNewPlayerName("");
        setIsAdding(false);
    };

    return (
        <div className="space-y-1.5">
            {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}

            {isAdding ? (
                <div className="flex items-center gap-2">
                    <Input
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="New player name..."
                        className="h-9"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddPlayer();
                        }}
                    />
                    <Button size="icon" variant="ghost" className="h-9 w-9" onClick={handleAddPlayer}>
                        <Check className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setIsAdding(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Select value={value} onValueChange={onChange} disabled={disabled}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredPlayers.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">No players yet</div>
                            ) : (
                                filteredPlayers.map((player) => (
                                    <SelectItem key={player.id} value={player.id}>
                                        {player.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 shrink-0"
                        onClick={() => setIsAdding(true)}
                        title="Add Player"
                        disabled={disabled}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
