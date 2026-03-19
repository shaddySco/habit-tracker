import React, { useState } from 'react'
import { ResItem, GotoLink, s, showToast } from './UI.jsx'
import { getStats } from '../useAppState.js'

/* ════════════ WEEKLY ════════════ */
export function Weekly({ state, dispatch, setPage }) {
  const weeklyRes = state.resolutions.filter(r => r.freq === 'weekly')
  const byCat = {}
  state.categories.forEach(c => byCat[c.id] = [])
  state.resolutions.filter(r => r.freq !== 'monthly').forEach(r => { if (byCat[r.catId]) byCat[r.catId].push(r) })

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Grid */}
        <div style={s.card}>
          <div style={s.ctitle}>Weekly Grid <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--vl)', color: 'var(--vt)' }}>This week</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 9, fontWeight: 600, color: 'var(--i3)', textAlign: 'left', padding: 4, textTransform: 'uppercase', letterSpacing: 1, width: 140 }}>Resolution</th>
                  {['M','T','W','T','F','S','S'].map((d, i) => <th key={i} style={{ fontSize: 9, fontWeight: 600, color: 'var(--i3)', textAlign: 'center', padding: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{d}</th>)}
                  <th style={{ fontSize: 9, fontWeight: 600, color: 'var(--i3)', textAlign: 'center', padding: 4 }}>Streak</th>
                  <th style={{ fontSize: 9, fontWeight: 600, color: 'var(--i3)', textAlign: 'center', padding: 4 }}>%</th>
                </tr>
              </thead>
              <tbody>
                {state.resolutions.filter(r => r.freq === 'daily' || r.freq === 'weekly').map(r => {
                  const cat = state.categories.find(c => c.id === r.catId) || { color: '#999' }
                  const days = [r.done, false, false, false, false, false, false].map((d, i) => i === 6 ? r.done : i < 4)
                  const sk = days.filter(Boolean).length
                  const pct = Math.round(sk / 7 * 100)
                  const badgeBg = pct >= 80 ? 'var(--sl)' : pct >= 40 ? 'var(--al)' : 'var(--rl)'
                  const badgeFg = pct >= 80 ? 'var(--st)' : pct >= 40 ? 'var(--at)' : 'var(--rt)'
                  return (
                    <tr key={r.id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, padding: '4px 2px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                        {r.text.slice(0, 24)}{r.text.length > 24 ? '…' : ''}
                      </div></td>
                      {days.map((d, i) => <td key={i} style={{ textAlign: 'center', padding: '3px 2px' }}>
                        <div style={{ width: 19, height: 19, borderRadius: 4, background: d ? 'var(--sage)' : 'var(--bd)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: d ? '#fff' : 'var(--i3)', fontWeight: 700 }}>{d ? '✓' : ''}</div>
                      </td>)}
                      <td style={{ textAlign: 'center' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>🔥{sk}</span></td>
                      <td style={{ textAlign: 'center' }}><span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20, fontFamily: "'DM Mono', monospace", background: badgeBg, color: badgeFg }}>{pct}%</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Category progress + partners */}
        <div style={s.card}>
          <div style={s.ctitle}>Category Progress <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--gl)', color: 'var(--gt)' }}>This week</span></div>
          {state.categories.map(c => {
            const items = byCat[c.id] || []; if (!items.length) return null
            const pct = Math.round(items.filter(r => r.done).length / items.length * 100)
            return <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
              <span style={{ fontSize: 12, color: 'var(--i2)', minWidth: 110, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, display: 'inline-block' }} />{c.name}
              </span>
              <div style={{ flex: 1, height: 6, background: 'var(--bd)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: c.color, borderRadius: 10 }} />
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--i3)', minWidth: 28, textAlign: 'right', fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
            </div>
          })}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 12, color: 'var(--i2)', marginBottom: 8 }}>Accountability partners:</div>
            {state.partners.length === 0
              ? <div style={{ fontSize: 11.5, color: 'var(--i3)' }}>None yet. <GotoLink onClick={() => setPage('partners')}>Add partners →</GotoLink></div>
              : state.partners.map(p => {
                  const cat = state.categories.find(c => c.id === p.catId) || { name: '?', color: '#999' }
                  return <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--bd)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                    <div style={{ flex: 1, fontSize: 12 }}>{p.name} <span style={{ color: 'var(--i3)', fontSize: 10.5 }}>({cat.name})</span></div>
                    <button onClick={() => openGCal(p, state)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--sage)', background: 'var(--sl)', color: 'var(--st)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>📅</button>
                    <button onClick={() => sendEmail(p, state)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--sky)', background: 'var(--kl)', color: 'var(--kt)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✉</button>
                  </div>
                })
            }
            <GotoLink onClick={() => setPage('partners')} style={{ marginTop: 6, display: 'block' }}>Manage partners →</GotoLink>
          </div>
        </div>
      </div>

      {/* Weekly resolutions */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.ctitle}>
          Weekly Resolutions
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--al)', color: 'var(--at)' }}>{weeklyRes.length > 0 ? Math.round(weeklyRes.filter(r => r.done).length / weeklyRes.length * 100) + '%' : '0%'}</span>
            <GotoLink onClick={() => setPage('resolutions')}>Manage all →</GotoLink>
          </div>
        </div>
        {weeklyRes.length === 0
          ? <div style={{ fontSize: 12.5, color: 'var(--i3)', padding: '8px 0' }}>No weekly resolutions. <GotoLink onClick={() => setPage('resolutions')}>Add resolutions →</GotoLink></div>
          : weeklyRes.map(r => (
              <ResItem key={r.id} r={r} categories={state.categories}
                onToggle={() => dispatch({ type: 'TOGGLE_RES', id: r.id })}
                onEdit={patch => dispatch({ type: 'EDIT_RES', id: r.id, ...patch })}
                onDelete={() => dispatch({ type: 'DELETE_RES', id: r.id })} />
            ))
        }
      </div>

      {/* Reflection */}
      <div style={s.card}>
        <div style={s.ctitle}>Weekly Reflection <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--al)', color: 'var(--at)' }}>End of week</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {['5 things that made me happy', '5 things I achieved', '5 things I\'m grateful for'].map(label => (
            <div key={label}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 6 }}>{label}</div>
              {[1,2,3,4,5].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 6 }}>
                  <div style={{ width: 17, height: 17, borderRadius: '50%', background: 'var(--gold)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{n}</div>
                  <input style={{ flex: 1, border: 'none', borderBottom: '1px solid var(--bd)', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: 'var(--ink)', padding: '2px 3px', outline: 'none' }} placeholder="Write here…" />
                </div>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 6 }}>What can I improve?</div>
            <textarea style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '8px 11px', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', resize: 'none', outline: 'none', minHeight: 70 }} placeholder="Growth is not punishment…" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => showToast('Reflection saved ✓')} style={s.btnCol('rust')}>Save Reflection</button>
          <button onClick={() => setPage('summary')} style={s.btn}>Generate Summary PDF →</button>
        </div>
      </div>
    </div>
  )
}

