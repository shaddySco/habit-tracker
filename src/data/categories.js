export const MORNING_STEPS = [
  { id: 'ms1', label: 'No phone' },
  { id: 'ms2', label: 'Pray' },
  { id: 'ms3', label: 'Plan the day' },
  { id: 'ms4', label: 'Move / stretch' },
  { id: 'ms5', label: 'Start hard thing first' },
]

export const DEFAULT_CATEGORIES = [
  { id: 'spiritual', label: 'Spiritual', color: 'spiritual', habits: [] },
  { id: 'health', label: 'Health & Fitness', color: 'health', habits: [] },
  { id: 'mental', label: 'Mentality', color: 'mental', habits: [] },
  { id: 'financial', label: 'Financial', color: 'financial', habits: [] },
  { id: 'career', label: 'Career & Skills', color: 'career', habits: [] },
  { id: 'social', label: 'Social', color: 'social', habits: [] },
]

export const MILESTONES = [
  { id: 'ml1', icon: '🎯', name: 'Major Goal 1', sub: 'Custom milestone' },
  { id: 'ml2', icon: '🏆', name: 'Major Goal 2', sub: 'Custom milestone' },
  { id: 'ml3', icon: '💰', name: 'Financial Target', sub: 'Custom milestone' },
  { id: 'ml4', icon: '🏠', name: 'Personal/Home Goal', sub: 'Custom milestone' },
  { id: 'ml5', icon: '📈', name: 'Career Growth', sub: 'Custom milestone' },
  { id: 'ml6', icon: '🎓', name: 'Education/Skill', sub: 'Custom milestone' },
]

export const VISION_PROMPTS = [
  'Q1 Goal — Jan to Mar',
  'Q2 Goal — Apr to Jun',
  'Q3 Goal — Jul to Sep',
  'Q4 Goal — Oct to Dec',
]

export const SELF_CHECK_QUESTIONS = [
  'What truly matters to me this month?',
  'Am I afraid or prepared?',
  'What skills must I build?',
  'Who inspires my journey?',
  'What distracts me daily?',
  'Am I consistent — really?',
  'What would success change?',
]

export const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// ─── STORAGE HELPERS ────────────────────────────────────────────
export const todayKey = () => new Date().toISOString().slice(0, 10)
export const monthKey = () => new Date().toISOString().slice(0, 7)

export const getWeekStart = () => {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(new Date().setDate(diff))
}

export const getWeekDates = () => {
  const ws = getWeekStart()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws)
    d.setDate(ws.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export const weekStartKey = () => getWeekStart().toISOString().slice(0, 10)

export const loadState = () => {
  try {
    const raw = localStorage.getItem('res2026')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export const saveState = (state) => {
  try { localStorage.setItem('res2026', JSON.stringify(state)) } catch {}
}

// ─── CALENDAR HELPERS ───────────────────────────────────────────
export const fmtCalDate = (d) =>
  d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

export const openCalendarReminder = ({ title, details, email, recur = 'WEEKLY' }) => {
  const now = new Date()
  const start = new Date(now)
  start.setHours(9, 0, 0, 0)
  const end = new Date(start)
  end.setHours(9, 30, 0, 0)
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&details=${encodeURIComponent(details)}` +
    `&dates=${fmtCalDate(start)}/${fmtCalDate(end)}` +
    `&recur=RRULE:FREQ=${recur}` +
    `&add=${encodeURIComponent(email)}`
  window.open(url, '_blank')
}
