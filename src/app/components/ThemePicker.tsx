'use client'
import { APP_THEMES, AppTheme } from '../themes'
import { useAppTheme } from '../context/ThemeContext'

export default function ThemePicker({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useAppTheme()

  const pick = (t: AppTheme) => {
    setTheme(t)
    onClose()
  }

  return (
    <div style={{
      background: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
      padding: '16px 20px',
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.1em',
        color: theme.textMuted,
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        — choose your theme
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {APP_THEMES.map(t => {
          const active = t.id === theme.id
          return (
            <div
              key={t.id}
              onClick={() => pick(t)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                border: `${active ? 2 : 1}px solid ${active ? theme.accent : theme.border}`,
                background: active ? theme.cardBg : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: theme.font,
                fontSize: 13,
                color: active ? theme.accent : theme.textMuted,
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 16 }}>{t.emoji}</span>
              {t.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
