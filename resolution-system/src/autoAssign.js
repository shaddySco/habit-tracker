const FREQ_KW = {
  daily:   ['every day','each day','daily','every morning','every night','every evening','each morning','kila siku','morning routine','nightly','each evening'],
  weekly:  ['every week','each week','weekly','once a week','twice a week','per week','every sunday','every monday','kila wiki','each weekend','weekends'],
  monthly: ['every month','each month','monthly','once a month','per month','kila mwezi','end of month','start of month','every quarter'],
}

const CAT_THEME = {
  spiritual:    ['pray','prayer','bible','church','devotion','fast','worship','god','faith','scripture','spiritual','mass','sermon','quran','devotional','tithe'],
  health:       ['workout','gym','run','exercise','water','drink','sleep','eat','diet','jog','walk','stretch','yoga','nutrition','healthy','calories','steps','body','fitness'],
  career:       ['work','job','business','client','project','meeting','email','finance','money','save','invest','budget','income','profit','sales','freelance','startup','career'],
  finance:      ['save','invest','budget','money','income','profit','finance','spending','debt','bank','kes','savings'],
  learning:     ['read','book','course','study','learn','skill','watch','listen','podcast','class','lesson','practice','write','code','language','research'],
  relationship: ['family','friend','call','text','connect','date','partner','spouse','parent','sibling','community','love','appreciate','thank','visit','parents'],
}

export function buildCatSignals(categories) {
  return categories.map(cat => {
    const nm = cat.name.toLowerCase()
    let sigs = []
    Object.keys(CAT_THEME).forEach(theme => {
      if (nm.includes(theme)) sigs = sigs.concat(CAT_THEME[theme])
    })
    if (!sigs.length) sigs = nm.split(/[\s\/&,]+/).filter(w => w.length > 3)
    return { ...cat, _sigs: [...new Set(sigs)] }
  })
}

export function autoAssign(text, categories) {
  const t = text.toLowerCase()

  // frequency
  const fs = { daily: 0, weekly: 0, monthly: 0 }
  Object.keys(FREQ_KW).forEach(f => FREQ_KW[f].forEach(kw => { if (t.includes(kw)) fs[f] += 2 }))
  const mxf = Math.max(...Object.values(fs))
  const freq = mxf > 0 ? Object.keys(fs).find(f => fs[f] === mxf) : 'daily'

  // category
  const cs = {}
  categories.forEach(cat => {
    cs[cat.id] = 0
    ;(cat._sigs || []).forEach(kw => { if (t.includes(kw)) cs[cat.id]++ })
  })
  const mxc = Math.max(...Object.values(cs))
  const catId = mxc > 0 ? Object.keys(cs).find(id => cs[id] === mxc) : (categories[0]?.id || '')

  return { catId, freq }
}

export function splitResolutions(text) {
  let lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 8)
  if (lines.length <= 1) {
    lines = text.trim()
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map(l => l.trim())
      .filter(l => l.length > 8)
  }
  return lines.map(l => l.replace(/^\d+[.)]\s*/, '').trim()).filter(l => l.length > 5)
}
