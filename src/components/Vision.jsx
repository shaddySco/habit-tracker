import { useRef, useState } from 'react'
import { VISION_PROMPTS } from '../data/categories'

const CATEGORIES = [
  { id: 'spiritual', label: 'Spiritual', color: 'spiritual', icon: '🙏', keywords: ['pray', 'faith', 'god', 'bible', 'church', 'spiritual', 'rosary', 'confession', 'worship', 'devotion', 'meditation', 'retreat', 'soul', 'holy'] },
  { id: 'health', label: 'Health & Fitness', color: 'health', icon: '💪', keywords: ['workout', 'run', 'gym', 'fitness', 'health', 'body', 'weight', 'eat', 'diet', 'water', 'exercise', 'marathon', 'sport', 'muscle', 'sleep', 'walk', 'jog'] },
  { id: 'mental', label: 'Mentality', color: 'mental', icon: '🧠', keywords: ['journal', 'read', 'book', 'mindset', 'learn', 'study', 'affirmation', 'mental', 'focus', 'growth', 'mindful', 'reflect', 'knowledge', 'podcast', 'calm', 'clarity'] },
  { id: 'financial', label: 'Financial', color: 'financial', icon: '💰', keywords: ['money', 'save', 'invest', 'income', 'budget', 'debt', 'salary', 'business', 'earn', 'wealth', 'ksh', 'financial', 'revenue', 'profit', 'spend', 'afford'] },
  { id: 'career', label: 'Career & Skills', color: 'career', icon: '🎯', keywords: ['job', 'work', 'career', 'project', 'graduate', 'degree', 'internship', 'skill', 'portfolio', 'design', 'code', 'certificate', 'promotion', 'professional', 'class', 'campus'] },
  { id: 'social', label: 'Social', color: 'social', icon: '🤝', keywords: ['friend', 'family', 'relationship', 'connect', 'network', 'mentor', 'community', 'love', 'people', 'social', 'communicate', 'partner', 'team', 'support', 'kind'] },
]

// Fast local classifier — checks keyword overlap first before calling API
function classifyLocal(text) {
  const lower = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const cat of CATEGORIES) {
    const score = cat.keywords.filter(k => lower.includes(k)).length
    if (score > bestScore) { bestScore = score; best = cat }
  }
  return bestScore > 0 ? best : null
}

// Claude API classifier — used when local confidence is low
async function classifyWithAI(text) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: `Classify this personal goal into exactly ONE category. Reply with ONLY the category id, nothing else.

Goal: "${text}"

Categories:
- spiritual (faith, prayer, God, church, Bible, spiritual growth)
- health (fitness, exercise, diet, body, wellness, sport, workout)
- mental (mindset, reading, learning, journaling, focus, personal growth)
- financial (money, savings, income, investment, business, budget)
- career (work, job, skills, project, graduation, portfolio, certification)
- social (relationships, friends, family, networking, community, communication)

Reply with only one of: spiritual, health, mental, financial, career, social`
        }]
      })
    })
    const data = await res.json()
    const id = data.content?.[0]?.text?.trim().toLowerCase()
    return CATEGORIES.find(c => c.id === id) || null
  } catch {
    return null
  }
}

