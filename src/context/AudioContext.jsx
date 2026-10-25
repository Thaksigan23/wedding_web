import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { wedding } from '../data/wedding'

const FADE_MS = 700
const TICK_MS = 40

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const startedRef = useRef(false)
  const [muted, setMuted] = useState(wedding.audio.mutedByDefault !== false)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(null)

  const targetVolume = wedding.audio.targetVolume ?? 0.28

  const clearFade = () => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }

  const fadeTo = useCallback((to, { pauseAtEnd = false } = {}) => {
    const el = audioRef.current
    if (!el) return
    clearFade()
    const from = el.volume
    const steps = Math.max(1, Math.round(FADE_MS / TICK_MS))
    let step = 0
    fadeRef.current = setInterval(() => {
      step += 1
      const next = from + ((to - from) * step) / steps
      el.volume = Math.min(1, Math.max(0, next))
      if (step >= steps) {
        clearFade()
        el.volume = to
        if (pauseAtEnd) {
          el.pause()
          setPlaying(false)
        }
      }
    }, TICK_MS)
  }, [])

  const startPlayback = useCallback(async () => {
    const el = audioRef.current
    if (!el) return false
    el.muted = false
    el.volume = 0
    try {
      await el.play()
      setPlaying(true)
      setMuted(false)
      setAvailable(true)
      startedRef.current = true
      fadeTo(targetVolume)
      return true
    } catch {
      setMuted(true)
      setPlaying(false)
      return false
    }
  }, [fadeTo, targetVolume])

  const pausePlayback = useCallback(() => {
    setMuted(true)
    fadeTo(0, { pauseAtEnd: true })
  }, [fadeTo])

  const toggle = useCallback(async () => {
    const el = audioRef.current
    if (!el) return
    if (muted || !playing) {
      await startPlayback()
    } else {
      pausePlayback()
    }
  }, [muted, playing, startPlayback, pausePlayback])

  // Try autoplay on mount + fallback to first interaction
  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    let cancelled = false
    el.src = wedding.audio.src
    el.loop = true
    el.preload = 'auto'

    const onCanPlay = () => {
      if (!cancelled) setAvailable(true)
    }
    const onError = () => {
      if (!cancelled) setAvailable(false)
    }

    el.addEventListener('canplaythrough', onCanPlay)
    el.addEventListener('error', onError)
    el.load()

    const attemptAutoplay = async () => {
      if (cancelled || startedRef.current) return
      try {
        el.volume = 0
        el.muted = false
        await el.play()
        if (cancelled) {
          el.pause()
          return
        }
        startedRef.current = true
        setPlaying(true)
        setMuted(false)
        setAvailable(true)
        fadeTo(targetVolume)
      } catch {
        // Autoplay policy prevented immediate playback: attach listener for the very first gesture
        const onFirstGesture = async () => {
          window.removeEventListener('pointerdown', onFirstGesture)
          window.removeEventListener('touchstart', onFirstGesture)
          window.removeEventListener('click', onFirstGesture)
          window.removeEventListener('keydown', onFirstGesture)
          if (cancelled || startedRef.current) return
          await startPlayback()
        }
        window.addEventListener('pointerdown', onFirstGesture, { passive: true })
        window.addEventListener('touchstart', onFirstGesture, { passive: true })
        window.addEventListener('click', onFirstGesture, { passive: true })
        window.addEventListener('keydown', onFirstGesture, { passive: true })
      }
    }

    attemptAutoplay()

    return () => {
      cancelled = true
      clearFade()
      el.removeEventListener('canplaythrough', onCanPlay)
      el.removeEventListener('error', onError)
    }
  }, [fadeTo, startPlayback, targetVolume])

  // Page visibility: fade out when tab hidden, resume when tab visible
  useEffect(() => {
    const onVis = () => {
      const el = audioRef.current
      if (!el || !startedRef.current) return
      if (document.hidden) {
        fadeTo(0, { pauseAtEnd: true })
      } else if (!muted) {
        el.play()
          .then(() => {
            setPlaying(true)
            fadeTo(targetVolume)
          })
          .catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [muted, fadeTo, targetVolume])

  return (
    <AudioContext.Provider value={{ muted, playing, available, toggle, startPlayback, pausePlayback }}>
      <audio ref={audioRef} loop preload="auto" playsInline />
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) {
    return {
      muted: true,
      playing: false,
      available: false,
      toggle: () => {},
      startPlayback: () => {},
      pausePlayback: () => {},
    }
  }
  return ctx
}
