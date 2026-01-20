import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/Card";
import { getAllPlayers } from "@/lib/playerStore";
import { getBattingStats, getBowlingStats } from "@/lib/scoreSelectors";
import { ScoreState } from "@/types/score";

interface ScorecardTableProps {
    score: ScoreState;
    teamName: string;
}

export function ScorecardTable({ score, teamName }: ScorecardTableProps) {
    
    const allPlayers = getAllPlayers();

    const battingStats = getBattingStats(score, allPlayers);
    const bowlingStats = getBowlingStats(score, allPlayers);

    return (
        <div className="space-y-6">
            
            <Card variant="default" className="p-0 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                    <h3 className="font-semibold">{teamName} Batting</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Batter</TableHead>
                            <TableHead className="text-right">R</TableHead>
                            <TableHead className="text-right">B</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">4s</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">6s</TableHead>
                            <TableHead className="text-right">SR</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {battingStats.map((batter) => (
                            <TableRow key={batter.id}>
                                <TableCell>
                                    <div className="font-medium flex items-center gap-2">
                                        {batter.name}
                                        {batter.isOnStrike && <span className="text-primary text-xs">★</span>}
                                        
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold">{batter.runs}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{batter.balls}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell text-muted-foreground">{batter.fours}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell text-muted-foreground">{batter.sixes}</TableCell>
                                <TableCell className="text-right text-sm">
                                    {batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : "0.0"}
                                </TableCell>
                            </TableRow>
                        ))}
                        {battingStats.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                    No batting stats yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            
            <Card variant="default" className="p-0 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                    <h3 className="font-semibold">Bowling</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Bowler</TableHead>
                            <TableHead className="text-right">O</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">M</TableHead>
                            <TableHead className="text-right">R</TableHead>
                            <TableHead className="text-right">W</TableHead>
                            <TableHead className="text-right">ECO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bowlingStats.map((bowler) => (
                            <TableRow key={bowler.id}>
                                <TableCell className="font-medium">{bowler.name}</TableCell>
                                <TableCell className="text-right">{bowler.overs}.{bowler.balls}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell text-muted-foreground">{bowler.maidens}</TableCell>
                                <TableCell className="text-right">{bowler.runs}</TableCell>
                                <TableCell className="text-right font-bold">{bowler.wickets}</TableCell>
                                <TableCell className="text-right text-sm">
                                    
                                    {((bowler.overs * 6 + bowler.balls) > 0)
                                        ? (bowler.runs / ((bowler.overs * 6 + bowler.balls) / 6)).toFixed(1)
                                        : "0.0"}
                                </TableCell>
                            </TableRow>
                        ))}
                        {bowlingStats.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                    No bowling stats yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
