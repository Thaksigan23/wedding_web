import { useCallback, useEffect, useRef, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'

const FADE_MS = 700
const TICK_MS = 40

/**
 * Soft looped invitation music — unlocks after door tap (user gesture).
 * Auto-plays gently when configured; mute/unmute from the control.
 */
export function AudioToggle({ className = '', unlocked = false }) {
  const { t } = useLanguage()
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const startedRef = useRef(false)
  const [muted, setMuted] = useState(wedding.audio.mutedByDefault !== false)
  const [available, setAvailable] = useState(null)
  const [srcLoaded, setSrcLoaded] = useState(false)

  const targetVolume = wedding.audio.targetVolume ?? 0.28
  const autoplayOnOpen = wedding.audio.autoplayOnOpen !== false

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
        if (pauseAtEnd) el.pause()
      }
    }, TICK_MS)
  }, [])

  const ensureSrc = useCallback(() => {
    const el = audioRef.current
    if (!el || srcLoaded) return el
    el.src = wedding.audio.src
    el.loop = true
    el.load()
    setSrcLoaded(true)
    return el
  }, [srcLoaded])

  const startPlayback = useCallback(async () => {
    const el = ensureSrc()
    if (!el) return false
    el.muted = false
    el.volume = 0
    try {
      await el.play()
      setMuted(false)
      setAvailable(true)
      fadeTo(targetVolume)
      return true
    } catch {
      setMuted(true)
      return false
    }
  }, [ensureSrc, fadeTo, targetVolume])

  // Probe + autoplay once the door unlocks (counts as a user gesture)
  useEffect(() => {
    if (!unlocked || available === false || startedRef.current) return undefined

    let cancelled = false
    const probe = new Audio()
    probe.preload = 'metadata'

    const onOk = async () => {
      if (cancelled) return
      setAvailable(true)
      if (autoplayOnOpen && wedding.audio.mutedByDefault === false) {
        startedRef.current = true
        await startPlayback()
      }
    }
    const onFail = () => {
      if (!cancelled) setAvailable(false)
    }

    probe.addEventListener('loadedmetadata', onOk)
    probe.addEventListener('error', onFail)
    probe.src = wedding.audio.src

    return () => {
      cancelled = true
      probe.removeEventListener('loadedmetadata', onOk)
      probe.removeEventListener('error', onFail)
      probe.src = ''
    }
  }, [unlocked, available, autoplayOnOpen, startPlayback])

  useEffect(() => {
    const onVis = () => {
      const el = audioRef.current
      if (!el || !srcLoaded) return
      if (document.hidden) {
        fadeTo(0, { pauseAtEnd: true })
      } else if (!muted) {
        el.play()
          .then(() => fadeTo(targetVolume))
          .catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [muted, srcLoaded, fadeTo, targetVolume])

  useEffect(() => () => clearFade(), [])

  const toggle = async () => {
    const el = ensureSrc()
    if (!el) return

    if (muted) {
      startedRef.current = true
      const ok = await startPlayback()
      if (!ok) setAvailable((prev) => (prev === false ? false : prev))
    } else {
      setMuted(true)
      fadeTo(0, { pauseAtEnd: true })
      el.muted = true
    }
  }

  if (available === false) return null
  if (!unlocked) return null

  return (
    <>
      <audio ref={audioRef} loop preload="auto" playsInline />
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-maroon-deep/55 px-3 py-1.5 font-sans text-[0.7rem] tracking-[0.12em] text-ivory backdrop-blur-md transition hover:border-gold/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
        aria-label={muted ? t(wedding.audio.labels.unmute) : t(wedding.audio.labels.mute)}
        aria-pressed={!muted}
      >
        {muted ? <IconMuted /> : <IconPlaying />}
        <span className="hidden sm:inline">
          {muted ? t(wedding.audio.labels.muted) : t(wedding.audio.labels.playing)}
        </span>
      </button>
    </>
  )
}

function IconMuted() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l5 4V6L7 10H4z" fill="currentColor" opacity="0.7" />
      <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconPlaying() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l5 4V6L7 10H4z" fill="currentColor" />
      <path
        d="M16 8c1.5 1.2 2.5 3 2.5 4s-1 2.8-2.5 4M18.5 5.5c2.2 1.8 3.5 4.2 3.5 6.5s-1.3 4.7-3.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
