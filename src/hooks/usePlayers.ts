import { useState, useEffect } from "react";
import { Player } from "@/types/match";
import { getPlayers, subscribePlayers } from "@/lib/playerStore";

export function usePlayers(teamId: string) {
    const [players, setPlayers] = useState<Player[]>(() => getPlayers(teamId));

    useEffect(() => {
        setPlayers(getPlayers(teamId));
        return subscribePlayers(() => {
            setPlayers(getPlayers(teamId));
        });
    }, [teamId]);

    return players;
}
