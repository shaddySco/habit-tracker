import { useRef } from 'react'
import { VISION_PROMPTS } from '../data/categories'

export function Vision({ state, dispatch }) {
  const fileRefs = useRef({})

  const handleImg = (i, e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => dispatch({ type: 'SET_VISION_IMG', idx: i, src: ev.target.result })
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="page-title">Vision Board</div>
      <div className="page-sub">Upload images and write your quarterly goals — keep your why visible</div>
      <div className="vis-grid">
        {VISION_PROMPTS.map((prompt, i) => {
          const v = state.vision['q' + (i + 1)] || {}
          return (
            <div key={i} className="vis-card">
              <div className="vis-img-area" onClick={() => fileRefs.current[i]?.click()}>
                {v.img
                  ? <img src={v.img} alt={prompt} />
                  : <div className="vis-placeholder"><span className="vis-plus">+</span>Add image</div>}
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  ref={el => fileRefs.current[i] = el}
                  onChange={e => handleImg(i, e)} />
              </div>
              <div className="vis-body">
                <div className="vis-q">{prompt}</div>
                <input className="vis-input" type="text" placeholder="Write your goal here..."
                  value={v.text || ''}
                  onChange={e => dispatch({ type: 'SET_VISION_TEXT', idx: i, text: e.target.value })} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
