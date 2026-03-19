import React, { useState } from 'react'
import { buildCatSignals, autoAssign, splitResolutions } from '../autoAssign.js'
import { showToast } from './UI.jsx'

const PALETTE = ['#6B5BB5','#B84030','#BF8C30','#3070A8','#9C7BB5','#4A7C52','#C07020','#7BB8D4','#E89B7A','#8FB5A0']

export default function Onboarding({ initialCats, onFinish }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [intention, setIntention] = useState('')
  const [cats, setCats] = useState(initialCats)
  const [bulkText, setBulkText] = useState('')
  const [pending, setPending] = useState([])
  const [resolutions, setResolutions] = useState([])
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  const addCat = () => {
    const id = 'cat' + Date.now()
    setCats(prev => [...prev, { id, name: 'New category', color: PALETTE[prev.length % PALETTE.length] }])
  }
  const rmCat = id => { if (cats.length > 1) setCats(prev => prev.filter(c => c.id !== id)) }
  const updCat = (id, patch) => setCats(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))

  const analyse = () => {
    if (!bulkText.trim()) return showToast('Please paste your resolutions')
    const withSigs = buildCatSignals(cats)
    const lines = splitResolutions(bulkText)
    if (!lines.length) return showToast('No resolutions detected')
    const items = lines.map(text => {
      const { catId, freq } = autoAssign(text, withSigs)
      return { text, catId, freq, selected: true }
    })
    setPending(items)
  }

  const confirmAll = () => {
    const sel = pending.filter(x => x.selected)
    if (!sel.length) return showToast('Select at least one')
    setResolutions(prev => [...prev, ...sel.map(item => ({ id: 'r' + Date.now() + Math.random(), text: item.text, catId: item.catId, freq: item.freq, done: false, photo: false }))])
    setPending([])
    setBulkText('')
    showToast(sel.length + ' resolutions added ✓')
  }

  const finish = () => {
    const nm = name.trim() || 'You'
    onFinish({ name: nm, intention }, cats, resolutions, startDate)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', background: 'var(--bg)' }}>
      <div style={{ width: 580, maxWidth: '100%', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: '40px 36px', boxShadow: 'var(--sh2)', animation: 'slideUp .4s ease' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>2026 · Resolution System</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: 'var(--ink)', marginBottom: 8 }}>Your year.<br /><em style={{ color: 'var(--gold)' }}>Your system.</em></h1>
            <p style={{ fontSize: 13, color: 'var(--i2)', marginBottom: 24, lineHeight: 1.65 }}>Discipline over motivation. Set your categories, paste your resolutions as a paragraph, and the system assigns each one automatically.</p>
            <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 5 }}>Your name</label>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && setStep(2)}
              placeholder="e.g. Jenna Kuria" maxLength={40}
              style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', marginBottom: 12 }} />
            <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 5 }}>Your intention for 2026</label>
            <input value={intention} onChange={e => setIntention(e.target.value)} onKeyDown={e => e.key === 'Enter' && setStep(2)}
              placeholder="e.g. Build discipline, earn freedom"
              style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', marginBottom: 12 }} />
            
            <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 5 }}>Journey Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} onKeyDown={e => e.key === 'Enter' && setStep(2)}
              style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px 14px', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', marginBottom: 4 }} />
            <button onClick={() => setStep(2)} style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--r)', padding: 13, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginTop: 16 }}>
              Next: Set your categories →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Step 2 of 3</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: 'var(--ink)', marginBottom: 8 }}>Your life <em style={{ color: 'var(--gold)' }}>categories</em></h1>
            <p style={{ fontSize: 13, color: 'var(--i2)', marginBottom: 20, lineHeight: 1.65 }}>Name each area you want to grow in. These become the sections your resolutions are sorted into.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
              {cats.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)' }}>
                  <input type="color" value={c.color} onChange={e => updCat(c.id, { color: e.target.value })} style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
                  <input value={c.name} onChange={e => updCat(c.id, { name: e.target.value })} style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', outline: 'none' }} />
                  <button onClick={() => rmCat(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--i3)', fontSize: 15, padding: '0 3px' }}>✕</button>
                </div>
              ))}
            </div>
            <button onClick={addCat} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'none', border: '1.5px dashed var(--bd2)', borderRadius: 'var(--r)', cursor: 'pointer', color: 'var(--i2)', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", width: '100%', marginBottom: 16 }}>
              + Add category
            </button>
            <button onClick={() => setStep(3)} style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--r)', padding: 13, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: 8 }}>
              Next: Add your resolutions →
            </button>
            <button onClick={() => setStep(1)} style={{ width: '100%', background: 'transparent', border: '1.5px solid var(--bd)', borderRadius: 'var(--r)', padding: 11, fontSize: 13.5, color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
              ← Back
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Step 3 of 3</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: 'var(--ink)', marginBottom: 8 }}>Paste your <em style={{ color: 'var(--gold)' }}>resolutions</em></h1>
            <p style={{ fontSize: 13, color: 'var(--i2)', marginBottom: 16, lineHeight: 1.65 }}>Write or paste your full list as a paragraph or numbered list. The system reads each sentence, assigns it to a category and frequency, and lets you review before adding.</p>
            <textarea value={bulkText} onChange={e => setBulkText(e.target.value)}
              placeholder="e.g. I want to pray every morning before I check my phone. Go to the gym 4 times a week. Read one book per month. Track my expenses every Sunday…"
              style={{ width: '100%', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', outline: 'none', resize: 'vertical', minHeight: 120, lineHeight: 1.6, marginBottom: 10 }} />
            <button onClick={analyse} style={{ width: '100%', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 'var(--r)', padding: 10, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: 12 }}>
              Analyse all resolutions →
            </button>

            {/* Results table */}
            {pending.length > 0 && (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--bd)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{pending.length} resolutions found</span>
                  <button onClick={() => setPending(prev => prev.map(x => ({ ...x, selected: true })))}
                    style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, border: '1px solid var(--bd)', background: 'none', cursor: 'pointer', color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif" }}>Select all</button>
                </div>
                {pending.map((item, i) => {
                  const thisCat = cats.find(c => c.id === item.catId) || cats[0]
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--bd)' }}>
                      <div onClick={() => setPending(prev => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}
                        style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${item.selected ? 'var(--sage)' : 'var(--bd2)'}`, background: item.selected ? 'var(--sage)' : 'var(--s2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0, marginTop: 2 }}>
                        {item.selected ? '✓' : ''}
                      </div>
                      <div style={{ flex: 1, fontSize: 12.5 }}>{item.text}</div>
                      <div style={{ display: 'flex', gap: 5, flexShrink: 0, flexWrap: 'wrap' }}>
                        <select value={item.catId} onChange={e => setPending(prev => prev.map((x, j) => j === i ? { ...x, catId: e.target.value } : x))}
                          style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 5, padding: '2px 6px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', cursor: 'pointer' }}>
                          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select value={item.freq} onChange={e => setPending(prev => prev.map((x, j) => j === i ? { ...x, freq: e.target.value } : x))}
                          style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 5, padding: '2px 6px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', cursor: 'pointer' }}>
                          {['daily','weekly','monthly'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                  )
                })}
                <div style={{ padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid var(--bd)' }}>
                  <span style={{ flex: 1, fontSize: 11.5, color: 'var(--i2)' }}>{pending.filter(x => x.selected).length} selected</span>
                  <button onClick={confirmAll} style={{ background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Add selected →</button>
                </div>
              </div>
            )}

            {resolutions.length > 0 && (
              <div style={{ marginBottom: 12, maxHeight: 160, overflowY: 'auto', background: 'var(--s2)', borderRadius: 'var(--r)', padding: '10px 12px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--i3)', fontWeight: 600, marginBottom: 6 }}>{resolutions.length} resolutions added</div>
                {resolutions.map(r => {
                  const c = cats.find(x => x.id === r.catId) || { color: '#999' }
                  return <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', fontSize: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ flex: 1 }}>{r.text.slice(0, 60)}{r.text.length > 60 ? '…' : ''}</span>
                    <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 20, fontFamily: "'DM Mono', monospace", fontWeight: 600, background: r.freq === 'daily' ? 'var(--sl)' : r.freq === 'weekly' ? 'var(--al)' : 'var(--vl)', color: r.freq === 'daily' ? 'var(--st)' : r.freq === 'weekly' ? 'var(--at)' : 'var(--vt)' }}>{r.freq}</span>
                  </div>
                })}
              </div>
            )}

            <button onClick={finish} style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--r)', padding: 13, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: 8 }}>
              Enter my system →
            </button>
            <button onClick={() => setStep(2)} style={{ width: '100%', background: 'transparent', border: '1.5px solid var(--bd)', borderRadius: 'var(--r)', padding: 11, fontSize: 13.5, color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
