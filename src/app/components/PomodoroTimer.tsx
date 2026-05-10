'use client'
import { useState, useEffect, useRef } from 'react'
import { useAppTheme } from '../context/ThemeContext'

const MODES = [
  { label: 'focus', duration: 25 * 60, color: '#7c6af7' },
  { label: 'short break', duration: 5 * 60, color: '#4fc38a' },
  { label: 'long break', duration: 15 * 60, color: '#37a8dd' },
]

export default function PomodoroTimer() {
  const { theme: t } = useAppTheme()
  const [modeIdx, setModeIdx] = useState(0)
  const [seconds, setSeconds] = useState(MODES[0].duration)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mode = MODES[modeIdx]

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false)
            if (modeIdx === 0) setCycles(c => c + 1)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, modeIdx])

  function switchMode(idx: number) {
    setModeIdx(idx)
    setSeconds(MODES[idx].duration)
    setRunning(false)
  }

  function reset() {
    setSeconds(mode.duration)
    setRunning(false)
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const pct = Math.round(((mode.duration - seconds) / mode.duration) * 100)
  const color = mode.color
  const circumference = 2 * Math.PI * 28

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>pomodoro</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < cycles % 4 ? color : t.border }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {MODES.map((m, i) => (
          <div key={m.label} onClick={() => switchMode(i)} style={{ flex: 1, textAlign: 'center', padding: '5px 4px', borderRadius: 8, border: `1px solid ${modeIdx === i ? color : t.border}`, background: modeIdx === i ? color + '22' : 'transparent', color: modeIdx === i ? color : t.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", cursor: 'pointer', transition: 'all 0.2s' }}>
            {m.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="28" fill="none" stroke={t.border} strokeWidth="3" />
            <circle cx="34" cy="34" r="28" fill="none" stroke={color} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)} strokeLinecap="round" transform="rotate(-90 34 34)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color }}>
            {mins}:{secs}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: t.text, fontFamily: t.font, fontWeight: 500, marginBottom: 4, textTransform: 'capitalize' }}>{mode.label}</div>
          <div style={{ fontSize: 11, color: t.muted, fontFamily: t.font, marginBottom: 10 }}>{cycles} session{cycles !== 1 ? 's' : ''} completed</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setRunning(r => !r)} style={{ background: color, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontFamily: t.font, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {running ? '⏸ pause' : '▶ start'}
            </button>
            <button onClick={reset} style={{ background: 'transparent', color: t.muted, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', fontFamily: t.font, fontSize: 12, cursor: 'pointer' }}>
              ↺
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
