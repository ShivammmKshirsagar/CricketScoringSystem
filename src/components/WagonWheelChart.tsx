import { useMemo } from "react";
import { ScoreState } from "@/types/score";
import { getAllPlayers } from "@/lib/playerStore";
import { getWagonWheelShots, getBattingStats } from "@/lib/scoreSelectors";
import { Card } from "./Card";

interface WagonWheelChartProps {
  score: ScoreState;
  selectedBatterId?: string;
}

export function WagonWheelChart({ score, selectedBatterId }: WagonWheelChartProps) {
  const allPlayers = getAllPlayers();
  const shots = useMemo(
    () => getWagonWheelShots(score, allPlayers, selectedBatterId),
    [score, allPlayers, selectedBatterId]
  );

  const battingStats = getBattingStats(score, allPlayers);
  
  
  const size = 320;
  const center = size / 2;
  const fieldRadius = 140;

  
  const totalRuns = shots.reduce((sum, shot) => sum + shot.runs, 0);

  
  const getRunColor = (runs: number) => {
    if (runs === 6) return '#10b981'; 
    if (runs === 4) return '#3b82f6'; 
    if (runs === 3) return '#f59e0b'; 
    if (runs === 2) return '#8b5cf6'; 
    return '#6b7280'; 
  };

  
  const getPosition = (angle: number, distance: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    const x = center + distance * Math.cos(radian);
    const y = center + distance * Math.sin(radian);
    return { x, y };
  };

  return (
    <div className="space-y-4">
      
      <div className="grid grid-cols-2 gap-3">
        <Card variant="default">
          <div className="text-sm text-muted-foreground">Total Shots</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">
            {shots.length}
          </div>
        </Card>
        <Card variant="default">
          <div className="text-sm text-muted-foreground">Runs from Shots</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">
            {totalRuns}
          </div>
        </Card>
      </div>

      
      <Card variant="default">
        {shots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No wagon wheel data recorded yet
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Admin needs to select shot direction when recording runs
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <svg 
              width={size} 
              height={size} 
              viewBox={`0 0 ${size} ${size}`}
              className="max-w-full h-auto"
            >
              
              <circle
                cx={center}
                cy={center}
                r={fieldRadius}
                fill="rgba(34, 197, 94, 0.05)"
                stroke="rgba(34, 197, 94, 0.2)"
                strokeWidth="1"
              />
              <circle
                cx={center}
                cy={center}
                r={fieldRadius * 0.66}
                fill="none"
                stroke="rgba(34, 197, 94, 0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx={center}
                cy={center}
                r={fieldRadius * 0.33}
                fill="none"
                stroke="rgba(34, 197, 94, 0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              
              <rect
                x={center - 8}
                y={center - 30}
                width={16}
                height={60}
                fill="rgba(139, 92, 46, 0.3)"
                stroke="rgba(139, 92, 46, 0.5)"
                strokeWidth="1"
              />

              
              <text x={center} y={20} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">
                Off
              </text>
              <text x={center} y={size - 10} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">
                Leg
              </text>
              
              
              {shots.map((shot, index) => {
                const distance = fieldRadius * 0.85; 
                const pos = getPosition(shot.angle, distance);
                const color = getRunColor(shot.runs);

                return (
                  <g key={index}>
                    
                    <line
                      x1={center}
                      y1={center}
                      x2={pos.x}
                      y2={pos.y}
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={shot.runs === 6 ? 8 : shot.runs === 4 ? 6 : 4}
                      fill={color}
                      opacity="0.8"
                    />
                    
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="white"
                    >
                      {shot.runs}
                    </text>
                  </g>
                );
              })}

              
              <circle cx={center} cy={center} r={6} fill="rgba(59, 130, 246, 0.8)" />
            </svg>
          </div>
        )}
      </Card>

      
      <Card variant="default">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Legend
        </h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span>Six (6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span>Four (4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
            <span>Three (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
            <span>Two (2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#6b7280]"></div>
            <span>One (1)</span>
          </div>
        </div>
      </Card>

      
      {battingStats.length > 0 && (
        <Card variant="default">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Filter by Batter
          </h4>
          <div className="text-xs text-muted-foreground">
            {selectedBatterId 
              ? `Showing: ${battingStats.find(b => b.id === selectedBatterId)?.name || 'Unknown'}`
              : 'Showing: All batters'
            }
          </div>
        </Card>
      )}
    </div>
  );
}