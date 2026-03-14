import { useReducer, useEffect, useState } from 'react'
import { DEFAULT_CATEGORIES, loadState, saveState, todayKey, monthKey } from './data/categories'
import Daily from './components/Daily'
import Weekly from './components/Weekly'
import Monthly from './components/Monthly'
import { Vision } from './components/Vision'
import Milestones from './components/Milestones'
import Wisdom from './components/Wisdom'

// ─── INITIAL STATE ───────────────────────────────────────────────
const buildInitial = () => {
  const saved = loadState()
  return {
    username: saved.username || '',
    cats: saved.cats || JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    checks: saved.checks || {},
    photos: saved.photos || {},
    partners: saved.partners || {},
    stars: saved.stars || {},
    notes: saved.notes || {},
    milestones: saved.milestones || {},
    vision: saved.vision || {},
    reflection: saved.reflection || {},
    morning: saved.morning || {},
    tasks: saved.tasks || {},
    selfcheck: saved.selfcheck || {},
  }
}

// ─── REDUCER ─────────────────────────────────────────────────────
function reducer(state, action) {
  let next = { ...state }
  switch (action.type) {
    case 'SET_USERNAME':
      next.username = action.username
      break
    case 'TOGGLE_MORNING':
      next.morning = { ...state.morning, [todayKey() + '_' + action.id]: !state.morning[todayKey() + '_' + action.id] }
      break
    case 'SET_TASK':
      next.tasks = { ...state.tasks, [todayKey() + '_task' + action.n]: action.val }
      break
    case 'TOGGLE_TASK':
      next.tasks = { ...state.tasks, [todayKey() + '_task' + action.n + '_done']: !state.tasks[todayKey() + '_task' + action.n + '_done'] }
      break
    case 'TOGGLE_CHECK':
      next.checks = { ...state.checks, [action.day + '_' + action.hid]: !state.checks[action.day + '_' + action.hid] }
      break
    case 'SAVE_PHOTO':
      next.photos = { ...state.photos, [action.key]: action.src }
      break
    case 'SAVE_PARTNER':
      next.partners = { ...state.partners, [action.catId]: { name: action.name, email: action.email } }
      break
    case 'ADD_HABIT': {
      const cats = state.cats.map(c => c.id === action.catId
        ? { ...c, habits: [...c.habits, { id: c.id[0] + Date.now(), text: action.text, freq: action.freq }] }
        : c)
      next.cats = cats
      break
    }
    case 'DELETE_HABIT': {
      const cats = state.cats.map(c => c.id === action.catId
        ? { ...c, habits: c.habits.filter(h => h.id !== action.hid) }
        : c)
      next.cats = cats
      break
    }
    case 'EDIT_HABIT': {
      const cats = state.cats.map(c => c.id === action.catId
        ? { ...c, habits: c.habits.map(h => h.id === action.hid ? { ...h, text: action.text } : h) }
        : c)
      next.cats = cats
      break
    }
    case 'MOVE_HABIT': {
      const cats = state.cats.map(c => c.id === action.catId
        ? { ...c, habits: c.habits.map(h => h.id === action.hid ? { ...h, freq: action.freq } : h) }
        : c)
      next.cats = cats
      break
    }
    case 'SET_STAR':
      next.stars = { ...state.stars, [monthKey() + '_' + action.catId]: action.val }
      break
    case 'SET_NOTE':
      next.notes = { ...state.notes, [monthKey() + '_' + action.catId]: action.val }
      break
    case 'SET_SELFCHECK':
      next.selfcheck = { ...state.selfcheck, [action.key]: action.val }
      break
    case 'SET_REFLECTION':
      next.reflection = { ...state.reflection, [action.weekKey]: { ...(state.reflection[action.weekKey] || {}), [action.key]: action.val } }
      break
    case 'SET_VISION_IMG': {
      const k = 'q' + (action.idx + 1)
      next.vision = { ...state.vision, [k]: { ...(state.vision[k] || {}), img: action.src } }
      break
    }
    case 'SET_VISION_TEXT': {
      const k = 'q' + (action.idx + 1)
      next.vision = { ...state.vision, [k]: { ...(state.vision[k] || {}), text: action.text } }
      break
    }
    case 'TOGGLE_MILESTONE':
      next.milestones = { ...state.milestones, [action.id]: !state.milestones[action.id] }
      break
    default:
      return state
  }
  return next
}

// ─── STREAK ──────────────────────────────────────────────────────
function calcStreak(state) {
  let s = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const hasDone = state.cats.some(cat => cat.habits.some(h => state.checks[key + '_' + h.id]))
    if (hasDone) s++; else break
  }
  return s
}

const TABS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly Summary' },
  { id: 'monthly', label: 'Monthly Scorecard' },
  { id: 'vision', label: 'Vision Board' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'wisdom', label: '📖 Daily Wisdom' },
]

// ─── LOGIN COMPONENT ─────────────────────────────────────────────
function Login({ onLogin }) {
  const [name, setName] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', minWidth: '320px', maxWidth: '400px', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.75rem', fontWeight: '700', fontFamily: 'Playfair Display, serif' }}>Welcome Back</h2>
        <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>Enter your name to view your tracker</p>
        <input
          type="text"
          placeholder="Your username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onLogin(name.trim())}
          style={{ padding: '0.875rem', width: '100%', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginBottom: '1.25rem', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
        />
        <button
          onClick={() => name.trim() && onLogin(name.trim())}
          style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'background 0.2s' }}
        >
          Start Tracking
        </button>
      </div>
    </div>
  )
}

// ─── APP ─────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, null, buildInitial)
  const [tab, setTab] = useState('daily')
  const [toast, setToast] = useState({ msg: '', show: false })

  useEffect(() => { saveState(state) }, [state])

  const showToast = (msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }

  const streak = calcStreak(state)
  const now = new Date()

  const pageProps = { state, dispatch, showToast }

  if (!state.username) {
    return <Login onLogin={(name) => dispatch({ type: 'SET_USERNAME', username: name })} />
  }

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <div>
          <div className="header-title">{state.username}&apos;s Habit Tracker</div>
          <div className="header-sub">Your year of intentional growth</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="streak-box">
            <div className="streak-num">{streak}</div>
            <div className="streak-lbl">Day Streak</div>
          </div>
          <div className="header-date">
            {now.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <div className="main">
        {tab === 'daily' && <Daily {...pageProps} />}
        {tab === 'weekly' && <Weekly {...pageProps} />}
        {tab === 'monthly' && <Monthly {...pageProps} />}
        {tab === 'vision' && <Vision {...pageProps} />}
        {tab === 'milestones' && <Milestones {...pageProps} />}
        {tab === 'wisdom' && <Wisdom state={state} dispatch={dispatch} />}
      </div>

      {/* TOAST */}
      <div className={`toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}