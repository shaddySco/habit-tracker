import { useState, useRef } from 'react'
import { MORNING_STEPS, DAY_NAMES, todayKey, getWeekDates, openCalendarReminder } from '../data/categories'
import { buildDailySummaryHTML, printHTML, PDFButton } from './SummaryPDF'
import { notifyPartnersOfGoalChange } from '../utils/notifyPartners'

export default function Daily({ state, dispatch, showToast }) {
  const [editMode, setEditMode] = useState({})
  const [newHabit, setNewHabit] = useState({})
  const [newFreq, setNewFreq] = useState({})
  const [showPartnerGroup, setShowPartnerGroup] = useState({})
  const [newPartnerName, setNewPartnerName] = useState({})
  const [newPartnerEmail, setNewPartnerEmail] = useState({})
  const [newPartnerGoal, setNewPartnerGoal] = useState({})
  const fileRefs = useRef({})
  const weekDates = getWeekDates()
  const todayIdx = weekDates.indexOf(todayKey())

  const toggleMorning = (id) => dispatch({ type: 'TOGGLE_MORNING', id })
  const toggleCheck = (hid, day) => dispatch({ type: 'TOGGLE_CHECK', hid, day })
  const toggleTask = (n) => dispatch({ type: 'TOGGLE_TASK', n })
  const setTask = (n, val) => dispatch({ type: 'SET_TASK', n, val })

  const addHabit = (catId) => {
    const text = (newHabit[catId] || '').trim()
    if (!text) { showToast('Please enter a goal name'); return }
    dispatch({ type: 'ADD_HABIT', catId, text, freq: newFreq[catId] || 'daily' })
    setNewHabit(p => ({ ...p, [catId]: '' }))
    // Notify partners after state updates (short delay so state is fresh)
    setTimeout(() => {
      const count = notifyPartnersOfGoalChange({ state, catId, changeType: 'added', habitText: text })
      if (count > 0) showToast(`Goal added! ✉️ Notifying ${count} partner(s)...`)
      else showToast('Goal added!')
    }, 200)
  }

  const editHabitWithNotify = (catId, hid, oldText, newText) => {
    if (!newText.trim() || newText === oldText) return
    dispatch({ type: 'EDIT_HABIT', catId, hid, text: newText.trim() })
    setTimeout(() => {
      const count = notifyPartnersOfGoalChange({ state, catId, changeType: 'edited', habitText: newText.trim(), oldText })
      if (count > 0) showToast(`Goal updated! ✉️ Notifying ${count} partner(s)...`)
    }, 200)
  }

  const deleteHabitWithNotify = (catId, hid, habitText) => {
    dispatch({ type: 'DELETE_HABIT', catId, hid })
    setTimeout(() => {
      const count = notifyPartnersOfGoalChange({ state, catId, changeType: 'deleted', habitText })
      if (count > 0) showToast(`Goal removed. ✉️ Notifying ${count} partner(s)...`)
      else showToast('Goal removed.')
    }, 200)
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

  // ── PARTNER GROUP HELPERS ──
  const getPartnerGroup = (catId) => state.partnerGroups?.[catId] || []

  const addPartnerToGroup = (catId) => {
    const name = (newPartnerName[catId] || '').trim()
    const email = (newPartnerEmail[catId] || '').trim()
    const goal = (newPartnerGoal[catId] || '').trim()
    if (!email) { showToast('Please enter a Gmail address'); return }
    dispatch({ type: 'ADD_PARTNER_TO_GROUP', catId, name, email, goal })
    setNewPartnerName(p => ({ ...p, [catId]: '' }))
    setNewPartnerEmail(p => ({ ...p, [catId]: '' }))
    setNewPartnerGoal(p => ({ ...p, [catId]: '' }))
    showToast(`✅ ${name || email} added to ${catId} group`)
  }

  const removePartner = (catId, partnerId) => {
    dispatch({ type: 'REMOVE_PARTNER_FROM_GROUP', catId, partnerId })
    showToast('Partner removed')
  }

  const sendGroupIntroEmail = (catId, catLabel) => {
    const partners = getPartnerGroup(catId)
    if (!partners.length) { showToast('No partners in this group yet'); return }
    const username = state.username || 'Your friend'
    const cat = state.cats.find(c => c.id === catId)
    const daily = cat?.habits.filter(h => h.freq === 'daily') || []
    const weekly = cat?.habits.filter(h => h.freq === 'weekly') || []
    const monthly = cat?.habits.filter(h => h.freq === 'monthly') || []
    const formatSection = (label, habits) =>
      habits.length ? `  [${label}]\n${habits.map(h => `    • ${h.text}`).join('\n')}` : ''
    const goalSections = [
      formatSection('Daily', daily),
      formatSection('Weekly', weekly),
      formatSection('Monthly', monthly),
    ].filter(Boolean).join('\n\n') || '  No goals set yet.'

    partners.forEach((p, i) => {
      setTimeout(() => {
        const subject = `${username} is inviting you to their ${catLabel} Accountability Group`
        const personalGoal = p.goal ? `\nYour specific focus for me: "${p.goal}"\n` : ''
        const body = `Hey ${p.name || 'there'},\n\nMy name is ${username}, and I'm building a small accountability group for my ${catLabel} goals — and I'd love for you to be part of it.\n\n${personalGoal}\nAs a group member, your role would be to:\n  ✅ Check in with me 3 times a week (Mon, Wed, Fri)\n  ✅ Ask how my goals are going — honestly\n  ✅ Encourage me when I'm consistent, challenge me when I'm not\n  ✅ Receive a weekly progress report\n\n━━━━━━━━━━━━━━━━━━━━━━━━\nGOALS I'M WORKING ON (${catLabel.toUpperCase()})\n━━━━━━━━━━━━━━━━━━━━━━━━\n${goalSections}\n\nSimply reply "I'm in!" to accept.\n\nWith gratitude,\n${username} 🙏`
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(p.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(gmailUrl, '_blank')
      }, i * 800)
    })
    showToast(`✉️ Opening Gmail for ${partners.length} partner(s)...`)
  }

  const scheduleGroupReminder = (catId, catLabel) => {
    const partners = getPartnerGroup(catId)
    if (!partners.length) { showToast('No partners in this group yet'); return }
    const username = state.username || 'your accountability partner'
    // 3x per week: Monday, Wednesday, Friday
    partners.forEach((p, i) => {
      setTimeout(() => {
        const title = `[${catLabel}] Check in on ${username} — 3x this week`
        const details = [
          `Hey ${p.name || 'friend'}!`,
          ``,
          `This is one of your 3 weekly check-ins for ${username}'s ${catLabel} goals.`,
          `You're set to check in every Monday, Wednesday, and Friday.`,
          p.goal ? `\nYour specific focus: "${p.goal}"` : '',
          ``,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `WHAT TO DO ON EACH CHECK-IN`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `  ✅ Send a quick message — "How's your ${catLabel} going?"`,
          `  ✅ Ask about one specific habit they're working on`,
          `  ✅ Celebrate a win if they mention one`,
          `  ✅ Challenge them if they're slacking`,
          ``,
          `⚠️ Note: This reminder has changed from weekly to 3 times per week`,
          `(Monday, Wednesday, Friday) so you can be a more consistent presence.`,
          ``,
          `Your support makes a real difference. Thank you! 🙏`,
          `— ${username}'s Habit Tracker`,
        ].filter(l => l !== null).join('\n')

        // Build Google Calendar URL with 3x weekly recurrence (MO, WE, FR)
        const now = new Date()
        const start = new Date(now)
        start.setHours(9, 0, 0, 0)
        const end = new Date(start)
        end.setHours(9, 30, 0, 0)
        const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        const rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR'
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
          `&text=${encodeURIComponent(title)}` +
          `&details=${encodeURIComponent(details)}` +
          `&dates=${fmt(start)}/${fmt(end)}` +
          `&recur=${encodeURIComponent(rrule)}` +
          `&add=${encodeURIComponent(p.email)}`
        window.open(url, '_blank')
      }, i * 800)
    })
    showToast(`📅 3x/week reminders set for ${partners.length} partner(s) — Mon, Wed, Fri`)
  }

  const totalDaily = state.cats.flatMap(c => c.habits.filter(h => h.freq === 'daily')).length
  const doneToday = state.cats.flatMap(c => c.habits.filter(h => h.freq === 'daily' && state.checks[todayKey() + '_' + h.id])).length
  const dayPct = totalDaily ? Math.round(doneToday / totalDaily * 100) : 0

  // Discipline items from Wisdom tab, grouped by category
  const disciplineItems = state.disciplineItems || []

  return (
    <div>
      <div className="day-header">
        <div>
          <div className="page-title">Today's Habits</div>
          <div className="page-sub">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="prog-wrap">
            <div className="prog-track"><div className="prog-fill fill-health" style={{ width: dayPct + '%' }} /></div>
            <span className="prog-pct">{dayPct}%</span>
          </div>
          <PDFButton
            label="End of Day Summary"
            onClick={() => printHTML(buildDailySummaryHTML(state, todayKey()), `${state.username} — Daily Summary`)}
          />
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
        const partnerGroup = getPartnerGroup(cat.id)
        const showGroup = !!showPartnerGroup[cat.id]

        // Discipline items for this category from Wisdom tab
        const catDisciplines = disciplineItems.filter(d => d.category === cat.id)

        const renderFreqSection = (freq, habits, extraItems = []) => {
          if (!habits.length && !extraItems.length && !isEdit) return null
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
                    onBlur={e => editHabitWithNotify(cat.id, h.id, h.text, e.target.value)} />
                  <select className="move-select" value={h.freq}
                    onChange={e => dispatch({ type: 'MOVE_HABIT', catId: cat.id, hid: h.id, freq: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <button className="del-btn" onClick={() => deleteHabitWithNotify(cat.id, h.id, h.text)}>×</button>
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

              {/* Discipline items from Wisdom tab — shown as read-only with a different indicator */}
              {!isEdit && extraItems.map(d => (
                <div key={d.id} className="grid-habit-row" style={{ opacity: 0.85 }}>
                  <div className="grid-habit-name" title={d.text} style={{ fontStyle: 'italic' }}>
                    {d.text}
                    <span style={{ fontSize: 9, marginLeft: 6, color: 'var(--muted)', background: 'var(--border)', padding: '1px 5px', borderRadius: 8 }}>
                      discipline
                    </span>
                  </div>
                </div>
              ))}

              {isEdit && !habits.length && !extraItems.length && (
                <div style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 8px', fontStyle: 'italic' }}>No {freq} goals yet</div>
              )}
            </div>
          )
        }

        return (
          <div key={cat.id} className="cat-card">
            <div className="cat-card-header">
              <span className={`cat-badge badge-${cat.color}`}>{cat.label}</span>
              <div className="cat-hdr-right">
                <span className="pct-text">Daily: {pct}%</span>
                {partnerGroup.length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    👥 {partnerGroup.length}
                  </span>
                )}
                <button className={`edit-btn${isEdit ? ' active' : ''}`}
                  onClick={() => setEditMode(p => ({ ...p, [cat.id]: !p[cat.id] }))}>
                  {isEdit ? '✓ Done' : '✏️ Edit'}
                </button>
              </div>
            </div>

            <div className="habit-grid-section">
              {renderFreqSection('daily', daily, catDisciplines.filter(d => d.freq === 'daily'))}
              {renderFreqSection('weekly', weekly, catDisciplines.filter(d => d.freq === 'weekly'))}
              {renderFreqSection('monthly', monthly, catDisciplines.filter(d => d.freq === 'monthly'))}
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

            {/* ── ACCOUNTABILITY PARTNER GROUP ── */}
            <div className="partner-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="partner-lbl">
                  Accountability Group
                  {partnerGroup.length > 0 && (
                    <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 7px', borderRadius: 10, fontWeight: 600 }}>
                      {partnerGroup.length} member{partnerGroup.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowPartnerGroup(p => ({ ...p, [cat.id]: !p[cat.id] }))}
                  style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showGroup ? '▲ Hide' : '▼ Manage'}
                </button>
              </div>

              {/* Existing partner list */}
              {partnerGroup.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                  {partnerGroup.map((p, idx) => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px', background: 'var(--surface)', borderRadius: 8,
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600, color: 'var(--accent)', flexShrink: 0
                      }}>
                        {(p.name || p.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name || p.email}
                        </div>
                        {p.goal && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Focus: {p.goal}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removePartner(cat.id, p.id)}
                        style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: 'var(--red-light)', color: 'var(--red)', cursor: 'pointer', fontSize: 13, flexShrink: 0 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new partner form */}
              {showGroup && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10, padding: '10px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginBottom: 2 }}>Add a partner to this group</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <input
                      type="text" placeholder="Name (e.g. John Kamau)"
                      value={newPartnerName[cat.id] || ''}
                      onChange={e => setNewPartnerName(p => ({ ...p, [cat.id]: e.target.value }))}
                      style={{ flex: 1, minWidth: 120, border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                    />
                    <input
                      type="email" placeholder="Gmail address"
                      value={newPartnerEmail[cat.id] || ''}
                      onChange={e => setNewPartnerEmail(p => ({ ...p, [cat.id]: e.target.value }))}
                      style={{ flex: 1, minWidth: 150, border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                    />
                  </div>
                  <input
                    type="text" placeholder="What is this partner helping you with? (optional)"
                    value={newPartnerGoal[cat.id] || ''}
                    onChange={e => setNewPartnerGoal(p => ({ ...p, [cat.id]: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                  />
                  <button className="add-btn" onClick={() => addPartnerToGroup(cat.id)} style={{ alignSelf: 'flex-start' }}>
                    + Add Partner
                  </button>
                </div>
              )}

              {/* Group actions */}
              {partnerGroup.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="cal-btn" style={{ flex: 1, backgroundColor: '#10b981', margin: 0 }}
                    onClick={() => sendGroupIntroEmail(cat.id, cat.label)}>
                    ✉️ Email Group
                  </button>
                  <button className="cal-btn" style={{ flex: 1, margin: 0 }}
                    onClick={() => scheduleGroupReminder(cat.id, cat.label)}>
                    📅 Set Reminders
                  </button>
                </div>
              )}

              {partnerGroup.length === 0 && !showGroup && (
                <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                  No partners yet — click Manage to add your accountability group
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}