'use client'
import { useState, useEffect } from 'react'
import { MarkingResult, Question } from '../types'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  result: MarkingResult | null
  questions: Question[]
  answers: string[]
  topic: string
  onNext: () => void
  loading: boolean
}

export default function ResultsPanel({ result, questions, answers, topic, onNext, loading }: Props) {
  const { theme: t } = useAppTheme()
  const [barWidth, setBarWidth] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (result) setTimeout(() => setBarWidth(Math.round((result.total_correct / questions.length) * 100)), 200)
  }, [result, questions.length])

  if (loading || !result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: 16 }}>
        <div style={{ width: 36, height: 36, border: `2px solid ${t.border}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: t.accent }}>marking your answers…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  function shareResults() {
    const pct = Math.round((result!.total_correct / questions.length) * 100)
    const text = `📚 Study Buddy Results\nTopic: ${topic}\nScore: ${result!.total_correct}/${questions.length} (${pct}%)\n${result!.overall_comment}\n\nStudied with Study Buddy AI`
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>// results & feedback</div>
        <button onClick={shareResults} style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", background: copied ? t.success + '22' : t.surface, color: copied ? t.success : t.textMuted, border: `1px solid ${copied ? t.success + '44' : t.border}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', transition: 'all 0.2s' }}>
          {copied ? '✓ copied!' : '↗ share'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 36, fontWeight: 700, color: t.accent }}>{result.total_correct}/{questions.length}</div>
        <div style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>{result.overall_comment}</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 6, background: t.border, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, background: barWidth >= 80 ? t.success : barWidth >= 50 ? '#d4a252' : t.danger, width: `${barWidth}%`, transition: 'width 1s ease' }} />
        </div>
      </div>

      {result.results.map((r, i) => (
        <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.accent, marginBottom: 8 }}>
            Q{String(i + 1).padStart(2, '0')} — <span style={{ color: r.correct ? t.success : t.danger }}>{r.score_label}</span>
          </div>
          <div style={{ fontSize: 14, color: t.text, marginBottom: 8, lineHeight: 1.5, fontFamily: t.font }}>{questions[i]?.q}</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8, fontFamily: t.font }}>
            Your answer: <span style={{ color: r.correct ? t.success : t.danger }}>{answers[i] || '(no answer)'}</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, padding: '10px 12px', borderRadius: 8, background: r.correct ? '#0f2a1f' : '#2a0f0f', color: r.correct ? t.success : '#f09595', border: `1px solid ${r.correct ? '#1a4a30' : '#4a1b1b'}`, fontFamily: t.font }}>
            {r.feedback}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <button onClick={onNext} style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 8, padding: '11px 22px', fontFamily: t.font, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          🃏 View Flashcards
        </button>
      </div>
    </div>
  )
}
