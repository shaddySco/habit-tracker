import { useState } from 'react'

const CATEGORY_META = {
  spiritual: {
    icon: '🙏',
    color: '#7c3aed',
    light: '#f5f3ff',
    examples: ['Pray every morning', 'Read scripture daily', 'Write 3 things I\'m grateful for', 'Attend weekly service', 'Fast once a week'],
    hint: 'Faith, prayer, gratitude, spiritual growth',
  },
  health: {
    icon: '💪',
    color: '#10b981',
    light: '#ecfdf5',
    examples: ['Workout 30 mins daily', 'Drink 2 litres of water', 'Sleep by 10 PM', 'Run 5km weekly', 'Eat more vegetables'],
    hint: 'Exercise, nutrition, sleep, wellness',
  },
  mental: {
    icon: '🧠',
    color: '#2563eb',
    light: '#eff6ff',
    examples: ['Journal for 10 minutes', 'Read 10 pages of a book', 'Say daily affirmations', 'Meditate for 5 mins', 'Limit social media'],
    hint: 'Mindset, learning, focus, self-awareness',
  },
  financial: {
    icon: '💰',
    color: '#f59e0b',
    light: '#fffbeb',
    examples: ['Save $10 / 500 Ksh today', 'Track daily expenses', 'No impulse purchases', 'Review monthly budget', 'Research investments'],
    hint: 'Savings, budgeting, income goals',
  },
  career: {
    icon: '🚀',
    color: '#ef4444',
    light: '#fef2f2',
    examples: ['Work on my project for 1 hour', 'Apply to one job/internship', 'Complete an online course', 'Update my portfolio', 'Network with professionals'],
    hint: 'Skills, career, education, side projects',
  },
  social: {
    icon: '🤝',
    color: '#0ea5e9',
    light: '#f0f9ff',
    examples: ['Call a friend or family member', 'Meet someone new', 'Practice active listening', 'Write a thank-you message', 'Join a community event'],
    hint: 'Relationships, communication, community',
  },
}

