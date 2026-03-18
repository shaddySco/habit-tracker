import { useState } from 'react'
import { getWeekDates, weekStartKey, openCalendarReminder } from '../data/categories'
import { buildWeeklySummaryHTML, printHTML, PDFButton } from './SummaryPDF'

function buildWeeklySummaryText(state) {
  const weekDates = getWeekDates()
  const lines = ['=== WEEKLY HABIT SUMMARY ===\n']
  state.cats.forEach(cat => {
    const daily = cat.habits.filter(h => h.freq === 'daily')
    const weekly = cat.habits.filter(h => h.freq === 'weekly')
    let possible = 0, done = 0, missed = []
    daily.forEach(h => {
      possible += 7
      const d = weekDates.filter(day => state.checks[day + '_' + h.id]).length
      done += d
      if (d === 0) missed.push(h.text)
    })
    weekly.forEach(h => {
      possible += 1
      const d = weekDates.some(day => state.checks[day + '_' + h.id]) ? 1 : 0
      done += d
      if (!d) missed.push(h.text)
    })
    const pct = possible ? Math.round(done / possible * 100) : 0
    lines.push(`[${cat.label}] ${pct}% complete`)
    if (missed.length) lines.push(`Missed: ${missed.slice(0, 3).join(', ')}`)
  })
  const r = state.reflection[weekStartKey()] || {}
  if (r.win) lines.push(`\nWins this week: ${r.win.slice(0, 120)}`)
  lines.push('\nPlease check in and encourage your accountability partner!')
  return lines.join('\n')
}

