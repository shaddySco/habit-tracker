import { useState } from 'react'

// ─── Keyword → Group detector ─────────────────────────────────────
const KEYWORD_MAP = [
  {
    label: 'Spiritual', color: 'spiritual', icon: '🙏',
    keywords: ['pray', 'prayer', 'faith', 'bible', 'god', 'church', 'spiritual', 'meditate', 'meditation', 'devotion', 'worship', 'holy', 'soul', 'scripture', 'gratitude', 'grateful', 'confession', 'rosary'],
  },
  {
    label: 'Health & Fitness', color: 'health', icon: '💪',
    keywords: ['health', 'fit', 'fitness', 'gym', 'exercise', 'run', 'running', 'workout', 'weight', 'diet', 'eat', 'sleep', 'body', 'marathon', 'hiking', 'walk', 'swim', 'nutrition', 'water', 'strong'],
  },
  {
    label: 'Mentality', color: 'mental', icon: '🧠',
    keywords: ['mindset', 'mental', 'read', 'reading', 'book', 'journal', 'journaling', 'learn', 'affirmation', 'podcast', 'think', 'reflect', 'growth', 'self', 'awareness', 'mind', 'discipline', 'focus'],
  },
  {
    label: 'Financial', color: 'financial', icon: '💰',
    keywords: ['money', 'save', 'saving', 'budget', 'debt', 'income', 'invest', 'investment', 'financial', 'salary', 'wealth', 'spend', 'bank', 'profit', 'expense', 'afford', 'rich', 'broke', 'fund'],
  },
  {
    label: 'Career & Skills', color: 'career', icon: '🚀',
    keywords: ['career', 'job', 'work', 'project', 'internship', 'skill', 'skills', 'code', 'coding', 'design', 'school', 'graduate', 'graduation', 'study', 'studying', 'degree', 'certification', 'portfolio', 'business', 'professional', 'employment', 'course'],
  },
  {
    label: 'Social', color: 'social', icon: '🤝',
    keywords: ['friend', 'friends', 'family', 'social', 'network', 'connect', 'community', 'mentor', 'relationship', 'love', 'people', 'communication', 'talk', 'call', 'meet', 'together', 'support', 'partner'],
  },
]

function detectGroupsFromVision(text) {
  if (!text.trim()) return []
  const lower = text.toLowerCase()
  const words = lower.split(/\W+/)
  const detected = []
  for (const group of KEYWORD_MAP) {
    if (group.keywords.some(kw => words.includes(kw) || lower.includes(kw))) {
      detected.push(group)
    }
  }
  return detected
}

// Inline editable title
function EditableTitle({ value, onSave, onDelete, style = {} }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    const t = draft.trim()
    if (t && t !== value) onSave(t)
    else setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
        style={{ fontWeight: '700', fontSize: '12px', border: 'none', borderBottom: '1.5px solid #2563eb', outline: 'none', background: 'transparent', width: '140px', textTransform: 'uppercase', ...style }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', ...style }}>
      <span
        onClick={() => { setDraft(value); setEditing(true) }}
        title="Click to rename"
        style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', cursor: 'text', letterSpacing: '0.03em', color: 'var(--text)' }}
      >
        {value}
      </span>
      <span onClick={() => { setDraft(value); setEditing(true) }} style={{ fontSize: '10px', cursor: 'pointer', opacity: 0.4 }} title="Rename">✏️</span>
      {onDelete && (
        <span onClick={onDelete} style={{ fontSize: '10px', cursor: 'pointer', opacity: 0.4, marginLeft: '2px' }} title="Delete group">🗑️</span>
      )}
    </div>
  )
}

