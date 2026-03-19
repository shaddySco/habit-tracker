import React, { useEffect } from 'react'
import { useAppState, getStats, badgeClass } from './useAppState.js'
import Onboarding from './components/Onboarding.jsx'
import Daily from './components/Daily.jsx'
import Resolutions from './components/Resolutions.jsx'
import { Weekly, Monthly, Partners, Milestones, Summary } from './components/Pages.jsx'
import { fireConfetti, showToast } from './components/UI.jsx'

const PAGES = ['daily','weekly','monthly','resolutions','partners','milestones','summary']
const PAGE_LABELS = { daily:'☀ Daily', weekly:'◈ Weekly', monthly:'✦ Monthly', resolutions:'✎ Resolutions', partners:'⇌ Partners', milestones:'⏱ Milestones', summary:'📄 Summary' }

export default function App() {
  const { state, dispatch } = useAppState()
  const [page, setPage] = React.useState('daily')

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.dark ? 'dark' : 'light')
  }, [state.dark])

  if (!state.onboarded) {
    return (
      <>
        <div id="conf-wrap" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, display: 'none' }} />
        <div id="toast-el" className="toast" />
        <Onboarding
          initialCats={state.categories}
          onFinish={(user, categories, resolutions, startDate) => {
            dispatch({ type: 'FINISH_ONBOARD', user, categories, startDate })
            if (resolutions.length > 0) dispatch({ type: 'ADD_RESOLUTIONS', items: resolutions })
          }}
        />
      </>
    )
  }

  const stats = getStats(state)
  const initials = state.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'YU'

  const getBadge = (p) => {
    const cls = badgeClass(p)
    const colors = { 'nb-g': ['var(--sl)', 'var(--st)'], 'nb-a': ['var(--al)', 'var(--at)'], 'nb-r': ['var(--rl)', 'var(--rt)'], 'nb-n': ['var(--s3)', 'var(--i3)'] }
    return colors[cls] || colors['nb-n']
  }

  const navBadges = {
    daily:   [stats.dpct + '%', getBadge(stats.dpct)],
    weekly:  [stats.wpct + '%', getBadge(stats.wpct)],
    monthly: [stats.mpct + '%', getBadge(stats.mpct)],
    resolutions: [state.resolutions.length + ' total', ['var(--s3)', 'var(--i3)']],
    milestones: [stats.msd + '/' + stats.mst, stats.msd === stats.mst && stats.mst > 0 ? getBadge(100) : ['var(--s3)', 'var(--i3)']],
  }

  const exportData = () => {
    const data = { exportDate: new Date().toISOString(), ...state }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `resolution-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click()
    URL.revokeObjectURL(url); showToast('Backup downloaded ✓')
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div id="conf-wrap" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, display: 'none' }} />
      <div id="toast-el" style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%) translateY(70px)', background: 'var(--ink)', color: 'var(--bg)', padding: '9px 18px', borderRadius: 30, fontSize: 12.5, fontWeight: 500, zIndex: 600, transition: '.3s', whiteSpace: 'nowrap', opacity: 0, pointerEvents: 'none' }} />

      {/* TOPBAR */}
      <header style={{ background: 'var(--sf)', borderBottom: '1px solid var(--bd)', padding: '0 22px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: 'italic', color: 'var(--ink)' }}>{state.user.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase' }}>2026 Resolution System</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--gl)', border: '1px solid var(--gold)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: 'var(--gt)', fontFamily: "'DM Mono', monospace" }}>
            🔥 {stats.streak} days
          </div>
          <button onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--bd)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
            {state.dark ? '☀️' : '🌙'}
          </button>
          <button onClick={exportData} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1.5px solid var(--bd)', background: 'none', color: 'var(--i2)', fontFamily: "'DM Sans', sans-serif" }}>⬇ Export</button>
          <button onClick={fireConfetti} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'var(--gold)', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>🎉</button>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ background: 'var(--sf)', borderBottom: '1px solid var(--bd)', display: 'flex', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
        {PAGES.map(p => {
          const badge = navBadges[p]
          return (
            <button key={p} onClick={() => setPage(p)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '9px 14px', cursor: 'pointer', border: 'none', borderBottom: `2.5px solid ${page === p ? 'var(--gold)' : 'transparent'}`, background: 'none', color: page === p ? 'var(--ink)' : 'var(--i3)', fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, whiteSpace: 'nowrap', transition: '.15s', minWidth: 88, fontWeight: page === p ? 500 : 400 }}>
              {PAGE_LABELS[p]}
              {badge && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20, fontFamily: "'DM Mono', monospace", background: badge[1][0], color: badge[1][1] }}>
                  {badge[0]}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* PAGES */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {page === 'daily'       && <Daily       state={state} dispatch={dispatch} setPage={setPage} />}
        {page === 'weekly'      && <Weekly      state={state} dispatch={dispatch} setPage={setPage} />}
        {page === 'monthly'     && <Monthly     state={state} dispatch={dispatch} setPage={setPage} />}
        {page === 'resolutions' && <Resolutions state={state} dispatch={dispatch} setPage={setPage} />}
        {page === 'partners'    && <Partners    state={state} dispatch={dispatch} setPage={setPage} />}
        {page === 'milestones'  && <Milestones  state={state} dispatch={dispatch} setPage={setPage} />}
        {page === 'summary'     && <Summary     state={state} dispatch={dispatch} setPage={setPage} />}
      </div>
    </div>
  )
}
