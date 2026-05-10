'use client'
import { useState } from 'react'
import { useAppTheme } from '../context/ThemeContext'

interface Props {
  usedToday: number
  limit: number
  plan: string
  onClose: () => void
}

export default function UpgradeModal({ usedToday, limit, plan, onClose }: Props) {
  const { theme: t } = useAppTheme()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000bb', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: '32px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
        <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8 }}>Daily limit reached</h2>
        <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
          You've used <strong style={{ color: t.accent }}>{usedToday}/{limit}</strong> sessions today on the free plan.
          Upgrade to Pro for 20 sessions per day.
        </p>

        <div style={{ background: t.bg, border: `1px solid #7c6af744`, borderRadius: 12, padding: '20px', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#7c6af7', marginBottom: 8 }}>PRO — $10/month</div>
          {['20 sessions per day', 'Everything in Free', 'Priority AI responses', 'Early access to new features'].map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 13, color: t.text }}>
              <span style={{ color: '#4fc38a' }}>✓</span> {f}
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{ width: '100%', background: '#7c6af7', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontFamily: t.font, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 10, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Redirecting to checkout…' : 'Upgrade to Pro →'}
        </button>
        <button onClick={onClose} style={{ background: 'transparent', color: t.textMuted, border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: t.font }}>
          Maybe later
        </button>
        <p style={{ fontSize: 11, color: t.textMuted, marginTop: 12 }}>Resets every day at midnight · Cancel anytime</p>
      </div>
    </div>
  )
}
