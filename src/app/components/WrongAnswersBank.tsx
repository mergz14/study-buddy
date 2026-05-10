'use client'
import { useState } from 'react'
import { WrongAnswer } from '../types'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  items: WrongAnswer[]
  onDrill: (q: WrongAnswer) => void
  onClear: (id: string) => void
}

export default function WrongAnswersBank({ items, onDrill, onClear }: Props) {
  const { theme: t } = useAppTheme()
  const [filter, setFilter] = useState('all')
  const subjects = ['all', ...Array.from(new Set(items.map(i => i.subject)))]
  const filtered = filter === 'all' ? items : items.filter(i => i.subject === filter)
  const pending = items.filter(i => !i.drilled).length

  if (items.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 12 }}>
        <div style={{ fontSize: 40 }}>✅</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: t.accent }}>no wrong answers yet</div>
        <div style={{ fontSize: 14, color: t.textMuted, fontFamily: t.font, textAlign: 'center', maxWidth: 280 }}>Questions you get wrong will appear here so you can drill them until you nail them.</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 4 }}>Wrong Answers Bank</h2>
          <div style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>{pending} to drill · {items.length - pending} mastered</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <div key={s} onClick={() => setFilter(s)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filter === s ? t.accent : t.border}`, background: filter === s ? t.accent + '22' : 'transparent', color: filter === s ? t.accent : t.textMuted, fontSize: 12, fontFamily: "'Space Mono', monospace", cursor: 'pointer' }}>
            {s}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: t.surface, border: `1px solid ${item.drilled ? t.border : '#e24b4a44'}`, borderRadius: 12, padding: '16px', opacity: item.drilled ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: t.text, fontFamily: t.font, fontWeight: 500, flex: 1, marginRight: 12, lineHeight: 1.4 }}>{item.question}</div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {!item.drilled && (
                  <button onClick={() => onDrill(item)} style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", background: t.accent + '22', color: t.accent, border: `1px solid ${t.accent + '44'}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>drill →</button>
                )}
                <button onClick={() => onClear(item.id)} style={{ fontSize: 11, color: t.textMuted, background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#e24b4a', fontFamily: t.font, marginBottom: 4 }}>Your answer: {item.yourAnswer || '(blank)'}</div>
            <div style={{ fontSize: 12, color: t.success, fontFamily: t.font, marginBottom: 8 }}>Correct: {item.correctAnswer}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>{item.subject}</span>
              <span style={{ fontSize: 11, color: t.textMuted }}>·</span>
              <span style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              {item.drilled && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: t.success + '22', color: t.success, fontFamily: "'Space Mono', monospace" }}>mastered</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