export default function Dashboard({ state, dispatch, setTab }) {
  const [goalDraft, setGoalDraft] = useState(state.generalGoals || '')
  const [newCatName, setNewCatName] = useState('')
  const [showAddCat, setShowAddCat] = useState(false)
  const [preview, setPreview] = useState(null) // groups detected from vision

  const saveGoals = () => dispatch({ type: 'SET_GENERAL_GOALS', val: goalDraft })

  const sections = [
    { id: 'daily',      title: '📊 Daily Tracking',        desc: 'Log your morning rituals, 3 main tasks, and habit progress for today.',    color: '#2563eb' },
    { id: 'wisdom',     title: '📖 Daily Routine & Wisdom', desc: 'Follow your personalized routine and generate your official PDF summary.', color: '#7c3aed' },
    { id: 'milestones', title: '🏆 Milestones & Growth',    desc: 'Track big wins, achievements, and career assets.',                         color: '#10b981' },
    { id: 'vision',     title: '🎨 Vision Board',           desc: 'Keep your quarterly dreams and aspirations visual and front-of-mind.',      color: '#f59e0b' },
    { id: 'weekly',     title: '📈 Review & Progress',      desc: 'See your weekly and monthly scoring to stay honest with your growth.',      color: '#ef4444' },
  ]

  const addCategory = () => {
    const name = newCatName.trim()
    if (!name) return
    dispatch({ type: 'ADD_CATEGORY', label: name })
    setNewCatName('')
    setShowAddCat(false)
  }

  // Analyse vision and show preview
  const analyseVision = () => {
    const text = goalDraft || state.generalGoals
    if (!text.trim()) { alert('Please write your vision first!'); return }
    const detected = detectGroupsFromVision(text)
    if (!detected.length) {
      alert('No clear life areas detected. Try mentioning things like health, career, faith, money, friends, etc.')
      return
    }
    // Filter out groups already present
    const existingLabels = state.cats.map(c => c.label.toLowerCase())
    const newOnes = detected.filter(d => !existingLabels.includes(d.label.toLowerCase()))
    setPreview({ detected, newOnes })
  }

  const applyGroups = (selected) => {
    selected.forEach(g => dispatch({ type: 'ADD_CATEGORY', label: g.label }))
    setPreview(null)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-title">Command Center</div>
      <div className="page-sub">Welcome back, {state.username}. Here is your roadmap for this year.</div>

      {/* VISION BOX */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px' }}>🎯 My Ultimate Vision</div>
        <textarea
          placeholder="What is your 'Why' for this year? e.g. I want to graduate, get fit, save money, grow spiritually and strengthen my relationships..."
          value={goalDraft}
          onChange={e => setGoalDraft(e.target.value)}
          onBlur={saveGoals}
          style={{ width: '100%', minHeight: '90px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', color: 'var(--text)', outline: 'none', resize: 'vertical', lineHeight: '1.6', boxSizing: 'border-box', marginBottom: '10px' }}
        />

        {/* Generate Groups button */}
        <button
          onClick={analyseVision}
          style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ✨ Generate Groups from Vision
        </button>

        {/* Preview Modal */}
        {preview && (
          <PreviewModal
            preview={preview}
            onApply={applyGroups}
            onClose={() => setPreview(null)}
          />
        )}

        {/* ── GROUPS & GOALS ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>📂 Your Groups & Goals</div>
          <button
            onClick={() => setShowAddCat(v => !v)}
            style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}
          >
            + Add Group
          </button>
        </div>

        {showAddCat && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              autoFocus type="text" placeholder="Group name, e.g. Relationships..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
            />
            <button onClick={addCategory} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Add</button>
            <button onClick={() => setShowAddCat(false)} style={{ padding: '8px 12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>Cancel</button>
          </div>
        )}

        {state.cats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '14px', border: '2px dashed var(--border)', borderRadius: '12px' }}>
            No groups yet — write your vision above and click <strong>"✨ Generate Groups"</strong>, or use <strong>"+ Add Group"</strong>.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {state.cats.map(cat => (
              <CategoryCard key={cat.id} cat={cat} dispatch={dispatch} cats={state.cats} />
            ))}
          </div>
        )}

        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '12px', fontStyle: 'italic' }}>
          💡 Click any group title to rename it. Goals added here appear instantly in your Daily tab.
        </div>
      </div>

      {/* QUICK NAV */}
      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>Quick Navigation</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
        {sections.map(s => (
          <div key={s.id} onClick={() => setTab(s.id)}
            style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 15px -3px ${s.color}22` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '16px', fontWeight: '700', color: s.color }}>{s.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>{s.desc}</div>
            <div style={{ marginTop: 'auto', fontSize: '12px', fontWeight: '600', color: s.color }}>Go to section →</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500' }}>
          💡 Use the <strong>Daily Wisdom</strong> tab to generate your PDF summary and stay accountable!
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────

function CategoryCard({ cat, dispatch, cats }) {
  const [newGoal, setNewGoal] = useState('')

  const addGoal = (text) => {
    const t = (text || newGoal).trim()
    if (!t) return
    dispatch({ type: 'ADD_HABIT', catId: cat.id, text: t, freq: 'daily' })
    setNewGoal('')
  }

  return (
    <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '12px', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `var(--${cat.color}, #6366f1)`, flexShrink: 0 }} />
        <EditableTitle
          value={cat.label}
          onSave={label => dispatch({ type: 'RENAME_CATEGORY', catId: cat.id, label })}
          onDelete={cats.length > 1 ? () => {
            if (window.confirm(`Delete "${cat.label}" and all its goals?`)) dispatch({ type: 'DELETE_CATEGORY', catId: cat.id })
          } : null}
        />
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)' }}>{cat.habits.length} goals</span>
      </div>

      {cat.habits.map(h => (
        <div key={h.id} style={{ fontSize: '13px', color: '#475569', padding: '4px 0', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>•</span>
          <span style={{ flex: 1 }}>{h.text}</span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        <input
          type="text" value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGoal()}
          placeholder={`Add a ${cat.label} goal...`}
          style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none' }}
        />
        <button onClick={() => addGoal()} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '16px', cursor: 'pointer', color: '#475569', fontWeight: '700' }}>+</button>
      </div>
    </div>
  )
}

function PreviewModal({ preview, onApply, onClose }) {
  const [selected, setSelected] = useState(preview.newOnes.map(g => g.label))

  const toggle = (label) => setSelected(s => s.includes(label) ? s.filter(x => x !== label) : [...s, label])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px -12px rgb(0 0 0/0.25)' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>✨ Groups Detected from Your Vision</div>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '1.25rem' }}>
          We found these life areas in what you wrote. Select which ones to add as groups:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          {preview.detected.map(g => {
            const isNew = preview.newOnes.some(n => n.label === g.label)
            const isSelected = selected.includes(g.label)
            return (
              <div
                key={g.label}
                onClick={() => isNew && toggle(g.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px',
                  border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  cursor: isNew ? 'pointer' : 'default', transition: 'all 0.15s'
                }}
              >
                <span style={{ fontSize: '22px' }}>{g.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{g.label}</div>
                  {!isNew && <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>Already in your groups ✓</div>}
                </div>
                {isNew && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? '#2563eb' : '#cbd5e1'}`, background: isSelected ? '#2563eb' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', flexShrink: 0 }}>
                    {isSelected ? '✓' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', color: '#64748b' }}>Cancel</button>
          <button
            onClick={() => onApply(preview.newOnes.filter(g => selected.includes(g.label)))}
            disabled={selected.length === 0}
            style={{ flex: 2, padding: '12px', background: selected.length > 0 ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#94a3b8', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: selected.length > 0 ? 'pointer' : 'default', color: 'white', fontSize: '14px' }}
          >
            Add {selected.length} Group{selected.length !== 1 ? 's' : ''} →
          </button>
        </div>
      </div>
    </div>
  )
}
