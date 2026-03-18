// SummaryPDF.jsx
// Generates printable PDF summaries for daily, weekly, and monthly periods.
// Uses window.print() with print-specific CSS — no server or library needed.

import { getWeekDates, weekStartKey, monthKey, todayKey } from '../data/categories'

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function pct(done, total) {
    return total ? Math.round(done / total * 100) : 0
}

function bar(p, color = '#2D5016') {
    return `
    <div style="height:8px;background:#e8e8e8;border-radius:4px;overflow:hidden;margin:4px 0 2px">
      <div style="height:100%;width:${p}%;background:${color};border-radius:4px"></div>
    </div>`
}

function starRow(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n)
}

// ── CSS injected into the print window ───────────────────────────────────────

const PRINT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1a1a1a; background: white; padding: 24px; }
  h1 { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
  h2 { font-size: 15px; font-weight: 600; margin: 18px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #eee; }
  h3 { font-size: 13px; font-weight: 600; margin: 12px 0 6px; }
  .meta { font-size: 11px; color: #777; margin-bottom: 18px; }
  .section { margin-bottom: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
  .badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .row { display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: 1px solid #f0f0f0; }
  .row:last-child { border-bottom: none; }
  .check { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid #ccc; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
  .check.done { background: #2D5016; border-color: #2D5016; color: white; }
  .tag { font-size: 9px; padding: 1px 6px; border-radius: 8px; background: #f0f0f0; color: #555; margin-left: auto; }
  .q-block { background: #f9f9f9; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; }
  .q-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #999; margin-bottom: 4px; }
  .q-answer { font-size: 12px; line-height: 1.5; color: #333; white-space: pre-wrap; }
  .score-big { font-size: 40px; font-weight: 700; color: #2D5016; }
  .missed { color: #c0392b; font-size: 11px; }
  .win { color: #27ae60; font-size: 11px; }
  .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #eee; font-size: 10px; color: #aaa; text-align: center; }
  @media print {
    body { padding: 12px; }
    @page { margin: 15mm; }
  }
`

// Badge colors per category
const CAT_COLORS = {
    spiritual: { bg: '#EEEDFE', text: '#3C3489' },
    health: { bg: '#E1F5EE', text: '#085041' },
    mental: { bg: '#E6F1FB', text: '#0C447C' },
    financial: { bg: '#FAEEDA', text: '#633806' },
    career: { bg: '#FAECE7', text: '#712B13' },
    social: { bg: '#EAF3DE', text: '#27500A' },
}

function catBadge(label, color) {
    const c = CAT_COLORS[color] || { bg: '#f0f0f0', text: '#555' }
    return `<span class="badge" style="background:${c.bg};color:${c.text}">${label}</span>`
}

// ── DAILY SUMMARY ─────────────────────────────────────────────────────────────

export function buildDailySummaryHTML(state, date) {
    const d = date || todayKey()
    const username = state.username || 'Shadrack'

    // Morning steps
    const morningSteps = [
        { id: 'ms1', label: 'No phone' }, { id: 'ms2', label: 'Pray' },
        { id: 'ms3', label: 'Plan the day' }, { id: 'ms4', label: 'Move / stretch' },
        { id: 'ms5', label: 'Start hard thing first' },
    ]
    const morningDone = morningSteps.filter(s => !!state.morning?.[d + '_' + s.id]).length

    // Tasks
    const tasks = [1, 2, 3].map(n => ({
        text: state.tasks?.[d + '_task' + n] || '',
        done: !!state.tasks?.[d + '_task' + n + '_done']
    })).filter(t => t.text)

    // Category habits
    let catSections = ''
    let totalHabits = 0, doneHabits = 0
    state.cats.forEach(cat => {
        const daily = cat.habits.filter(h => h.freq === 'daily')
        if (!daily.length) return
        const catDone = daily.filter(h => !!state.checks?.[d + '_' + h.id]).length
        totalHabits += daily.length; doneHabits += catDone
        const rows = daily.map(h => {
            const done = !!state.checks?.[d + '_' + h.id]
            return `<div class="row">
        <div class="check ${done ? 'done' : ''}">${done ? '✓' : ''}</div>
        <span style="flex:1">${h.text}</span>
      </div>`
        }).join('')
        catSections += `
      <div class="card">
        ${catBadge(cat.label, cat.color)}
        <div style="font-size:11px;color:#777;margin-bottom:6px">${catDone}/${daily.length} — ${pct(catDone, daily.length)}%</div>
        ${bar(pct(catDone, daily.length))}
        ${rows}
      </div>`
    })

    const overallPct = pct(doneHabits, totalHabits)

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>${username} — Daily Summary — ${fmt(d)}</title>
  <style>${PRINT_CSS}</style></head><body>
  <h1>📋 Daily Summary</h1>
  <div class="meta">${username} &nbsp;·&nbsp; ${fmt(d)}</div>

  <div class="section">
    <h2>Overall Progress</h2>
    <div style="display:flex;align-items:center;gap:16px">
      <div class="score-big">${overallPct}%</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">${doneHabits} of ${totalHabits} daily habits completed</div>
        ${bar(overallPct, '#2D5016')}
        <div style="font-size:11px;color:#777;margin-top:4px">
          ${overallPct >= 80 ? '🌟 Outstanding day!' : overallPct >= 50 ? '💪 Good effort — keep pushing' : '📈 Room to grow — tomorrow is a new chance'}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Morning Routine — ${morningDone}/${morningSteps.length}</h2>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${morningSteps.map(s => {
        const done = !!state.morning?.[d + '_' + s.id]
        return `<span style="padding:4px 10px;border-radius:12px;font-size:11px;background:${done ? '#EAF3DE' : '#f0f0f0'};color:${done ? '#27500A' : '#999'}">${done ? '✓' : '○'} ${s.label}</span>`
    }).join('')}
    </div>
  </div>

  ${tasks.length ? `
  <div class="section">
    <h2>3 Main Tasks</h2>
    ${tasks.map((t, i) => `
      <div class="row">
        <div class="check ${t.done ? 'done' : ''}">${t.done ? '✓' : i + 1}</div>
        <span style="flex:1;${t.done ? 'text-decoration:line-through;color:#aaa' : ''}">${t.text}</span>
        ${t.done ? '<span class="tag win">Done</span>' : '<span class="tag">Pending</span>'}
      </div>`).join('')}
  </div>` : ''}

  <div class="section">
    <h2>Habit Categories</h2>
    <div class="grid">${catSections}</div>
  </div>

  <div class="footer">
    Generated by ${username}'s Habit Tracker &nbsp;·&nbsp; ${new Date().toLocaleString('en-KE')}
  </div>
  </body></html>`
}

// ── WEEKLY SUMMARY ────────────────────────────────────────────────────────────

export function buildWeeklySummaryHTML(state) {
    const username = state.username || 'Shadrack'
    const weekDates = getWeekDates()
    const wk = weekStartKey()
    const r = state.reflection?.[wk] || {}

    // Check if reflection is filled
    const reflectionFilled = !!(r.happy || r.achieved || r.grateful || r.distract || r.improve)

    const ws = new Date(weekDates[0])
    const we = new Date(weekDates[6])
    const weekRange = ws.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) +
        ' – ' + we.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

    // Per-category stats
    let catSections = ''
    let grandTotal = 0, grandDone = 0
    state.cats.forEach(cat => {
        const daily = cat.habits.filter(h => h.freq === 'daily')
        const weekly = cat.habits.filter(h => h.freq === 'weekly')
        let possible = 0, done = 0, missed = []
        daily.forEach(h => {
            possible += 7
            const d = weekDates.filter(day => !!state.checks?.[day + '_' + h.id]).length
            done += d; if (!d) missed.push(h.text)
        })
        weekly.forEach(h => {
            possible += 1
            const d = weekDates.some(day => !!state.checks?.[day + '_' + h.id]) ? 1 : 0
            done += d; if (!d) missed.push(h.text)
        })
        grandTotal += possible; grandDone += done
        const p = pct(done, possible)
        catSections += `
      <div class="card">
        ${catBadge(cat.label, cat.color)}
        <div style="font-size:22px;font-weight:700;margin:4px 0">${p}%</div>
        ${bar(p)}
        ${missed.length ? `<div class="missed" style="margin-top:6px">Missed: ${missed.slice(0, 3).join(', ')}${missed.length > 3 ? ` +${missed.length - 3}` : ''}</div>` : '<div class="win" style="margin-top:6px">✓ All habits done!</div>'}
      </div>`
    })

    const overallPct = pct(grandDone, grandTotal)

    // Reflection blocks
    const reflQA = [
        { q: '5 things that made me happy this week', a: r.happy },
        { q: '5 things I achieved this week', a: r.achieved },
        { q: '5 things I was grateful for', a: r.grateful },
        { q: 'What distracted me this week?', a: r.distract },
        { q: 'What can I improve next week?', a: r.improve },
    ]

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>${username} — Weekly Summary — ${weekRange}</title>
  <style>${PRINT_CSS}</style></head><body>
  <h1>📊 Weekly Summary</h1>
  <div class="meta">${username} &nbsp;·&nbsp; ${weekRange}</div>

  <div class="section">
    <h2>Overall Score</h2>
    <div style="display:flex;align-items:center;gap:16px">
      <div class="score-big">${overallPct}%</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">${grandDone} of ${grandTotal} habit-days completed</div>
        ${bar(overallPct, '#2D5016')}
        <div style="font-size:11px;color:#777;margin-top:4px">
          ${overallPct >= 80 ? '🌟 Excellent week — keep this momentum!' : overallPct >= 50 ? '💪 Good progress — push harder next week' : '📈 Room to grow — stay committed'}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Category Breakdown</h2>
    <div class="grid">${catSections}</div>
  </div>

  ${reflectionFilled ? `
  <div class="section">
    <h2>Weekly Reflection</h2>
    ${reflQA.filter(q => q.a).map(q => `
      <div class="q-block">
        <div class="q-label">${q.q}</div>
        <div class="q-answer">${q.a}</div>
      </div>`).join('')}
  </div>` : ''}

  <div class="footer">
    Generated by ${username}'s Habit Tracker &nbsp;·&nbsp; ${new Date().toLocaleString('en-KE')}
  </div>
  </body></html>`
}

// ── MONTHLY SUMMARY ───────────────────────────────────────────────────────────

export function buildMonthlySummaryHTML(state) {
    const username = state.username || 'Shadrack'
    const mk = monthKey()
    const monthName = new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })

    // Star ratings
    let total = 0, max = 0
    const catRatings = state.cats.map(cat => {
        const stars = state.stars?.[mk + '_' + cat.id] || 0
        const note = state.notes?.[mk + '_' + cat.id] || ''
        total += stars; max += 5
        return { ...cat, stars, note }
    })
    const overallPct = max ? Math.round(total / max * 100) : 0

    // Self-check answers
    const selfCheckQs = [
        'What truly matters to me this month?', 'Am I afraid or prepared?',
        'What skills must I build?', 'Who inspires my journey?',
        'What distracts me daily?', 'Am I consistent — really?', 'What would success change?',
    ]
    const selfCheckFilled = selfCheckQs.some((_, i) => !!state.selfcheck?.[mk + '_sc' + i])

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>${username} — Monthly Summary — ${monthName}</title>
  <style>${PRINT_CSS}</style></head><body>
  <h1>📅 Monthly Scorecard</h1>
  <div class="meta">${username} &nbsp;·&nbsp; ${monthName}</div>

  <div class="section">
    <h2>Overall Score</h2>
    <div style="display:flex;align-items:center;gap:16px">
      <div class="score-big">${overallPct}%</div>
      <div style="flex:1">
        ${bar(overallPct, '#2D5016')}
        <div style="font-size:11px;color:#777;margin-top:4px">
          ${overallPct >= 80 ? '🌟 Excellent month — keep this momentum!' : overallPct >= 50 ? '💪 Good progress — push harder!' : '📈 Room to grow — stay committed'}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Category Ratings</h2>
    <div class="grid">
      ${catRatings.map(cat => `
        <div class="card">
          ${catBadge(cat.label, cat.color)}
          <div style="font-size:18px;margin:4px 0;color:#BA7517">${starRow(cat.stars)}</div>
          <div style="font-size:11px;color:#777">${cat.stars}/5</div>
          ${cat.note ? `<div style="font-size:11px;color:#555;margin-top:6px;font-style:italic">${cat.note}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>

  ${selfCheckFilled ? `
  <div class="section">
    <h2>Monthly Self-Check — Actualize Your Dream Life</h2>
    ${selfCheckQs.map((q, i) => {
        const a = state.selfcheck?.[mk + '_sc' + i]
        if (!a) return ''
        return `<div class="q-block">
        <div class="q-label">${q}</div>
        <div class="q-answer">${a}</div>
      </div>`
    }).join('')}
  </div>` : ''}

  <div class="footer">
    Generated by ${username}'s Habit Tracker &nbsp;·&nbsp; ${new Date().toLocaleString('en-KE')}
  </div>
  </body></html>`
}

// ── PRINT TRIGGER ─────────────────────────────────────────────────────────────

export function printHTML(html, title) {
    const w = window.open('', '_blank')
    if (!w) { alert('Please allow popups to generate PDF'); return }
    w.document.write(html)
    w.document.close()
    w.document.title = title
    setTimeout(() => { w.focus(); w.print() }, 600)
}

// ── REACT BUTTON COMPONENT ────────────────────────────────────────────────────

export function PDFButton({ label, onClick, disabled, disabledReason, color = 'var(--accent)' }) {
    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <button
                onClick={onClick}
                disabled={disabled}
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                    background: disabled ? 'var(--border)' : color,
                    color: disabled ? 'var(--muted)' : 'white',
                    border: 'none', opacity: disabled ? 0.7 : 1, transition: 'all .15s'
                }}>
                📄 {label}
            </button>
            {disabled && disabledReason && (
                <div style={{ fontSize: 10, color: 'var(--muted)', maxWidth: 200, textAlign: 'right' }}>
                    {disabledReason}
                </div>
            )}
        </div>
    )
}