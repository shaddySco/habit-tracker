import { useState, useRef } from 'react'
import { MORNING_STEPS, DAY_NAMES, todayKey, getWeekDates } from '../data/categories'

export default function Daily({ state, dispatch, showToast }) {
  const [editMode, setEditMode] = useState({})
  const [newHabit, setNewHabit] = useState({})
  const [newFreq, setNewFreq] = useState({})
  const fileRefs = useRef({})
  const weekDates = getWeekDates()
  const todayIdx = weekDates.indexOf(todayKey())

  const toggleMorning = (id) => dispatch({ type: 'TOGGLE_MORNING', id })
  const toggleCheck = (hid, day) => dispatch({ type: 'TOGGLE_CHECK', hid, day })
  const toggleTask = (n) => dispatch({ type: 'TOGGLE_TASK', n })
  const setTask = (n, val) => dispatch({ type: 'SET_TASK', n, val })
  const savePartner = (catId, name, email) => dispatch({ type: 'SAVE_PARTNER', catId, name, email })

  const addHabit = (catId) => {
    const text = (newHabit[catId] || '').trim()
    if (!text) { showToast('Please enter a goal name'); return }
    dispatch({ type: 'ADD_HABIT', catId, text, freq: newFreq[catId] || 'daily' })
    setNewHabit(p => ({ ...p, [catId]: '' }))
    showToast('Goal added!')
  }

  const handlePhoto = (hid, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      dispatch({ type: 'SAVE_PHOTO', key: todayKey() + '_' + hid, src: ev.target.result })
      showToast('Evidence saved!')
    }
    reader.readAsDataURL(file)
  }

  const viewPhoto = (hid) => {
    const src = state.photos[todayKey() + '_' + hid]
    if (!src) return
    const w = window.open('', '_blank')
    w.document.write(`<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${src}" style="max-width:100%;max-height:100vh;"></body></html>`)
  }

  const sendIntroEmail = (catId, catLabel) => {
    const p = state.partners[catId] || {}
    if (!p.email) { showToast("Please enter your partner's email first"); return }
    const cat = state.cats.find(c => c.id === catId)
    const username = state.username || 'Your friend'

    const daily = cat.habits.filter(h => h.freq === 'daily')
    const weekly = cat.habits.filter(h => h.freq === 'weekly')
    const monthly = cat.habits.filter(h => h.freq === 'monthly')

    const formatSection = (label, habits) =>
      habits.length ? `  [${label}]\n${habits.map(h => `    • ${h.text}`).join('\n')}` : ''

    const goalSections = [
      formatSection('Daily', daily),
      formatSection('Weekly', weekly),
      formatSection('Monthly', monthly),
    ].filter(Boolean).join('\n\n')

    const habitsList = goalSections || '  No goals set yet.'

    const subject = `${username} is inviting you to be their Accountability Partner — ${catLabel}`
    const body = `Hey ${p.name || 'there'},

I'm reaching out because I trust you and believe you can help me grow.

I'm committed to levelling up my ${catLabel} in 2026, and I'd love for you to be my accountability partner in this area.

━━━━━━━━━━━━━━━━━━━━━━━━
WHAT DOES THIS MEAN?
━━━━━━━━━━━━━━━━━━━━━━━━
As my accountability partner, your role would be to:
  ✅ Check in with me once a week (a quick message is enough)
  ✅ Ask me how my goals are going — honestly
  ✅ Encourage me when I'm consistent, challenge me when I'm not
  ✅ Receive a weekly progress report from my habit tracker

━━━━━━━━━━━━━━━━━━━━━━━━
GOALS YOU'D BE HELPING ME ACHIEVE (${catLabel.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━
${habitsList}

━━━━━━━━━━━━━━━━━━━━━━━━
IF YOU ACCEPT
━━━━━━━━━━━━━━━━━━━━━━━━
Simply reply to this email with "I'm in!" and I will set up a weekly Google Calendar reminder so you never forget to check in.

This means a lot to me — having someone in my corner will make a real difference. No pressure, but I truly hope you'll say yes.

With gratitude,
${username} 🙏

---
P.S. Once the weekly reminder is set up, you'll receive a progress summary for my ${catLabel} goals every week automatically. Your check-ins will help keep me honest and consistent throughout 2026!
`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(p.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank')
    showToast(`✉️ Gmail compose opened for ${p.name || 'your partner'}!`)
  }

  const scheduleReminder = (catId, catLabel) => {
    const p = state.partners[catId] || {}
    if (!p.email) { showToast("Please enter your partner's Gmail first"); return }
    const username = state.username || 'your accountability partner'
    const title = `[${catLabel}] Weekly accountability check-in — ${username}`
    const details = `Hey ${p.name || 'friend'}!\n\nThis is your weekly reminder to check in on ${username}'s ${catLabel} goals.\n\nPlease reach out and encourage them this week!`
    const now = new Date(); const s = new Date(now); s.setHours(9, 0, 0, 0)
    const e2 = new Date(s); e2.setHours(9, 30, 0, 0)
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${fmt(s)}/${fmt(e2)}&recur=RRULE:FREQ=WEEKLY&add=${encodeURIComponent(p.email)}`
    window.open(url, '_blank')
    showToast(`Calendar opened for ${p.name || 'partner'}`)
  }

  const totalDaily = state.cats.flatMap(c => c.habits.filter(h => h.freq === 'daily')).length
  const doneToday = state.cats.flatMap(c => c.habits.filter(h => h.freq === 'daily' && state.checks[todayKey() + '_' + h.id])).length
  const dayPct = totalDaily ? Math.round(doneToday / totalDaily * 100) : 0

  return (
    <div>
      <div className="day-header">
        <div>
          <div className="page-title">Today's Habits</div>
          <div className="page-sub">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="prog-wrap">
          <div className="prog-track"><div className="prog-fill fill-health" style={{ width: dayPct + '%' }} /></div>
          <span className="prog-pct">{dayPct}%</span>
        </div>
      </div>

      {/* MORNING ROUTINE */}
      <div className="morning-box">
        <div className="morning-title">Win the first hour</div>
        <div className="morning-sub">Morning routine — Productivity rule after sleep</div>
        <div className="morning-steps">
          {MORNING_STEPS.map(step => {
            const done = !!state.morning[todayKey() + '_' + step.id]
            return (
              <div key={step.id} className={`morning-step${done ? ' done' : ''}`} onClick={() => toggleMorning(step.id)}>
                <div className="morning-check"><span className="morning-check-tick">✓</span></div>
                <span className="morning-label">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3 MAIN TASKS */}
      <div className="tasks-box">
        <div className="tasks-header">
          <span className="tasks-title">3 Main Tasks for Today</span>
          <span className="tasks-badge">Focus on what matters most</span>
        </div>
        {[1, 2, 3].map(n => {
          const val = state.tasks[todayKey() + '_task' + n] || ''
          const done = !!state.tasks[todayKey() + '_task' + n + '_done']
          return (
            <div key={n} className="task-row">
              <span className="task-num">{n}</span>
              <input
                className={`task-input${done ? ' done' : ''}`}
                type="text" placeholder={`Main task ${n}...`} value={val}
                onChange={e => setTask(n, e.target.value)}
              />
              <button className={`task-done-btn${done ? ' done' : ''}`} onClick={() => toggleTask(n)}>{done ? '✓' : '○'}</button>
            </div>
          )
        })}
      </div>

      {/* DAY LABELS */}
      <div className="day-labels-row">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className={`day-lbl${i === todayIdx ? ' today' : ''}`}>{d}</div>
        ))}
      </div>

      {/* CATEGORIES */}
      {state.cats.map(cat => {
        const daily = cat.habits.filter(h => h.freq === 'daily')
        const weekly = cat.habits.filter(h => h.freq === 'weekly')
        const monthly = cat.habits.filter(h => h.freq === 'monthly')
        const doneD = daily.filter(h => state.checks[todayKey() + '_' + h.id]).length
        const pct = daily.length ? Math.round(doneD / daily.length * 100) : 0
        const isEdit = !!editMode[cat.id]
        const p = state.partners[cat.id] || { name: '', email: '' }

        const renderFreqSection = (freq, habits) => {
          if (!habits.length && !isEdit) return null
          const labels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }
          const pillClass = { daily: 'freq-daily', weekly: 'freq-weekly', monthly: 'freq-monthly' }
          return (
            <div key={freq} className="freq-section">
              <div className="freq-label-row">
                <span className={`freq-pill ${pillClass[freq]}`}>{labels[freq]}</span>
                <div className="freq-line" />
              </div>
              {isEdit ? habits.map(h => (
                <div key={h.id} className="edit-mode-row">
                  <input className="edit-habit-input" defaultValue={h.text}
                    onBlur={e => dispatch({ type: 'EDIT_HABIT', catId: cat.id, hid: h.id, text: e.target.value })} />
                  <select className="move-select" value={h.freq}
                    onChange={e => dispatch({ type: 'MOVE_HABIT', catId: cat.id, hid: h.id, freq: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <button className="del-btn" onClick={() => dispatch({ type: 'DELETE_HABIT', catId: cat.id, hid: h.id })}>×</button>
                </div>
              )) : habits.map(h => {
                const photo = state.photos[todayKey() + '_' + h.id]
                return (
                  <div key={h.id} className="grid-habit-row">
                    <div className="grid-habit-name" title={h.text}>{h.text}</div>
                    <div className="grid-right">
                      <div className="grid-days">
                        {weekDates.map((day, i) => {
                          const checked = !!state.checks[day + '_' + h.id]
                          const isToday = i === todayIdx
                          return (
                            <div key={day}
                              className={`day-circle${isToday ? ' today-col' : ''}${checked ? ' checked' : ''}`}
                              onClick={() => toggleCheck(h.id, day)}>
                              {isToday ? '•' : ''}
                            </div>
                          )
                        })}
                      </div>
                      {photo && <img src={photo} className="evidence-thumb" onClick={() => viewPhoto(h.id)} alt="evidence" />}
                      <div className={`icon-btn${photo ? ' has-img' : ''}`}
                        onClick={() => fileRefs.current[h.id]?.click()}>📷</div>
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        ref={el => fileRefs.current[h.id] = el}
                        onChange={e => handlePhoto(h.id, e)} />
                    </div>
                  </div>
                )
              })}
              {isEdit && !habits.length && <div style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 8px', fontStyle: 'italic' }}>No {freq} goals yet</div>}
            </div>
          )
        }

        return (
          <div key={cat.id} className="cat-card">
            <div className="cat-card-header">
              <span className={`cat-badge badge-${cat.color}`}>{cat.label}</span>
              <div className="cat-hdr-right">
                <span className="pct-text">Daily: {pct}%</span>
                <button className={`edit-btn${isEdit ? ' active' : ''}`}
                  onClick={() => setEditMode(p => ({ ...p, [cat.id]: !p[cat.id] }))}>
                  {isEdit ? '✓ Done' : '✏️ Edit'}
                </button>
              </div>
            </div>
            <div className="habit-grid-section">
              {renderFreqSection('daily', daily)}
              {renderFreqSection('weekly', weekly)}
              {renderFreqSection('monthly', monthly)}
              {isEdit && (
                <div className="add-habit-row">
                  <input className="add-habit-input" type="text" placeholder="Add a new goal..."
                    value={newHabit[cat.id] || ''}
                    onChange={e => setNewHabit(p => ({ ...p, [cat.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addHabit(cat.id)} />
                  <select className="add-freq-select" value={newFreq[cat.id] || 'daily'}
                    onChange={e => setNewFreq(p => ({ ...p, [cat.id]: e.target.value }))}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <button className="add-btn" onClick={() => addHabit(cat.id)}>+ Add</button>
                </div>
              )}
            </div>
            <div className="partner-section">
              <div className="partner-lbl">Accountability Partner</div>
              <div className="partner-form">
                <div className="p-field">
                  <label>Partner name</label>
                  <input type="text" placeholder="e.g. John Kamau" defaultValue={p.name}
                    onBlur={e => savePartner(cat.id, e.target.value, document.getElementById(`pe-${cat.id}`)?.value || p.email)}
                    id={`pn-${cat.id}`} />
                </div>
                <div className="p-field">
                  <label>Gmail address</label>
                  <input type="email" placeholder="partner@gmail.com" defaultValue={p.email}
                    onBlur={e => savePartner(cat.id, document.getElementById(`pn-${cat.id}`)?.value || p.name, e.target.value)}
                    id={`pe-${cat.id}`} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    className="cal-btn"
                    style={{ flex: 1, backgroundColor: '#10b981', margin: 0 }}
                    onClick={() => sendIntroEmail(cat.id, cat.label)}
                  >
                    ✉️ Send Intro Email
                  </button>
                  <button
                    className="cal-btn"
                    style={{ flex: 1, margin: 0 }}
                    onClick={() => scheduleReminder(cat.id, cat.label)}
                  >
                    📅 Set Weekly Reminder
                  </button>
                </div>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>
                  💡 <strong>Step 1:</strong> Send the intro email first — your partner will see your name, their role, and all the goals they'd be supporting. <strong>Step 2:</strong> Once they accept, set the weekly reminder so they never miss a check-in.
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}