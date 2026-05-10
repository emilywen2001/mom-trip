import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Sparkles, X } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SmartParserSheet({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleParse = async () => {
    const trimmed = url.trim()
    if (!trimmed) return
    setError('')
    setLoading(true)
    try {
      // V1：豆包语音模型接入后再补真实解析 API；当前先做占位跳转
      await new Promise((r) => setTimeout(r, 1200))
      onClose()
      navigate(ROUTES.ITINERARY, { state: { fromParser: true, url: trimmed } })
    } catch {
      setError('链接格式不对吧~ 试试别的')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ background: 'rgba(74, 53, 32, 0.4)', zIndex: 80 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] px-5 pt-3 pb-8"
        style={{ background: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-2">
          <span className="rounded-full" style={{ width: 40, height: 4, background: '#E5DCC9' }} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} color="#E07B3F" />
            <h2 className="text-[18px] font-semibold" style={{ color: '#4A3520' }}>智能解析</h2>
          </div>
          <button onClick={onClose} className="touchable rounded-full" style={{ width: 32, height: 32 }}>
            <X size={18} color="#8B7355" />
          </button>
        </div>

        <p className="text-[13px] mb-4" style={{ color: '#8B7355' }}>
          复制笔记链接，自动解析成行程
        </p>

        <div
          className="flex items-center gap-2 px-3 mb-4"
          style={{ height: 48, background: '#FFF4E6', borderRadius: 24 }}
        >
          <button
            className="flex items-center gap-1 px-2 text-[13px] font-medium"
            style={{ color: '#E07B3F' }}
          >
            小红书
            <ChevronDown size={14} />
          </button>
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            placeholder="粘贴链接..."
            className="flex-1 bg-transparent outline-none text-[14px]"
            style={{ color: '#4A3520' }}
          />
          {url && (
            <button onClick={() => setUrl('')} className="touchable" style={{ width: 24, height: 24 }}>
              <X size={14} color="#8B7355" />
            </button>
          )}
        </div>

        {error && (
          <p className="text-[13px] mb-3" style={{ color: '#E87A6F' }}>{error}</p>
        )}

        <button
          onClick={handleParse}
          disabled={!url.trim() || loading}
          className="touchable w-full text-[16px] font-semibold"
          style={{
            height: 48,
            borderRadius: 24,
            background: url.trim() && !loading
              ? 'linear-gradient(90deg, #FF9A56 0%, #E07B3F 100%)'
              : '#F0EBE3',
            color: url.trim() && !loading ? '#FFFFFF' : '#B5A696',
          }}
        >
          {loading ? '正在解析...' : '解析'}
        </button>
      </div>
    </div>
  )
}
