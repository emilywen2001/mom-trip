import { useState } from 'react'

interface CheckItem { id: string; text: string; done: boolean }

const INITIAL: CheckItem[] = [
  { id: 'c1',  text: '酒店（厦门海景大酒店）', done: true  },
  { id: 'c2',  text: '去程火车票',              done: true  },
  { id: 'c3',  text: '返程火车票',              done: false },
  { id: 'c4',  text: '鼓浪屿船票',              done: false },
  { id: 'c5',  text: '厦门大学预约',            done: false },
  { id: 'c6',  text: '身份证',                  done: true  },
  { id: 'c7',  text: '充电宝',                  done: true  },
  { id: 'c8',  text: '防晒霜',                  done: false },
  { id: 'c9',  text: '雨伞',                    done: false },
  { id: 'c10', text: '常用药品',                done: true  },
]

const SECTIONS: { title: string; ids: string[] }[] = [
  { title: '📋 预订确认', ids: ['c1', 'c2', 'c3', 'c4', 'c5'] },
  { title: '🎒 出行准备', ids: ['c6', 'c7', 'c8', 'c9', 'c10'] },
]

const ALL_SECTION_IDS = SECTIONS.flatMap((s) => s.ids)

export default function ChecklistCard() {
  const [items, setItems] = useState<CheckItem[]>(INITIAL)
  const [newText, setNewText] = useState('')

  const toggle = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))

  const addItem = () => {
    if (!newText.trim()) return
    setItems((prev) => [...prev, { id: `c_${Date.now()}`, text: newText.trim(), done: false }])
    setNewText('')
  }

  const extraItems = items.filter((i) => !ALL_SECTION_IDS.includes(i.id))

  return (
    <div className="px-4 pt-3 pb-8">
      {SECTIONS.map((sec) => {
        const secItems = sec.ids.map((id) => items.find((i) => i.id === id)!).filter(Boolean)
        const doneCount = secItems.filter((i) => i.done).length
        return (
          <div key={sec.title} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[14px] font-bold" style={{ color: '#4A3F35' }}>{sec.title}</p>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#F0EBE3', color: '#7B6E65' }}
              >
                {doneCount}/{secItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {secItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left active:scale-[0.98] transition-transform"
                  style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: item.done ? '#4A8C5C' : 'transparent',
                      border: `2px solid ${item.done ? '#4A8C5C' : '#F0EBE3'}`,
                    }}
                  >
                    {item.done && <span className="text-[12px] text-white font-bold">✓</span>}
                  </div>
                  <span
                    className="text-[14px] font-semibold flex-1"
                    style={{
                      color: item.done ? '#B5A696' : '#2D2A26',
                      textDecoration: item.done ? 'line-through' : 'none',
                    }}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Extra items */}
      {extraItems.length > 0 && (
        <div className="mb-4">
          <p className="text-[14px] font-bold mb-2" style={{ color: '#4A3F35' }}>📝 其他</p>
          <div className="space-y-2">
            {extraItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left active:scale-[0.98] transition-transform"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.done ? '#4A8C5C' : 'transparent',
                    border: `2px solid ${item.done ? '#4A8C5C' : '#F0EBE3'}`,
                  }}
                >
                  {item.done && <span className="text-[12px] text-white font-bold">✓</span>}
                </div>
                <span
                  className="text-[14px] font-semibold flex-1"
                  style={{
                    color: item.done ? '#B5A696' : '#2D2A26',
                    textDecoration: item.done ? 'line-through' : 'none',
                  }}
                >
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add row */}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 rounded-xl px-4 py-3 text-[13px]"
          style={{ background: '#FFFFFF', border: '2px solid #F0EBE3', outline: 'none', color: '#2D2A26' }}
          placeholder="添加新的待办…"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button
          onClick={addItem}
          className="px-4 py-3 rounded-xl text-[13px] font-bold text-white active:scale-95 transition-transform"
          style={{ background: '#C8633A' }}
        >
          添加
        </button>
      </div>
    </div>
  )
}
