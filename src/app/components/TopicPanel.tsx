'use client'
import { useState } from 'react'
import { QuizMode } from '../types'
import { useAppTheme } from '../context/ThemeContext'

const QUICK_TOPICS = ['Photosynthesis', 'The French Revolution', "Newton's Laws of Motion", 'DNA Replication', 'World War II causes']

interface Props {
  onStart: (topic: string, mode: QuizMode) => void
  loading: boolean
  error: string
}

export default function TopicPanel({ onStart, loading, error }: Props) {
  const [topic, setTopic] = useState('')
  const [mode, setMode] = useState<QuizMode>('typed')
  const { theme: t } = useAppTheme()

  const MODES: { id: QuizMode; label: string; desc: string; icon: string }[] = [
    { id: 'typed', label: 'typed answers', desc: 'write your answer freely', icon: '✏️' },
    { id: 'multiple-choice', label: 'multiple choice', desc: '4 options per question', icon: '🔘' },
    { id: 'essay', label: 'essay mode', desc: 'longer written answers', icon: '📝' },
  ]

  return (
    <div className="fade-in">
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>// enter your topic or paste notes</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {QUICK_TOPICS.map(q => (
          <div key={q} onClick={() => setTopic(q)} style={{ fontSize: 13, padding: '5px 14px', borderRadius: 20, border: `1px solid ${t.border}`, color: t.textMuted, cursor: 'pointer', background: topic === q ? t.surface : 'transparent', fontFamily: t.font, transition: 'all 0.2s' }}>
            {q}
          </div>
        ))}
      </div>

      <textarea
        rows={5}
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Type a topic or paste your notes, a paragraph from a textbook, anything..."
        style={{ width: '100%', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontFamily: t.font, fontSize: 14, padding: '1rem', resize: 'none', outline: 'none', lineHeight: 1.6, marginBottom: 16 }}
        onFocus={e => e.target.style.borderColor = t.accent}
        onBlur={e => e.target.style.borderColor = t.border}
      />

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>// quiz mode</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {MODES.map(m => (
          <div key={m.id} onClick={() => setMode(m.id)} style={{ padding: '12px', borderRadius: 10, border: `${mode === m.id ? 2 : 1}px solid ${mode === m.id ? t.accent : t.border}`, background: mode === m.id ? t.surface : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 13, color: mode === m.id ? t.accent : t.text, fontFamily: t.font, fontWeight: 500, marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          disabled={loading || !topic.trim()}
          onClick={() => onStart(topic.trim(), mode)}
          style={{ background: loading || !topic.trim() ? t.border : t.accent, color: loading || !topic.trim() ? t.textMuted : t.accentText, border: 'none', borderRadius: 8, padding: '11px 24px', fontFamily: t.font, fontSize: 14, fontWeight: 600, cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
        >
          {loading ? 'Generating…' : mode === 'essay' ? '📝 Generate Essay Prompts' : '⚡ Generate Study Session'}
        </button>
        <span style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>
          {mode === 'essay' ? '3 essay prompts + mark schemes' : '10 questions + 5 flashcards + revision plan'}
        </span>
      </div>

      {error && <div style={{ background: '#2a0f0f', border: '1px solid #4a1b1b', borderRadius: 10, padding: '1rem', color: '#e24b4a', fontSize: 14, marginTop: 12 }}>{error}</div>}
    </div>
  )
}
