import { getWeekDates, weekStartKey, openCalendarReminder } from '../data/categories'

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
  const r = state.reflection[weekStartKey()] || {}

  const setReflect = (key, val) => dispatch({ type: 'SET_REFLECTION', weekKey: weekStartKey(), key, val })

  const notifyAllPartners = () => {
    const partners = state.cats.filter(cat => state.partners[cat.id]?.email)
    if (!partners.length) { showToast('No partner emails added yet.'); return }
    const summary = buildWeeklySummaryText(state)
    partners.forEach((cat, i) => {
      setTimeout(() => {
        const p = state.partners[cat.id]
        openCalendarReminder({
          title: `Weekly check-in — ${state.username || "your friend"}'s progress`,
          details: `Hey ${p.name || 'friend'}! Time to check in on ${state.username || "your friend"}.\n\n${summary}`,
          email: p.email,
          recur: 'WEEKLY',
        })
      }, i * 800)
    })
    showToast(`Opening Google Calendar for ${partners.length} partner(s)...`)
  }

  const remindSingle = (catId, catLabel) => {
    const p = state.partners[catId] || {}
    if (!p.email) { showToast("Please enter your partner's Gmail first"); return }
    const summary = buildWeeklySummaryText(state)
    openCalendarReminder({
      title: `[${catLabel}] Weekly accountability check-in`,
      details: `Hey ${p.name || 'friend'}!\n\nHere is this week's summary for ${state.username || "your friend"}'s ${catLabel} goals:\n\n${summary}`,
      email: p.email,
      recur: 'WEEKLY',
    })
    showToast(`Calendar opened for ${p.name || 'partner'}`)
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
        <button className="cal-btn" onClick={notifyAllPartners}>📅 Notify All Partners</button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="sum-grid">
        {state.cats.map(cat => {
          const p = state.partners[cat.id] || {}
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
              {p.email && (
                <button className="remind-btn" onClick={() => remindSingle(cat.id, cat.label)}>
                  📤 Remind {p.name || 'Partner'} — incl. summary
                </button>
              )}
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

      {/* REFLECTION */}
      <div className="card">
        <div className="card-title">Weekly Reflection</div>
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
      </div>
    </div>
  )
}
