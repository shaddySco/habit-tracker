export const MORNING_STEPS = [
  { id: 'ms1', label: 'No phone' },
  { id: 'ms2', label: 'Pray' },
  { id: 'ms3', label: 'Plan the day' },
  { id: 'ms4', label: 'Move / stretch' },
  { id: 'ms5', label: 'Start hard thing first' },
]

export const DEFAULT_CATEGORIES = [
  {
    id: 'spiritual', label: 'Spiritual', color: 'spiritual',
    habits: [
      { id: 's1', text: 'Read the Bible', freq: 'daily', routine: 'morning' },
      { id: 's2', text: 'Pray', freq: 'daily', routine: 'early' },
      { id: 's3', text: 'Write 3 things I am grateful for', freq: 'daily', routine: 'morning' },
      { id: 's4', text: 'Rosary', freq: 'weekly', routine: 'evening' },
      { id: 's5', text: 'Attend spiritual retreat', freq: 'monthly', routine: 'skill' },
      { id: 's6', text: 'Confession', freq: 'monthly', routine: 'recharge' },
    ],
  },
  {
    id: 'health', label: 'Health & Fitness', color: 'health',
    habits: [
      { id: 'h1', text: 'Workout session', freq: 'daily', routine: 'fitness' },
      { id: 'h2', text: 'Drink 2 litres of water', freq: 'daily', routine: 'early' },
      { id: 'h3', text: 'Take a walk', freq: 'daily', routine: 'recharge' },
      { id: 'h4', text: 'Run', freq: 'weekly', routine: 'fitness' },
      { id: 'h5', text: 'Eat fruits', freq: 'weekly', routine: 'recharge' },
      { id: 'h6', text: 'Log health metrics (weight, BP)', freq: 'weekly', routine: 'evening' },
      { id: 'h7', text: 'Relaxation / stress management', freq: 'weekly', routine: 'evening' },
      { id: 'h8', text: 'Learn first aid / basic life support', freq: 'monthly', routine: 'skill' },
    ],
  },
  {
    id: 'mental', label: 'Mentality', color: 'mental',
    habits: [
      { id: 'm1', text: 'Journal entry', freq: 'daily', routine: 'morning' },
      { id: 'm2', text: 'Say affirmations', freq: 'daily', routine: 'morning' },
      { id: 'm3', text: 'Limit screen time', freq: 'daily', routine: 'early' },
      { id: 'm4', text: 'Read self-help book', freq: 'daily', routine: 'morning' },
      { id: 'm5', text: 'Listen to a podcast', freq: 'weekly', routine: 'skill' },
      { id: 'm6', text: 'Review and track personal goals', freq: 'weekly', routine: 'evening' },
    ],
  },
  {
    id: 'financial', label: 'Financial', color: 'financial',
    habits: [
      { id: 'f1', text: 'Check budget, avoid overspending', freq: 'daily', routine: 'recharge' },
      { id: 'f2', text: 'No unnecessary debt or purchases', freq: 'daily', routine: 'recharge' },
      { id: 'f3', text: 'Save Ksh 100', freq: 'weekly', routine: 'evening' },
      { id: 'f4', text: 'Track weekly expenses', freq: 'weekly', routine: 'evening' },
      { id: 'f5', text: 'Personal finance content', freq: 'weekly', routine: 'skill' },
      { id: 'f6', text: 'Review monthly budget', freq: 'monthly', routine: 'recharge' },
      { id: 'f7', text: 'Work towards 2nd income source', freq: 'monthly', routine: 'skill' },
    ],
  },
  {
    id: 'career', label: 'Career & Skills', color: 'career',
    habits: [
      { id: 'c1', text: 'Work on final year project', freq: 'daily', routine: 'focus' },
      { id: 'c2', text: 'Attend classes on time', freq: 'daily', routine: 'focus' },
      { id: 'c3', text: 'Practice graphic design (poster)', freq: 'weekly', routine: 'skill' },
      { id: 'c4', text: 'Social media management practice', freq: 'weekly', routine: 'skill' },
      { id: 'c5', text: 'Online course or certification', freq: 'weekly', routine: 'skill' },
      { id: 'c6', text: 'Update portfolio / resume', freq: 'monthly', routine: 'skill' },
      { id: 'c7', text: 'IT/Marketing networking event', freq: 'monthly', routine: 'skill' },
    ],
  },
  {
    id: 'social', label: 'Social', color: 'social',
    habits: [
      { id: 'so1', text: 'Work on communication skills', freq: 'daily', routine: 'skill' },
      { id: 'so2', text: 'Connect with someone great online', freq: 'daily', routine: 'focus' },
      { id: 'so3', text: 'Call 2 old friends', freq: 'weekly', routine: 'evening' },
      { id: 'so4', text: 'Seek mentorship from spiritual leader', freq: 'monthly', routine: 'skill' },
    ],
  },
]

export const MILESTONES = [
  { id: 'ml1', icon: '🎓', name: 'Graduate', sub: 'Complete final year' },
  { id: 'ml2', icon: '💼', name: 'Succeed in internship', sub: 'Professional win' },
  { id: 'ml3', icon: '💰', name: 'Debt free', sub: 'Financial freedom' },
  { id: 'ml4', icon: '📈', name: '2 income sources', sub: 'By year end' },
  { id: 'ml5', icon: '🏔️', name: 'Climb Mt Kenya', sub: 'Adventure goal' },
  { id: 'ml6', icon: '🏃', name: 'Run a marathon', sub: 'Physical achievement' },
  { id: 'ml7', icon: '🤝', name: 'Get a mentor', sub: 'Accountability partner' },
  { id: 'ml8', icon: '📁', name: 'Portfolio created', sub: 'Career asset' },
  { id: 'ml9', icon: '😊', name: 'Be more friendly', sub: 'Personal growth' },
  { id: 'ml10', icon: '🌟', name: 'Celebrate milestones', sub: 'Acknowledge wins' },
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
