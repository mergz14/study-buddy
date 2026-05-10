'use client'
import { useState } from 'react'
import { Flashcard } from '../types'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  flashcards: Flashcard[]
  weakAreas: string
  onNext: () => void
  loading: boolean
}

export default function FlashcardsPanel({ flashcards, weakAreas, onNext, loading }: Props) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const { theme: t } = useAppTheme()

  if (loading || flashcards.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: 16 }}>
        <div style={{ width: 36, height: 36, border: `2px solid ${t.border}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: t.accent, animation: 'pulse 1.5s ease-in-out infinite' }}>crafting your flashcards…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
      </div>
    )
  }

  const toggle = (i: number) => {
    setFlipped(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>// 3 flashcards — click to flip</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {flashcards.map((fc, i) => {
          const isFlipped = flipped.has(i)
          return (
            <div
              key={i}
              onClick={() => toggle(i)}
              style={{ background: isFlipped ? t.inputBg : t.cardBg, border: `${isFlipped ? 2 : 1}px solid ${isFlipped ? t.accent : t.border}`, borderRadius: 12, padding: '1.25rem', cursor: 'pointer', minHeight: 130, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s' }}
            >
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: isFlipped ? t.accent : t.textMuted, marginBottom: 8 }}>{isFlipped ? '◀ BACK' : '▶ FRONT'}</div>
                <div style={{ fontSize: 14, color: isFlipped ? t.textMuted : t.text, lineHeight: 1.4, fontFamily: t.font, fontWeight: isFlipped ? 400 : 500 }}>
                  {isFlipped ? fc.back : fc.front}
                </div>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.border, marginTop: 8 }}>{isFlipped ? 'tap to flip back' : 'tap to flip'}</div>
            </div>
          )
        })}
      </div>

      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>// weak areas identified</div>
        <p style={{ fontSize: 14, color: t.text, lineHeight: 1.7, fontFamily: t.font }}>{weakAreas || 'Good performance — review all areas to reinforce knowledge.'}</p>
      </div>

      <button onClick={onNext} style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 8, padding: '11px 22px', fontFamily: t.font, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        📅 See Revision Plan
      </button>
    </div>
  )
}
