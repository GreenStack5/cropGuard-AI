import { useEffect, useRef, useState } from 'react'

export type CameraStatus = 'starting' | 'ready' | 'capturing' | 'denied' | 'unsupported'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)
  const [status, setStatus] = useState<CameraStatus>('starting')

  const stopStream = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {})
          }
        }
        if (!cancelled) setStatus('ready')
      } catch (error) {
        if (cancelled) return
        const name = error instanceof DOMException ? error.name : ''
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setStatus('denied')
        } else {
          setStatus('unsupported')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      stopStream()
    }
  }, [])

  const capture = (): Promise<File> =>
    new Promise((resolve, reject) => {
      const video = videoRef.current
      if (!video || !video.videoWidth) {
        reject(new Error('Camera is not ready.'))
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not capture the frame.'))
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      setStatus('capturing')
      canvas.toBlob(
        (blob) => {
          setStatus('ready')
          if (!blob) {
            reject(new Error('Could not process the captured photo.'))
            return
          }
          const file = new File([blob], `camera-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })
          resolve(file)
        },
        'image/jpeg',
        0.92,
      )
    })

  return { videoRef, status, capture, stopStream, retry: () => setStatus('starting') }
}