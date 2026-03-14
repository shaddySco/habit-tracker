import { useState } from 'react'

const WISDOM_DATA = {
    whyHabitsMatter: [
        'Habits shape your future daily',
        'Consistency beats motivation always',
        'Discipline today, freedom kesho',
        'Daily actions define destiny',
        'Routine creates calm confidence',
        'Focus grows through repetition',
        'Habits reduce decision stress',
        'Good systems protect dreams',
        'Daily effort compounds quietly',
        'Intentional living brings clarity',
    ],

    developHabit: [
        { step: '1. Start Very Small', desc: 'Anza kidogo sana. Make it so easy you cannot fail. Small wins build confidence and remove pressure.' },
        { step: '2. Attach It to Routine', desc: 'Connect the new habit to something you already do daily. Familiar rhythm makes it easier to stay consistent.' },
        { step: '3. Track Your Progress', desc: 'Write it down. Seeing growth visually strengthens commitment and builds accountability.' },
        { step: '4. Stay Patient and Consistent', desc: 'Usichoke haraka. Growth is quiet. Repetition builds identity over time.' },
    ],

    developSystem: [
        { step: '1. Focus on Process, Not Mood', desc: 'Do not wait to feel inspired. Follow the structure even on low-energy days.' },
        { step: '2. Create Fixed Time Blocks', desc: 'Decide when tasks happen. Clear timing removes confusion and reduces excuses.' },
        { step: '3. Reduce Distractions Intentionally', desc: 'Protect your attention. Silence notifications. Guard your mental space.' },
        { step: '4. Review and Improve Weekly', desc: 'Reflect calmly. What worked? What needs adjustment? Improve gently, continue boldly.' },
    ],

    breakOldHabits: [
        { step: '1. Identify the Trigger', desc: 'Notice what starts the pattern. Awareness creates control.' },
        { step: '2. Replace, Don\'t Just Remove', desc: 'Bad habits need better alternatives. Swap the action, not just the intention.' },
        { step: '3. Make It Harder to Access', desc: 'Increase distance from temptation. Environment influences behavior.' },
        { step: '4. Be Kind to Yourself', desc: 'Growth is not punishment. Learn, reset, move forward stronger.' },
    ],

    beMoreProductive: [
        { step: '1. Prioritize Three Main Tasks', desc: 'Focus on three essential outcomes daily. Simplicity increases clarity.' },
        { step: '2. Work in Focused Sessions', desc: 'Deep work. No multitasking. Full attention produces better results.' },
        { step: '3. Rest Without Guilt', desc: 'Energy fuels performance. Recovery strengthens consistency.' },
        { step: '4. Celebrate Small Progress', desc: 'Every step counts. Appreciation builds motivation and resilience.' },
    ],

    actualizeLife: [
        { step: '1. Get Clear Vision', desc: 'Define exactly what you want. Clarity creates direction.' },
        { step: '2. Break It Into Steps', desc: 'Large dreams need small actions. Plan weekly, execute daily.' },
        { step: '3. Build Supporting Habits', desc: 'Success grows from routine. Systems protect ambition.' },
        { step: '4. Learn Continuously', desc: 'Invest in knowledge. Skills expand opportunity.' },
        { step: '5. Surround Yourself Wisely', desc: 'Energy matters. Stay near people who uplift and challenge you.' },
        { step: '6. Stay Consistent Long-Term', desc: 'Sio sprint. It is a marathon. Quiet effort wins.' },
    ],

    quotes: [
        { text: 'The will to succeed is important, but what\'s more important is the will to prepare.', author: 'Bobby Knight' },
        { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
        { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Anonymous' },
        { text: 'Discipline over motivation.', author: 'Jenna Kuria' },
        { text: 'Small actions, repeated daily, quietly build the life you desire.', author: 'Jenna Kuria' },
    ],

    morningRules: [
        { icon: '📵', rule: 'No phone', desc: 'Protect focus. Win the first hour.' },
        { icon: '🙏', rule: 'Pray', desc: 'Centre yourself before the day begins.' },
        { icon: '📋', rule: 'Plan the day', desc: 'Decide your 3 main tasks before anything else.' },
        { icon: '🏃', rule: 'Move intentionally', desc: 'Stretch, walk, or work out. Wake your body up.' },
        { icon: '🔥', rule: 'Start hard thing first', desc: 'Tackle the most difficult task while energy is highest.' },
    ],
}

function getDailyQuote() {
    const idx = new Date().getDate() % WISDOM_DATA.quotes.length
    return WISDOM_DATA.quotes[idx]
}

function getDailyHabitTip() {
    const idx = new Date().getDate() % WISDOM_DATA.whyHabitsMatter.length
    return WISDOM_DATA.whyHabitsMatter[idx]
}

export default function Wisdom() {
    const [activeSection, setActiveSection] = useState('morning')
    const quote = getDailyQuote()
    const habitTip = getDailyHabitTip()

    const sections = [
        { id: 'morning', label: '🌅 Morning Rules' },
        { id: 'habit', label: '🔁 Build a Habit' },
        { id: 'system', label: '⚙️ Build a System' },
        { id: 'break', label: '🚫 Break Old Habits' },
        { id: 'productive', label: '⚡ Be Productive' },
        { id: 'actualize', label: '🌟 Actualize Your Life' },
    ]

    const renderSteps = (items) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((item, i) => (
                <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.step}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
            ))}
        </div>
    )

    return (
        <div>
            <div className="page-title">Daily Wisdom</div>
            <div className="page-sub">Principles from The Ultimate 101 Guide to Productivity &amp; Discipline</div>

            {/* DAILY QUOTE */}
            <div style={{
                background: 'var(--text)', color: 'white', borderRadius: 14,
                padding: '1.5rem', marginBottom: '1.25rem'
            }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.5, marginBottom: 8 }}>
                    Quote of the Day
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>
                    "{quote.text}"
                </div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>— {quote.author}</div>
            </div>

            {/* DAILY HABIT TIP */}
            <div style={{
                background: 'var(--accent-light)', border: '1px solid var(--accent)',
                borderRadius: 10, padding: '12px 16px', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: 10
            }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 500, marginBottom: 2 }}>
                        Today's Habit Reminder
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{habitTip}</div>
                </div>
            </div>

            {/* SECTION TABS */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {sections.map(s => (
                    <button key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        style={{
                            padding: '7px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .15s',
                            border: activeSection === s.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                            background: activeSection === s.id ? 'var(--accent)' : 'var(--surface)',
                            color: activeSection === s.id ? 'white' : 'var(--text)',
                        }}>
                        {s.label}
                    </button>
                ))}
            </div>

            {/* SECTION CONTENT */}
            <div className="card">
                {activeSection === 'morning' && (
                    <div>
                        <div className="card-title">Productivity Rule After Sleep</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                            How you start your morning shapes your entire day.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {WISDOM_DATA.morningRules.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', background: 'var(--bg)', borderRadius: 10 }}>
                                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.rule}</div>
                                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'habit' && (
                    <div>
                        <div className="card-title">How to Develop a Habit</div>
                        {renderSteps(WISDOM_DATA.developHabit)}
                    </div>
                )}

                {activeSection === 'system' && (
                    <div>
                        <div className="card-title">How to Develop a System</div>
                        {renderSteps(WISDOM_DATA.developSystem)}
                    </div>
                )}

                {activeSection === 'break' && (
                    <div>
                        <div className="card-title">How to Break Old Habits</div>
                        {renderSteps(WISDOM_DATA.breakOldHabits)}
                    </div>
                )}

                {activeSection === 'productive' && (
                    <div>
                        <div className="card-title">How to Be More Productive</div>
                        {renderSteps(WISDOM_DATA.beMoreProductive)}
                    </div>
                )}

                {activeSection === 'actualize' && (
                    <div>
                        <div className="card-title">How to Actualize Your Dream Life</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                            Questions to ask yourself: What truly matters to me? Am I afraid or prepared? What skills must I build?
                        </div>
                        {renderSteps(WISDOM_DATA.actualizeLife)}
                    </div>
                )}
            </div>

            {/* WHY HABITS MATTER — full list */}
            <div className="card">
                <div className="card-title">Why Habits Matter</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem' }}>
                    Small actions, repeated daily, quietly build the life you desire.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                    {WISDOM_DATA.whyHabitsMatter.map((tip, i) => (
                        <div key={i} style={{
                            fontSize: 12, padding: '8px 12px', borderRadius: 8,
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: 8
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                            {tip}
                        </div>
                    ))}
                </div>
            </div>

            {/* CREDIT */}
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
                Content sourced from <strong>The Ultimate 101 Guide to Productivity and Discipline</strong> by Jenna Kuria
                &nbsp;·&nbsp; Bloom PDF Store &nbsp;·&nbsp; <a href="mailto:jennakuria1@gmail.com" style={{ color: 'var(--accent)' }}>jennakuria1@gmail.com</a>
            </div>
        </div>
    )
}