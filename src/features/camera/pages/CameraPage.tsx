import { useState, useRef } from 'react'
import { Camera, Image, Film } from 'lucide-react'
import BigButton from '@/shared/components/BigButton'
import { mediaApi } from '@/shared/api/mediaApi'
import { useTripStore } from '@/shared/store/useTripStore'
import CameraPreview from '../components/CameraPreview'
import CaptureButton from '../components/CaptureButton'
import TripGallery from '../components/TripGallery'

const tabs = [
  { key: 'shoot',   icon: Camera, label: '拍摄' },
  { key: 'gallery', icon: Image,  label: '相册' },
  { key: 'video',   icon: Film,   label: '视频' },
] as const

type TabKey = typeof tabs[number]['key']

export default function CameraPage() {
  const { currentTrip } = useTripStore()
  const [tab, setTab] = useState<TabKey>('shoot')
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
              onClick={() => { if (tab !== t.key) { stopCamera(); setTab(t.key) } }}
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

      {tab === 'shoot' && (
        <div className="flex flex-col items-center">
          <CameraPreview
            cameraActive={cameraActive}
            videoRef={videoRef}
            lastPhoto={lastPhoto}
          />
          <CaptureButton
            cameraActive={cameraActive}
            uploading={uploading}
            onStart={startCamera}
            onCapture={takePhoto}
          />
          <p className="text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {cameraActive ? '点击圆圈拍照' : '点击圆圈开启相机'}
          </p>
        </div>
      )}

      {tab === 'gallery' && <TripGallery />}

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
