'use client'
import { useState } from 'react'
import { HomeworkItem } from '../types'
import { useAppTheme } from '../context/ThemeContext'

const SUBJECTS = ['Maths', 'Science', 'English', 'History', 'Geography', 'Physics', 'Biology', 'Chemistry', 'Other']
const PRIORITIES = ['low', 'medium', 'high'] as const
const PRIORITY_COLORS = { low: '#4fc38a', medium: '#d4a252', high: '#e24b4a' }

interface Props {
  items: HomeworkItem[]
  setItems: (items: HomeworkItem[]) => void
}

export default function HomeworkPanel({ items, setItems }: Props) {
  const { theme: t } = useAppTheme()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', subject: 'Maths', dueDate: '', priority: 'medium' as HomeworkItem['priority'], isExam: false })
  const [filter, setFilter] = useState<'all' | 'pending' | 'done' | 'exams'>('all')

  function addItem() {
    if (!form.title.trim()) return
    const item: HomeworkItem = { id: Date.now().toString(), title: form.title, subject: form.subject, dueDate: form.dueDate, priority: form.priority, done: false, isExam: form.isExam }
    setItems([...items, item])
    setForm({ title: '', subject: 'Maths', dueDate: '', priority: 'medium', isExam: false })
    setAdding(false)
  }

  function toggleDone(id: string) { setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i)) }
  function deleteItem(id: string) { setItems(items.filter(i => i.id !== id)) }

  const filtered = items.filter(i => {
    if (filter === 'all') return true
    if (filter === 'done') return i.done
    if (filter === 'exams') return i.isExam
    return !i.done
  })

  const pending = items.filter(i => !i.done).length
  const exams = items.filter(i => i.isExam && !i.done)
  const soonestExam = exams.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
  const examDaysLeft = soonestExam ? Math.ceil((new Date(soonestExam.dueDate).getTime() - Date.now()) / 86400000) : null

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      {examDaysLeft !== null && examDaysLeft >= 0 && (
        <div style={{ background: examDaysLeft <= 3 ? '#2a0f0f' : '#1a1200', border: `1px solid ${examDaysLeft <= 3 ? '#e24b4a44' : '#d4a25244'}`, borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>📅</span>
          <div>
            <div style={{ fontSize: 14, color: t.text, fontFamily: t.font, fontWeight: 500 }}>{soonestExam!.title}</div>
            <div style={{ fontSize: 13, color: examDaysLeft <= 3 ? '#e24b4a' : '#d4a252', fontFamily: t.font }}>{examDaysLeft === 0 ? 'Today!' : examDaysLeft === 1 ? 'Tomorrow!' : `${examDaysLeft} days left`}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 4 }}>Homework</h2>
          <div style={{ fontSize: 13, color: t.textMuted, fontFamily: t.font }}>{pending} pending · {items.filter(i => i.done).length} done</div>
        </div>
        <button onClick={() => setAdding(true)} style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 10, padding: '9px 16px', fontFamily: t.font, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add task</button>
      </div>

      {adding && (
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '18px', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>// new task</div>
          <input autoFocus placeholder="Task title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') addItem() }} style={{ width: '100%', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: t.font, fontSize: 14, padding: '9px 12px', outline: 'none', marginBottom: 10 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
            <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: t.font, fontSize: 13, padding: '8px 10px', outline: 'none' }}>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: t.font, fontSize: 13, padding: '8px 10px', outline: 'none' }} />
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as HomeworkItem['priority'] }))} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: t.font, fontSize: 13, padding: '8px 10px', outline: 'none' }}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p} priority</option>)}
            </select>
          </div>
          <div onClick={() => setForm(f => ({ ...f, isExam: !f.isExam }))} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${form.isExam ? t.accent : t.border}`, background: form.isExam ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: t.accentText, transition: 'all 0.15s' }}>{form.isExam ? '✓' : ''}</div>
            <span style={{ fontSize: 13, color: t.text, fontFamily: t.font }}>This is an exam</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addItem} style={{ background: t.accent, color: t.accentText, border: 'none', borderRadius: 8, padding: '8px 16px', fontFamily: t.font, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            <button onClick={() => setAdding(false)} style={{ background: 'transparent', color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 8, padding: '8px 14px', fontFamily: t.font, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {(['all', 'pending', 'exams', 'done'] as const).map(f => (
          <div key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filter === f ? t.accent : t.border}`, background: filter === f ? t.accent + '22' : 'transparent', color: filter === f ? t.accent : t.textMuted, fontSize: 12, fontFamily: "'Space Mono', monospace", cursor: 'pointer' }}>
            {f}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: t.textMuted, fontFamily: t.font }}>{items.length === 0 ? 'No tasks yet — add one above!' : 'Nothing here'}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)).map(item => (
            <div key={item.id} style={{ background: t.surface, border: `1px solid ${item.isExam && !item.done ? '#d4a25244' : t.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: item.done ? 0.6 : 1 }}>
              <div onClick={() => toggleDone(item.id)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.done ? t.success : t.border}`, background: item.done ? t.success : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: '#fff', transition: 'all 0.15s' }}>
                {item.done ? '✓' : ''}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: t.text, fontFamily: t.font, fontWeight: 500, textDecoration: item.done ? 'line-through' : 'none', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.title}
                  {item.isExam && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: '#d4a25222', color: '#d4a252', fontFamily: "'Space Mono', monospace" }}>EXAM</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: t.textMuted, fontFamily: t.font }}>{item.subject}</span>
                  {item.dueDate && <span style={{ fontSize: 11, color: t.textMuted }}>· due {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: PRIORITY_COLORS[item.priority] + '22', color: PRIORITY_COLORS[item.priority], fontFamily: "'Space Mono', monospace" }}>{item.priority}</span>
                </div>
              </div>
              <div onClick={() => deleteItem(item.id)} style={{ fontSize: 14, cursor: 'pointer', color: t.textMuted, opacity: 0.5 }}>✕</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
