'use client'
import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { callAI, parseJSON } from '../lib/api'
import { AppState, EssayPrompt, Flashcard, HomeworkItem, MarkingResult, Question, QuizMode, RevisionPlan, Stage, StudySession, StudyStreak, View, WrongAnswer } from '../types'
import { useAppTheme } from '../context/ThemeContext'
import TopicPanel from '../components/TopicPanel'
import QuizPanel from '../components/QuizPanel'
import ResultsPanel from '../components/ResultsPanel'
import FlashcardsPanel from '../components/FlashcardsPanel'
import PlanPanel from '../components/PlanPanel'
import AmbientPanel from '../components/AmbientPanel'
import Sidebar from '../components/Sidebar'
import SubjectsView from '../components/SubjectsView'
import ChatPanel from '../components/ChatPanel'
import HomeworkPanel from '../components/HomeworkPanel'
import WrongAnswersBank from '../components/WrongAnswersBank'
import PomodoroTimer from '../components/PomodoroTimer'
import EssayPanel from '../components/EssayPanel'
import UpgradeModal from '../components/UpgradeModal'

const STAGES = ['01 / topic', '02 / quiz', '03 / results', '04 / flashcards', '05 / plan']
const SUBJECTS = ['Science', 'History', 'Maths', 'English', 'Geography', 'Physics', 'Biology', 'Chemistry', 'Other']

const INITIAL_STATE: AppState = {
  topic: '', subject: 'Other', mode: 'typed', questions: [], answers: [],
  markingResult: null, flashcards: [], revisionPlan: null, essayPrompts: [], stage: 0,
}

function ls<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function lsSet(key: string, val: unknown) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

function computeStreak(sessions: StudySession[]): StudyStreak {
  if (sessions.length === 0) return { count: 0, lastDate: '' }
  const stored = ls<StudyStreak>('study-streak', { count: 0, lastDate: '' })
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (stored.lastDate === today) return stored
  if (stored.lastDate === yesterday) { const n = { count: stored.count + 1, lastDate: today }; lsSet('study-streak', n); return n }
  const r = { count: 1, lastDate: today }; lsSet('study-streak', r); return r
}

function getExamDaysLeft(homework: HomeworkItem[]): number | null {
  const exams = homework.filter(h => h.isExam && !h.done && h.dueDate)
  if (exams.length === 0) return null
  const soonest = exams.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
  const days = Math.ceil((new Date(soonest.dueDate).getTime() - Date.now()) / 86400000)
  return days >= 0 ? days : null
}

