import React, { useState } from 'react'

/* ── STYLES ── */
export const s = {
  card:    { background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: '16px 18px', boxShadow: 'var(--sh)' },
  ctitle:  { fontFamily: "'Playfair Display', serif", fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 },
  chip:    (col) => ({ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `var(--${col}l)`, color: `var(--${col}t)` }),
  btn:     { padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', border: '1.5px solid var(--bd)', background: 'none', color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif", transition: '.15s', whiteSpace: 'nowrap' },
  btnCol:  (c) => ({ background: `var(--${c})`, color: '#fff', borderColor: `var(--${c})`, padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", border: 'none', transition: '.15s' }),
  input:   { width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none' },
  ia:      { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--i3)', fontSize: 12, padding: '2px 4px', borderRadius: 4, fontFamily: "'DM Sans', sans-serif" },
  kpi:     (col) => ({ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: '14px 16px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--sh)' }),
}

/* ── CHIP ── */
export function Chip({ col, children }) {
  return <span style={s.chip(col)}>{children}</span>
}

/* ── BADGE ── */
export function Badge({ pct, custom }) {
  const cls = custom || (pct >= 80 ? 'g' : pct >= 40 ? 'a' : 'r')
  const colors = { g: ['var(--sl)', 'var(--st)'], a: ['var(--al)', 'var(--at)'], r: ['var(--rl)', 'var(--rt)'], n: ['var(--s3)', 'var(--i3)'] }
  const [bg, fg] = colors[cls] || colors.n
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20, fontFamily: "'DM Mono', monospace", background: bg, color: fg }}>
      {pct !== undefined ? pct + '%' : custom}
    </span>
  )
}

/* ── KPI CARD ── */
export function KpiCard({ label, value, sub, color }) {
  return (
    <div style={s.kpi(color)}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `var(--${color})`, borderRadius: 'var(--r2) var(--r2) 0 0' }} />
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--i3)', marginTop: 3 }}>{sub}</div>
    </div>
  )
}

