'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const FEATURES = [
  { icon: '⚡', title: 'AI-Generated Quizzes', desc: '10 tailored questions on any topic, marked instantly with detailed feedback' },
  { icon: '🃏', title: 'Smart Flashcards', desc: '5 flashcards generated from your weakest areas — not random ones' },
  { icon: '📝', title: 'Essay Mode', desc: 'Essay prompts with mark schemes, graded by AI like a real teacher' },
  { icon: '🔘', title: 'Multiple Choice', desc: 'Four options per question for exam-style practice' },
  { icon: '⏱', title: 'Pomodoro Timer', desc: '25-minute focus sessions built right into the study flow' },
  { icon: '🔥', title: 'Study Streaks', desc: 'Track how many days in a row you\'ve studied and keep the momentum' },
  { icon: '🏆', title: 'Subject Leaderboard', desc: 'See your strongest and weakest subjects ranked by average score' },
  { icon: '🎯', title: 'Drill Zone', desc: 'Every wrong answer saved so you can drill your weak spots specifically' },
  { icon: '⏰', title: 'Spaced Repetition', desc: 'App reminds you when to revisit topics based on your score' },
  { icon: '📅', title: 'Exam Countdown', desc: 'Set your exam date and track how many days you have left' },
  { icon: '🎵', title: 'Ambient Mode', desc: 'Flip clock, ambient lighting, and Spotify player to set the vibe' },
  { icon: '🎨', title: '8 Themes', desc: 'Galaxy, aesthetic, lo-fi, ocean and more — make it yours' },
]

export default function LandingPage() {
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    scene.innerHTML = ''
    const orbs = [
      { x: '10%', y: '-30%', w: 500, c: '#4a3fa0', dur: 12 },
      { x: '60%', y: '-10%', w: 400, c: '#2d1f6e', dur: 16 },
      { x: '80%', y: '40%', w: 350, c: '#7c3aed', dur: 10 },
      { x: '20%', y: '50%', w: 300, c: '#1a0f3d', dur: 14 },
    ]
    orbs.forEach((o, i) => {
      const el = document.createElement('div')
      el.style.cssText = `position:absolute;border-radius:50%;width:${o.w}px;height:${o.w}px;left:${o.x};top:${o.y};background:${o.c};opacity:0.18;filter:blur(40px);animation:ldOrb ${o.dur}s ease-in-out infinite;animation-delay:${i * -3}s`
      scene.appendChild(el)
    })
  }, [])

  return (
    <div style={{ background: '#06060f', color: '#e8e6ff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', width: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes ldOrb{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(30px,-20px) scale(1.08)}70%{transform:translate(-20px,15px) scale(0.94)}}
        @keyframes ldFade{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .ld-fade{animation:ldFade 0.7s ease forwards}
        .ld-fade-2{animation:ldFade 0.7s 0.15s ease forwards;opacity:0}
        .ld-fade-3{animation:ldFade 0.7s 0.3s ease forwards;opacity:0}
        .ld-btn-primary{background:#7c6af7;color:#fff;border:none;border-radius:10px;padding:14px 28px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;transition:all 0.2s}
        .ld-btn-primary:hover{background:#6a59e0;transform:translateY(-2px)}
        .ld-btn-ghost{background:transparent;color:#a89af7;border:1px solid #2d2660;border-radius:10px;padding:12px 24px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;text-decoration:none;display:inline-block;transition:all 0.2s}
        .ld-btn-ghost:hover{background:#1a1535}
        .feat-card{background:#0d0b1e;border:1px solid #1e1b3a;border-radius:14px;padding:20px;transition:all 0.2s}
        .feat-card:hover{border-color:#4a3fa0;background:#110f2a;transform:translateY(-2px)}
        .price-card{background:#0d0b1e;border:1px solid #1e1b3a;border-radius:16px;padding:28px;flex:1}
        .price-pro{border-color:#7c6af7;background:linear-gradient(135deg,#0d0b1e,#120e2a)}
      `}</style>

      {/* Nav */}
      <nav style={{ padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e1b3a', position: 'sticky', top: 0, background: '#06060fdd', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#7c6af7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: '#c4bcff' }}>STUDY.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/sign-in" className="ld-btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }}>Sign in</Link>
          <Link href="/sign-up" className="ld-btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '100px 40px 80px', textAlign: 'center' }}>
        <div ref={sceneRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div className="ld-fade" style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#7c6af7', letterSpacing: '0.15em', textTransform: 'uppercase', background: '#7c6af722', border: '1px solid #7c6af744', borderRadius: 20, padding: '4px 14px', marginBottom: 24 }}>
            powered by Claude AI
          </div>
          <h1 className="ld-fade-2" style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.15, marginBottom: 20, background: 'linear-gradient(135deg, #e8e6ff 0%, #a89af7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Study smarter.<br />Not harder.
          </h1>
          <p className="ld-fade-3" style={{ fontSize: 18, color: '#7070a0', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Turn any topic or notes into quizzes, flashcards, essay practice and a personalised revision plan — in seconds.
          </p>
          <div className="ld-fade-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="ld-btn-primary">Start for free →</Link>
            <Link href="/sign-in" className="ld-btn-ghost">I have an account</Link>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: '#3d3860' }}>5 free sessions per day · no credit card required</div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#7c6af7', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>// everything you need</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#e8e6ff' }}>Built for real revision</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#e8e6ff', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#5a5580', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '60px 40px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#7c6af7', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>// pricing</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#e8e6ff' }}>Simple and fair</h2>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* Free */}
          <div className="price-card">
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#7070a0', marginBottom: 8 }}>FREE</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: '#e8e6ff', marginBottom: 4 }}>£0</div>
            <div style={{ fontSize: 13, color: '#5a5580', marginBottom: 24 }}>forever</div>
            {['5 study sessions per day', 'All quiz modes', 'Flashcards + essay mode', 'Pomodoro + ambient mode', 'Homework tracker', 'Drill zone + streaks'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, fontSize: 14, color: '#a89af7' }}>
                <span style={{ color: '#4fc38a', flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/sign-up" className="ld-btn-ghost" style={{ display: 'block', textAlign: 'center', marginTop: 24, width: '100%', padding: '12px' }}>Get started</Link>
          </div>

          {/* Pro */}
          <div className="price-card price-pro" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#7c6af7', color: '#fff', fontSize: 11, fontFamily: "'Space Mono', monospace", padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#7c6af7', marginBottom: 8 }}>PRO</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: '#e8e6ff', marginBottom: 4 }}>$10</div>
            <div style={{ fontSize: 13, color: '#5a5580', marginBottom: 24 }}>per month</div>
            {['20 study sessions per day', 'Everything in Free', 'Priority AI responses', 'Badge on your profile', 'Early access to new features', 'Support the project ❤️'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, fontSize: 14, color: '#c4bcff' }}>
                <span style={{ color: '#7c6af7', flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/sign-up" className="ld-btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 24, width: '100%', padding: '12px' }}>Upgrade to Pro →</Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ textAlign: 'center', padding: '60px 40px 80px', borderTop: '1px solid #1e1b3a' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#e8e6ff', marginBottom: 12 }}>Ready to ace your exams?</h2>
        <p style={{ color: '#5a5580', marginBottom: 28, fontSize: 16 }}>Join students already using Study Buddy to revise smarter.</p>
        <Link href="/sign-up" className="ld-btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Create free account →</Link>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #1e1b3a', fontSize: 12, color: '#2d2660' }}>
        © 2026 Study Buddy · Powered by Claude AI
      </div>
    </div>
  )
}
