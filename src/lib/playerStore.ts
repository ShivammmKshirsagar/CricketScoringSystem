import { Player } from "@/types/match";

const STORAGE_KEY = "cricket_players";

export function getPlayers(teamId: string): Player[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        const allPlayers = JSON.parse(raw) as Player[];
        return allPlayers.filter(p => p.teamId === teamId);
    } catch {
        return [];
    }
}

export function getAllPlayers(): Player[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as Player[];
    } catch {
        return [];
    }
}

export function addPlayer(teamId: string, name: string): Player {
    const raw = localStorage.getItem(STORAGE_KEY);
    let allPlayers: Player[] = [];
    try {
        allPlayers = raw ? JSON.parse(raw) : [];
    } catch {
        allPlayers = [];
    }

    const newPlayer: Player = {
        id: crypto.randomUUID(),
        teamId,
        name,
    };

    allPlayers.push(newPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlayers));
    window.dispatchEvent(new Event(EVENT_NAME));
    return newPlayer;
}

const EVENT_NAME = "cricket_players_changed";

export function subscribePlayers(callback: () => void): () => void {
    const onChange = () => callback();
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener("storage", onChange);
    return () => {
        window.removeEventListener(EVENT_NAME, onChange);
        window.removeEventListener("storage", onChange);
    };
}
