import EmergencyButton from '@/shared/components/EmergencyButton'
import { useUserStore } from '@/shared/store/useUserStore'

function greeting() {
  const h = new Date().getHours()
  if (h < 6)  return { text: '夜深了，注意休息', emoji: '🌙' }
  if (h < 12) return { text: '早上好', emoji: '☀️' }
  if (h < 18) return { text: '下午好', emoji: '🌤️' }
  return { text: '晚上好', emoji: '🌙' }
}

interface Props {
  dayInfo?: { currentDay: number; totalDays: number }
}

export default function GreetingCard({ dayInfo }: Props) {
  const { user } = useUserStore()
  const g = greeting()
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-[20px] font-bold text-white leading-tight">
          {user?.name}，{g.text} {g.emoji}
        </h1>
        {dayInfo && (
          <p className="text-[13px] text-white/80 mt-0.5">
            第 {dayInfo.currentDay} 天 · 还有 {dayInfo.totalDays - dayInfo.currentDay + 1} 天结束
          </p>
        )}
      </div>
      <EmergencyButton />
    </div>
  )
}
