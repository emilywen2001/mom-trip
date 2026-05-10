import MicSvg from './MicSvg'

interface Props {
  onClick?: () => void
}

export default function BigVoiceButton({ onClick }: Props) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
      {[0, 0.6, 1.2].map((delay, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            border: '2px solid #FFB88C',
            animation: `assistant-ping 2.4s ease-out ${delay}s infinite`,
          }}
        />
      ))}
      <button
        onClick={onClick}
        className="touchable rounded-full assistant-breath active:scale-95 transition-transform"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle at 30% 30%, #FFD3A6 0%, #FFA065 55%, #E07B3F 100%)',
          boxShadow: '0 14px 40px rgba(224, 123, 63, 0.45)',
          fontSize: 88,
          lineHeight: 1,
        }}
        aria-label="开始语音通话"
      >
        <MicSvg size={96} color="#FFFFFF" strokeWidth={2.2} />
      </button>
    </div>
  )
}
