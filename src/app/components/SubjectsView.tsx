'use client'
import { StudySession } from '../types'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  sessions: StudySession[]
  onRevisit: (topic: string) => void
  streak: number
}

function getNextReview(session: StudySession): string {
  const pct = (session.score / session.totalQuestions) * 100
  const days = pct >= 90 ? 14 : pct >= 70 ? 7 : pct >= 40 ? 3 : 1
  const due = new Date(session.date)
  due.setDate(due.getDate() + days)
  return due.toISOString()
}

function isDue(session: StudySession): boolean {
  const due = new Date(getNextReview(session))
  return due <= new Date()
}

function groupBySubject(sessions: StudySession[]) {
  return sessions.reduce((acc, s) => {
    const key = s.subject || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {} as Record<string, StudySession[]>)
}

const SUBJECT_COLORS: Record<string, string> = {
  Science: '#4fc38a', History: '#d4a252', Maths: '#4d9fff', English: '#ff85c8',
  Geography: '#37a8dd', Physics: '#7c6af7', Biology: '#4fc38a', Chemistry: '#ff6b35', Other: '#888780',
}

export default function SubjectsView({ sessions, onRevisit, streak }: Props) {
  const { theme: t } = useAppTheme()
  const grouped = groupBySubject(sessions)
  const dueForReview = sessions.filter(isDue)

  const subjectLeaderboard = Object.entries(grouped).map(([subject, subs]) => ({
    subject,
    avgScore: Math.round(subs.reduce((a, s) => a + (s.score / s.totalQuestions) * 100, 0) / subs.length),
    sessions: subs.length,
    color: SUBJECT_COLORS[subject] || SUBJECT_COLORS.Other,
  })).sort((a, b) => b.avgScore - a.avgScore)

  if (sessions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 12 }}>
        <div style={{ fontSize: 40 }}>📚</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: t.accent }}>no sessions yet</div>
        <div style={{ fontSize: 14, color: t.textMuted, fontFamily: t.font, textAlign: 'center', maxWidth: 280 }}>Complete a War Room session and it'll appear here organised by subject.</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'streak', value: `${streak} 🔥` },
          { label: 'sessions', value: sessions.length },
          { label: 'avg score', value: sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.score / s.totalQuestions) * 100, 0) / sessions.length) + '%' : '—' },
          { label: 'subjects', value: Object.keys(grouped).length },
        ].map(stat => (
          <div key={stat.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 22, fontFamily: "'Space Mono', monospace", fontWeight: 700, color: t.accent, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Space Mono', monospace", letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Due for review */}
      {dueForReview.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#d4a252', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>⏰ due for review ({dueForReview.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dueForReview.map(s => (
              <div key={s.id} style={{ background: '#221a00', border: '1px solid #3d3000', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, color: t.text, fontFamily: t.font, fontWeight: 500 }}>{s.topic}</div>
                  <div style={{ fontSize: 11, color: '#d4a252', fontFamily: t.font }}>last score: {s.score}/{s.totalQuestions} — ready to revisit</div>
                </div>
                <button onClick={() => onRevisit(s.topic)} style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", background: '#d4a25222', color: '#d4a252', border: '1px solid #d4a25244', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
                  revisit →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>🏆 subject leaderboard</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subjectLeaderboard.map((s, rank) => (
            <div key={s.subject} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: rank === 0 ? '#d4a252' : rank === 1 ? '#888' : rank === 2 ? '#cd7f32' : t.textMuted, width: 24 }}>#{rank + 1}</div>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: t.text, fontFamily: t.font, fontWeight: 500 }}>{s.subject}</div>
                <div style={{ height: 4, background: t.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: s.color, width: `${s.avgScore}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: s.color }}>{s.avgScore}%</div>
                <div style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>{s.sessions} session{s.sessions !== 1 ? 's' : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All sessions */}
      {Object.entries(grouped).map(([subject, subSessions]) => (
        <div key={subject} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: SUBJECT_COLORS[subject] || '#888', flexShrink: 0 }} />
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: t.text, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{subject}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {subSessions.map(session => {
              const pct = Math.round((session.score / session.totalQuestions) * 100)
              const color = pct >= 80 ? t.success : pct >= 50 ? '#d4a252' : t.danger
              const due = isDue(session)
              return (
                <div key={session.id} style={{ background: t.surface, border: `1px solid ${due ? '#d4a25244' : t.border}`, borderRadius: 12, padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: t.text, fontFamily: t.font, fontWeight: 500, flex: 1, lineHeight: 1.3, marginRight: 8 }}>{session.topic}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, color, flexShrink: 0 }}>{session.score}/{session.totalQuestions}</div>
                  </div>
                  <div style={{ height: 4, background: t.border, borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: color, width: `${pct}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>{new Date(session.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    <button onClick={() => onRevisit(session.topic)} style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", background: t.accent + '22', color: t.accent, border: `1px solid ${t.accent + '44'}`, borderRadius: 6, padding: '3px 9px', cursor: 'pointer' }}>
                      revisit →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
