import React, { useState } from 'react'
import { ResItem, s } from './UI.jsx'
import { buildCatSignals, autoAssign, splitResolutions } from '../autoAssign.js'
import { showToast } from './UI.jsx'

export default function Resolutions({ state, dispatch }) {
  const [bulkText, setBulkText] = useState('')
  const [pending, setPending] = useState([])
  
  const [addingCat, setAddingCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const saveNewCat = () => {
    if (newCatName.trim()) {
      const colors = ['#6B5BB5', '#B84030', '#BF8C30', '#3070A8', '#9C7BB5', '#4A90E2', '#50E3C2', '#F5A623', '#E02020'];
      const color = colors[state.categories.length % colors.length];
      dispatch({ type: 'ADD_CATEGORY', category: { id: 'cat' + Date.now(), name: newCatName.trim(), color } })
    }
    setAddingCat(false)
    setNewCatName('')
  }

  const analyse = () => {
    if (!bulkText.trim()) return showToast('Please paste your resolutions')
    const withSigs = buildCatSignals(state.categories)
    const lines = splitResolutions(bulkText)
    if (!lines.length) return showToast('No individual resolutions detected')
    setPending(lines.map(text => {
      const { catId, freq } = autoAssign(text, withSigs)
      return { text, catId, freq, selected: true }
    }))
  }

  const confirm = () => {
    const sel = pending.filter(x => x.selected)
    if (!sel.length) return showToast('Select at least one')
    dispatch({ type: 'ADD_RESOLUTIONS', items: sel.map(item => ({ id: 'r' + Date.now() + Math.random(), text: item.text, catId: item.catId, freq: item.freq, done: false, photo: false })) })
    setPending([]); setBulkText('')
    showToast(sel.length + ' resolutions added ✓')
  }

  const byCat = {}
  state.categories.forEach(c => byCat[c.id] = [])
  state.resolutions.forEach(r => { if (byCat[r.catId]) byCat[r.catId].push(r) })

  return (
    <div style={{ padding: 22, maxWidth: 1180, margin: '0 auto', animation: 'fadeUp .22s ease' }}>

      {/* BULK PANEL */}
      <div style={{ background: 'var(--s2)', border: '1.5px dashed var(--bd2)', borderRadius: 'var(--r2)', padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Add resolutions — paste a paragraph</div>
        <div style={{ fontSize: 12, color: 'var(--i2)', lineHeight: 1.65, marginBottom: 12 }}>
          Write or paste your resolutions as a paragraph, numbered list, or one per line. The system splits them into individual resolutions and <strong>auto-assigns</strong> each one to a category and frequency. Review and adjust before adding.
        </div>
        <textarea value={bulkText} onChange={e => setBulkText(e.target.value)}
          placeholder="e.g. I want to pray every morning before I check my phone. Go to the gym 4 times a week. Save KES 5,000 every month. Read one book per month. Call my parents every Sunday…"
          style={{ width: '100%', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', resize: 'vertical', minHeight: 110, lineHeight: 1.6 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button onClick={analyse} style={{ flex: 1, background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 'var(--r)', padding: 9, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
            Analyse all → auto-assign
          </button>
          <button onClick={() => { setBulkText(''); setPending([]) }} style={s.btn}>Clear</button>
        </div>

        {pending.length > 0 && (
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', marginTop: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--bd)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{pending.length} resolutions found</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setPending(p => p.map(x => ({ ...x, selected: true })))} style={{ ...s.btn, fontSize: 11, padding: '2px 8px' }}>Select all</button>
                <button onClick={() => setPending(p => p.map(x => ({ ...x, selected: false })))} style={{ ...s.btn, fontSize: 11, padding: '2px 8px' }}>None</button>
              </div>
            </div>
            {pending.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderBottom: i < pending.length - 1 ? '1px solid var(--bd)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <div onClick={() => setPending(p => p.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}
                  style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${item.selected ? 'var(--sage)' : 'var(--bd2)'}`, background: item.selected ? 'var(--sage)' : 'var(--s2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0, marginTop: 2 }}>
                  {item.selected ? '✓' : ''}
                </div>
                <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.4 }}>{item.text}</div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0, flexWrap: 'wrap' }}>
                  <select value={item.catId} onChange={e => setPending(p => p.map((x, j) => j === i ? { ...x, catId: e.target.value } : x))}
                    style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 5, padding: '2px 6px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', cursor: 'pointer' }}>
                    {state.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={item.freq} onChange={e => setPending(p => p.map((x, j) => j === i ? { ...x, freq: e.target.value } : x))}
                    style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 5, padding: '2px 6px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', cursor: 'pointer' }}>
                    {['daily','weekly','monthly'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid var(--bd)' }}>
              <span style={{ flex: 1, fontSize: 11.5, color: 'var(--i2)' }}>{pending.filter(x => x.selected).length} selected</span>
              <button onClick={confirm} style={{ background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Add selected →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ALL RESOLUTIONS */}
      <div style={s.card}>
        <div style={s.ctitle}>
          All Resolutions
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--gl)', color: 'var(--gt)' }}>{state.resolutions.length} total</span>
            {addingCat ? (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveNewCat(); if (e.key === 'Escape') setAddingCat(false) }} placeholder="Category name" style={{ border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", outline: 'none', background: 'var(--sf)' }} />
                <button onClick={saveNewCat} style={{ ...s.ia, color: 'var(--sage)' }}>✓</button>
                <button onClick={() => setAddingCat(false)} style={s.ia}>✕</button>
              </div>
            ) : (
              <button onClick={() => setAddingCat(true)} style={{ ...s.btn, border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: 11, padding: '2px 8px' }}>+ Add Category</button>
            )}
          </div>
        </div>
        {state.categories.map(cat => (
          <CategoryBlock key={cat.id} cat={cat} ci={byCat[cat.id] || []} state={state} dispatch={dispatch} />
        ))}
      </div>
    </div>
  )
}

function CategoryBlock({ cat, ci, state, dispatch }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(cat.name)

  const save = () => {
    if (val.trim()) dispatch({ type: 'EDIT_CATEGORY', id: cat.id, patch: { name: val.trim() } })
    setEditing(false)
  }

  const handleDeleteResolution = (rId) => {
    dispatch({ type: 'DELETE_RES', id: rId })
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '2px solid var(--bd)', marginBottom: 8 }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
        
        {editing ? (
          <input autoFocus value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setVal(cat.name); setEditing(false) } }} style={{ flex: 1, border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 8px', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", outline: 'none', background: 'var(--sf)', color: 'var(--ink)' }} />
        ) : (
          <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--i2)', flex: 1 }}>{cat.name}</span>
        )}

        {editing ? (
          <>
            <button style={{ ...s.ia, color: 'var(--sage)' }} onClick={save}>✓</button>
            <button style={s.ia} onClick={() => { setVal(cat.name); setEditing(false) }}>✕</button>
          </>
        ) : (
          <button style={s.ia} onClick={() => setEditing(true)}>✎</button>
        )}
        
        {ci.length === 0 && !editing && <button style={{ ...s.ia, color: 'var(--i3)', transition: '0.2s' }} onClick={() => dispatch({ type: 'DELETE_CATEGORY', id: cat.id })}>✕</button>}
        
        <span style={{ fontSize: 10, color: 'var(--i3)', fontFamily: "'DM Mono', monospace", marginLeft: 6 }}>{ci.length} resolution{ci.length !== 1 ? 's' : ''}</span>
      </div>
      
      {ci.length === 0 && <div style={{ fontSize: 11.5, color: 'var(--i3)', fontStyle: 'italic', paddingLeft: 18 }}>No resolutions in this category.</div>}
      
      {ci.map(r => (
        <ResItem key={r.id} r={r} categories={state.categories}
          onToggle={() => dispatch({ type: 'TOGGLE_RES', id: r.id })}
          onEdit={patch => dispatch({ type: 'EDIT_RES', id: r.id, ...patch })}
          onDelete={() => handleDeleteResolution(r.id)}
          onPhoto={() => dispatch({ type: 'SET_RES_PHOTO', id: r.id })} />
      ))}
    </div>
  )
}
