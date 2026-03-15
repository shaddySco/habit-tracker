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

export default function Wisdom({ state, dispatch }) {
    const [checked, setChecked] = useState({})
    const [collapsed, setCollapsed] = useState({})
    const [editingBlocks, setEditingBlocks] = useState({})
    const quote = getDailyQuote()
    const today = todayKey()

    const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }))
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

    const builtRoutine = BLOCK_DEFINITIONS.map(def => {
        const block = getBlock(def)
        const habitSteps = buildHabitSteps(def.filterHabitIds) // always use def's filterHabitIds
        const allSteps = [...def.manualSteps, ...habitSteps]
        return { ...block, id: def.id, manualSteps: def.manualSteps, habitSteps, allSteps }
    })

    const totalSteps = builtRoutine.reduce((acc, b) => acc + b.allSteps.length, 0)
    const doneSteps = builtRoutine.reduce((acc, b) => {
        const manualDone = b.manualSteps.filter(s => !!checked[s.id]).length
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
            {builtRoutine.map((block) => {
                const manualDone = block.manualSteps.filter(s => !!checked[s.id]).length
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
                                    const done = !!checked[step.id]
                                    return (
                                        <div
                                            key={step.id}
                                            onClick={() => toggle(step.id)}
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

                                {block.habitSteps.length === 0 && block.manualSteps.length === 0 && (
                                    <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', padding: '8px 0' }}>
                                        No goals linked to this block. Add habits in the Daily tab.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}

            {/* RESET */}
            <div style={{ textAlign: 'center', margin: '8px 0 1.5rem' }}>
                <button
                    onClick={() => setChecked({})}
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

            {/* CREDIT */}
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
                Routine built from <strong>The Ultimate 101 Guide to Productivity and Discipline</strong> by Jenna Kuria
                &nbsp;·&nbsp; <a href="mailto:jennakuria1@gmail.com" style={{ color: 'var(--accent)' }}>jennakuria1@gmail.com</a>
            </div>
        </div>
    )
}