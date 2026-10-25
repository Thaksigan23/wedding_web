import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { useAudio } from '../context/AudioContext'

export function AudioToggle({ className = '' }) {
  const { t } = useLanguage()
  const { muted, playing, available, toggle } = useAudio()

  if (available === false) return null

  const isMuted = muted || !playing

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-maroon-deep/55 px-3 py-1.5 font-sans text-[0.7rem] tracking-[0.12em] text-ivory backdrop-blur-md transition hover:border-gold/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
      aria-label={isMuted ? t(wedding.audio.labels.unmute) : t(wedding.audio.labels.mute)}
      aria-pressed={!isMuted}
    >
      {isMuted ? <IconMuted /> : <IconPlaying />}
      <span className="hidden sm:inline">
        {isMuted ? t(wedding.audio.labels.muted) : t(wedding.audio.labels.playing)}
      </span>
    </button>
  )
}

export function IconMuted() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l5 4V6L7 10H4z" fill="currentColor" opacity="0.7" />
      <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconPlaying() {
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
