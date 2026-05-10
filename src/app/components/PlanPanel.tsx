'use client'
import { RevisionPlan } from '../types'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  plan: RevisionPlan | null
  onStudyNext: (topic: string) => void
  onReset: () => void
  loading: boolean
}

export default function PlanPanel({ plan, onStudyNext, onReset, loading }: Props) {
  const { theme: t } = useAppTheme()

  if (loading || !plan) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: 16 }}>
        <div style={{ width: 36, height: 36, border: `2px solid ${t.border}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: t.accent, animation: 'pulse 1.5s ease-in-out infinite' }}>building your 15-min plan…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>// 15-minute revision plan</div>

      <div style={{ marginBottom: 24 }}>
        {plan.plan.map((block, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${t.border}`, paddingLeft: 16, marginBottom: 14 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, marginBottom: 4 }}>{block.time}</div>
            <div style={{ fontSize: 14, color: t.text, lineHeight: 1.5, fontFamily: t.font }}>{block.activity}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16, marginBottom: 24 }}>
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: '1.5rem' }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>🎯</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: t.accent, marginBottom: 8 }}>// next topic recommendation</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, fontFamily: t.font, marginBottom: 4 }}>{plan.next_topic}</div>
          <div style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>{plan.next_reason}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => onStudyNext(plan.next_topic)} style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 8, padding: '11px 22px', fontFamily: t.font, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          → Study Next Topic
        </button>
        <button onClick={onReset} style={{ background: 'transparent', color: t.accent, border: `1px solid ${t.border}`, borderRadius: 8, padding: '8px 16px', fontFamily: t.font, fontSize: 13, cursor: 'pointer' }}>
          ↺ New Session
        </button>
      </div>
    </div>
  )
}
