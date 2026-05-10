'use client'
import { View } from '../types'
import { useAppTheme } from '../context/ThemeContext'
import { APP_THEMES } from '../themes'

interface Props {
  view: View
  setView: (v: View) => void
  sessionCount: number
  homeworkCount: number
  wrongCount: number
  streak: number
  examDaysLeft: number | null
}

const NAV = [
  { id: 'warroom' as View, icon: '⚡', label: 'War Room' },
  { id: 'subjects' as View, icon: '📚', label: 'Subjects' },
  { id: 'chat' as View, icon: '💬', label: 'Study Buddy' },
  { id: 'homework' as View, icon: '📝', label: 'Homework' },
  { id: 'wronganswers' as View, icon: '🎯', label: 'Drill Zone' },
]

export default function Sidebar({ view, setView, sessionCount, homeworkCount, wrongCount, streak, examDaysLeft }: Props) {
  const { theme: t, setTheme } = useAppTheme()

  return (
    <div style={{ width: 220, background: t.surface, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0, transition: 'background 0.4s' }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: streak > 0 ? 10 : 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: t.text }}>STUDY.AI</div>
            <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Space Mono', monospace" }}>war room</div>
          </div>
        </div>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: t.accent + '15', border: `1px solid ${t.accent + '33'}` }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent }}>{streak} day streak</span>
          </div>
        )}
        {examDaysLeft !== null && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: examDaysLeft <= 3 ? '#e24b4a15' : '#d4a25215', border: `1px solid ${examDaysLeft <= 3 ? '#e24b4a33' : '#d4a25233'}` }}>
            <span style={{ fontSize: 14 }}>📅</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: examDaysLeft <= 3 ? '#e24b4a' : '#d4a252' }}>{examDaysLeft}d to exam</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ padding: '10px 10px', flex: 1 }}>
        <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>menu</div>
        {NAV.map(item => {
          const active = view === item.id
          const badge = item.id === 'subjects' ? sessionCount : item.id === 'homework' ? homeworkCount : item.id === 'wronganswers' ? wrongCount : 0
          return (
            <div key={item.id} onClick={() => setView(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 2, cursor: 'pointer', background: active ? t.accent + '22' : 'transparent', border: `1px solid ${active ? t.accent + '44' : 'transparent'}`, transition: 'all 0.15s' }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 13, color: active ? t.accent : t.text, fontFamily: t.font, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              {badge > 0 && <span style={{ fontSize: 10, background: t.accent, color: t.accentText, borderRadius: 10, padding: '1px 6px', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{badge}</span>}
            </div>
          )
        })}

        {/* Themes */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>theme</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 4px' }}>
            {APP_THEMES.map(th => (
              <div key={th.id} onClick={() => setTheme(th)} title={th.label} style={{ width: 28, height: 28, borderRadius: 8, background: th.accent, cursor: 'pointer', border: `2px solid ${t.id === th.id ? '#fff' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', transition: 'all 0.15s' }}>
                {t.id === th.id ? '✓' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 14px', borderTop: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>
          <div style={{ color: t.text, fontWeight: 500, marginBottom: 2 }}>Study Buddy</div>
          <div>powered by Claude AI</div>
        </div>
      </div>
    </div>
  )
}
