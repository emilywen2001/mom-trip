const LOGS = [
  {
    id: 'tl1', date: '2025.05', place: '厦门', status: 'ongoing' as const,
    feeling: '姐妹们的第一次海岛游，鼓浪屿太美了！🏝️',
    photos: ['🌊', '🏖️', '🐚'],
  },
  {
    id: 'tl2', date: '2025.03', place: '上海', status: 'done' as const,
    feeling: '外滩的夜景太美了，上海方言听着亲切 ✨',
    photos: ['🌃', '🌉', '🏙️'],
  },
  {
    id: 'tl3', date: '2024.10', place: '北京', status: 'done' as const,
    feeling: '故宫逛了整整一天，女儿也笑我走不动啦😪',
    photos: ['🏯', '🌅', '🦁'],
  },
]

const PHOTO_BG = [
  'linear-gradient(135deg,#87CEEB,#5BA3CF)',
  'linear-gradient(135deg,#FFB347,#E8944A)',
  'linear-gradient(135deg,#98D8A0,#5BAF6B)',
]

export default function TravelLogTab() {
  return (
    <div className="px-4 pt-3 pb-8">
      {LOGS.map((log, idx) => (
        <div key={log.id} className="flex gap-3 mb-6">
          {/* Dot + line */}
          <div className="flex flex-col items-center" style={{ minWidth: 20 }}>
            <div
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{
                background: log.status === 'ongoing' ? '#C8633A' : '#4A8C5C',
                boxShadow: log.status === 'ongoing' ? '0 0 0 3px rgba(200,99,58,0.2)' : undefined,
              }}
            />
            {idx < LOGS.length - 1 && (
              <div className="w-0.5 flex-1 mt-1" style={{ background: '#F0EBE3', minHeight: 40 }} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-bold" style={{ color: '#B5A696' }}>{log.date}</span>
              <span className="text-[16px] font-bold" style={{ color: '#2D2A26' }}>{log.place}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                style={{
                  background: log.status === 'ongoing' ? '#FFE8D4' : '#E2F0E8',
                  color: log.status === 'ongoing' ? '#C8633A' : '#4A8C5C',
                }}
              >
                {log.status === 'ongoing' ? '进行中' : '已完成'}
              </span>
            </div>
            <p className="text-[13px] mb-2 leading-relaxed" style={{ color: '#7B6E65' }}>{log.feeling}</p>
            <div className="flex gap-2">
              {log.photos.map((emoji, pi) => (
                <div
                  key={pi}
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-[26px]"
                  style={{ background: PHOTO_BG[pi % PHOTO_BG.length] }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