export default function Weekly({ state, dispatch, showToast }) {
  const weekDates = getWeekDates()
  const wk = weekStartKey()
  const r = state.reflection[wk] || {}
  const [showReflectionWarning, setShowReflectionWarning] = useState(false)

  const setReflect = (key, val) => dispatch({ type: 'SET_REFLECTION', weekKey: wk, key, val })

  // Check if weekly reflection is sufficiently filled
  const reflectionFields = ['happy', 'achieved', 'grateful', 'distract', 'improve']
  const filledFields = reflectionFields.filter(k => (r[k] || '').trim().length > 3)
  const reflectionComplete = filledFields.length >= 3 // at least 3 of 5 filled

  const handlePDFClick = () => {
    if (!reflectionComplete) {
      setShowReflectionWarning(true)
      // Scroll to reflection section
      document.getElementById('weekly-reflection')?.scrollIntoView({ behavior: 'smooth' })
      showToast('⚠️ Please complete the Weekly Reflection before generating the summary')
      return
    }
    setShowReflectionWarning(false)
    printHTML(buildWeeklySummaryHTML(state), `${state.username} — Weekly Summary`)
  }

  const notifyAllPartners = () => {
    const partners = state.cats.filter(cat => state.partnerGroups?.[cat.id]?.length)
    const legacyPartners = state.cats.filter(cat => state.partners[cat.id]?.email)
    const allCats = [...new Set([...partners.map(c => c.id), ...legacyPartners.map(c => c.id)])]

    if (!allCats.length) { showToast('No partner emails added yet.'); return }
    const summary = buildWeeklySummaryText(state)
    let count = 0
    allCats.forEach((catId, ci) => {
      const cat = state.cats.find(c => c.id === catId)
      const group = state.partnerGroups?.[catId] || []
      const legacy = state.partners[catId]?.email ? [state.partners[catId]] : []
      const allP = [...group, ...legacy.filter(l => !group.find(g => g.email === l.email))]
      allP.forEach((p, pi) => {
        count++
        setTimeout(() => {
          openCalendarReminder({
            title: `Weekly check-in — ${state.username || "your friend"}'s progress`,
            details: `Hey ${p.name || 'friend'}! Time to check in on ${state.username || "your friend"}.\n\n${summary}`,
            email: p.email,
            recur: 'WEEKLY',
          })
        }, (ci * 3 + pi) * 700)
      })
    })
    showToast(`Opening Google Calendar for ${count} partner(s)...`)
  }

  const allPhotos = []
  state.cats.forEach(cat => cat.habits.forEach(h => {
    weekDates.forEach(day => {
      const k = day + '_' + h.id
      if (state.photos[k]) allPhotos.push({ src: state.photos[k], label: h.text })
    })
  }))

  const ws = new Date(weekDates[0])
  const we = new Date(weekDates[6])
  const weekRange = ws.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) + ' – ' + we.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Weekly Summary</div>
          <div className="page-sub">{weekRange}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <button className="cal-btn" onClick={notifyAllPartners}>📅 Notify All Partners</button>
          <PDFButton
            label="Weekly PDF"
            onClick={handlePDFClick}
            disabled={!reflectionComplete}
            disabledReason={`Complete Weekly Reflection first (${filledFields.length}/3 minimum filled)`}
          />
        </div>
      </div>

      {/* Reflection completion warning */}
      {showReflectionWarning && (
        <div style={{
          background: '#FFF3CD', border: '1px solid #EF9F27', borderRadius: 10,
          padding: '10px 14px', marginBottom: '1.25rem', fontSize: 13
        }}>
          ⚠️ <strong>Complete your Weekly Reflection first</strong> — scroll down and fill in at least 3 reflection fields before generating the PDF summary.
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="sum-grid">
        {state.cats.map(cat => {
          const p = state.partnerGroups?.[cat.id]?.[0] || state.partners[cat.id] || {}
          const daily = cat.habits.filter(h => h.freq === 'daily')
          const weekly = cat.habits.filter(h => h.freq === 'weekly')
          let possible = 0, done = 0, missed = []
          daily.forEach(h => {
            possible += 7
            const d = weekDates.filter(day => state.checks[day + '_' + h.id]).length
            done += d
            if (d === 0) missed.push(h.text)
          })
          weekly.forEach(h => {
            possible += 1
            const d = weekDates.some(day => state.checks[day + '_' + h.id]) ? 1 : 0
            done += d
            if (!d) missed.push(h.text)
          })
          const pct = possible ? Math.round(done / possible * 100) : 0
          return (
            <div key={cat.id} className="sum-card">
              <span className={`cat-badge badge-${cat.color}`} style={{ fontSize: 10, padding: '3px 10px' }}>{cat.label}</span>
              <div className="sum-pct">{pct}%</div>
              <div className="sum-bar-track">
                <div className={`sum-bar-fill fill-${cat.color}`} style={{ width: pct + '%' }} />
              </div>
              {missed.length > 0 ? (
                <div>
                  {missed.slice(0, 3).map((m, i) => <div key={i} className="missed-item">{m}</div>)}
                  {missed.length > 3 && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>+{missed.length - 3} more</div>}
                </div>
              ) : <div className="all-done">All habits done this week!</div>}
            </div>
          )
        })}
      </div>

      {/* PHOTO GALLERY */}
      <div className="card">
        <div className="card-title">Evidence Gallery — This Week</div>
        {allPhotos.length > 0 ? (
          <div className="gallery-grid">
            {allPhotos.map((p, i) => (
              <div key={i} className="gal-item">
                <img src={p.src} alt={p.label} />
                <div className="gal-lbl">{p.label.slice(0, 22)}</div>
              </div>
            ))}
          </div>
        ) : <div className="no-photos">No photos uploaded this week. Tap 📷 on any habit to add evidence.</div>}
      </div>

      {/* REFLECTION — must fill before PDF */}
      <div className="card" id="weekly-reflection">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
          <div className="card-title" style={{ margin: 0 }}>
            Weekly Reflection
            <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 8, color: reflectionComplete ? 'var(--teal)' : 'var(--gold-dark)' }}>
              {reflectionComplete ? '✓ Complete — PDF ready' : `⚠️ Fill ${3 - filledFields.length} more field(s) to unlock PDF`}
            </span>
          </div>
        </div>
        <div className="reflect-grid">
          <div className="reflect-row-2">
            <div>
              <div className="reflect-q">5 things that made me happy this week</div>
              <textarea className="mnote" placeholder="1. 2. 3. 4. 5." value={r.happy || ''}
                onChange={e => setReflect('happy', e.target.value)} />
            </div>
            <div>
              <div className="reflect-q">5 things I achieved this week</div>
              <textarea className="mnote" placeholder="1. 2. 3. 4. 5." value={r.achieved || ''}
                onChange={e => setReflect('achieved', e.target.value)} />
            </div>
          </div>
          <div className="reflect-row-2">
            <div>
              <div className="reflect-q">5 things I was grateful for this week</div>
              <textarea className="mnote" placeholder="1. 2. 3. 4. 5." value={r.grateful || ''}
                onChange={e => setReflect('grateful', e.target.value)} />
            </div>
            <div>
              <div className="reflect-q">What distracted me this week?</div>
              <textarea className="mnote" placeholder="Be honest..." value={r.distract || ''}
                onChange={e => setReflect('distract', e.target.value)} />
            </div>
          </div>
          <div>
            <div className="reflect-q">What can I improve next week? (One concrete action)</div>
            <textarea className="mnote mnote-sm" placeholder="I will..." value={r.improve || ''}
              onChange={e => setReflect('improve', e.target.value)} />
          </div>
        </div>

        {/* PDF trigger again at bottom of reflection for convenience */}
        {reflectionComplete && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <PDFButton
              label="Generate Weekly PDF Summary"
              onClick={() => printHTML(buildWeeklySummaryHTML(state), `${state.username} — Weekly Summary`)}
            />
          </div>
        )}
      </div>
    </div>
  )
}