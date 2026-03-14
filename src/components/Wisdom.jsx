import { useState } from 'react'
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

// Each block has:
//  - fixed manual steps (lifestyle rules from PDF — never change)
//  - catIds: which habit CATEGORIES to pull live habits from, filtered by freq
//  - freqs: which frequencies to include for those cats
const BLOCK_DEFINITIONS = [
    {
        period: 'Early Morning Ritual',
        time: '5:00 – 6:00 AM',
        color: '#534AB7',
        colorLight: '#EEEDFE',
        icon: '🌄',
        principle: 'Win the first hour — how you start shapes your entire day.',
        manualSteps: [
            { id: 'em1', label: 'No phone for the first 30 minutes', why: 'Protect your focus before the world hijacks it.' },
            { id: 'em3', label: 'Move your body — stretch or walk', why: 'Wake your body up. Energy fuels performance.' },
        ],
        // Pull daily habits from these categories that fit morning
        catIds: ['spiritual', 'health'],
        filterHabitIds: ['s2', 'h2'], // pray, drink water — specific morning ones
    },
    {
        period: 'Morning Power Hour & Planning',
        time: '6:00 – 7:00 AM',
        color: '#BA7517',
        colorLight: '#FAEEDA',
        icon: '☀️',
        principle: 'Plan before you act. Decide your 3 main tasks before anything else.',
        manualSteps: [
            { id: 'mp5', label: 'Set your 3 main tasks for today (Daily tab)', why: 'Focus on three essential outcomes. Simplicity increases clarity.' },
        ],
        catIds: ['spiritual', 'mental'],
        filterHabitIds: ['s1', 'm4', 's3', 'm2', 'm1'], // Bible, self-help, gratitude, affirmations, journal
    },
    {
        period: 'Classes, Campus & Focus',
        time: '7:00 – 1:00 PM',
        color: '#993C1D',
        colorLight: '#FAECE7',
        icon: '🎓',
        principle: 'Start the hard thing first. Follow the structure even on low-energy days.',
        manualSteps: [
            { id: 'cl3', label: 'Silence notifications during class/work', why: 'Deep work: protect your attention. Guard your mental space.' },
        ],
        catIds: ['career', 'social'],
        filterHabitIds: ['c1', 'c2', 'so2'], // project, classes, connect online
    },
    {
        period: 'Midday Recharge',
        time: '1:00 – 2:00 PM',
        color: '#0F6E56',
        colorLight: '#E1F5EE',
        icon: '🌿',
        principle: 'Rest without guilt — energy fuels performance. Recovery strengthens consistency.',
        manualSteps: [
            { id: 'md4', label: 'Eat well — fruits if possible', why: 'Healthy eating is a non-negotiable habit.' },
        ],
        catIds: ['health', 'financial'],
        filterHabitIds: ['h3', 'f1', 'f2'], // walk, budget check, no debt
    },
    {
        period: 'Afternoon Skill Development',
        time: '2:00 – 5:00 PM',
        color: '#185FA5',
        colorLight: '#E6F1FB',
        icon: '⚡',
        principle: 'Large dreams need small actions. Plan weekly, execute daily.',
        manualSteps: [],
        catIds: ['career', 'mental', 'social'],
        filterHabitIds: ['c3', 'c4', 'c5', 'm5', 'so1'], // design, social media, course, podcast, communication
    },
    {
        period: 'Evening Fitness',
        time: '5:00 – 7:00 PM',
        color: '#3B6D11',
        colorLight: '#EAF3DE',
        icon: '💪',
        principle: 'Physical discipline builds mental discipline. Energy fuels everything.',
        manualSteps: [
            { id: 'ew1', label: 'Limit screen time — log off social media', why: 'Replace the bad habit with something intentional.' },
        ],
        catIds: ['health'],
        filterHabitIds: ['h1', 'h4', 'h5', 'h6', 'h7'], // workout, run, fruits, health metrics, stress mgmt
    },
    {
        period: 'Evening Wind-down & Reflection',
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
        catIds: ['mental', 'financial', 'social', 'spiritual'],
        filterHabitIds: ['m6', 'f3', 'so3', 's4', 's5', 's6'], // review goals, save Ksh, call friends, rosary
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

export default function Wisdom({ state, dispatch }) {
    const [checked, setChecked] = useState({})
    const [collapsed, setCollapsed] = useState({})
    const quote = getDailyQuote()
    const today = todayKey()

    const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }))
    const toggleCollapse = (period) => setCollapsed(p => ({ ...p, [period]: !p[period] }))

    // Live habit lookup — reads directly from state.cats
    const getHabitsForRoutine = (routineKey) => {
        const habits = []
        for (const cat of state.cats) {
            const found = cat.habits.filter(h => h.routine === routineKey)
            found.forEach(h => {
                habits.push({ ...h, catColor: cat.color, catLabel: cat.label })
            })
        }
        return habits
    }

    const isHabitDone = (hid) => !!state.checks[today + '_' + hid]

    // Toggle a habit's check state directly from the routine
    const toggleHabit = (hid) => {
        dispatch({ type: 'TOGGLE_CHECK', hid, day: today })
    }

    // Today's tasks from state
    const tasks = [1, 2, 3].map(n => ({
        text: state.tasks[today + '_task' + n] || '',
        done: !!state.tasks[today + '_task' + n + '_done'],
    })).filter(t => t.text)

    // Overall daily habit progress
    const allDailyHabits = state.cats.flatMap(c => c.habits.filter(h => h.freq === 'daily'))
    const dailyDone = allDailyHabits.filter(h => isHabitDone(h.id)).length
    const dailyPct = allDailyHabits.length ? Math.round(dailyDone / allDailyHabits.length * 100) : 0

    // Mapping between block period and routine keys in data
    const ROUTINE_MAP = {
        'Early Morning Ritual': 'early',
        'Morning Power Hour & Planning': 'morning',
        'Classes, Campus & Focus': 'focus',
        'Midday Recharge': 'recharge',
        'Afternoon Skill Development': 'skill',
        'Evening Fitness': 'fitness',
        'Evening Wind-down & Reflection': 'evening'
    }

    // Build each block's full step list dynamically
    const builtRoutine = BLOCK_DEFINITIONS.map(block => {
        const routineKey = ROUTINE_MAP[block.period]
        const habitSteps = getHabitsForRoutine(routineKey)
        const allSteps = [...block.manualSteps, ...habitSteps]
        return { ...block, allSteps, habitSteps }
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
            <div className="page-sub">{getDayGreeting()} — goals update live as you edit them 🌱</div>

            {/* QUOTE */}
            <div style={{ background: 'var(--text)', color: 'white', borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.5, marginBottom: 8 }}>Quote of the Day</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 500, lineHeight: 1.6, marginBottom: 8 }}>"{quote.text}"</div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>— {quote.author}</div>
            </div>

            {/* TODAY'S TASKS */}
            <div style={{
                background: 'var(--gold-light)', border: tasks.length ? '1px solid #EF9F27' : '1px dashed #EF9F27',
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
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
                        Routine — {doneSteps}/{totalSteps} steps done
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                        Daily habits — {dailyDone}/{allDailyHabits.length} ({dailyPct}%)
                    </div>
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
                const isCollapsed = collapsed[block.period]
                const isComplete = blockTotal > 0 && blockDone === blockTotal

                return (
                    <div key={block.period} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 14, marginBottom: 12, overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div
                            onClick={() => toggleCollapse(block.period)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                                cursor: 'pointer', transition: 'background .2s',
                                background: isComplete ? block.colorLight : 'transparent',
                            }}
                        >
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{block.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>{block.period}</span>
                                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: block.colorLight, color: block.color, fontWeight: 500 }}>
                                        {block.time}
                                    </span>
                                    {isComplete && <span style={{ fontSize: 11, color: block.color, fontWeight: 500 }}>✓ Complete</span>}
                                </div>
                                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginTop: 6, overflow: 'hidden', width: 120 }}>
                                    <div style={{ height: '100%', width: blockPct + '%', background: block.color, borderRadius: 2, transition: 'width .3s' }} />
                                </div>
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0 }}>
                                {blockDone}/{blockTotal} {isCollapsed ? '▼' : '▲'}
                            </span>
                        </div>

                        {/* Body */}
                        {!isCollapsed && (
                            <div style={{ padding: '0 16px 14px' }}>
                                {/* Principle */}
                                <div style={{
                                    fontSize: 12, color: block.color, fontStyle: 'italic',
                                    padding: '8px 12px', background: block.colorLight,
                                    borderRadius: 8, marginBottom: 10, lineHeight: 1.5,
                                }}>
                                    "{block.principle}"
                                </div>

                                {/* Manual steps — checkable here */}
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

                                {/* Live habit steps — label comes from state.cats, checkable here AND in Daily tab */}
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
                                            {/* Circle = synced with Daily tab */}
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
                                                    {/* LIVE TEXT from state.cats — updates when you edit */}
                                                    <span style={{
                                                        fontSize: 13, fontWeight: 500,
                                                        textDecoration: done ? 'line-through' : 'none',
                                                        color: done ? 'var(--muted)' : 'var(--text)',
                                                    }}>
                                                        {habit.text}
                                                    </span>
                                                    {/* Category badge */}
                                                    <span className={`cat-badge badge-${habit.catColor}`} style={{ fontSize: 9, padding: '1px 7px' }}>
                                                        {habit.catLabel}
                                                    </span>
                                                    <span style={{ fontSize: 9, color: 'var(--muted)', fontStyle: 'italic' }}>
                                                        {done ? '● synced' : '○ tap to check'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>
                                                    {habit.freq === 'weekly' ? '📅 Weekly goal' : habit.freq === 'monthly' ? '📆 Monthly goal' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* Empty state if all habits in this block were deleted */}
                                {block.habitSteps.length === 0 && block.manualSteps.length === 0 && (
                                    <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', padding: '8px 0' }}>
                                        No goals linked to this block yet. Add habits in the Daily tab.
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
                    ○ circle = synced with Daily tab &nbsp;·&nbsp; □ square = routine-only step
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