/* ════════════ MONTHLY ════════════ */
export function Monthly({ state, dispatch, setPage }) {
  const monthlyRes = state.resolutions.filter(r => r.freq === 'monthly')
  const doy = Math.min(366, Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000))

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={s.card}>
          <div style={s.ctitle}>Monthly Scorecard <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--sl)', color: 'var(--st)' }}>March 2026</span></div>
          {state.categories.map((c, i) => (
            <ScoreRow key={c.id} cat={c} />
          ))}
        </div>
        <div style={s.card}>
          <div style={s.ctitle}>Self-Reflection</div>
          {['What I\'m most proud of', 'What held me back?', 'Focus for next month'].map(label => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', marginBottom: 5 }}>{label}</div>
              <textarea style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '8px 11px', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', resize: 'none', outline: 'none', minHeight: 60 }} placeholder="…" />
            </div>
          ))}
        </div>
      </div>

      {/* Monthly resolutions */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.ctitle}>
          Monthly Resolutions
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--vl)', color: 'var(--vt)' }}>{monthlyRes.length > 0 ? Math.round(monthlyRes.filter(r => r.done).length / monthlyRes.length * 100) + '%' : '0%'}</span>
            <GotoLink onClick={() => setPage('resolutions')}>Manage all →</GotoLink>
          </div>
        </div>
        {monthlyRes.length === 0
          ? <div style={{ fontSize: 12.5, color: 'var(--i3)', padding: '8px 0' }}>No monthly resolutions. <GotoLink onClick={() => setPage('resolutions')}>Add resolutions →</GotoLink></div>
          : monthlyRes.map(r => (
              <ResItem key={r.id} r={r} categories={state.categories}
                onToggle={() => dispatch({ type: 'TOGGLE_RES', id: r.id })}
                onEdit={patch => dispatch({ type: 'EDIT_RES', id: r.id, ...patch })}
                onDelete={() => dispatch({ type: 'DELETE_RES', id: r.id })} />
            ))
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Milestones mini */}
        <div style={s.card}>
          <div style={s.ctitle}>Milestones <GotoLink onClick={() => setPage('milestones')}>View all →</GotoLink></div>
          {state.milestones.length === 0
            ? <div style={{ fontSize: 12, color: 'var(--i3)' }}>None yet.</div>
            : state.milestones.slice(0, 4).map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--bd)' }}>
                  <div onClick={() => dispatch({ type: 'TOGGLE_MILESTONE', idx: i })}
                    style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${m.done ? 'var(--sage)' : 'var(--bd2)'}`, background: m.done ? 'var(--sage)' : 'var(--sf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0, cursor: 'pointer' }}>
                    {m.done ? '✓' : ''}
                  </div>
                  <span style={{ flex: 1, fontSize: 12, textDecoration: m.done ? 'line-through' : 'none', color: m.done ? 'var(--i3)' : 'var(--ink)' }}>{m.title}</span>
                  <span style={{ fontSize: 10, color: 'var(--i3)', fontFamily: "'DM Mono', monospace" }}>{m.pct}%</span>
                </div>
              ))
          }
        </div>
        {/* Heatmap */}
        <div style={s.card}>
          <div style={s.ctitle}>2026 Activity Heatmap <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--sl)', color: 'var(--st)' }}>Year view</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: '4px 0' }}>
            {Array.from({ length: 366 }, (_, i) => {
              const past = i < doy; let bg = 'var(--bd)'
              if (past) { const r = Math.random(); bg = r < .15 ? 'var(--bd)' : r < .35 ? '#C8E6C9' : r < .6 ? '#81C784' : r < .8 ? '#4CAF50' : '#2E7D32' }
              return <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: bg }} title={`Day ${i + 1}`} />
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 10, color: 'var(--i3)' }}>
            Less {['var(--bd)', '#C8E6C9', '#81C784', '#4CAF50', '#2E7D32'].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: c }} />)} More
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreRow({ cat }) {
  const [score, setScore] = useState(3)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--bd)' }}>
      <span style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: cat.color, display: 'inline-block' }} />{cat.name}
      </span>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} onClick={() => setScore(n)} style={{ fontSize: 16, cursor: 'pointer', color: n <= score ? 'var(--gold)' : 'var(--bd2)', transition: '.1s' }}>
            {n <= score ? '★' : '☆'}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ════════════ PARTNERS ════════════ */
export function Partners({ state, dispatch }) {
  const [adding, setAdding] = useState(null)
  const [pName, setPName] = useState('')
  const [pEmail, setPEmail] = useState('')

  const submit = () => {
    if (!pName.trim() || !pEmail.trim()) return showToast('Please enter name and email')
    if (state.partners.filter(p => p.catId === adding).length >= 2) return showToast('Max 2 partners per category')
    const cat = state.categories.find(c => c.id === adding)
    const initials = pName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    dispatch({ type: 'ADD_PARTNER', partner: { id: 'p' + Date.now(), name: pName.trim(), email: pEmail.trim(), catId: adding, initials, color: cat?.color || '#999' } })
    setAdding(null); setPName(''); setPEmail('')
    showToast(pName + ' added as partner ✓')
  }

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={s.card}>
          <div style={s.ctitle}>Accountability Partners <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--gl)', color: 'var(--gt)' }}>Max 2 per category</span></div>
          <div style={{ fontSize: 12, color: 'var(--i2)', lineHeight: 1.65, marginBottom: 14 }}>Each category gets up to <strong>2 partners</strong>. Partners receive only their category's resolutions via Google Calendar and email.</div>
          {state.categories.map(cat => {
            const cp = state.partners.filter(p => p.catId === cat.id)
            const cr = state.resolutions.filter(r => r.catId === cat.id)
            const full = cp.length >= 2
            return (
              <div key={cat.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--bd)', marginBottom: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--i2)', flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--i3)', fontFamily: "'DM Mono', monospace" }}>{cp.length}/2 · {cr.length} resolutions</span>
                </div>
                {cp.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--s2)', borderRadius: 'var(--r)', marginBottom: 6, border: '1px solid var(--bd)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--i2)' }}>{p.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => openGCal(p, state)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--sage)', background: 'var(--sl)', color: 'var(--st)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>📅 Calendar</button>
                      <button onClick={() => sendEmail(p, state)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--sky)', background: 'var(--kl)', color: 'var(--kt)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✉ Email</button>
                      <button onClick={() => dispatch({ type: 'DELETE_PARTNER', id: p.id })} style={{ ...s.ia, color: 'var(--i3)', opacity: 1 }}>✕</button>
                    </div>
                  </div>
                ))}
                {adding === cat.id
                  ? <div style={{ padding: '10px 12px', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--gold)' }}>
                      <input autoFocus value={pName} onChange={e => setPName(e.target.value)} placeholder="Partner's name"
                        style={{ width: '100%', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '8px 11px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', marginBottom: 8 }} />
                      <input value={pEmail} onChange={e => setPEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Partner's email"
                        style={{ width: '100%', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '8px 11px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', marginBottom: 8 }} />
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button onClick={submit} style={s.btnCol('gold')}>Add Partner</button>
                        <button onClick={() => setAdding(null)} style={s.btn}>Cancel</button>
                      </div>
                    </div>
                  : full
                    ? <div style={{ fontSize: 11, color: 'var(--at)', background: 'var(--al)', padding: '4px 10px', borderRadius: 5, fontWeight: 500 }}>✓ Max 2 partners for this category</div>
                    : <button onClick={() => { setAdding(cat.id); setPName(''); setPEmail('') }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', background: 'none', border: '1.5px dashed var(--bd2)', borderRadius: 'var(--r)', cursor: 'pointer', color: 'var(--i3)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", width: '100%' }}>
                        + Add partner for {cat.name}
                      </button>
                }
              </div>
            )
          })}
        </div>
        <div style={s.card}>
          <div style={s.ctitle}>How partners work <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--kl)', color: 'var(--kt)' }}>Zero backend</span></div>
          <div style={{ fontSize: 12.5, color: 'var(--i2)', lineHeight: 1.9, marginBottom: 14 }}>
            <div>📅 <strong>Google Calendar:</strong> Opens a pre-filled invite with only their category's habits in the description. Partner added as guest automatically.</div>
            <div style={{ marginTop: 8 }}>✉ <strong>Email:</strong> Opens your mail client with a pre-written summary of their category's resolutions only.</div>
          </div>
          <div style={{ background: 'var(--sl)', border: '1px solid var(--sage)', borderRadius: 'var(--r)', padding: 12, fontSize: 12, color: 'var(--st)' }}>
            ✓ Partners only see their assigned category<br />✓ No server · No API · No cost<br />✓ Works on any device
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════ MILESTONES ════════════ */
export function Milestones({ state, dispatch, setPage }) {
  const stats = getStats(state)
  const [addingMs, setAddingMs] = useState(false)
  const [msTitle, setMsTitle] = useState('')

  const saveMs = () => {
    if (msTitle.trim()) dispatch({ type: 'ADD_MILESTONE', milestone: { id: 'ms' + Date.now(), title: msTitle.trim(), date: '2026', pct: 0, done: false } })
    setAddingMs(false)
    setMsTitle('')
  }

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={s.card}>
          <div style={s.ctitle}>
            Year-End Milestones
            {addingMs ? (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <input autoFocus value={msTitle} onChange={e => setMsTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveMs(); if (e.key === 'Escape') setAddingMs(false) }} placeholder="Title..." style={{ border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", outline: 'none', background: 'var(--sf)', color: 'var(--ink)' }} />
                <button onClick={saveMs} style={{ ...s.ia, color: 'var(--sage)' }}>✓</button>
                <button onClick={() => setAddingMs(false)} style={s.ia}>✕</button>
              </div>
            ) : (
              <button onClick={() => setAddingMs(true)} style={{ ...s.btnCol('gold'), fontSize: 11, padding: '3px 10px' }}>+ Add</button>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--i2)', marginBottom: 12 }}>Major one-off targets — not recurring habits. Tick when achieved.</div>
          {state.milestones.length === 0
            ? <div style={{ fontSize: 12.5, color: 'var(--i3)', padding: '8px 0' }}>No milestones yet.</div>
            : state.milestones.map((m, i) => (
                <MilestoneItem key={m.id} m={m} idx={i} dispatch={dispatch} isLast={i === state.milestones.length - 1} />
              ))
          }
        </div>
        <div style={s.card}>
          <div style={s.ctitle}>Progress</div>
          <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: 'var(--ink)', lineHeight: 1 }}>{stats.mspct}%</div>
            <div style={{ fontSize: 12, color: 'var(--i2)', marginTop: 2 }}>milestones completed</div>
            <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{stats.msd} of {stats.mst} done</div>
          </div>
          <div style={{ height: 8, background: 'var(--bd)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ width: stats.mspct + '%', height: '100%', background: 'linear-gradient(90deg,var(--rust),var(--gold))', borderRadius: 10 }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--i2)', lineHeight: 2 }}>
            <div>📅 Day {stats.doy} of 366</div>
            <div>📊 {Math.round(stats.doy / 366 * 100)}% of 2026 complete</div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--bd)' }}>
            <GotoLink onClick={() => setPage('daily')}>View daily checklist →</GotoLink><br />
            <GotoLink onClick={() => setPage('resolutions')} style={{ marginTop: 4 }}>View all resolutions →</GotoLink>
          </div>
        </div>
      </div>
    </div>
  )
}

function MilestoneItem({ m, idx, dispatch, isLast }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(m.title)
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div onClick={() => dispatch({ type: 'TOGGLE_MILESTONE', idx })}
          style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${m.done ? 'var(--sage)' : 'var(--bd2)'}`, background: m.done ? 'var(--sage)' : 'var(--sf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: m.done ? '#fff' : 'var(--i2)', cursor: 'pointer' }}>
          {m.done ? '✓' : '○'}
        </div>
        {!isLast && <div style={{ width: 2, background: 'var(--bd)', flex: 1, minHeight: 20, marginTop: 3 }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {editing
            ? <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { dispatch({ type: 'EDIT_MILESTONE', idx, patch: { title } }); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
                style={{ flex: 1, border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 8px', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', background: 'var(--sf)' }} />
            : <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500, textDecoration: m.done ? 'line-through' : 'none', color: m.done ? 'var(--i3)' : 'var(--ink)' }}>{m.title}</span>
          }
          <button style={s.ia} onClick={() => setEditing(!editing)}>✎</button>
          <button style={{ ...s.ia, color: 'var(--i3)' }} onClick={() => dispatch({ type: 'DELETE_MILESTONE', idx })}>✕</button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--i3)', fontFamily: "'DM Mono', monospace", marginTop: 1 }}>{m.date}</div>
        <div style={{ height: 4, background: 'var(--bd)', borderRadius: 10, overflow: 'hidden', marginTop: 5 }}>
          <div style={{ width: m.pct + '%', height: '100%', background: 'linear-gradient(90deg,var(--sage),var(--gold))', borderRadius: 10 }} />
        </div>
        <div style={{ fontSize: 10, color: 'var(--i3)', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{m.pct}% complete</div>
      </div>
    </div>
  )
}

