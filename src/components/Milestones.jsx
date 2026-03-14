import { MILESTONES } from '../data/categories'

export default function Milestones({ state, dispatch, showToast }) {
  const toggle = (id) => {
    dispatch({ type: 'TOGGLE_MILESTONE', id })
    if (!state.milestones[id]) showToast('🎉 Milestone achieved! Celebrate this win!')
  }
  return (
    <div>
      <div className="page-title">Year-End Milestones</div>
      <div className="page-sub">Tap any milestone to mark it achieved — celebrate every win</div>
      <div className="ms-grid">
        {MILESTONES.map(m => {
          const achieved = !!state.milestones[m.id]
          return (
            <div key={m.id} className={`ms-item${achieved ? ' achieved' : ''}`} onClick={() => toggle(m.id)}>
              <div className="ms-icon">{m.icon}</div>
              <div>
                <div className="ms-name">{m.name}</div>
                <div className="ms-sub">{achieved ? 'Achieved!' : m.sub}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