function CategoryCard({ cat, onAddHabit, habits }) {
  const [input, setInput] = useState('')
  const [showExamples, setShowExamples] = useState(false)
  const meta = CATEGORY_META[cat.id] || {}

  const add = (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed) return
    onAddHabit(cat.id, trimmed)
    setInput('')
    setShowExamples(false)
  }

  return (
    <div style={{
      background: 'white', borderRadius: '16px', border: `2px solid ${meta.light || '#f1f5f9'}`,
      overflow: 'hidden', transition: 'box-shadow 0.2s'
    }}>
      {/* Header */}
      <div style={{ background: meta.light, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${meta.color}22` }}>
        <span style={{ fontSize: '22px' }}>{meta.icon}</span>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: meta.color }}>{cat.label}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{meta.hint}</div>
        </div>
        <div style={{ marginLeft: 'auto', background: meta.color, color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '600' }}>
          {habits.length} {habits.length === 1 ? 'goal' : 'goals'}
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Existing goals */}
        {habits.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            {habits.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#334155', flex: 1 }}>{h.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add input */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder={`Add a ${cat.label} goal...`}
            style={{
              flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
              fontSize: '13px', outline: 'none', fontFamily: 'DM Sans, sans-serif', color: '#334155'
            }}
          />
          <button
            onClick={() => add()}
            style={{ background: meta.color, color: 'white', border: 'none', borderRadius: '8px', padding: '0 14px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' }}
          >+</button>
        </div>

        {/* Examples toggle */}
        <button
          onClick={() => setShowExamples(v => !v)}
          style={{ background: 'none', border: 'none', fontSize: '11px', color: meta.color, cursor: 'pointer', padding: '2px 0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {showExamples ? '▲ Hide examples' : '💡 Show examples'}
        </button>

        {showExamples && (
          <div style={{ marginTop: '8px', background: meta.light, borderRadius: '8px', padding: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tap to add →</div>
            {meta.examples.map((ex, i) => (
              <div
                key={i}
                onClick={() => add(ex)}
                style={{
                  fontSize: '12px', color: '#475569', padding: '5px 8px', cursor: 'pointer',
                  borderRadius: '6px', transition: 'background 0.15s', marginBottom: '3px',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${meta.color}18`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: meta.color, fontSize: '10px' }}>＋</span> {ex}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Setup({ state, dispatch }) {
  const [vision, setVision] = useState('')
  const [step, setStep] = useState(1) // 1 = vision, 2 = goals

  const totalGoals = state.cats.reduce((acc, c) => acc + c.habits.length, 0)

  const handleAddHabit = (catId, text) => {
    dispatch({ type: 'ADD_HABIT', catId, text, freq: 'daily' })
  }

  const KEYWORD_MAP = [
    { label: 'Spiritual',      color: 'spiritual', keywords: ['pray','prayer','faith','bible','god','church','spiritual','meditate','meditation','devotion','worship','soul','scripture','gratitude','confession'] },
    { label: 'Health & Fitness', color: 'health',    keywords: ['health','fit','fitness','gym','exercise','run','running','workout','weight','diet','eat','sleep','body','marathon','walk','swim','nutrition','water','strong'] },
    { label: 'Mentality',      color: 'mental',    keywords: ['mindset','mental','read','reading','book','journal','learn','affirmation','podcast','think','reflect','growth','self','awareness','mind','discipline','focus'] },
    { label: 'Financial',      color: 'financial', keywords: ['money','save','saving','budget','debt','income','invest','investment','financial','salary','wealth','spend','bank','profit','expense','afford','rich','fund'] },
    { label: 'Career & Skills', color: 'career',    keywords: ['career','job','work','project','internship','skill','skills','code','design','school','graduate','graduation','study','degree','certification','portfolio','business','course'] },
    { label: 'Social',         color: 'social',    keywords: ['friend','friends','family','social','network','connect','community','mentor','relationship','love','people','communication','talk','call','meet','support'] },
  ]

  const goToGoals = () => {
    if (vision.trim()) {
      dispatch({ type: 'SET_GENERAL_GOALS', val: vision.trim() })
      // Detect life areas and pre-add groups not yet present
      const lower = vision.toLowerCase()
      const words = lower.split(/\W+/)
      const existingLabels = state.cats.map(c => c.label.toLowerCase())
      KEYWORD_MAP.forEach(g => {
        if (g.keywords.some(kw => words.includes(kw) || lower.includes(kw))) {
          if (!existingLabels.includes(g.label.toLowerCase())) {
            dispatch({ type: 'ADD_CATEGORY', label: g.label })
          }
        }
      })
    }
    setStep(2)
  }

  const handleFinish = () => {
    dispatch({ type: 'SETUP_DONE' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '880px' }}>

        {/* Top greeting */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎯</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', fontFamily: 'Playfair Display, serif', margin: '0 0 8px' }}>
            Let's set up your tracker, {state.username}!
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            You only need to do this once. Set your vision and your goals — everything else flows from here.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div onClick={() => setStep(s)} style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                  background: step === s ? '#2563eb' : step > s ? '#10b981' : '#e2e8f0',
                  color: step >= s ? 'white' : '#94a3b8'
                }}>
                  {step > s ? '✓' : s}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: step === s ? '#2563eb' : '#94a3b8' }}>
                  {s === 1 ? 'Your Vision' : 'Your Goals'}
                </span>
                {s < 2 && <div style={{ width: '40px', height: '2px', background: step > s ? '#10b981' : '#e2e8f0', borderRadius: '2px' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Big Vision */}
        {step === 1 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '28px', lineHeight: 1 }}>✨</div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>What is your ultimate vision for this year?</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>This is your "Why" — the big picture that drives everything. Be honest and specific.</p>
              </div>
            </div>

            <textarea
              value={vision}
              onChange={e => setVision(e.target.value)}
              placeholder={`E.g. This year I want to graduate with honours, get my first internship, grow spiritually, and build healthy habits that last a lifetime. I want to end 2026 feeling proud of who I've become...`}
              style={{
                width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '12px',
                border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                color: '#334155', lineHeight: '1.7', outline: 'none', resize: 'vertical',
                boxSizing: 'border-box', background: '#f8fafc'
              }}
            />

            <button
              onClick={goToGoals}
              style={{
                marginTop: '1.25rem', width: '100%', padding: '1rem', borderRadius: '12px',
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', border: 'none', fontWeight: '700',
                fontSize: '15px', cursor: 'pointer', transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              ✨ Detect My Groups & Continue →
            </button>
          </div>
        )}

        {/* STEP 2: Per-category Goals */}
        {step === 2 && (
          <>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 3px rgb(0 0 0 / 0.05)' }}>
              <span style={{ fontSize: '20px' }}>✨</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Your Vision</div>
                <div style={{ fontSize: '14px', color: '#0f172a', lineHeight: 1.5 }}>{vision || 'Not set yet'}</div>
              </div>
              <button onClick={() => setStep(1)} style={{ marginLeft: 'auto', fontSize: '12px', color: '#2563eb', background: 'none', border: '1px solid #2563eb', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>Edit</button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Now, break it down into goals by life area</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Add at least one goal per category. Click "💡 Show examples" for ideas.  Press <strong>Enter</strong> or <strong>+</strong> to add.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
              {state.cats.map(cat => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  habits={cat.habits}
                  onAddHabit={handleAddHabit}
                />
              ))}
            </div>

            <div style={{
              background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  {totalGoals === 0 ? 'Add at least one goal to get started' : `${totalGoals} goal${totalGoals === 1 ? '' : 's'} set across your life areas 🎉`}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>You can always add more from the Daily tab later.</div>
              </div>
              <button
                onClick={handleFinish}
                disabled={totalGoals === 0}
                style={{
                  marginLeft: 'auto', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700',
                  fontSize: '15px', border: 'none', cursor: totalGoals > 0 ? 'pointer' : 'not-allowed',
                  background: totalGoals > 0 ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#94a3b8',
                  color: 'white', whiteSpace: 'nowrap', flexShrink: 0, transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => totalGoals > 0 && (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Start Tracking 🚀
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
