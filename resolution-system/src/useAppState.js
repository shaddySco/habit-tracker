import { useReducer, useCallback, useEffect } from 'react'

const DEFAULT_CATS = [
  { id: 'cat0', name: 'Spiritual / Faith',  color: '#6B5BB5' },
  { id: 'cat1', name: 'Health & Body',       color: '#B84030' },
  { id: 'cat2', name: 'Career & Finance',    color: '#BF8C30' },
  { id: 'cat3', name: 'Learning & Growth',   color: '#3070A8' },
  { id: 'cat4', name: 'Relationships',       color: '#9C7BB5' },
]

const INITIAL_STATE = {
  user: { name: '', intention: '' },
  onboarded: false,
  dark: true,
  startDate: new Date().toISOString().split('T')[0],
  qi: 0,
  categories: DEFAULT_CATS,
  resolutions: [],
  partners: [],
  milestones: [],
  morningRoutine: [],
  mainTasks: [],
  eveningRoutine: [],
  quotes: [
    { t: "Discipline is the bridge between goals and accomplishment.", a: "JIM ROHN" },
    { t: "Discipline is choosing between what you want now and what you want most.", a: "ABRAHAM LINCOLN" },
    { t: "The will to succeed is important, but more important is the will to prepare.", a: "BOBBY KNIGHT" },
    { t: "Kila siku builds momentum. Consistency beats motivation always.", a: "JENNA KURIA" },
    { t: "Small actions, repeated daily, quietly build the life you desire.", a: "JENNA KURIA" },
    { t: "Usichoke haraka. Growth is quiet. Repetition builds identity over time.", a: "JENNA KURIA" },
    { t: "Do not wait to feel inspired. Follow the structure even on low-energy days.", a: "JENNA KURIA" },
  ],
}

function reducer(state, action) {
  switch (action.type) {
    case 'FINISH_ONBOARD':
      return { ...state, onboarded: true, user: action.user, categories: action.categories, startDate: action.startDate }
    case 'TOGGLE_DARK':
      return { ...state, dark: !state.dark }
    case 'NEXT_QUOTE':
      return { ...state, qi: (state.qi + 1) % state.quotes.length }
    case 'ADD_RESOLUTIONS':
      return { ...state, resolutions: [...state.resolutions, ...action.items] }
    case 'TOGGLE_RES': {
      const resolutions = state.resolutions.map(r =>
        r.id === action.id ? { ...r, done: !r.done } : r
      )
      return { ...state, resolutions }
    }
    case 'EDIT_RES': {
      const resolutions = state.resolutions.map(r =>
        r.id === action.id ? { ...r, text: action.text, catId: action.catId, freq: action.freq } : r
      )
      return { ...state, resolutions }
    }
    case 'DELETE_RES':
      return { ...state, resolutions: state.resolutions.filter(r => r.id !== action.id) }
    case 'SET_RES_PHOTO': {
      const resolutions = state.resolutions.map(r =>
        r.id === action.id ? { ...r, photo: true, done: true } : r
      )
      return { ...state, resolutions }
    }
    case 'TOGGLE_ROUTINE': {
      const key = action.routineKey
      return {
        ...state,
        [key]: state[key].map((t, i) => i === action.idx ? { ...t, done: !t.done } : t)
      }
    }
    case 'ADD_ROUTINE_ITEM': {
      const key = action.routineKey
      return { ...state, [key]: [...state[key], action.item] }
    }
    case 'EDIT_ROUTINE_ITEM': {
      const key = action.routineKey
      return {
        ...state,
        [key]: state[key].map((t, i) => i === action.idx ? { ...t, ...action.patch } : t)
      }
    }
    case 'DELETE_ROUTINE_ITEM': {
      const key = action.routineKey
      return { ...state, [key]: state[key].filter((_, i) => i !== action.idx) }
    }
    case 'EDIT_TASK_LABEL': {
      const mainTasks = state.mainTasks.map((t, i) =>
        i === action.idx ? { ...t, label: action.label } : t
      )
      return { ...state, mainTasks }
    }
    case 'ADD_PARTNER': {
      const existing = state.partners.filter(p => p.catId === action.partner.catId)
      if (existing.length >= 2) return state
      return { ...state, partners: [...state.partners, action.partner] }
    }
    case 'DELETE_PARTNER':
      return { ...state, partners: state.partners.filter(p => p.id !== action.id) }
    case 'ADD_MILESTONE':
      return { ...state, milestones: [...state.milestones, action.milestone] }
    case 'TOGGLE_MILESTONE': {
      const milestones = state.milestones.map((m, i) =>
        i === action.idx ? { ...m, done: !m.done } : m
      )
      return { ...state, milestones }
    }
    case 'EDIT_MILESTONE': {
      const milestones = state.milestones.map((m, i) =>
        i === action.idx ? { ...m, ...action.patch } : m
      )
      return { ...state, milestones }
    }
    case 'DELETE_MILESTONE':
      return { ...state, milestones: state.milestones.filter((_, i) => i !== action.idx) }
    case 'RATE_STAR':
      return state // scorecard ratings are local UI state
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] }
    case 'EDIT_CATEGORY': {
      const categories = state.categories.map(c =>
        c.id === action.id ? { ...c, ...action.patch } : c
      )
      return { ...state, categories }
    }
    case 'DELETE_CATEGORY': {
      return { ...state, categories: state.categories.filter(c => c.id !== action.id) }
    }
    default:
      return state
  }
}

function init(initialState) {
  try {
    const item = window.localStorage.getItem('resolutionSystemState')
    return item ? JSON.parse(item) : initialState
  } catch (error) {
    console.warn('Failed to parse state from localStorage', error)
    return initialState
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, init)
  
  useEffect(() => {
    window.localStorage.setItem('resolutionSystemState', JSON.stringify(state))
  }, [state])

  const act = useCallback(dispatch, [dispatch])
  return { state, dispatch: act }
}

/* ── COMPUTED ── */
export function getStats(state) {
  const md = state.morningRoutine.filter(t => t.done).length
  const td = state.mainTasks.filter(t => t.done).length
  const ed = state.eveningRoutine.filter(t => t.done).length
  const dr = state.resolutions.filter(r => r.freq === 'daily')
  const drd = dr.filter(r => r.done).length
  const total = state.morningRoutine.length + state.mainTasks.length + state.eveningRoutine.length + dr.length
  const done  = md + td + ed + drd
  const dpct  = total > 0 ? Math.round(done / total * 100) : 0

  const wr  = state.resolutions.filter(r => r.freq === 'weekly')
  const wpct = wr.length > 0 ? Math.round(wr.filter(r => r.done).length / wr.length * 100) : 0

  const mr   = state.resolutions.filter(r => r.freq === 'monthly')
  const mpct = mr.length > 0 ? Math.round(mr.filter(r => r.done).length / mr.length * 100) : 0

  const msd = state.milestones.filter(m => m.done).length
  const mst = state.milestones.length
  const mspct = mst > 0 ? Math.round(msd / mst * 100) : 0

  const now = new Date()
  const startObj = state.startDate ? new Date(state.startDate) : now
  const elapsedDays = Math.max(0, Math.floor((now - startObj) / (1000 * 60 * 60 * 24)))
  
  const doy = Math.min(366, Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000))

  return { dpct, wpct, mpct, total, done, msd, mst, mspct, doy, streak: elapsedDays }
}

export function badgeClass(pct) {
  return pct >= 80 ? 'nb-g' : pct >= 40 ? 'nb-a' : 'nb-r'
}
