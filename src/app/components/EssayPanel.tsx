'use client'
import { useState } from 'react'
import { EssayPrompt } from '../types'
import { useAppTheme } from '../context/ThemeContext'
import { callAI } from '../lib/api'

interface Props {
  prompts: EssayPrompt[]
  topic: string
  onBack: () => void
}

export default function EssayPanel({ prompts, topic, onBack }: Props) {
  const { theme: t } = useAppTheme()
  const [selected, setSelected] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ grade: string; comments: string; strengths: string; improvements: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length
  const prompt = prompts[selected]

  async function submitEssay() {
    if (!answer.trim() || loading) return
    setLoading(true)
    try {
      const raw = await callAI(
        `Topic: "${topic}"\nEssay question: "${prompt.prompt}"\nMark scheme: "${prompt.markScheme}"\n\nStudent essay:\n${answer}\n\nMark this essay. Return ONLY valid JSON:\n{"grade":"A/B/C/D/E","comments":"overall feedback in 2-3 sentences","strengths":"what they did well","improvements":"specific things to improve"}`,
        'You are an experienced teacher marking student essays. Be fair, constructive and specific. Return only valid JSON.'
      )
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setFeedback(parsed)
    } catch {
      setFeedback({ grade: '?', comments: 'Could not mark essay. Please try again.', strengths: '', improvements: '' })
    } finally {
      setLoading(false)
    }
  }

  const gradeColor: Record<string, string> = { A: '#4fc38a', B: '#7c6af7', C: '#d4a252', D: '#ff6b35', E: '#e24b4a' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 12px', fontFamily: t.font, fontSize: 12, cursor: 'pointer' }}>← back</button>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>// essay mode — {topic}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {prompts.map((p, i) => (
          <div key={i} onClick={() => { setSelected(i); setAnswer(''); setFeedback(null) }} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `${selected === i ? 2 : 1}px solid ${selected === i ? t.accent : t.border}`, background: selected === i ? t.surface : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: t.accent, marginBottom: 4 }}>QUESTION {i + 1}</div>
            <div style={{ fontSize: 13, color: t.text, fontFamily: t.font, lineHeight: 1.4 }}>{p.prompt}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font, marginTop: 4 }}>{p.wordCount}</div>
          </div>
        ))}
      </div>

      {!feedback ? (
        <>
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px 14px', marginBottom: 12, fontSize: 12, color: t.textMuted, fontFamily: t.font }}>
            <strong style={{ color: t.text }}>Mark scheme:</strong> {prompt.markScheme}
          </div>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Write your essay here..."
            rows={12}
            style={{ width: '100%', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontFamily: t.font, fontSize: 14, padding: '1rem', resize: 'vertical', outline: 'none', lineHeight: 1.7, marginBottom: 10 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: t.textMuted, fontFamily: t.font }}>{wordCount} words</span>
            <button onClick={submitEssay} disabled={loading || !answer.trim()} style={{ background: answer.trim() && !loading ? t.accent : t.border, color: answer.trim() && !loading ? t.accentText : t.textMuted, border: 'none', borderRadius: 8, padding: '10px 22px', fontFamily: t.font, fontSize: 14, fontWeight: 600, cursor: answer.trim() && !loading ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Marking…' : '✓ Submit for marking'}
            </button>
          </div>
        </>
      ) : (
        <div className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: (gradeColor[feedback.grade] || t.accent) + '22', border: `2px solid ${gradeColor[feedback.grade] || t.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color: gradeColor[feedback.grade] || t.accent }}>{feedback.grade}</div>
            <div style={{ fontSize: 14, color: t.text, fontFamily: t.font, lineHeight: 1.6, flex: 1 }}>{feedback.comments}</div>
          </div>
          {[{ label: '✓ strengths', text: feedback.strengths, color: t.success }, { label: '→ improve', text: feedback.improvements, color: t.accent }].map(s => s.text && (
            <div key={s.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: '14px', marginBottom: 10 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: s.color, letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 13, color: t.text, fontFamily: t.font, lineHeight: 1.6 }}>{s.text}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => { setFeedback(null) }} style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 8, padding: '10px 18px', fontFamily: t.font, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Try again</button>
            <button onClick={onBack} style={{ background: 'transparent', color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: t.font, fontSize: 13, cursor: 'pointer' }}>← back to war room</button>
          </div>
        </div>
      )}
    </div>
  )
}
