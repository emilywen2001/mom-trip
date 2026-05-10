import { useState, useRef } from 'react'
import { Camera, Image, Film, Mic, RefreshCw } from 'lucide-react'
import BigButton from '../../components/ui/BigButton'
import { mediaApi } from '../../services/api'
import { useTripStore } from '../../store/tripStore'

const MOCK_GALLERY = [
  { id: '1', url: 'https://picsum.photos/seed/trip1/300/300', place: '鼓浪屿' },
  { url: 'https://picsum.photos/seed/trip2/300/300', id: '2', place: '中山路' },
  { url: 'https://picsum.photos/seed/trip3/300/400', id: '3', place: '南普陀' },
  { url: 'https://picsum.photos/seed/trip4/300/300', id: '4', place: '曾厝垵' },
  { url: 'https://picsum.photos/seed/trip5/300/350', id: '5', place: '海边' },
  { url: 'https://picsum.photos/seed/trip6/300/300', id: '6', place: '厦大' },
]

export default function CameraPage() {
  const { currentTrip } = useTripStore()
  const [tab, setTab] = useState<'shoot' | 'gallery' | 'video'>('shoot')
  const [cameraActive, setCameraActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [lastPhoto, setLastPhoto] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraActive(true)
    } catch {
      alert('无法访问摄像头，请检查权限设置')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setCameraActive(false)
  }

  const takePhoto = async () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setLastPhoto(dataUrl)
    navigator.vibrate?.(50)

    // Upload
    setUploading(true)
    try {
      const blob = await fetch(dataUrl).then((r) => r.blob())
      const form = new FormData()
      form.append('file', blob, 'photo.jpg')
      form.append('tripId', currentTrip?.id ?? 't_001')
      form.append('mediaType', 'photo')
      await mediaApi.upload(form)
    } catch {
      // silent fail in demo
    } finally {
      setUploading(false)
    }
  }

  const tabs = [
    { key: 'shoot',   icon: Camera, label: '拍摄' },
    { key: 'gallery', icon: Image,  label: '相册' },
    { key: 'video',   icon: Film,   label: '视频' },
  ]

  return (
    <div className="page-container" style={{ background: '#1A1A1A' }}>
      {/* Tab bar */}
      <div className="flex pt-12 px-4 pb-3 gap-2">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => { if (tab !== t.key) { stopCamera(); setTab(t.key as typeof tab) } }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-semibold flex-1 justify-center"
              style={{
                background: active ? '#C8633A' : 'rgba(255,255,255,0.1)',
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
              }}
            >
              <Icon size={16} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Shoot tab */}
      {tab === 'shoot' && (
        <div className="flex flex-col items-center">
          {/* Camera preview */}
          <div
            className="w-full relative overflow-hidden"
            style={{ height: '60vw', maxHeight: 320, background: '#2A2A2A' }}
          >
            {cameraActive ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Camera size={48} color="rgba(255,255,255,0.3)" />
                <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>点击下方开启相机</p>
              </div>
            )}
            {lastPhoto && (
              <div className="absolute bottom-3 right-3 w-16 h-16 rounded-xl overflow-hidden border-2 border-white">
                <img src={lastPhoto} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-12 mt-8 px-8">
            <button
              onClick={cameraActive ? stopCamera : () => {}}
              className="w-12 h-12 rounded-full flex items-center justify-center touchable"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <RefreshCw size={20} color="white" />
            </button>

            {/* Shutter */}
            <button
              onClick={cameraActive ? takePhoto : startCamera}
              className="w-20 h-20 rounded-full flex items-center justify-center touchable"
              style={{ background: 'white', border: '4px solid rgba(255,255,255,0.5)' }}
              disabled={uploading}
            >
              {uploading ? (
                <div className="w-8 h-8 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              ) : cameraActive ? (
                <div className="w-14 h-14 rounded-full" style={{ background: '#C8633A' }} />
              ) : (
                <Camera size={28} color="#C8633A" />
              )}
            </button>

            <button
              className="w-12 h-12 rounded-full flex items-center justify-center touchable"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Mic size={20} color="white" />
            </button>
          </div>
          <p className="text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {cameraActive ? '点击圆圈拍照' : '点击圆圈开启相机'}
          </p>
        </div>
      )}

      {/* Gallery tab */}
      {tab === 'gallery' && (
        <div className="px-4">
          <p className="text-[13px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            本次旅行 · {MOCK_GALLERY.length} 张
          </p>
          <div className="columns-2 gap-2">
            {MOCK_GALLERY.map((photo) => (
              <div key={photo.id} className="mb-2 rounded-2xl overflow-hidden relative">
                <img src={photo.url} alt="" className="w-full object-cover" />
                <div
                  className="absolute bottom-0 left-0 right-0 px-2 py-1"
                  style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }}
                >
                  <p className="text-[11px] text-white">📍 {photo.place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video tab */}
      {tab === 'video' && (
        <div className="px-4 flex flex-col items-center">
          <div
            className="w-full rounded-3xl flex flex-col items-center justify-center gap-4 my-8 p-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px dashed rgba(255,255,255,0.2)' }}
          >
            <Film size={48} color="rgba(255,255,255,0.4)" />
            <p className="text-[16px] font-semibold text-white text-center">旅行结束后，一键生成专属视频</p>
            <p className="text-[13px] text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
              AI 自动剪辑你的旅行照片，配上音乐，生成精美回忆视频
            </p>
          </div>
          <div className="w-full space-y-3">
            <p className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>选择风格</p>
            <div className="grid grid-cols-2 gap-3">
              {['🌅 温馨回忆', '🎉 活泼欢快'].map((s) => (
                <button
                  key={s}
                  className="py-4 rounded-2xl text-[14px] font-semibold"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <BigButton>✨ 生成旅行视频</BigButton>
          </div>
        </div>
      )}
    </div>
  )
}
