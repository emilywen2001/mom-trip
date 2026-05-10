import { useRef, useState, useCallback } from 'react'
import { mediaApi } from '@/shared/api/mediaApi'
import { useTripStore } from '@/shared/store/useTripStore'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [lastPhoto, setLastPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const { currentTrip } = useTripStore()

  const startCamera = useCallback(async (facing?: 'user' | 'environment') => {
    const mode = facing ?? facingMode
    try {
      // 先停掉旧流
      streamRef.current?.getTracks().forEach((t) => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1920 } },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraActive(true)
    } catch {
      // 权限被拒时静默处理，页面层统一引导
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }, [])

  const flipCamera = useCallback(() => {
    const next = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(next)
    startCamera(next)
    navigator.vibrate?.(30)
  }, [facingMode, startCamera])

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !cameraActive) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 如果有 CSS filter，在 canvas 上也应用
    const filterCSS = video.style.filter
    if (filterCSS && filterCSS !== 'none') {
      ctx.filter = filterCSS
    }
    ctx.drawImage(video, 0, 0)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setLastPhoto(dataUrl)
    navigator.vibrate?.(50)

    // 异步上传
    setUploading(true)
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const form = new FormData()
        form.append('file', blob, 'photo.jpg')
        form.append('tripId', currentTrip?.id ?? 't_001')
        form.append('mediaType', 'photo')
        return mediaApi.upload(form)
      })
      .catch(() => { /* silent in demo */ })
      .finally(() => setUploading(false))

    return dataUrl
  }, [cameraActive, currentTrip])

  return {
    videoRef,
    cameraActive,
    lastPhoto,
    uploading,
    facingMode,
    startCamera,
    stopCamera,
    flipCamera,
    takePhoto,
  }
}
