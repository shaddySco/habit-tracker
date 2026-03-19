import React from 'react'
import { CheckItem, KpiCard, ResItem, GotoLink, s } from './UI.jsx'
import { getStats } from '../useAppState.js'

export default function Daily({ state, dispatch, setPage }) {
  const stats = getStats(state)
  const q = state.quotes[state.qi]
  const dailyRes = state.resolutions.filter(r => r.freq === 'daily')

  const toggle = (key, idx) => dispatch({ type: 'TOGGLE_ROUTINE', routineKey: key, idx })
  const editRoutine = (key, idx, label) => dispatch({ type: 'EDIT_ROUTINE_ITEM', routineKey: key, idx, patch: { label } })
  const delRoutine = (key, idx) => { dispatch({ type: 'DELETE_ROUTINE_ITEM', routineKey: key, idx }) }
  const addRoutine = (key, label, time) => {
    if (!label.trim()) return
    dispatch({ type: 'ADD_ROUTINE_ITEM', routineKey: key, item: { id: key + Date.now(), label, time: time || '', done: false } })
  }

  const [addingTo, setAddingTo] = React.useState(null)
  const [addLabel, setAddLabel] = React.useState('')
  const [addTime, setAddTime] = React.useState('')

  const submitAdd = () => {
    if (!addLabel.trim()) return
    addRoutine(addingTo, addLabel, addTime)
    setAddingTo(null); setAddLabel(''); setAddTime('')
  }

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
        <KpiCard label="Streak" value={stats.streak} sub="days 🔥" color="gold" />
        <KpiCard label="Today" value={stats.dpct + '%'} sub={`${stats.done} of ${stats.total} done`} color="rust" />
        <KpiCard label="Week avg" value={stats.wpct + '%'} sub="habit consistency" color="sage" />
        <KpiCard label="Day of year" value={stats.doy} sub="of 366 in 2026" color="vio" />
      </div>

      {/* Quote */}
      <div style={{ background: 'var(--sf)', borderLeft: '3px solid var(--gold)', borderRadius: '0 var(--r) var(--r) 0', padding: '13px 16px', marginBottom: 14, position: 'relative' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55 }}>"{q.t}"</div>
        <div style={{ fontSize: 10, color: 'var(--gold)', fontFamily: "'DM Mono', monospace", marginTop: 5 }}>— {q.a}</div>
        <button onClick={() => dispatch({ type: 'NEXT_QUOTE' })} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: '1px solid var(--bd)', borderRadius: 6, padding: '3px 8px', fontSize: 10, cursor: 'pointer', color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif" }}>↺ New</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Morning */}
        <div style={s.card}>
          <div style={s.ctitle}>
            Morning Routine
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ ...s.chip('rust'), }}>First hour</span>
              <button style={s.btnCol('gold')} onClick={() => setAddingTo('morningRoutine')}>+ Add</button>
            </div>
          </div>
          {state.morningRoutine.map((t, i) => (
            <CheckItem key={t.id} item={t}
              onToggle={() => toggle('morningRoutine', i)}
              onEdit={label => editRoutine('morningRoutine', i, label)}
              onDelete={() => delRoutine('morningRoutine', i)} />
          ))}
          {addingTo === 'morningRoutine' && <AddInline label={addLabel} setLabel={setAddLabel} time={addTime} setTime={setAddTime} onSave={submitAdd} onCancel={() => setAddingTo(null)} showTime />}
        </div>

        {/* Tasks + Evening */}
        <div style={s.card}>
          <div style={s.ctitle}>
            Top 3 Tasks
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={s.chip('gold')}>Today</span>
              <button style={s.btnCol('gold')} onClick={() => setAddingTo('mainTasks')}>+ Add</button>
            </div>
          </div>
          {state.mainTasks.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', borderRadius: 8, marginBottom: 3, border: '1px solid transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div onClick={() => toggle('mainTasks', i)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${t.done ? 'var(--sage)' : 'var(--bd2)'}`, background: t.done ? 'var(--sage)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', cursor: 'pointer' }}>{t.done ? '✓' : ''}</div>
              <input value={t.label} onChange={e => dispatch({ type: 'EDIT_TASK_LABEL', idx: i, label: e.target.value })}
                style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: t.done ? 'var(--i3)' : 'var(--ink)', outline: 'none', textDecoration: t.done ? 'line-through' : 'none' }} />
              <button style={{ ...s.ia, color: 'var(--i3)' }} onClick={() => delRoutine('mainTasks', i)}>✕</button>
            </div>
          ))}
          {addingTo === 'mainTasks' && <AddInline label={addLabel} setLabel={setAddLabel} onSave={submitAdd} onCancel={() => setAddingTo(null)} />}

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--bd)' }}>
            <div style={{ ...s.ctitle, fontSize: 13, marginBottom: 8 }}>
              Evening Check-in
              <button style={s.btnCol('gold')} onClick={() => setAddingTo('eveningRoutine')}>+ Add</button>
            </div>
            {state.eveningRoutine.map((t, i) => (
              <CheckItem key={t.id} item={t}
                onToggle={() => toggle('eveningRoutine', i)}
                onEdit={label => editRoutine('eveningRoutine', i, label)}
                onDelete={() => delRoutine('eveningRoutine', i)} />
            ))}
            {addingTo === 'eveningRoutine' && <AddInline label={addLabel} setLabel={setAddLabel} time={addTime} setTime={setAddTime} onSave={submitAdd} onCancel={() => setAddingTo(null)} showTime />}
          </div>
        </div>
      </div>

      {/* Daily Resolutions */}
      <div style={s.card}>
        <div style={s.ctitle}>
          Daily Resolutions
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={s.chip('sage')}>{dailyRes.length > 0 ? Math.round(dailyRes.filter(r => r.done).length / dailyRes.length * 100) + '%' : '0%'}</span>
            <GotoLink onClick={() => setPage('resolutions')}>Manage all →</GotoLink>
          </div>
        </div>
        {dailyRes.length === 0
          ? <div style={{ fontSize: 12.5, color: 'var(--i3)', padding: '8px 0' }}>No daily resolutions yet. <GotoLink onClick={() => setPage('resolutions')}>Add resolutions →</GotoLink></div>
          : <ResByCat items={dailyRes} categories={state.categories} dispatch={dispatch} />
        }
      </div>
    </div>
  )
}

function AddInline({ label, setLabel, time, setTime, onSave, onCancel, showTime }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '6px 0', flexWrap: 'wrap' }}>
      <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
        placeholder="Enter text…"
        style={{ flex: 1, border: '1px solid var(--gold)', borderRadius: 6, padding: '5px 9px', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', background: 'var(--sf)', minWidth: 120 }} />
      {showTime && <input value={time} onChange={e => setTime(e.target.value)} placeholder="Time (e.g. 7 AM)"
        style={{ width: 110, border: '1px solid var(--bd)', borderRadius: 6, padding: '5px 9px', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', background: 'var(--sf)' }} />}
      <button onClick={onSave} style={{ background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Add</button>
      <button onClick={onCancel} style={{ background: 'none', border: '1px solid var(--bd)', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
    </div>
  )
}

function ResByCat({ items, categories, dispatch }) {
  const byCat = {}
  categories.forEach(c => byCat[c.id] = [])
  items.forEach(r => { if (byCat[r.catId]) byCat[r.catId].push(r) })
  return categories.filter(c => byCat[c.id].length > 0).map(cat => {
    const ci = byCat[cat.id], cd = ci.filter(r => r.done).length, cp = Math.round(cd / ci.length * 100)
    return (
      <div key={cat.id} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '2px solid var(--bd)', marginBottom: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--i2)', flex: 1 }}>{cat.name}</span>
          <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: cat.color }}>{cp}%</span>
        </div>
        {ci.map(r => (
          <ResItem key={r.id} r={r} categories={categories}
            onToggle={() => dispatch({ type: 'TOGGLE_RES', id: r.id })}
            onEdit={patch => dispatch({ type: 'EDIT_RES', id: r.id, ...patch })}
            onDelete={() => dispatch({ type: 'DELETE_RES', id: r.id })}
            onPhoto={() => dispatch({ type: 'SET_RES_PHOTO', id: r.id })} />
        ))}
      </div>
    )
  })
}