/* ════════════ SUMMARY ════════════ */
export function Summary({ state, setPage }) {
  const stats = getStats(state)

  const printPDF = () => {
    const content = document.getElementById('pdf-content')?.innerHTML || ''
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head><title>Progress — ${state.user.name}</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&family=DM+Mono&display=swap" rel="stylesheet"><style>body{font-family:'DM Sans',sans-serif;padding:40px;max-width:680px;margin:auto;color:#1C1814}.t{font-family:'Playfair Display',serif;font-size:24px;font-weight:700}.sec{margin-top:16px;padding-top:12px;border-top:1px solid #E2DBD0}.sl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#A09488;font-weight:600;margin-bottom:6px}</style></head><body>${content}<script>window.print();<\/script></body></html>`)
    w.document.close()
  }

  const q = state.quotes[state.qi]

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={s.card}>
          <div style={s.ctitle}>Weekly Progress Report <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--vl)', color: 'var(--vt)' }}>PDF</span></div>
          <div id="pdf-content" style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: 16, fontSize: 12, lineHeight: 1.8, color: 'var(--i2)' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Weekly Progress Report</div>
            <div style={{ fontSize: 11, color: 'var(--i3)', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{state.user.name} · {new Date().toDateString()}</div>
            <div style={{ fontSize: 12, fontStyle: 'italic' }}>"{q.t}" — {q.a}</div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 4 }}>Stats</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <div>🔥 Streak: <strong>{stats.streak} days</strong></div>
                <div>✅ Daily: <strong>{stats.dpct}%</strong></div>
                <div>📊 Weekly: <strong>{stats.wpct}%</strong></div>
                <div>📌 Milestones: <strong>{stats.msd}/{stats.mst}</strong></div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 4 }}>Category progress</div>
              {state.categories.map(c => {
                const items = state.resolutions.filter(r => r.catId === c.id)
                const pct = items.length ? Math.round(items.filter(r => r.done).length / items.length * 100) : 0
                return <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{pct}%</span>
                </div>
              })}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 4 }}>Resolutions ({state.resolutions.length} total)</div>
              {state.resolutions.slice(0, 10).map(r => {
                const c = state.categories.find(x => x.id === r.catId) || { color: '#999' }
                return <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 0', fontSize: 11.5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ flex: 1, textDecoration: r.done ? 'line-through' : 'none', color: r.done ? 'var(--i3)' : 'var(--ink)' }}>{r.text.slice(0, 60)}{r.text.length > 60 ? '…' : ''}</span>
                  <span style={{ fontSize: 9, color: 'var(--i3)', fontFamily: "'DM Mono', monospace" }}>{r.freq}</span>
                </div>
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={printPDF} style={s.btnCol('rust')}>🖨 Print / Save PDF</button>
          </div>
        </div>
        <div style={s.card}>
          <div style={s.ctitle}>Send to Partners</div>
          {state.partners.length === 0
            ? <div style={{ fontSize: 12.5, color: 'var(--i3)' }}>No partners yet. <GotoLink onClick={() => setPage('partners')}>Add partners →</GotoLink></div>
            : state.partners.map(p => {
                const cat = state.categories.find(c => c.id === p.catId) || { name: '?', color: '#999' }
                return <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--s2)', borderRadius: 'var(--r)', marginBottom: 8, border: '1px solid var(--bd)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--i2)' }}>{cat.name} · {p.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => openGCal(p, state)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--sage)', background: 'var(--sl)', color: 'var(--st)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>📅</button>
                    <button onClick={() => sendEmail(p, state)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid var(--sky)', background: 'var(--kl)', color: 'var(--kt)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✉</button>
                  </div>
                </div>
              })
          }
          <GotoLink onClick={() => setPage('partners')} style={{ marginTop: 8, display: 'block' }}>Manage partners →</GotoLink>
        </div>
      </div>
    </div>
  )
}

