'use client'
import { useEffect, useRef, useState } from 'react'

const THEMES = [
  { id: 'midnight', label: 'midnight', emoji: '🌑', bg: '#08080f', card: '#0f0d1e', border: '#1e1b3a', text: '#e8e6ff', accent: '#7c6af7', muted: '#3d3860', particleColor: '#c4bcff', particles: 'stars' as const },
  { id: 'galaxy',   label: 'galaxy',   emoji: '🌌', bg: '#050714', card: '#0a0b1f', border: '#1a1d3a', text: '#d4e4ff', accent: '#4d9fff', muted: '#2a3560', particleColor: '#ffffff', particles: 'stars' as const },
  { id: 'bw',       label: 'b & w',    emoji: '◐',  bg: '#0a0a0a', card: '#111',    border: '#2a2a2a', text: '#f0f0f0', accent: '#ffffff', muted: '#444',    particleColor: '#ffffff', particles: 'none' as const },
  { id: 'aesthetic',label: 'aesthetic',emoji: '🌸', bg: '#1a0d1a', card: '#220d22', border: '#3d1a3d', text: '#ffd6f0', accent: '#ff85c8', muted: '#5a2a5a', particleColor: '#ff85c8', particles: 'petals' as const },
  { id: 'lofi',     label: 'lo-fi',    emoji: '☕', bg: '#1a1208', card: '#221a08', border: '#3d300a', text: '#f5e6c8', accent: '#d4a252', muted: '#5a4420', particleColor: '#d4a252', particles: 'none' as const },
  { id: 'forest',   label: 'forest',   emoji: '🌿', bg: '#061208', card: '#091a0c', border: '#0f3015', text: '#c8f0d0', accent: '#4fc38a', muted: '#1a4020', particleColor: '#4fc38a', particles: 'stars' as const },
  { id: 'sunset',   label: 'sunset',   emoji: '🌅', bg: '#100806', card: '#1a0e08', border: '#3d1a08', text: '#ffe0c0', accent: '#ff6b35', muted: '#5a2a10', particleColor: '#ffaa44', particles: 'petals' as const },
  { id: 'ocean',    label: 'ocean',    emoji: '🌊', bg: '#040e18', card: '#06121f', border: '#0a2540', text: '#c0e8ff', accent: '#37a8dd', muted: '#0a2540', particleColor: '#85c8eb', particles: 'stars' as const },
]

const VIBES = ['orbs', 'stars', 'breathe', 'rain', 'off'] as const
type Vibe = typeof VIBES[number]
type Theme = typeof THEMES[number]

const PRESET_PLAYLISTS = [
  { label: 'lo-fi beats',      emoji: '☕', id: '0vvXsWCC9xrXsKd4eE4w8h', type: 'playlist' },
  { label: 'deep focus',       emoji: '🧠', id: '37i9dQZF1DWZeKCadgRdKQ', type: 'playlist' },
  { label: 'chill vibes',      emoji: '🌊', id: '37i9dQZF1DX4WYpdgoIcn6', type: 'playlist' },
  { label: 'study classical',  emoji: '🎻', id: '37i9dQZF1DWV0gynK7G6pD', type: 'playlist' },
  { label: 'peaceful piano',   emoji: '🎹', id: '37i9dQZF1DX4sWSpwq3LiO', type: 'playlist' },
  { label: 'ambient coding',   emoji: '💻', id: '37i9dQZF1DX5trt9i14X7j', type: 'playlist' },
]

function parseSpotifyUrl(url: string): { type: string; id: string } | null {
  try {
    const match = url.match(/spotify\.com\/(playlist|track|album|artist)\/([a-zA-Z0-9]+)/)
    if (match) return { type: match[1], id: match[2] }
    const uriMatch = url.match(/spotify:(playlist|track|album):([a-zA-Z0-9]+)/)
    if (uriMatch) return { type: uriMatch[1], id: uriMatch[2] }
    return null
  } catch {
    return null
  }
}

