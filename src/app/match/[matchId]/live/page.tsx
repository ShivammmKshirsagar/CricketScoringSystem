'use client'


import { useState } from 'react'
import Scoreboard from '@/components/Scoreboard'
import BallInputPanel from '@/components/BallInputPanel'


export default function LiveMatch() {
const [runs, setRuns] = useState(0)
const [wickets, setWickets] = useState(0)
const [balls, setBalls] = useState(0)


function handleBall(run: number, wicket?: boolean) {
setRuns(r => r + run)
setBalls(b => b + 1)
if (wicket) setWickets(w => w + 1)
}


return (
<main style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }}>
<Scoreboard runs={runs} wickets={wickets} overs={Math.floor(balls/6) + (balls%6)/10} />
<BallInputPanel onBall={handleBall} />
</main>
)
}