/* ════════════ GCAL + EMAIL HELPERS ════════════ */
function openGCal(p, state) {
  const cat = state.categories.find(c => c.id === p.catId)
  const cr = state.resolutions.filter(r => r.catId === p.catId)
  const done = cr.filter(r => r.done).length
  const pct = cr.length > 0 ? Math.round(done / cr.length * 100) : 0
  const title = encodeURIComponent(`[2026] ${cat?.name || ''} weekly check-in — ${state.user.name}`)
  const body = `Hi ${p.name},\n\nHere is my ${cat?.name} progress:\n\n✅ ${pct}% complete (${done}/${cr.length})\n\n${cr.map(r => `${r.done ? '✓' : '○'} ${r.text} [${r.freq}]`).join('\n')}\n\n🔥 Streak: ${getStats(state).streak} days\n— ${state.user.name}`
  const now = new Date(), pad = n => String(n).padStart(2, '0')
  const ds = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${encodeURIComponent(body)}&dates=${ds}T090000/${ds}T093000&add=${encodeURIComponent(p.email)}`, '_blank')
  showToast(`Calendar invite opened for ${p.name} ✓`)
}

function sendEmail(p, state) {
  const cat = state.categories.find(c => c.id === p.catId)
  const cr = state.resolutions.filter(r => r.catId === p.catId)
  const done = cr.filter(r => r.done).length, pct = cr.length > 0 ? Math.round(done / cr.length * 100) : 0
  const subject = encodeURIComponent(`[2026 Resolution System] My ${cat?.name} progress — ${new Date().toDateString()}`)
  const body = encodeURIComponent(`Hi ${p.name},\n\nMy ${cat?.name} progress:\n\n${pct}% complete (${done}/${cr.length} done)\n\n${cr.map(r => `• ${r.done ? '[Done]' : '[Pending]'} ${r.text} (${r.freq})`).join('\n')}\n\n🔥 Streak: ${getStats(state).streak} days\n— ${state.user.name}`)
  window.location.href = `mailto:${p.email}?subject=${subject}&body=${body}`
  showToast(`Email drafted for ${p.name} ✓`)
}