export default function StudyApp() {
  const { user } = useUser()
  const { theme: t } = useAppTheme()
  const [view, setView] = useState<View>('warroom')
  const [state, setState] = useState<AppState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAmbient, setShowAmbient] = useState(false)
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [homework, setHomework] = useState<HomeworkItem[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([])
  const [streak, setStreak] = useState<StudyStreak>({ count: 0, lastDate: '' })
  const [showEssay, setShowEssay] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{ usedToday: number; limit: number; plan: string } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    setSessions(ls('study-sessions', []))
    setHomework(ls('study-homework', []))
    setWrongAnswers(ls('study-wrong', []))
    setStreak(ls('study-streak', { count: 0, lastDate: '' }))
    fetchUsage()

    // Check if just upgraded
    if (window.location.search.includes('upgraded=true')) {
      fetchUsage()
      window.history.replaceState({}, '', '/app')
    }
  }, [])

  async function fetchUsage() {
    try {
      const res = await fetch('/api/check-limit')
      if (res.ok) { const data = await res.json(); setUsageInfo(data) }
    } catch {}
  }

  function saveSessions(s: StudySession[]) { setSessions(s); lsSet('study-sessions', s) }
  function saveHomework(h: HomeworkItem[]) { setHomework(h); lsSet('study-homework', h) }
  function saveWrong(w: WrongAnswer[]) { setWrongAnswers(w); lsSet('study-wrong', w) }
  const setStage = (stage: Stage) => setState(s => ({ ...s, stage }))

  async function checkLimitAndProceed(): Promise<boolean> {
    try {
      const res = await fetch('/api/check-limit')
      const data = await res.json()
      setUsageInfo(data)
      if (!data.allowed) { setShowUpgrade(true); return false }
      return true
    } catch { return true }
  }

  async function handleStart(topic: string, mode: QuizMode) {
    const allowed = await checkLimitAndProceed()
    if (!allowed) return

    setError('')
    setLoading(true)
    setShowEssay(false)
    setState(s => ({ ...s, topic, mode, stage: mode === 'essay' ? 0 : 1, questions: [], answers: [], essayPrompts: [] }))

    if (mode === 'essay') {
      try {
        const raw = await callAI(
          `Topic: "${topic}"\n\nGenerate 3 essay questions with mark schemes. Return ONLY valid JSON:\n{"prompts":[{"prompt":"essay question","markScheme":"what markers look for","wordCount":"suggested word count e.g. 300-500 words"}]}`,
          'You are an exam setter. Create challenging essay questions. Return only valid JSON.'
        )
        const parsed = parseJSON<{ prompts: EssayPrompt[] }>(raw)
        setState(s => ({ ...s, topic, mode, essayPrompts: parsed.prompts ?? [], stage: 0 }))
        setShowEssay(true)
        await fetch('/api/increment-session', { method: 'POST' })
        fetchUsage()
      } catch (e) { setError(e instanceof Error ? e.message : 'Failed to generate essay prompts') }
      finally { setLoading(false) }
      return
    }

    try {
      const isMC = mode === 'multiple-choice'
      const prompt = isMC
        ? `Topic: "${topic}"\n\nGenerate 10 multiple choice questions. Hints must be subtle cryptic clues — never the answer itself, just a related concept, analogy or category. Return ONLY valid JSON:\n{"questions":[{"q":"question","hint":"subtle cryptic clue","options":["A","B","C","D"],"correctIndex":0}]}`
        : `Topic: "${topic}"\n\nGenerate 10 quiz questions. Hints must be subtle and cryptic — think analogies, first letter, category, memory trick. NEVER give away the answer directly. Return ONLY valid JSON:\n{"questions":[{"q":"question","hint":"subtle cryptic clue"}]}`
      const raw = await callAI(prompt, 'You are a quiz generator. Hints should be cryptic clues only, never the answer. Return only valid JSON.')
      const parsed = parseJSON<{ questions: Question[] }>(raw)
      if (!parsed.questions?.length) throw new Error('No questions returned')
      setState(s => ({ ...s, questions: parsed.questions, answers: new Array(parsed.questions.length).fill('') }))
      await fetch('/api/increment-session', { method: 'POST' })
      fetchUsage()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to generate questions') }
    finally { setLoading(false) }
  }

  async function handleMark() {
    setError(''); setLoading(true); setStage(2)
    try {
      const isMC = state.mode === 'multiple-choice'
      const qa = state.questions.map((q, i) => {
        const ans = state.answers[i]
        if (isMC) { const correct = q.options?.[q.correctIndex ?? 0] ?? ''; return `Q${i+1}: ${q.q}\nStudent picked: ${ans}\nCorrect: ${correct}` }
        return `Q${i+1}: ${q.q}\nAnswer: ${ans}`
      }).join('\n\n')
      const raw = await callAI(
        `Topic: "${state.topic}"\n\nStudent answers:\n${qa}\n\nMark each answer. Return ONLY valid JSON:\n{"results":[{"correct":true,"feedback":"explanation","score_label":"Correct","correct_answer":"the correct answer"}],"total_correct":N,"weak_areas":"one sentence","overall_comment":"one encouraging sentence"}`,
        'You are a strict but encouraging teacher. Return only valid JSON.'
      )
      const parsed = parseJSON<MarkingResult>(raw)
      setState(s => ({ ...s, markingResult: parsed }))
      const newWrong: WrongAnswer[] = []
      parsed.results.forEach((r, i) => {
        if (!r.correct) {
          newWrong.push({ id: Date.now() + '-' + i, topic: state.topic, subject: state.subject, question: state.questions[i]?.q ?? '', yourAnswer: state.answers[i] ?? '', correctAnswer: r.correct_answer ?? r.feedback, date: new Date().toISOString(), drilled: false })
        }
      })
      if (newWrong.length > 0) saveWrong([...newWrong, ...wrongAnswers])
      const session: StudySession = { id: Date.now().toString(), topic: state.topic, subject: state.subject, date: new Date().toISOString(), score: parsed.total_correct, totalQuestions: state.questions.length, mode: state.mode, questions: state.questions, markingResult: parsed, flashcards: [] }
      const newSessions = [session, ...sessions]
      saveSessions(newSessions)
      setStreak(computeStreak(newSessions))
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to mark answers') }
    finally { setLoading(false) }
  }

  async function handleFlashcards() {
    setError(''); setLoading(true); setStage(3)
    try {
      const raw = await callAI(`Topic: "${state.topic}". Weak areas: ${state.markingResult?.weak_areas ?? ''}\n\nGenerate 5 focused flashcards. Return ONLY valid JSON:\n{"flashcards":[{"front":"concept","back":"answer"}]}`, 'Return only valid JSON.')
      const parsed = parseJSON<{ flashcards: Flashcard[] }>(raw)
      setState(s => ({ ...s, flashcards: parsed.flashcards ?? [] }))
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  async function handlePlan() {
    setError(''); setLoading(true); setStage(4)
    try {
      const raw = await callAI(`Topic: "${state.topic}". Score: ${state.markingResult?.total_correct ?? 0}/${state.questions.length}. Weak areas: "${state.markingResult?.weak_areas ?? ''}".\n\nCreate a 15-minute revision plan and next topic recommendation. Return ONLY valid JSON:\n{"plan":[{"time":"0-3 min","activity":"what to do"}],"next_topic":"topic","next_reason":"why"}`, 'Return only valid JSON.')
      const parsed = parseJSON<RevisionPlan>(raw)
      setState(s => ({ ...s, revisionPlan: parsed }))
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  function handleAnswerChange(i: number, val: string) { setState(s => { const answers = [...s.answers]; answers[i] = val; return { ...s, answers } }) }
  function handleStudyNext(topic: string) { setState({ ...INITIAL_STATE, topic }); handleStart(topic, 'typed') }
  function handleReset() { setState(INITIAL_STATE); setError(''); setShowEssay(false) }
  function handleDrillWrong(item: WrongAnswer) { handleStart(item.topic, 'typed'); setView('warroom'); saveWrong(wrongAnswers.map(w => w.id === item.id ? { ...w, drilled: true } : w)) }
  function handleClearWrong(id: string) { saveWrong(wrongAnswers.filter(w => w.id !== id)) }

  const badgeText = state.topic ? (state.topic.length > 20 ? state.topic.slice(0, 20) + '…' : state.topic) : 'no topic'
  const pendingHW = homework.filter(h => !h.done).length
  const undrilledWrong = wrongAnswers.filter(w => !w.drilled).length
  const examDaysLeft = getExamDaysLeft(homework)

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: t.bg, fontFamily: t.font }}>
      {showUpgrade && usageInfo && (
        <UpgradeModal usedToday={usageInfo.usedToday} limit={usageInfo.limit} plan={usageInfo.plan} onClose={() => setShowUpgrade(false)} />
      )}

      <Sidebar view={view} setView={setView} sessionCount={sessions.length} homeworkCount={pendingHW} wrongCount={undrilledWrong} streak={streak.count} examDaysLeft={examDaysLeft} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: t.text }}>
            {view === 'warroom' && '⚡ War Room'}
            {view === 'subjects' && '📚 Subjects'}
            {view === 'chat' && '💬 Study Buddy'}
            {view === 'homework' && '📝 Homework'}
            {view === 'wronganswers' && '🎯 Drill Zone'}
          </div>

          {/* Usage bar */}
          {usageInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: usageInfo.plan === 'free' ? 'pointer' : 'default' }} onClick={() => usageInfo.plan === 'free' && setShowUpgrade(true)}>
              <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap' }}>
                {usageInfo.usedToday}/{usageInfo.limit}
                {usageInfo.plan === 'free' && <span style={{ color: t.accent, marginLeft: 6 }}>free</span>}
                {usageInfo.plan === 'pro' && <span style={{ color: '#4fc38a', marginLeft: 6 }}>pro ✓</span>}
              </div>
              <div style={{ width: 60, height: 4, background: t.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: usageInfo.usedToday >= usageInfo.limit ? '#e24b4a' : t.accent, width: `${Math.min((usageInfo.usedToday / usageInfo.limit) * 100, 100)}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}

          {view === 'warroom' && (
            <>
              {state.stage === 0 && (
                <select value={state.subject} onChange={e => setState(s => ({ ...s, subject: e.target.value }))} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontFamily: t.font, fontSize: 12, padding: '5px 10px', outline: 'none' }}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
              <button onClick={() => setShowPomodoro(v => !v)} style={{ background: showPomodoro ? '#7c6af722' : 'transparent', color: '#7c6af7', border: `1px solid ${t.border}`, borderRadius: 8, padding: '5px 12px', fontFamily: t.font, fontSize: 12, cursor: 'pointer' }}>⏱</button>
              <button onClick={() => setShowAmbient(v => !v)} style={{ background: showAmbient ? t.accent + '22' : 'transparent', color: t.accent, border: `1px solid ${t.border}`, borderRadius: 8, padding: '5px 12px', fontFamily: t.font, fontSize: 12, cursor: 'pointer' }}>🎵</button>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, background: t.inputBg, border: `1px solid ${t.border}`, color: t.accent, padding: '4px 10px', borderRadius: 20, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{badgeText}</div>
            </>
          )}

          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Stage bar */}
        {view === 'warroom' && !showEssay && (
          <div style={{ display: 'flex', background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '0 20px', overflowX: 'auto', flexShrink: 0 }}>
            {STAGES.map((label, i) => (
              <div key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '8px 14px', color: state.stage === i ? t.accent : state.stage > i ? t.success : t.textMuted, borderBottom: `2px solid ${state.stage === i ? t.accent : state.stage > i ? t.success + '44' : 'transparent'}`, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view === 'warroom' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {showPomodoro && <PomodoroTimer />}
              {showEssay && state.essayPrompts.length > 0
                ? <EssayPanel prompts={state.essayPrompts} topic={state.topic} onBack={handleReset} />
                : <>
                    {state.stage === 0 && <TopicPanel onStart={handleStart} loading={loading} error={error} />}
                    {state.stage === 1 && <QuizPanel questions={state.questions} answers={state.answers} topic={state.topic} mode={state.mode} onAnswerChange={handleAnswerChange} onSubmit={handleMark} loading={loading} error={error} />}
                    {state.stage === 2 && <ResultsPanel result={state.markingResult} questions={state.questions} answers={state.answers} topic={state.topic} onNext={handleFlashcards} loading={loading} />}
                    {state.stage === 3 && <FlashcardsPanel flashcards={state.flashcards} weakAreas={state.markingResult?.weak_areas ?? ''} onNext={handlePlan} loading={loading} />}
                    {state.stage === 4 && <PlanPanel plan={state.revisionPlan} onStudyNext={handleStudyNext} onReset={handleReset} loading={loading} />}
                  </>
              }
              {showAmbient && <div style={{ marginTop: 20 }}><AmbientPanel /></div>}
            </div>
          )}
          {view === 'subjects' && <div style={{ flex: 1, overflow: 'hidden' }}><SubjectsView sessions={sessions} onRevisit={t => handleStart(t, 'typed')} streak={streak.count} /></div>}
          {view === 'chat' && <div style={{ flex: 1, overflow: 'hidden' }}><ChatPanel /></div>}
          {view === 'homework' && <div style={{ flex: 1, overflow: 'hidden' }}><HomeworkPanel items={homework} setItems={saveHomework} /></div>}
          {view === 'wronganswers' && <div style={{ flex: 1, overflow: 'hidden' }}><WrongAnswersBank items={wrongAnswers} onDrill={handleDrillWrong} onClear={handleClearWrong} /></div>}
        </div>
      </div>
    </div>
  )
}
