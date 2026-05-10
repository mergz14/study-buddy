'use client'
import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '../types'
import { useAppTheme } from '../context/ThemeContext'
import { callAI } from '../lib/api'

const STARTERS = [
  'Explain photosynthesis simply',
  'What caused World War I?',
  'Help me understand quadratic equations',
  'What is the water cycle?',
]

export default function ChatPanel() {
  const { theme: t } = useAppTheme()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hey! I'm your AI study assistant. Ask me anything — I can explain concepts, help with homework, or quiz you on a topic.", timestamp: new Date().toISOString() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const history = [...messages, userMsg].map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n')
      const reply = await callAI(
        `Conversation so far:\n${history}\n\nStudent: ${msg}\n\nRespond as a friendly, concise study tutor. Keep answers clear and under 150 words unless a detailed explanation is needed.`,
        'You are a friendly AI study tutor for school students. Be encouraging, clear and concise. Use examples where helpful.'
      )
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date().toISOString() }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again!', timestamp: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 2 }}>Study Buddy</h2>
        <div style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>Ask anything about your studies</div>
      </div>

      {/* Starters */}
      {messages.length <= 1 && (
        <div style={{ padding: '14px 24px', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          {STARTERS.map(s => (
            <div key={s} onClick={() => send(s)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, border: `1px solid ${t.border}`, color: t.textMuted, cursor: 'pointer', fontFamily: t.font, background: t.surface, transition: 'all 0.15s' }}>
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? t.accent : t.surface, color: m.role === 'user' ? t.accentText : t.text, fontSize: 14, fontFamily: t.font, lineHeight: 1.6, border: m.role === 'assistant' ? `1px solid ${t.border}` : 'none' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: t.surface, border: `1px solid ${t.border}`, display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, animation: `dotBounce 1s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
              ))}
              <style>{`@keyframes dotBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Ask your tutor anything..."
          style={{ flex: 1, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontFamily: t.font, fontSize: 14, padding: '10px 14px', outline: 'none' }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{ background: input.trim() && !loading ? t.accent : t.border, color: input.trim() && !loading ? t.accentText : t.textMuted, border: 'none', borderRadius: 10, padding: '10px 16px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: 16, transition: 'all 0.15s' }}
        >
          →
        </button>
      </div>
    </div>
  )
}