export function Vision({ state, dispatch, showToast }) {
  const fileRefs = useRef({})
  const [classifying, setClassifying] = useState({}) // idx -> true while loading

  const handleImg = (i, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => dispatch({ type: 'SET_VISION_IMG', idx: i, src: ev.target.result })
    reader.readAsDataURL(file)
  }

  const handleTextChange = (i, text) => {
    dispatch({ type: 'SET_VISION_TEXT', idx: i, text })
  }

  const handleTextBlur = async (i, text) => {
    if (!text || text.trim().length < 5) return

    setClassifying(p => ({ ...p, [i]: true }))

    // Try local first (instant)
    let cat = classifyLocal(text)

    // If local didn't find a match, ask Claude
    if (!cat) {
      cat = await classifyWithAI(text)
    }

    setClassifying(p => ({ ...p, [i]: false }))

    if (cat) {
      dispatch({ type: 'SET_VISION_CATEGORY', idx: i, category: cat.id, categoryLabel: cat.label })
      showToast(`✨ Grouped under ${cat.label}`)
    }
  }

  // Group filled visions by category for the grouped view
  const allVisions = VISION_PROMPTS.map((prompt, i) => {
    const v = state.vision['q' + (i + 1)] || {}
    return { idx: i, prompt, ...v }
  }).filter(v => v.text)

  const grouped = {}
  for (const cat of CATEGORIES) {
    const items = allVisions.filter(v => v.category === cat.id)
    if (items.length) grouped[cat.id] = { cat, items }
  }
  const ungrouped = allVisions.filter(v => !v.category)
  const hasGrouped = Object.keys(grouped).length > 0

  return (
    <div>
      <div className="page-title">Vision Board</div>
      <div className="page-sub">Write your goals — the system reads and groups them by life category automatically ✨</div>

      {/* INPUT SECTION — always visible */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title" style={{ marginBottom: '1rem' }}>Your Quarterly Visions</div>
        <div className="vis-grid">
          {VISION_PROMPTS.map((prompt, i) => {
            const v = state.vision['q' + (i + 1)] || {}
            const cat = CATEGORIES.find(c => c.id === v.category)
            const isClassifying = !!classifying[i]

            return (
              <div key={i} className="vis-card">
                {/* Image area */}
                <div className="vis-img-area" onClick={() => fileRefs.current[i]?.click()}>
                  {v.img
                    ? <img src={v.img} alt={prompt} />
                    : (
                      <div className="vis-placeholder">
                        <span className="vis-plus">+</span>
                        Add image
                      </div>
                    )}
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    ref={el => fileRefs.current[i] = el}
                    onChange={e => handleImg(i, e)} />
                </div>

                <div className="vis-body">
                  <div className="vis-q">{prompt}</div>

                  {/* Category badge — shows after classification */}
                  {cat && !isClassifying && (
                    <div style={{ marginBottom: 6 }}>
                      <span className={`cat-badge badge-${cat.color}`} style={{ fontSize: 10, padding: '2px 10px' }}>
                        {cat.icon} {cat.label}
                      </span>
                    </div>
                  )}
                  {isClassifying && (
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, fontStyle: 'italic' }}>
                      🤖 Classifying...
                    </div>
                  )}

                  {/* Goal input */}
                  <textarea
                    className="vis-input"
                    placeholder="Write your vision here..."
                    value={v.text || ''}
                    rows={2}
                    style={{ resize: 'none', minHeight: 48, lineHeight: 1.5 }}
                    onChange={e => handleTextChange(i, e.target.value)}
                    onBlur={e => handleTextBlur(i, e.target.value)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* GROUPED VIEW — appears once at least one goal is classified */}
      {hasGrouped && (
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
            Your Visions by Life Area
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.25rem' }}>
            Automatically grouped — {allVisions.length} vision{allVisions.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} area{Object.keys(grouped).length !== 1 ? 's' : ''}
          </div>

          {Object.values(grouped).map(({ cat, items }) => (
            <div key={cat.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, marginBottom: 14, overflow: 'hidden'
            }}>
              {/* Category header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: `var(--${cat.color}-light, var(--bg))`
              }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <div>
                  <span className={`cat-badge badge-${cat.color}`} style={{ fontSize: 11, padding: '3px 12px' }}>
                    {cat.label}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
                  {items.length} vision{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Vision cards in this category */}
              <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {items.map(v => (
                  <div key={v.idx} style={{
                    background: 'var(--bg)', borderRadius: 10,
                    border: '1px solid var(--border)', overflow: 'hidden'
                  }}>
                    {v.img && (
                      <div style={{ height: 100, overflow: 'hidden' }}>
                        <img src={v.img} alt={v.text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>
                        {v.prompt}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)' }}>
                        {v.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Ungrouped — visions typed but not yet classified */}
          {ungrouped.length > 0 && (
            <div style={{
              background: 'var(--surface)', border: '1px dashed var(--border)',
              borderRadius: 14, padding: '12px 16px', marginBottom: 14
            }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, fontStyle: 'italic' }}>
                ⏳ Not yet classified — click into the goal fields above to trigger grouping
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {ungrouped.map(v => (
                  <div key={v.idx} style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{v.prompt}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {!hasGrouped && allVisions.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '2rem', background: 'var(--bg)',
          borderRadius: 14, border: '1px dashed var(--border)', color: 'var(--muted)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌟</div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Start writing your visions above</div>
          <div style={{ fontSize: 12 }}>The system will automatically group them by life area as you type</div>
        </div>
      )}
    </div>
  )
}