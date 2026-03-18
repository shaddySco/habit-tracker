import { useState, useEffect } from 'react'
import { todayKey } from '../data/categories'

const QUOTES = [
    { text: 'The will to succeed is important, but what\'s more important is the will to prepare.', author: 'Bobby Knight' },
    { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
    { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Anonymous' },
    { text: 'Discipline over motivation.', author: 'Jenna Kuria' },
    { text: 'Small actions, repeated daily, quietly build the life you desire.', author: 'Jenna Kuria' },
    { text: 'Consistency beats motivation always.', author: 'Jenna Kuria' },
    { text: 'Routine creates calm confidence.', author: 'Jenna Kuria' },
]

// Default block definitions — only the non-editable parts live here
// Editable fields (period, time, principle) are overridden by state.routineSettings
const BLOCK_DEFINITIONS = [
    {
        id: 'early_morning',
        period: 'Early Morning',
        time: '5:00 – 6:00 AM',
        color: '#534AB7',
        colorLight: '#EEEDFE',
        icon: '🌄',
        principle: 'Win the first hour — how you start shapes your entire day.',
        manualSteps: [
            { id: 'em1', label: 'No phone for the first 30 minutes', why: 'Protect your focus before the world hijacks it.' },
            { id: 'em3', label: 'Move your body — stretch or walk', why: 'Wake your body up. Energy fuels performance.' },
        ],
        filterHabitIds: ['s2', 'h2'],
    },
    {
        id: 'morning_power',
        period: 'Morning Power Hour & Planning',
        time: '6:00 – 7:00 AM',
        color: '#BA7517',
        colorLight: '#FAEEDA',
        icon: '☀️',
        principle: 'Plan before you act. Decide your 3 main tasks before anything else.',
        manualSteps: [
            { id: 'mp5', label: 'Set your 3 main tasks for today (Daily tab)', why: 'Focus on three essential outcomes. Simplicity increases clarity.' },
        ],
        filterHabitIds: ['s1', 'm4', 's3', 'm2', 'm1'],
    },
    {
        id: 'classes',
        period: 'Classes, Campus & Focus',
        time: '7:00 – 1:00 PM',
        color: '#993C1D',
        colorLight: '#FAECE7',
        icon: '🎓',
        principle: 'Start the hard thing first. Follow the structure even on low-energy days.',
        manualSteps: [
            { id: 'cl3', label: 'Silence notifications during class/work', why: 'Deep work: protect your attention. Guard your mental space.' },
        ],
        filterHabitIds: ['c1', 'c2', 'so2'],
    },
    {
        id: 'midday',
        period: 'Midday Recharge',
        time: '1:00 – 2:00 PM',
        color: '#0F6E56',
        colorLight: '#E1F5EE',
        icon: '🌿',
        principle: 'Rest without guilt — energy fuels performance. Recovery strengthens consistency.',
        manualSteps: [
            { id: 'md4', label: 'Eat well — fruits if possible', why: 'Healthy eating is a non-negotiable habit.' },
        ],
        filterHabitIds: ['h3', 'f1', 'f2'],
    },
    {
        id: 'afternoon_skill',
        period: 'Afternoon Skill Development',
        time: '2:00 – 5:00 PM',
        color: '#185FA5',
        colorLight: '#E6F1FB',
        icon: '⚡',
        principle: 'Large dreams need small actions. Plan weekly, execute daily.',
        manualSteps: [],
        filterHabitIds: ['c3', 'c4', 'c5', 'm5', 'so1'],
    },
    {
        id: 'evening_workout',
        period: 'Evening Workout',
        time: '5:00 – 7:00 PM',
        color: '#3B6D11',
        colorLight: '#EAF3DE',
        icon: '💪',
        principle: 'Physical discipline builds mental discipline. Energy fuels everything.',
        manualSteps: [
            { id: 'ew1', label: 'Limit screen time — log off social media', why: 'Replace the bad habit with something intentional.' },
        ],
        filterHabitIds: ['h1', 'h4', 'h5', 'h6', 'h7'],
    },
    {
        id: 'evening_reflection',
        period: 'Evening Reflection',
        time: '8:00 – 9:30 PM',
        color: '#534AB7',
        colorLight: '#EEEDFE',
        icon: '🌙',
        principle: 'Track your progress. Seeing growth visually strengthens commitment and builds accountability.',
        manualSteps: [
            { id: 'er3', label: 'Note one win and one thing to improve', why: 'Celebrate small progress. Appreciation builds resilience.' },
            { id: 'er4', label: 'Plan tomorrow\'s 3 main tasks (Daily tab)', why: 'Prepare tonight so tomorrow starts with clarity.' },
            { id: 'er5', label: 'No phone after 9:30 PM', why: 'Recovery strengthens consistency. Rest without guilt.' },
        ],
        filterHabitIds: ['m6', 'f3', 'so3', 's4', 's5', 's6'],
    },
]

function getDailyQuote() {
    return QUOTES[new Date().getDate() % QUOTES.length]
}

function getDayGreeting() {
    const day = new Date().toLocaleDateString('en-KE', { weekday: 'long' })
    const hour = new Date().getHours()
    if (hour < 12) return `Good morning — happy ${day}`
    if (hour < 17) return `Good afternoon — it's ${day}`
    return `Good evening — wrapping up ${day}`
}

// Inline editable field — click to edit, blur/enter to save
function EditableField({ value, onSave, style, multiline = false }) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value)

    // Keep draft in sync when value changes externally after a save
    useEffect(() => { if (!editing) setDraft(value) }, [value, editing])

    const commit = () => {
        const trimmed = draft.trim()
        if (trimmed && trimmed !== value) onSave(trimmed)
        else setDraft(value)
        setEditing(false)
    }

    if (editing) {
        const shared = {
            value: draft,
            onChange: e => setDraft(e.target.value),
            onBlur: commit,
            onKeyDown: e => { if (e.key === 'Enter' && !multiline) commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false) } },
            autoFocus: true,
            style: {
                ...style,
                background: 'var(--surface)',
                border: '1px solid var(--accent)',
                borderRadius: 6,
                padding: '3px 7px',
                fontFamily: 'DM Sans, sans-serif',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                resize: multiline ? 'vertical' : 'none',
            }
        }
        return multiline
            ? <textarea {...shared} rows={2} />
            : <input {...shared} type="text" />
    }

    return (
        <span
            onClick={() => { setDraft(value); setEditing(true) }}
            title="Click to edit"
            style={{ ...style, cursor: 'text', borderBottom: '1px dashed transparent', transition: 'border .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'var(--muted)'}
            onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
        >
            {value}
        </span>
    )
}

const DISCIPLINE_CATEGORIES = [
    { id: 'spiritual', label: 'Spiritual', color: 'spiritual', icon: '🙏' },
    { id: 'health', label: 'Health & Fitness', color: 'health', icon: '💪' },
    { id: 'mental', label: 'Mentality', color: 'mental', icon: '🧠' },
    { id: 'financial', label: 'Financial', color: 'financial', icon: '💰' },
    { id: 'career', label: 'Career & Skills', color: 'career', icon: '🎯' },
    { id: 'social', label: 'Social', color: 'social', icon: '🤝' },
]

export default function Wisdom({ state, dispatch }) {
    const [collapsed, setCollapsed] = useState({})
    const [editingBlocks, setEditingBlocks] = useState({})
    const [newDiscipline, setNewDiscipline] = useState('')
    const [newDisciplineCat, setNewDisciplineCat] = useState('mental')
    const [newDisciplineFreq, setNewDisciplineFreq] = useState('daily')
    const quote = getDailyQuote()
    const today = todayKey()

    // ── PERSISTED: manual routine checks keyed by today's date + step id ──
    const isManualDone = (stepId) => !!state.routineChecks?.[today + '_' + stepId]
    const toggleManual = (stepId) => dispatch({ type: 'TOGGLE_ROUTINE_CHECK', key: today + '_' + stepId })
    const resetManual = () => {
        // Clear today's manual checks by dispatching each one that is currently on
        const prefix = today + '_'
        Object.keys(state.routineChecks || {}).forEach(k => {
            if (k.startsWith(prefix) && state.routineChecks[k]) {
                dispatch({ type: 'TOGGLE_ROUTINE_CHECK', key: k })
            }
        })
    }

    const toggleCollapse = (blockId) => setCollapsed(p => ({ ...p, [blockId]: !p[blockId] }))
    const toggleEditBlock = (blockId) => setEditingBlocks(p => ({ ...p, [blockId]: !p[blockId] }))

    // Save a block field to state (persists via localStorage)
    const saveBlockField = (blockId, field, value) => {
        dispatch({ type: 'SET_ROUTINE_BLOCK', blockId, field, value })
    }

    // Merge defaults with any saved overrides from state.routineSettings
    const getBlock = (def) => {
        const overrides = state.routineSettings?.[def.id] || {}
        return { ...def, ...overrides }
    }

    const getHabit = (hid) => {
        for (const cat of state.cats) {
            const h = cat.habits.find(h => h.id === hid)
            if (h) return { ...h, catColor: cat.color, catLabel: cat.label }
        }
        return null
    }

    const isHabitDone = (hid) => !!state.checks[today + '_' + hid]

    const toggleHabit = (hid) => {
        dispatch({ type: 'TOGGLE_CHECK', hid, day: today })
    }

    const buildHabitSteps = (filterHabitIds) =>
        filterHabitIds.map(hid => getHabit(hid)).filter(Boolean)

    const tasks = [1, 2, 3].map(n => ({
        text: state.tasks[today + '_task' + n] || '',
        done: !!state.tasks[today + '_task' + n + '_done'],
    })).filter(t => t.text)

    const allDailyHabits = state.cats.flatMap(c => c.habits.filter(h => h.freq === 'daily'))
    const dailyDone = allDailyHabits.filter(h => isHabitDone(h.id)).length
    const dailyPct = allDailyHabits.length ? Math.round(dailyDone / allDailyHabits.length * 100) : 0

    // Get linked habit IDs for a block — saved overrides take priority over defaults
    const getLinkedIds = (def) => {
        const saved = state.routineSettings?.[def.id]
        // If user has explicitly set linkedHabitIds (even empty array), use that
        if (saved && Object.prototype.hasOwnProperty.call(saved, 'linkedHabitIds')) {
            return saved.linkedHabitIds
        }
        return def.filterHabitIds
    }

    // Toggle a habit link on/off for a block
    const toggleHabitLink = (blockId, hid) => {
        const def = BLOCK_DEFINITIONS.find(d => d.id === blockId)
        const current = getLinkedIds(def)
        const updated = current.includes(hid) ? current.filter(id => id !== hid) : [...current, hid]
        dispatch({ type: 'SET_ROUTINE_BLOCK', blockId, field: 'linkedHabitIds', value: updated })
    }

    // Delete a block (store as hidden in routineSettings)
    const deleteBlock = (blockId) => {
        dispatch({ type: 'SET_ROUTINE_BLOCK', blockId, field: 'hidden', value: true })
    }

    // Restore a deleted block
    const restoreBlock = (blockId) => {
        dispatch({ type: 'SET_ROUTINE_BLOCK', blockId, field: 'hidden', value: false })
    }

    const builtRoutine = BLOCK_DEFINITIONS.map(def => {
        const block = getBlock(def)
        const linkedIds = getLinkedIds(def)
        const habitSteps = buildHabitSteps(linkedIds)
        const allSteps = [...def.manualSteps, ...habitSteps]
        return { ...block, id: def.id, manualSteps: def.manualSteps, habitSteps, allSteps, linkedIds }
    })

    // Separate visible and hidden blocks
    const visibleBlocks = builtRoutine.filter(b => !b.hidden)
    const hiddenBlocks = builtRoutine.filter(b => b.hidden)

    // All habits flat list for the link picker
    const allHabits = state.cats.flatMap(cat =>
        cat.habits.map(h => ({ ...h, catColor: cat.color, catLabel: cat.label, catId: cat.id }))
    )

    const totalSteps = visibleBlocks.reduce((acc, b) => acc + b.allSteps.length, 0)
    const doneSteps = visibleBlocks.reduce((acc, b) => {
        const manualDone = b.manualSteps.filter(s => isManualDone(s.id)).length
        const habitsDone = b.habitSteps.filter(h => isHabitDone(h.id)).length
        return acc + manualDone + habitsDone
    }, 0)
    const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0
    const progressColor = pct < 40 ? '#BA7517' : pct < 75 ? '#185FA5' : '#3B6D11'

    return (
        <div>
            <div className="page-title">Your Daily Routine</div>
            <div className="page-sub">{getDayGreeting()} — click any title, time or principle to edit it ✏️</div>

            {/* QUOTE */}
            <div style={{ background: 'var(--text)', color: 'white', borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.5, marginBottom: 8 }}>Quote of the Day</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 500, lineHeight: 1.6, marginBottom: 8 }}>"{quote.text}"</div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>— {quote.author}</div>
            </div>

            {/* TODAY'S TASKS */}
            <div style={{
                background: 'var(--gold-light)',
                border: tasks.length ? '1px solid #EF9F27' : '1px dashed #EF9F27',
                borderRadius: 12, padding: '12px 16px', marginBottom: '1.25rem'
            }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold-dark)', fontWeight: 500, marginBottom: 8 }}>
                    Your 3 Main Tasks Today
                </div>
                {tasks.length > 0 ? tasks.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: t.done ? 'var(--teal)' : 'var(--gold-dark)', fontWeight: 500, minWidth: 14 }}>
                            {t.done ? '✓' : `${i + 1}.`}
                        </span>
                        <span style={{ fontSize: 13, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--muted)' : 'var(--text)' }}>
                            {t.text}
                        </span>
                    </div>
                )) : (
                    <div style={{ fontSize: 13, color: 'var(--gold-dark)' }}>
                        No tasks set yet — go to the <strong>Daily tab</strong> to add them.
                    </div>
                )}
            </div>

            {/* OVERALL PROGRESS */}
            <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
            }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 600, lineHeight: 1, color: progressColor }}>
                    {pct}%
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Routine — {doneSteps}/{totalSteps} steps done</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Daily habits — {dailyDone}/{allDailyHabits.length} ({dailyPct}%)</div>
                    <div style={{ height: 7, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: progressColor, borderRadius: 4, transition: 'width .4s' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>
                        {pct === 0 && 'Anza kidogo sana — start very small.'}
                        {pct > 0 && pct < 50 && 'Keep going. Daily effort compounds quietly.'}
                        {pct >= 50 && pct < 100 && 'More than halfway — consistency beats motivation!'}
                        {pct === 100 && '🎉 Full routine complete — discipline over motivation!'}
                    </div>
                </div>
            </div>

            {/* ROUTINE BLOCKS */}
            {visibleBlocks.map((block) => {
                const manualDone = block.manualSteps.filter(s => isManualDone(s.id)).length
                const habitsDone = block.habitSteps.filter(h => isHabitDone(h.id)).length
                const blockDone = manualDone + habitsDone
                const blockTotal = block.allSteps.length
                const blockPct = blockTotal ? Math.round((blockDone / blockTotal) * 100) : 0
                const isCollapsed = !!collapsed[block.id]
                const isComplete = blockTotal > 0 && blockDone === blockTotal
                const isEditing = !!editingBlocks[block.id]

                return (
                    <div key={block.id} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 14, marginBottom: 12, overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                            background: isComplete ? block.colorLight : 'transparent', transition: 'background .2s',
                        }}>
                            {/* Icon — click opens/closes, everything else is editable */}
                            <span
                                onClick={() => toggleCollapse(block.id)}
                                style={{ fontSize: 20, flexShrink: 0, cursor: 'pointer' }}
                            >
                                {block.icon}
                            </span>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    {/* EDITABLE: block title */}
                                    <EditableField
                                        value={block.period}
                                        onSave={v => saveBlockField(block.id, 'period', v)}
                                        style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}
                                    />
                                    {/* EDITABLE: time */}
                                    <EditableField
                                        value={block.time}
                                        onSave={v => saveBlockField(block.id, 'time', v)}
                                        style={{
                                            fontSize: 10, padding: '2px 8px', borderRadius: 20,
                                            background: block.colorLight, color: block.color, fontWeight: 500,
                                            display: 'inline-block'
                                        }}
                                    />
                                    {isComplete && <span style={{ fontSize: 11, color: block.color, fontWeight: 500 }}>✓ Complete</span>}
                                </div>
                                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginTop: 6, overflow: 'hidden', width: 120 }}>
                                    <div style={{ height: '100%', width: blockPct + '%', background: block.color, borderRadius: 2, transition: 'width .3s' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{blockDone}/{blockTotal}</span>
                                <button
                                    onClick={() => toggleEditBlock(block.id)}
                                    title={isEditing ? 'Done editing' : 'Edit this block'}
                                    style={{
                                        fontSize: 11, padding: '3px 9px', borderRadius: 6, cursor: 'pointer',
                                        fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all .15s',
                                        border: isEditing ? '1px solid var(--accent)' : '1px solid var(--border)',
                                        background: isEditing ? 'var(--accent)' : 'var(--surface)',
                                        color: isEditing ? 'white' : 'var(--muted)',
                                    }}
                                >
                                    {isEditing ? '✓ Done' : '✏️'}
                                </button>
                                <span
                                    onClick={() => toggleCollapse(block.id)}
                                    style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}
                                >
                                    {isCollapsed ? '▼' : '▲'}
                                </span>
                            </div>
                        </div>

                        {/* Body */}
                        {!isCollapsed && (
                            <div style={{ padding: '0 16px 14px' }}>

                                {/* EDITABLE: principle */}
                                <div style={{
                                    fontSize: 12, color: block.color, fontStyle: 'italic',
                                    padding: '8px 12px', background: block.colorLight,
                                    borderRadius: 8, marginBottom: 10, lineHeight: 1.5,
                                }}>
                                    "
                                    <EditableField
                                        value={block.principle}
                                        onSave={v => saveBlockField(block.id, 'principle', v)}
                                        multiline={true}
                                        style={{ fontSize: 12, color: block.color, fontStyle: 'italic', lineHeight: 1.5 }}
                                    />
                                    "
                                </div>

                                {/* Manual steps */}
                                {block.manualSteps.map((step) => {
                                    const done = isManualDone(step.id)
                                    return (
                                        <div
                                            key={step.id}
                                            onClick={() => toggleManual(step.id)}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                                padding: '9px 10px', borderRadius: 9, marginBottom: 4,
                                                cursor: 'pointer', transition: 'background .15s',
                                                background: done ? block.colorLight : 'var(--bg)',
                                            }}
                                        >
                                            <div style={{
                                                width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                                                border: done ? `2px solid ${block.color}` : '2px solid var(--border)',
                                                background: done ? block.color : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all .15s',
                                            }}>
                                                {done && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: 13, fontWeight: 500, marginBottom: 2,
                                                    textDecoration: done ? 'line-through' : 'none',
                                                    color: done ? 'var(--muted)' : 'var(--text)',
                                                }}>
                                                    {step.label}
                                                </div>
                                                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{step.why}</div>
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* Live habit steps */}
                                {block.habitSteps.map((habit) => {
                                    const done = isHabitDone(habit.id)
                                    return (
                                        <div
                                            key={habit.id}
                                            onClick={() => toggleHabit(habit.id)}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                                padding: '9px 10px', borderRadius: 9, marginBottom: 4,
                                                cursor: 'pointer', transition: 'background .15s',
                                                background: done ? block.colorLight : 'var(--bg)',
                                            }}
                                        >
                                            <div style={{
                                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                                                border: done ? `2px solid ${block.color}` : '2px solid var(--border)',
                                                background: done ? block.color : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all .15s',
                                            }}>
                                                {done && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                                                    <span style={{
                                                        fontSize: 13, fontWeight: 500,
                                                        textDecoration: done ? 'line-through' : 'none',
                                                        color: done ? 'var(--muted)' : 'var(--text)',
                                                    }}>
                                                        {habit.text}
                                                    </span>
                                                    <span className={`cat-badge badge-${habit.catColor}`} style={{ fontSize: 9, padding: '1px 7px' }}>
                                                        {habit.catLabel}
                                                    </span>
                                                    <span style={{ fontSize: 9, color: done ? block.color : 'var(--muted)', fontStyle: 'italic' }}>
                                                        {done ? '● synced' : '○ tap to check'}
                                                    </span>
                                                </div>
                                                {habit.freq !== 'daily' && (
                                                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                                                        {habit.freq === 'weekly' ? '📅 Weekly goal' : '📆 Monthly goal'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* ── LINK GOALS PANEL (shown when editing) ── */}
                                {isEditing && (
                                    <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--text)' }}>
                                            🔗 Link goals to this block
                                        </div>
                                        {allHabits.length === 0 && (
                                            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                                                No habits yet — add them in the Daily tab first.
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
                                            {allHabits.map(h => {
                                                const linked = block.linkedIds.includes(h.id)
                                                return (
                                                    <div
                                                        key={h.id}
                                                        onClick={() => toggleHabitLink(block.id, h.id)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 8,
                                                            padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                                                            background: linked ? block.colorLight : 'var(--bg)',
                                                            border: linked ? `1px solid ${block.color}` : '1px solid var(--border)',
                                                            transition: 'all .15s',
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                                            border: linked ? `2px solid ${block.color}` : '2px solid var(--border)',
                                                            background: linked ? block.color : 'transparent',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            {linked && <span style={{ color: 'white', fontSize: 9 }}>✓</span>}
                                                        </div>
                                                        <span style={{ fontSize: 13, flex: 1, color: 'var(--text)' }}>{h.text}</span>
                                                        <span className={`cat-badge badge-${h.catColor}`} style={{ fontSize: 9, padding: '1px 6px' }}>
                                                            {h.catLabel}
                                                        </span>
                                                        <span style={{ fontSize: 9, color: 'var(--muted)', background: 'var(--border)', padding: '1px 6px', borderRadius: 8 }}>
                                                            {h.freq}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {/* Delete block */}
                                        <button
                                            onClick={() => { deleteBlock(block.id); toggleEditBlock(block.id) }}
                                            style={{
                                                marginTop: 12, width: '100%', padding: '8px', borderRadius: 8,
                                                border: '1px solid var(--red)', background: 'var(--red-light)',
                                                color: 'var(--red)', fontSize: 12, fontWeight: 500,
                                                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                            }}>
                                            🗑 Delete this block from routine
                                        </button>
                                    </div>
                                )}

                                {!isEditing && block.habitSteps.length === 0 && block.manualSteps.length === 0 && (
                                    <div style={{
                                        fontSize: 12, color: 'var(--muted)', padding: '10px 12px',
                                        background: 'var(--bg)', borderRadius: 8, textAlign: 'center'
                                    }}>
                                        No goals linked — click <strong>✏️</strong> to link your habits to this block
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}

            {/* HIDDEN BLOCKS — restore option */}
            {hiddenBlocks.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                        Hidden blocks ({hiddenBlocks.length})
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {hiddenBlocks.map(b => (
                            <button
                                key={b.id}
                                onClick={() => restoreBlock(b.id)}
                                style={{
                                    padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)',
                                }}>
                                + Restore {b.period}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* RESET */}
            <div style={{ textAlign: 'center', margin: '8px 0 1.5rem' }}>
                <button
                    onClick={() => resetManual()}
                    style={{
                        padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)',
                    }}>
                    ↺ Reset manual steps
                </button>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                    ○ circle = synced with Daily tab &nbsp;·&nbsp; □ square = routine-only step &nbsp;·&nbsp; click any title or time to edit
                </div>
            </div>

            {/* ── ADD DISCIPLINE SECTION ── */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-title">My Disciplines</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1rem' }}>
                    Add personal disciplines to track under a specific life category — they appear in your Daily habits automatically.
                </div>

                {/* Existing disciplines grouped by category */}
                {DISCIPLINE_CATEGORIES.map(cat => {
                    const items = (state.disciplineItems || []).filter(d => d.category === cat.id)
                    if (!items.length) return null
                    return (
                        <div key={cat.id} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <span style={{ fontSize: 14 }}>{cat.icon}</span>
                                <span className={`cat-badge badge-${cat.color}`} style={{ fontSize: 10, padding: '2px 10px' }}>{cat.label}</span>
                            </div>
                            {items.map(d => (
                                <div key={d.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '7px 10px', background: 'var(--bg)', borderRadius: 8,
                                    marginBottom: 4, border: '1px solid var(--border)'
                                }}>
                                    <span style={{ fontSize: 13, flex: 1 }}>{d.text}</span>
                                    <span style={{ fontSize: 10, color: 'var(--muted)', background: 'var(--border)', padding: '2px 7px', borderRadius: 10 }}>{d.freq}</span>
                                    <button
                                        onClick={() => dispatch({ type: 'DELETE_DISCIPLINE', id: d.id })}
                                        style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: 'var(--red-light)', color: 'var(--red)', cursor: 'pointer', fontSize: 13 }}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                })}

                {/* Add new discipline form */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8, alignItems: 'flex-end' }}>
                    <input
                        type="text"
                        placeholder="e.g. Meditate for 10 minutes..."
                        value={newDiscipline}
                        onChange={e => setNewDiscipline(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && newDiscipline.trim()) {
                                dispatch({ type: 'ADD_DISCIPLINE', text: newDiscipline.trim(), category: newDisciplineCat, freq: newDisciplineFreq })
                                setNewDiscipline('')
                            }
                        }}
                        style={{
                            flex: 1, minWidth: 180, border: '1px solid var(--border)', borderRadius: 8,
                            padding: '8px 10px', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                            background: 'var(--bg)', color: 'var(--text)', outline: 'none'
                        }}
                    />
                    <select
                        value={newDisciplineCat}
                        onChange={e => setNewDisciplineCat(e.target.value)}
                        style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', outline: 'none' }}>
                        {DISCIPLINE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                    </select>
                    <select
                        value={newDisciplineFreq}
                        onChange={e => setNewDisciplineFreq(e.target.value)}
                        style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', outline: 'none' }}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <button
                        onClick={() => {
                            if (!newDiscipline.trim()) return
                            dispatch({ type: 'ADD_DISCIPLINE', text: newDiscipline.trim(), category: newDisciplineCat, freq: newDisciplineFreq })
                            setNewDiscipline('')
                        }}
                        style={{
                            padding: '8px 14px', background: 'var(--accent)', color: 'white',
                            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                        }}>
                        + Add
                    </button>
                </div>
            </div>

            {/* CREDIT */}
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
                Routine built from <strong>The Ultimate 101 Guide to Productivity and Discipline</strong> by Jenna Kuria
                &nbsp;·&nbsp; <a href="mailto:jennakuria1@gmail.com" style={{ color: 'var(--accent)' }}>jennakuria1@gmail.com</a>
            </div>
        </div>
    )
}