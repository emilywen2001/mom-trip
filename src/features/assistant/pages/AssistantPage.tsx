import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import AssistantHeader from '../components/AssistantHeader'
import BigVoiceButton from '../components/BigVoiceButton'
import SuggestedQuestions from '../components/SuggestedQuestions'

export default function AssistantPage() {
  const navigate = useNavigate()

  const goVoiceCall = (prefilled?: string) => {
    navigate(ROUTES.VOICE_CALL, { state: prefilled ? { question: prefilled } : undefined })
  }

  return (
    <div
      className="page-container relative"
      style={{
        background: 'linear-gradient(180deg, #FFFBF5 0%, #FFEDD5 100%)',
        minHeight: '100svh',
      }}
    >
      <AssistantHeader />

      <div className="flex flex-col items-center px-5">
        <p className="mt-2 text-[16px]" style={{ color: '#8B7355' }}>
          轻轻一按 · 和小桥聊聊吧
        </p>

        <div className="mt-3">
          <BigVoiceButton onClick={() => goVoiceCall()} />
        </div>

        <p className="mt-3 text-[19px] font-semibold" style={{ color: '#4A3520' }}>
          点按开始通话
        </p>
        <p className="mt-1 text-[14px]" style={{ color: '#8B7355' }}>
          或试试下面的常见问题 ⬇
        </p>

        <div className="mt-4 w-full">
          <SuggestedQuestions onSelect={(q) => goVoiceCall(q)} />
        </div>
      </div>
    </div>
  )
}
