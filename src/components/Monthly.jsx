import { useState } from 'react'
import { monthKey, SELF_CHECK_QUESTIONS, openCalendarReminder } from '../data/categories'
import { buildMonthlySummaryHTML, printHTML, PDFButton } from './SummaryPDF'

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
  const [showSelfCheckWarning, setShowSelfCheckWarning] = useState(false)

  let total = 0, max = 0
  state.cats.forEach(cat => { total += (state.stars[mk + '_' + cat.id] || 0); max += 5 })
  const overall = max ? Math.round(total / max * 100) : 0
  const overallMsg = overall >= 80 ? 'Excellent — keep this momentum!' : overall >= 50 ? 'Good progress — push harder!' : 'Room to grow — stay committed!'

  // Self-check completion gate
  const selfCheckFilled = SELF_CHECK_QUESTIONS.filter((_, i) => (state.selfcheck?.[mk + '_sc' + i] || '').trim().length > 3)
  const selfCheckComplete = selfCheckFilled.length >= 4 // at least 4 of 7 answered

  const handlePDFClick = () => {
    if (!selfCheckComplete) {
      setShowSelfCheckWarning(true)
      document.getElementById('monthly-selfcheck')?.scrollIntoView({ behavior: 'smooth' })
      showToast('⚠️ Please complete the Monthly Self-Check before generating the summary')
      return
    }
    setShowSelfCheckWarning(false)
    printHTML(buildMonthlySummaryHTML(state), `${state.username} — Monthly Summary — ${new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}`)
  }

  const notifyAllPartners = () => {
    const allCatIds = state.cats.filter(cat =>
      (state.partnerGroups?.[cat.id]?.length) || state.partners[cat.id]?.email
    ).map(c => c.id)

    if (!allCatIds.length) { showToast('No partner emails added yet.'); return }
    const summary = buildMonthlySummaryText(state)
    let count = 0
    allCatIds.forEach((catId, ci) => {
      const cat = state.cats.find(c => c.id === catId)
      const group = state.partnerGroups?.[catId] || []
      const legacy = state.partners[catId]?.email ? [state.partners[catId]] : []
      const allP = [...group, ...legacy.filter(l => !group.find(g => g.email === l.email))]
      allP.forEach((p, pi) => {
        count++
        setTimeout(() => {
          openCalendarReminder({
            title: `Monthly scorecard — accountability check`,
            details: `Hey ${p.name || 'friend'}!\n\nHere is this month's scorecard:\n\n${summary}`,
            email: p.email,
            recur: 'MONTHLY',
          })
        }, (ci * 3 + pi) * 700)
      })
    })
    showToast(`Sending monthly scorecard to ${count} partner(s)...`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Monthly Scorecard</div>
          <div className="page-sub">{new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })} — self-assessment</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <button className="cal-btn" onClick={notifyAllPartners}>📅 Notify All Partners</button>
          <PDFButton
            label="Monthly PDF"
            onClick={handlePDFClick}
            disabled={!selfCheckComplete}
            disabledReason={`Complete Self-Check first (${selfCheckFilled.length}/4 minimum answered)`}
          />
        </div>
      </div>

      {/* Self-check warning */}
      {showSelfCheckWarning && (
        <div style={{
          background: '#FFF3CD', border: '1px solid #EF9F27', borderRadius: 10,
          padding: '10px 14px', marginBottom: '1.25rem', fontSize: 13
        }}>
          ⚠️ <strong>Complete the Monthly Self-Check first</strong> — scroll down and answer at least 4 questions before generating the PDF summary.
        </div>
      )}

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

      {/* SELF-CHECK QUESTIONS — must fill before PDF */}
      <div className="selfcheck-box" id="monthly-selfcheck">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div className="selfcheck-title" style={{ margin: 0 }}>
            Monthly Self-Check — Actualize your dream life
          </div>
          <span style={{ fontSize: 11, color: selfCheckComplete ? 'var(--teal)' : 'var(--gold-dark)', fontWeight: 500 }}>
            {selfCheckComplete ? '✓ Complete — PDF ready' : `Fill ${4 - selfCheckFilled.length} more to unlock PDF`}
          </span>
        </div>
        <div className="selfcheck-grid">
          {SELF_CHECK_QUESTIONS.map((q, i) => {
            const key = mk + '_sc' + i
            const filled = (state.selfcheck[key] || '').trim().length > 3
            return (
              <div key={i} className="selfcheck-item" style={{ border: filled ? '1px solid var(--accent)' : '1px solid transparent' }}>
                <div className="selfcheck-q">{q}</div>
                <input className="selfcheck-input" type="text" placeholder="Your answer..."
                  value={state.selfcheck[key] || ''}
                  onChange={e => dispatch({ type: 'SET_SELFCHECK', key, val: e.target.value })} />
              </div>
            )
          })}
        </div>

        {/* PDF trigger at bottom of self-check for convenience */}
        {selfCheckComplete && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <PDFButton
              label="Generate Monthly PDF Summary"
              onClick={() => printHTML(buildMonthlySummaryHTML(state), `${state.username} — Monthly Summary`)}
            />
          </div>
        )}
      </div>
    </div>
  )
}