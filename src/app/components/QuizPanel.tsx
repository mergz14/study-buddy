'use client'
import { useState } from 'react'
import { Question, QuizMode } from '../types'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  questions: Question[]
  answers: string[]
  topic: string
  mode: QuizMode
  onAnswerChange: (i: number, val: string) => void
  onSubmit: () => void
  loading: boolean
  error: string
}

export default function QuizPanel({ questions, answers, topic, mode, onAnswerChange, onSubmit, loading, error }: Props) {
  const { theme: t } = useAppTheme()
  const [shownHints, setShownHints] = useState<Set<number>>(new Set())

  const toggleHint = (i: number) => setShownHints(prev => {
    const next = new Set(prev)
    next.has(i) ? next.delete(i) : next.add(i)
    return next
  })

  if (loading || questions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: 16 }}>
        <div style={{ width: 36, height: 36, border: `2px solid ${t.border}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: t.accent }}>generating your questions…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const allAnswered = answers.every(a => a.trim().length > 0)

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>// {mode === 'multiple-choice' ? 'multiple choice' : 'typed'} — {questions.length} questions</div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, background: t.inputBg, border: `1px solid ${t.border}`, color: t.accent, padding: '4px 12px', borderRadius: 20 }}>{topic.length > 28 ? topic.slice(0, 28) + '…' : topic}</span>
      </div>

      {questions.map((q, i) => (
        <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.accent, letterSpacing: '0.1em' }}>Q{String(i + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</div>
            {q.hint && (
              <button onClick={() => toggleHint(i)} style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", background: shownHints.has(i) ? t.accent + '22' : 'transparent', color: t.accent, border: `1px solid ${t.accent + '44'}`, borderRadius: 6, padding: '3px 9px', cursor: 'pointer', transition: 'all 0.15s' }}>
                {shownHints.has(i) ? 'hide hint' : '💡 hint'}
              </button>
            )}
          </div>

          <div style={{ fontSize: 15, color: t.text, marginBottom: shownHints.has(i) ? 10 : 14, lineHeight: 1.5, fontFamily: t.font }}>{q.q}</div>

          {shownHints.has(i) && q.hint && (
            <div style={{ fontSize: 12, color: t.textMuted, fontFamily: t.font, marginBottom: 12, padding: '8px 12px', background: t.inputBg, borderRadius: 8, borderLeft: `3px solid ${t.accent}`, fontStyle: 'italic' }}>
              💡 {q.hint}
            </div>
          )}

          {mode === 'multiple-choice' && q.options ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => (
                <div key={oi} onClick={() => onAnswerChange(i, opt)} style={{ padding: '10px 14px', borderRadius: 8, border: `${answers[i] === opt ? 2 : 1}px solid ${answers[i] === opt ? t.accent : t.border}`, background: answers[i] === opt ? t.accent + '22' : t.inputBg, cursor: 'pointer', fontSize: 14, color: answers[i] === opt ? t.accent : t.text, fontFamily: t.font, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${answers[i] === opt ? t.accent : t.border}`, background: answers[i] === opt ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, color: t.accentText }}>
                    {answers[i] === opt ? '✓' : ''}
                  </div>
                  {opt}
                </div>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Your answer…"
              value={answers[i] ?? ''}
              onChange={e => onAnswerChange(i, e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && allAnswered) onSubmit() }}
              style={{ width: '100%', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: t.font, fontSize: 14, padding: '9px 12px', outline: 'none' }}
            />
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={onSubmit} disabled={!allAnswered} style={{ background: allAnswered ? t.accent : t.border, color: allAnswered ? t.accentText : t.textMuted, border: 'none', borderRadius: 8, padding: '11px 22px', fontFamily: t.font, fontSize: 14, fontWeight: 600, cursor: allAnswered ? 'pointer' : 'not-allowed' }}>
          ✓ Mark My Answers
        </button>
        {!allAnswered && <span style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>answer all questions to continue</span>}
      </div>

      {error && <div style={{ background: '#2a0f0f', border: '1px solid #4a1b1b', borderRadius: 10, padding: '1rem', color: '#e24b4a', fontSize: 14, marginTop: 12 }}>{error}</div>}
    </div>
  )
}
