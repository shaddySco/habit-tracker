import { monthKey, SELF_CHECK_QUESTIONS, openCalendarReminder } from '../data/categories'

function buildMonthlySummaryText(state) {
  const mk = monthKey()
  const lines = ['=== MONTHLY SCORECARD ===\n']
  let total = 0, max = 0
  state.cats.forEach(cat => {
    const stars = state.stars[mk + '_' + cat.id] || 0
    total += stars; max += 5
    lines.push(`[${cat.label}] ${'⭐'.repeat(stars) || 'Not rated'} (${stars}/5)`)
  })
  const overall = max ? Math.round(total / max * 100) : 0
  lines.push(`\nOverall Score: ${overall}%`)
  lines.push('\nPlease check in and motivate your accountability partner to keep going!')
  return lines.join('\n')
}

export default function Monthly({ state, dispatch, showToast }) {
  const mk = monthKey()
  let total = 0, max = 0
  state.cats.forEach(cat => { total += (state.stars[mk + '_' + cat.id] || 0); max += 5 })
  const overall = max ? Math.round(total / max * 100) : 0
  const overallMsg = overall >= 80 ? 'Excellent — keep this momentum!' : overall >= 50 ? 'Good progress — push harder!' : 'Room to grow — stay committed!'

  const notifyAllPartners = () => {
    const partners = state.cats.filter(cat => state.partners[cat.id]?.email)
    if (!partners.length) { showToast('No partner emails added yet.'); return }
    const summary = buildMonthlySummaryText(state)
    partners.forEach((cat, i) => {
      setTimeout(() => {
        const p = state.partners[cat.id]
        openCalendarReminder({
          title: `Monthly scorecard — accountability check`,
          details: `Hey ${p.name || 'friend'}!\n\nHere is this month's scorecard:\n\n${summary}`,
          email: p.email,
          recur: 'MONTHLY',
        })
      }, i * 800)
    })
    showToast(`Sending monthly scorecard to ${partners.length} partner(s)...`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Monthly Scorecard</div>
          <div className="page-sub">{new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })} — self-assessment</div>
        </div>
        <button className="cal-btn" onClick={notifyAllPartners}>📅 Notify All Partners</button>
      </div>

      {/* OVERALL SCORE */}
      <div className="overall-box">
        <div className="overall-num">{overall}</div>
        <div className="overall-info">
          <div className="overall-lbl">Overall monthly score</div>
          <div className="overall-msg">{overallMsg}</div>
          <div className="overall-track">
            <div className="overall-fill" style={{ width: overall + '%' }} />
          </div>
        </div>
      </div>

      {/* CATEGORY STARS */}
      <div className="month-grid">
        {state.cats.map(cat => {
          const stars = state.stars[mk + '_' + cat.id] || 0
          const note = state.notes[mk + '_' + cat.id] || ''
          return (
            <div key={cat.id} className="month-card">
              <span className={`cat-badge badge-${cat.color}`} style={{ fontSize: 10, padding: '3px 10px' }}>{cat.label}</span>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} className="star"
                    onClick={() => dispatch({ type: 'SET_STAR', catId: cat.id, val: i })}>
                    {i <= stars ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <textarea className="mnote mnote-sm" placeholder="Notes..."
                value={note} onChange={e => dispatch({ type: 'SET_NOTE', catId: cat.id, val: e.target.value })} />
            </div>
          )
        })}
      </div>

      {/* SELF-CHECK QUESTIONS */}
      <div className="selfcheck-box">
        <div className="selfcheck-title">Monthly Self-Check — Actualize your dream life</div>
        <div className="selfcheck-grid">
          {SELF_CHECK_QUESTIONS.map((q, i) => {
            const key = mk + '_sc' + i
            return (
              <div key={i} className="selfcheck-item">
                <div className="selfcheck-q">{q}</div>
                <input className="selfcheck-input" type="text" placeholder="Your answer..."
                  value={state.selfcheck[key] || ''}
                  onChange={e => dispatch({ type: 'SET_SELFCHECK', key, val: e.target.value })} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