/* ── CHECK ITEM with edit/delete ── */
export function CheckItem({ item, onToggle, onEdit, onDelete, squareBox }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(item.label)

  const save = () => { onEdit?.(val); setEditing(false) }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', borderRadius: 8, marginBottom: 3, border: '1px solid transparent', cursor: 'pointer', transition: '.12s', background: 'transparent' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div onClick={onToggle}
        style={{ width: 18, height: 18, borderRadius: squareBox ? 4 : '50%', border: `2px solid ${item.done ? 'var(--sage)' : 'var(--bd2)'}`, background: item.done ? 'var(--sage)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', transition: '.15s', cursor: 'pointer' }}>
        {item.done ? '✓' : ''}
      </div>
      {editing
        ? <input autoFocus value={val} onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
            style={{ flex: 1, border: '1px solid var(--gold)', borderRadius: 6, padding: '3px 8px', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', background: 'var(--sf)' }} />
        : <span onClick={onToggle} style={{ flex: 1, fontSize: 12.5, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--i3)' : 'var(--ink)' }}>{item.label}</span>
      }
      <span style={{ fontSize: 10, color: 'var(--i3)', fontFamily: "'DM Mono', monospace" }}>{item.time || ''}</span>
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        {editing
          ? <>
              <button style={{ ...s.ia, color: 'var(--sage)' }} onClick={save}>✓</button>
              <button style={s.ia} onClick={() => setEditing(false)}>✕</button>
            </>
          : <>
              <button style={s.ia} onClick={() => setEditing(true)} title="Edit">✎</button>
              <button style={{ ...s.ia, color: 'var(--i3)' }} onClick={onDelete} title="Delete">✕</button>
            </>
        }
      </div>
    </div>
  )
}

/* ── RESOLUTION ITEM with edit/delete ── */
export function ResItem({ r, categories, onToggle, onEdit, onDelete, onPhoto }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(r.text)
  const [catId, setCatId] = useState(r.catId)
  const [freq, setFreq] = useState(r.freq)
  const cat = categories.find(c => c.id === r.catId) || { color: '#999' }
  const freqColors = { daily: ['var(--sl)', 'var(--st)'], weekly: ['var(--al)', 'var(--at)'], monthly: ['var(--vl)', 'var(--vt)'] }
  const [fb, fc] = freqColors[r.freq] || freqColors.daily

  const save = () => { onEdit({ text, catId, freq }); setEditing(false) }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 10px', borderRadius: 8, marginBottom: 5, border: '1px solid var(--bd)', background: 'var(--sf)', transition: '.12s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--sf)'}>
      <div onClick={onToggle}
        style={{ width: 19, height: 19, borderRadius: 5, border: `1.5px solid ${r.photo ? 'var(--vio)' : r.done ? 'var(--sage)' : 'var(--bd2)'}`, background: r.photo ? 'var(--vio)' : r.done ? 'var(--sage)' : 'var(--s2)', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: r.photo ? 8 : 9, color: '#fff', marginTop: 1 }}>
        {r.photo ? '📷' : r.done ? '✓' : ''}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing
          ? <>
              <textarea autoFocus rows={2} value={text} onChange={e => setText(e.target.value)}
                style={{ width: '100%', border: '1px solid var(--gold)', borderRadius: 6, background: 'var(--sf)', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: 'var(--ink)', padding: '4px 8px', outline: 'none', resize: 'none', marginBottom: 6 }} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <select value={catId} onChange={e => setCatId(e.target.value)}
                  style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 6, padding: '3px 7px', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', cursor: 'pointer' }}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={freq} onChange={e => setFreq(e.target.value)}
                  style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 6, padding: '3px 7px', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', cursor: 'pointer' }}>
                  {['daily','weekly','monthly'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <button style={{ ...s.ia, color: 'var(--sage)', fontSize: 12 }} onClick={save}>Save</button>
                <button style={s.ia} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          : <>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, wordBreak: 'break-word', textDecoration: r.done ? 'line-through' : 'none', color: r.done ? 'var(--i3)' : 'var(--ink)' }}>{r.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 20, fontWeight: 600, fontFamily: "'DM Mono', monospace", background: fb, color: fc }}>{r.freq}</span>
                {r.done && !r.photo && <button style={{ ...s.ia, fontSize: 10, opacity: 1 }} onClick={() => onPhoto?.()}>📷 proof</button>}
                {r.photo && <span style={{ fontSize: 10, color: 'var(--vio)' }}>📷 verified</span>}
              </div>
            </>
        }
      </div>
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        <button style={s.ia} onClick={() => setEditing(!editing)} title="Edit">✎</button>
        <button style={{ ...s.ia, color: 'var(--i3)' }} onClick={onDelete} title="Delete">✕</button>
      </div>
    </div>
  )
}

/* ── MODAL ── */
export function Modal({ open, title, sub, onClose, children }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.52)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--sf)', borderRadius: 'var(--r2)', padding: 24, width: 380, maxWidth: '92vw', border: '1px solid var(--bd)', boxShadow: 'var(--sh2)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 5 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--i2)', marginBottom: 14 }}>{sub}</div>}
        {children}
      </div>
    </div>
  )
}

/* ── GOTO LINK ── */
export function GotoLink({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ fontSize: 11.5, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline', padding: 0 }}>
      {children}
    </button>
  )
}

/* ── TOAST (global) ── */
let _toastTimer
export function showToast(msg) {
  const el = document.getElementById('toast-el')
  if (!el) return
  el.textContent = msg
  el.classList.add('show')
  clearTimeout(_toastTimer)
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2800)
}

/* ── CONFETTI ── */
export function fireConfetti() {
  const w = document.getElementById('conf-wrap')
  if (!w) return
  w.style.display = 'block'
  w.innerHTML = ''
  const cols = ['#D4A853','#C4533A','#7A9E7E','#9C7BB5','#7BB8D4','#E89B7A','#BF8C30']
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('div')
    p.style.cssText = `position:absolute;border-radius:2px;animation:confFall ${1.8 + Math.random() * 1.4}s ease-in ${Math.random() * 1.2}s forwards;left:${Math.random() * 100}%;top:-20px;background:${cols[Math.floor(Math.random() * cols.length)]};width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;border-radius:${Math.random() > .5 ? '50%' : '2px'}`
    w.appendChild(p)
  }
  setTimeout(() => { w.style.display = 'none' }, 4200)
}