export default function AmbientPanel() {
  const [theme, setTheme] = useState<Theme>(THEMES[0])
  const [vibe, setVibe] = useState<Vibe>('orbs')
  const [brightness, setBrightness] = useState(55)
  const [speed, setSpeed] = useState(5)
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' })
  const [embedInput, setEmbedInput] = useState('')
  const [embedSrc, setEmbedSrc] = useState<string | null>(null)
  const [embedError, setEmbedError] = useState('')
  const sceneRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const t = theme

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime({ h: String(now.getHours()).padStart(2, '0'), m: String(now.getMinutes()).padStart(2, '0'), s: String(now.getSeconds()).padStart(2, '0') })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return
    const scene = sceneRef.current
    scene.innerHTML = ''
    if (animRef.current) clearInterval(animRef.current)
    if (vibe === 'off') return

    const bright = brightness / 100
    const spd = speed / 5

    if (vibe === 'orbs') {
      const positions = [{ x: 55, y: -45, w: 190, delay: 0 }, { x: 300, y: 15, w: 140, delay: -3 }, { x: 480, y: -55, w: 170, delay: -6 }]
      positions.forEach(p => {
        const el = document.createElement('div')
        el.style.cssText = `position:absolute;border-radius:50%;width:${p.w}px;height:${p.w}px;left:${p.x}px;top:${p.y}px;background:${t.accent};opacity:${bright * 0.22};animation:ambOrb ${9 / spd}s ease-in-out infinite;animation-delay:${p.delay}s`
        scene.appendChild(el)
      })
    }

    if (vibe === 'breathe') {
      const el = document.createElement('div')
      el.style.cssText = `position:absolute;border-radius:50%;width:270px;height:270px;left:50%;top:50%;transform:translate(-50%,-50%);background:${t.accent};opacity:${bright * 0.18}`
      scene.appendChild(el)
      let phase = 0
      animRef.current = setInterval(() => {
        phase += 0.025 * spd
        el.style.opacity = String(0.05 + ((Math.sin(phase) + 1) / 2) * bright * 0.28)
      }, 50)
    }

    if (vibe === 'stars') {
      for (let i = 0; i < 55; i++) {
        const el = document.createElement('div')
        const sz = Math.random() * 2.5 + 0.8
        el.style.cssText = `position:absolute;border-radius:50%;width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:${t.particleColor};opacity:${Math.random() * bright * 0.8 + 0.1};animation:ambTw ${(Math.random() * 3 + 1.5) / spd}s ease-in-out infinite;animation-delay:${Math.random() * -4}s`
        scene.appendChild(el)
      }
    }

    if (vibe === 'rain') {
      for (let i = 0; i < 45; i++) {
        const el = document.createElement('div')
        const h = Math.random() * 18 + 8
        el.style.cssText = `position:absolute;width:1px;height:${h}px;border-radius:2px;left:${Math.random() * 100}%;top:0;background:${t.particleColor};opacity:${bright * 0.5};animation:ambRain ${(Math.random() * 0.8 + 0.4) / spd}s linear infinite;animation-delay:${Math.random() * -2}s`
        scene.appendChild(el)
      }
    }

    if ((vibe === 'orbs' || vibe === 'stars') && t.particles !== 'none') {
      for (let i = 0; i < 30; i++) {
        const el = document.createElement('div')
        const sz = Math.random() * 1.8 + 0.6
        el.style.cssText = `position:absolute;border-radius:50%;width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:${t.particleColor};opacity:${Math.random() * bright * 0.5 + 0.05};animation:ambTw ${(Math.random() * 3 + 2) / spd}s ease-in-out infinite;animation-delay:${Math.random() * -4}s`
        scene.appendChild(el)
      }
    }

    return () => { if (animRef.current) clearInterval(animRef.current) }
  }, [theme, vibe, brightness, speed])

  function loadPreset(type: string, id: string) {
    setEmbedSrc(`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`)
    setEmbedError('')
    setEmbedInput('')
  }

  function loadCustom() {
    const parsed = parseSpotifyUrl(embedInput.trim())
    if (!parsed) {
      setEmbedError('Paste a valid Spotify link — e.g. open.spotify.com/playlist/...')
      return
    }
    setEmbedError('')
    setEmbedSrc(`https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator&theme=0`)
  }

  const sl = (label: string) => (
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: t.muted, textTransform: 'uppercase', marginBottom: 10 }}>— {label}</div>
  )

  return (
    <div style={{ background: t.bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${t.border}`, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.5s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes ambOrb{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(18px,-12px) scale(1.06)}70%{transform:translate(-10px,8px) scale(0.95)}}
        @keyframes ambTw{0%,100%{opacity:0.2;transform:scale(0.7)}50%{opacity:1;transform:scale(1)}}
        @keyframes ambRain{0%{transform:translateY(-20px);opacity:0}10%{opacity:0.7}90%{opacity:0.4}100%{transform:translateY(200px);opacity:0}}
        @keyframes ambColon{0%,100%{opacity:1}50%{opacity:0.15}}
      `}</style>

      {/* Scene */}
      <div ref={sceneRef} style={{ width: '100%', height: 160, position: 'relative', overflow: 'hidden', background: t.bg, transition: 'background 0.6s' }} />

      <div style={{ padding: '14px 16px 20px', background: t.bg }}>

        {/* Flip clock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px 0 18px' }}>
          {[time.h, time.m, time.s].map((seg, si) => (
            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[seg[0], seg[1]].map((d, di) => (
                    <div key={di} style={{ width: 40, height: 54, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", fontSize: 26, fontWeight: 700, background: t.card, border: `1px solid ${t.border}`, color: t.text, transition: 'all 0.4s' }}>{d}</div>
                  ))}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.08em', color: t.muted }}>{['hours', 'mins', 'secs'][si]}</div>
              </div>
              {si < 2 && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: t.muted, paddingBottom: 18, animation: 'ambColon 1s step-end infinite' }}>:</div>}
            </div>
          ))}
        </div>

        {/* Spotify embed */}
        {sl('spotify player')}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
          {PRESET_PLAYLISTS.map(p => (
            <div
              key={p.id}
              onClick={() => loadPreset(p.type, p.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: embedSrc?.includes(p.id) ? t.card : 'transparent', color: embedSrc?.includes(p.id) ? t.accent : t.muted, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: embedSrc?.includes(p.id) ? 600 : 400, transition: 'all 0.2s' }}
            >
              <span>{p.emoji}</span> {p.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input
            value={embedInput}
            onChange={e => { setEmbedInput(e.target.value); setEmbedError('') }}
            onKeyDown={e => { if (e.key === 'Enter') loadCustom() }}
            placeholder="or paste any Spotify link..."
            style={{ flex: 1, background: t.card, border: `1px solid ${embedError ? '#e24b4a' : t.border}`, borderRadius: 8, color: t.text, fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: '8px 12px', outline: 'none' }}
          />
          <button
            onClick={loadCustom}
            style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 8, padding: '8px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Load
          </button>
        </div>

        {embedError && (
          <div style={{ fontSize: 12, color: '#e24b4a', fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>{embedError}</div>
        )}

        {embedSrc && (
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16, border: `1px solid ${t.border}` }}>
            <iframe
              src={embedSrc}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ display: 'block' }}
            />
          </div>
        )}

        {!embedSrc && (
          <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, fontSize: 12, color: t.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Pick a playlist above or paste a Spotify link to start playing
          </div>
        )}

        {/* Theme */}
        {sl('theme')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
          {THEMES.map(th => (
            <div key={th.id} onClick={() => setTheme(th)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 10, border: `${theme.id === th.id ? 2 : 1}px solid ${theme.id === th.id ? t.accent : t.border}`, background: theme.id === th.id ? t.card : 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: theme.id === th.id ? t.accent : t.muted, fontWeight: theme.id === th.id ? 600 : 400, transition: 'all 0.2s' }}>
              <span style={{ fontSize: 14 }}>{th.emoji}</span> {th.label}
            </div>
          ))}
        </div>

        {/* Ambience */}
        {sl('ambience')}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {VIBES.map(v => (
            <div key={v} onClick={() => setVibe(v)} style={{ borderRadius: 10, padding: '7px 12px', border: `${vibe === v ? 2 : 1}px solid ${vibe === v ? t.accent : t.border}`, cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, background: vibe === v ? t.card : 'transparent', color: vibe === v ? t.text : t.muted, transition: 'all 0.2s' }}>
              {v}
            </div>
          ))}
        </div>

        {/* Sliders */}
        {[
          { label: 'brightness', val: brightness, set: setBrightness },
          { label: 'speed',      val: speed * 10,  set: (v: number) => setSpeed(Math.round(v / 10)) },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: t.muted, width: 70, flexShrink: 0 }}>{s.label}</label>
            <input type="range" min={10} max={100} step={1} value={s.val} onChange={e => s.set(+e.target.value)} style={{ flex: 1, accentColor: t.accent, cursor: 'pointer' }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent, width: 28, textAlign: 'right' }}>{s.label === 'speed' ? speed : s.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
