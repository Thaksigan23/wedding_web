import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'
import { LanguageToggle } from './LanguageToggle'
import { CoverCountdown } from './Countdown'

const DOOR_MS = 1.85
const EASE_OUT = [0.16, 1, 0.3, 1]

function makeRings(count) {
  return Array.from({ length: count }, (_, i) => {
    const onLeft = i % 2 === 0
    return {
      id: i,
      left: onLeft ? `${5 + ((i * 7) % 12)}%` : `${83 + ((i * 5) % 10)}%`,
      top: `${-12 + ((i * 31) % 96)}%`,
      delay: (i % 8) * 2.35,
      duration: 20 + (i % 6) * 3.4,
      size: 26 + (i % 5) * 6,
      drift: onLeft ? 10 + (i % 4) * 5 : -(10 + (i % 4) * 5),
      rotate: onLeft ? 16 + (i % 5) * 8 : -(18 + (i % 5) * 7),
      opacity: 0.18 + (i % 5) * 0.02,
    }
  })
}

function coupleInitials() {
  const letter = (name) => {
    const cleaned = String(name || '')
      .replace(/[[\]]/g, '')
      .trim()
    return cleaned.charAt(0).toUpperCase() || '·'
  }
  return {
    bride: letter(wedding.bride.name.en),
    groom: letter(wedding.groom.name.en),
  }
}

function displayEn(name) {
  return String(name || '').replace(/^\[|\]$/g, '') || name
}

function formatInviteDate(iso, lang = 'en') {
  const monthsEn = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ]
  const monthsTa = [
    'ஜனவரி',
    'பிப்ரவரி',
    'மார்ச்',
    'ஏப்ரல்',
    'மே',
    'ஜூன்',
    'ஜூலை',
    'ஆகஸ்ட்',
    'செப்டம்பர்',
    'அக்டோபர்',
    'நவம்பர்',
    'டிசம்பர்',
  ]
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  const months = lang === 'ta' ? monthsTa : monthsEn
  const month = months[Number(m[2]) - 1] || ''
  return `${Number(m[3])}  •  ${month}  •  ${m[1]}`
}

/**
 * Invitation cover — gold-on-maroon ceremonial opening screen.
 */
export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [opening, setOpening] = useState(false)
  const coverRef = useRef(null)
  const initials = useMemo(() => coupleInitials(), [])
  const dateLabel = useMemo(
    () => formatInviteDate(wedding.muhurtham.datetime, lang),
    [lang],
  )

  useEffect(() => {
    if (open) return undefined
    const html = document.documentElement
    const body = document.body
    const cover = coverRef.current
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    const stopScroll = (event) => event.preventDefault()
    cover?.addEventListener('wheel', stopScroll, { passive: false })
    cover?.addEventListener('touchmove', stopScroll, { passive: false })
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
      cover?.removeEventListener('wheel', stopScroll)
      cover?.removeEventListener('touchmove', stopScroll)
    }
  }, [open])

  const handleOpen = useCallback(() => {
    if (opening) return
    setOpening(true)
    window.setTimeout(
      () => onOpen(),
      reduced ? 60 : Math.round(DOOR_MS * 1000 * 0.62),
    )
  }, [opening, onOpen, reduced])

  const fade = (delay) => ({
    initial: reduced ? false : { opacity: 0, y: 10 },
    animate: opening
      ? { opacity: 0, y: -10 }
      : { opacity: 1, y: 0 },
    transition: {
      duration: opening ? 0.42 : 0.85,
      delay: opening ? 0.28 : delay,
      ease: EASE_OUT,
    },
  })

  const brideEn = displayEn(wedding.bride.name.en)
  const groomEn = displayEn(wedding.groom.name.en)

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          ref={coverRef}
          className="invite-cover"
          onClick={handleOpen}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
        >
          <CornerFlorals />
          <CoverRings reduced={reduced} />

          <div
            className="invite-cover-bar"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="invite-cover-bar-spacer" aria-hidden="true" />
            <p className="invite-cover-mark">
              {initials.bride} <span>&</span> {initials.groom}
            </p>
            <span className="invite-cover-bar-spacer" aria-hidden="true" />
          </div>

          <div
            className="invite-cover-lang-dock"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <LanguageToggle vertical compact className="invite-cover-lang" />
          </div>

          <div className="invite-cover-content">
            <motion.p
              {...fade(0.08)}
              className={`invite-cover-together ${lang === 'en' ? 'is-en' : ''}`}
            >
              {lang === 'ta' ? wedding.togetherWith.ta : wedding.togetherWith.en}
            </motion.p>

            <motion.div {...fade(0.16)} className="invite-cover-names">
              <h1 className={lang === 'en' ? 'is-script' : undefined}>
                <span className="invite-cover-name">
                  {lang === 'ta' ? wedding.bride.name.ta : brideEn}
                </span>
                <span className="sr-only">{lang === 'ta' ? 'மற்றும்' : 'and'}</span>
                <span className="invite-cover-amp" aria-hidden="true">
                  &
                </span>
                <span className="invite-cover-name">
                  {lang === 'ta' ? wedding.groom.name.ta : groomEn}
                </span>
              </h1>
            </motion.div>

            <motion.p
              {...fade(0.24)}
              className={`invite-cover-invite ${lang === 'en' ? 'is-en' : ''}`}
            >
              {lang === 'ta' ? wedding.invitationTitle.ta : wedding.invitationTitle.en}
            </motion.p>

            <SealedEnvelope
              bride={initials.bride}
              groom={initials.groom}
              lang={lang}
              opening={opening}
              reduced={reduced}
              onOpen={handleOpen}
            />

            <motion.p
              {...fade(0.4)}
              className={`invite-cover-date ${lang === 'ta' ? 'is-ta' : ''}`}
            >
              {dateLabel}
            </motion.p>

            <motion.div {...fade(0.48)}>
              <OpenInviteButton
                lang={lang}
                onOpen={handleOpen}
                reduced={reduced}
                opening={opening}
              />
            </motion.div>
          </div>

          <div className="invite-cover-countdown-wrap" onClick={(e) => e.stopPropagation()}>
            <CoverCountdown />
            <a
              className="invite-cover-credit"
              href={wedding.footer.creditUrl || 'https://techloom.ai'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Powered by Techloom.ai
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Sparse gold interlocking rings that drift behind cover text. */
function CoverRings({ reduced }) {
  const rings = useMemo(() => makeRings(12), [])

  return (
    <div className="invite-cover-rings-flow" aria-hidden="true">
      {rings.map((ring) => (
        <span
          key={ring.id}
          className={`invite-cover-flow-ring${reduced ? ' is-static' : ''}`}
          style={{
            left: ring.left,
            top: reduced ? `${8 + ((ring.id * 17) % 64)}%` : ring.top,
            width: `${ring.size}px`,
            opacity: ring.opacity,
            animationDelay: `${ring.delay}s`,
            animationDuration: `${ring.duration}s`,
            '--ring-drift': `${ring.drift}px`,
            '--ring-rotate': `${ring.rotate}deg`,
          }}
        >
          <CoverRingMark />
        </span>
      ))}
    </div>
  )
}

function CoverRingMark() {
  return (
    <svg viewBox="0 0 90 48" fill="none" aria-hidden="true">
      <g transform="rotate(-28 34 24)">
        <ellipse cx="34" cy="24" rx="20" ry="13" stroke="#E8CD83" strokeWidth="3.2" />
      </g>
      <g transform="rotate(28 56 24)">
        <ellipse cx="56" cy="24" rx="20" ry="13" stroke="#C9A04B" strokeWidth="3.2" />
      </g>
    </svg>
  )
}

function SealedEnvelope({ bride, groom, lang, opening, reduced, onOpen }) {
  const uid = useId().replace(/:/g, '')

  return (
    <button
      type="button"
      className={`invite-envelope${opening ? ' is-opening' : ''}${reduced ? ' is-reduced' : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
      aria-label={lang === 'ta' ? 'அழைப்பிதழைத் திறக்க உறையைத் திறக்கவும்' : 'Open the sealed envelope'}
    >
      <span className="invite-envelope-stage">
        <svg className="invite-envelope-back" viewBox="0 0 280 186" aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-body`} x1="18%" y1="0%" x2="82%" y2="100%">
              <stop offset="0%" stopColor="#8a1a28" />
              <stop offset="48%" stopColor="#5b0b18" />
              <stop offset="100%" stopColor="#3a070e" />
            </linearGradient>
            <linearGradient id={`${uid}-top`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#9a2232" />
              <stop offset="100%" stopColor="#6a101c" />
            </linearGradient>
          </defs>
          <rect x="28" y="58" width="224" height="112" rx="8" fill={`url(#${uid}-body)`} />
          <rect
            x="28"
            y="58"
            width="224"
            height="112"
            rx="8"
            fill="none"
            stroke="#c9a052"
            strokeWidth="1.4"
          />
          <g className="invite-envelope-top">
            <path d="M28 58 L140 8 L252 58 Z" fill={`url(#${uid}-top)`} />
            <path
              d="M28 58 L140 8 L252 58"
              fill="none"
              stroke="#c9a052"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        <span className="invite-envelope-letter" aria-hidden="true">
          <span className="invite-envelope-letter-rule" />
          <span className="invite-envelope-letter-mark">
            {bride} & {groom}
          </span>
          <span className="invite-envelope-letter-rule" />
        </span>

        <svg className="invite-envelope-pocket" viewBox="0 0 280 186" aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-pocket`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#7a1522" />
              <stop offset="100%" stopColor="#3a070e" />
            </linearGradient>
          </defs>
          <path
            d="M28 58 L140 132 L252 58 L252 162 Q252 170 244 170 L36 170 Q28 170 28 162 Z"
            fill={`url(#${uid}-pocket)`}
          />
          <path
            d="M28 58 L140 132 L252 58"
            fill="none"
            stroke="#e8d19a"
            strokeWidth="1"
            opacity="0.45"
          />
          <path
            d="M28 58 L252 58 L252 162 Q252 170 244 170 L36 170 Q28 170 28 162 Z"
            fill="none"
            stroke="#c9a052"
            strokeWidth="1.35"
          />
        </svg>

        <span className="invite-envelope-flap-back" aria-hidden="true">
          <svg viewBox="0 0 224 60">
            <defs>
              <linearGradient id={`${uid}-lining`} x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#f8ebd7" />
                <stop offset="100%" stopColor="#e8d19a" />
              </linearGradient>
            </defs>
            <path d="M0 60 L112 0 L224 60 Z" fill={`url(#${uid}-lining)`} />
            <path
              d="M14 56 L112 10 L210 56"
              fill="none"
              stroke="#c9a052"
              strokeWidth="1.1"
              opacity="0.75"
            />
            <path
              d="M0 60 L112 0 L224 60"
              fill="none"
              stroke="#c9a052"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span className="invite-envelope-flap">
          <svg className="invite-envelope-flap-face" viewBox="0 0 224 60" aria-hidden="true">
            <defs>
              <linearGradient id={`${uid}-flap`} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#6a101c" />
                <stop offset="100%" stopColor="#4e0c16" />
              </linearGradient>
            </defs>
            <path d="M0 0 L224 0 L112 60 Z" fill={`url(#${uid}-flap)`} />
            <path
              d="M0 0 L224 0 L112 60 Z"
              fill="none"
              stroke="#c9a052"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
          </svg>
          <span className="invite-envelope-seal">
            <span className="invite-envelope-seal-text">
              {bride} {groom}
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}

function OpenInviteButton({ lang, onOpen, reduced, opening }) {
  return (
    <button
      type="button"
      className="invite-cover-cta"
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      aria-label={lang === 'ta' ? 'அழைப்பிதழைத் திறக்க தட்டவும்' : 'Open invitation'}
    >
      <ButtonFlourish className="invite-cover-cta-flourish -scale-x-100" />
      <span className="invite-cover-cta-inner">
        <LotusIcon className="h-3.5 w-3.5 shrink-0 text-[#310409]" />
        <span className={lang === 'ta' ? 'font-tamil' : ''}>
          {lang === 'ta' ? 'அழைப்பிதழை திற' : 'Open Invitation'}
        </span>
      </span>
      <ButtonFlourish className="invite-cover-cta-flourish" />
      {!reduced && !opening && <span className="invite-cover-cta-glow" aria-hidden="true" />}
    </button>
  )
}

function GoldFrame() {
  return (
    <div className="invite-cover-frame" aria-hidden="true">
      <div className="invite-cover-frame-outer" />
      <div className="invite-cover-frame-inner" />
      <FrameCorners />
    </div>
  )
}

function FrameCorners() {
  const corners = [
    'left-0 top-0',
    'right-0 top-0 scale-x-[-1]',
    'left-0 bottom-0 scale-y-[-1]',
    'right-0 bottom-0 scale-[-1]',
  ]
  return (
    <div className="pointer-events-none absolute inset-[10px] z-[2] sm:inset-[16px] md:inset-[20px]">
      {corners.map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 92 92"
          className={`absolute h-12 w-12 text-[#C9A04B]/80 sm:h-[4.25rem] sm:w-[4.25rem] ${pos}`}
          fill="none"
        >
          <path
            d="M4 88V20Q4 4 20 4h68M8 61V22Q8 8 22 8h39M12 39V24Q12 12 24 12h15"
            stroke="currentColor"
            strokeWidth="1.15"
          />
          <path
            d="M13 20q9-2 9-11m-8 17q12-2 12-14m-2 17q10-2 11-12"
            stroke="currentColor"
            strokeWidth=".75"
          />
          <path d="M6 18c6-1 11-6 12-12" stroke="currentColor" strokeWidth=".8" />
        </svg>
      ))}
    </div>
  )
}

function VerticalAxis() {
  return (
    <div className="invite-cover-axis" aria-hidden="true">
      <span className="invite-cover-axis-line" />
      <AxisJewel className="invite-cover-axis-node top-[2.2%]" />
      <AxisLotus className="invite-cover-axis-node top-[18%]" />
      <AxisJewel className="invite-cover-axis-node top-[34%]" />
      <AxisJewel className="invite-cover-axis-node bottom-[28%]" />
      <AxisLotus className="invite-cover-axis-node bottom-[14%]" />
      <AxisJewel className="invite-cover-axis-node bottom-[3%]" />
    </div>
  )
}

function AxisJewel({ className = '' }) {
  return (
    <svg
      viewBox="0 0 18 18"
      className={`mx-auto h-3 w-3 text-[#E8CD83] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M9 1.4 15.4 9 9 16.6 2.6 9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="9" cy="9" r="1.35" fill="currentColor" />
    </svg>
  )
}

function AxisLotus({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`mx-auto h-3.5 w-3.5 text-[#C9A04B] ${className}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3c-2.3 2.4-3.5 4.6-3.5 6.6 0 1.6 1.3 2.8 3.5 3.3 2.2-.5 3.5-1.7 3.5-3.3C15.5 7.6 14.3 5.4 12 3ZM5 8c-.4 3.2.4 5.3 2.3 6.4 1.1.6 2.3.7 3.6.3C9 11.8 7 9.6 5 8Zm14 0c-2 1.6-4 3.8-5.9 6.7 1.3.4 2.5.3 3.6-.3C18.6 13.3 19.4 11.2 19 8ZM3 14c2 4.4 5 6.6 9 6.6s7-2.2 9-6.6c-2.4 1.6-5.4 2.4-9 2.4S5.4 15.6 3 14Z" />
    </svg>
  )
}

function CornerFlorals() {
  return (
    <div className="invite-cover-florals" aria-hidden="true">
      <img
        src="/images/floral-corner-bottom.png"
        alt=""
        width="560"
        height="560"
        className="invite-cover-floral invite-cover-floral-top-left"
      />
      <img
        src="/images/floral-corner-bottom.png"
        alt=""
        width="560"
        height="560"
        className="invite-cover-floral invite-cover-floral-top-right"
      />
    </div>
  )
}

function HangingLamps({ reduced }) {
  return (
    <div className="invite-cover-lamps" aria-hidden="true">
      <Lamp side="left" reduced={reduced} />
      <Lamp side="right" reduced={reduced} />
    </div>
  )
}

function Lamp({ side, reduced }) {
  return (
    <div
      className={`invite-cover-lamp invite-cover-lamp-${side} ${reduced ? '' : 'sway-lantern'}`}
    >
      <img src="/images/hanging-lamp.png" alt="" />
      <span className="invite-cover-flame" />
    </div>
  )
}

function OrnamentDivider({ small = false }) {
  return (
    <div
      className={`invite-cover-divider ${small ? 'invite-cover-divider-sm' : ''}`}
      aria-hidden="true"
    >
      <span />
      <LotusIcon className={small ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span />
    </div>
  )
}

function FloralStar({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.2 13.35 10.65 22.8 12 13.35 13.35 12 22.8 10.65 13.35 1.2 12 10.65 10.65Z"
      />
      <circle cx="12" cy="12" r="1.35" fill="#3a080e" />
    </svg>
  )
}

function LotusIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3c-2.3 2.4-3.5 4.6-3.5 6.6 0 1.6 1.3 2.8 3.5 3.3 2.2-.5 3.5-1.7 3.5-3.3C15.5 7.6 14.3 5.4 12 3ZM5 8c-.4 3.2.4 5.3 2.3 6.4 1.1.6 2.3.7 3.6.3C9 11.8 7 9.6 5 8Zm14 0c-2 1.6-4 3.8-5.9 6.7 1.3.4 2.5.3 3.6-.3C18.6 13.3 19.4 11.2 19 8ZM3 14c2 4.4 5 6.6 9 6.6s7-2.2 9-6.6c-2.4 1.6-5.4 2.4-9 2.4S5.4 15.6 3 14Z" />
    </svg>
  )
}

function ButtonFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 48 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 10h18M46 10H28"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      <path
        d="M20 10c2.4-4 6-6.5 10-6.5M20 10c2.4 4 6 6.5 10 6.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M28 10c1.6-2.6 3.8-4 6.4-4M28 10c1.6 2.6 3.8 4 6.4 4"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="20" cy="10" r="1.15" fill="currentColor" />
    </svg>
  )
}

function OmMedallion({ pulse = false }) {
  const uid = useId().replace(/:/g, '')

  return (
    <motion.div
      className="invite-cover-medallion"
      animate={pulse ? { scale: [1, 1.016, 1] } : undefined}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="invite-cover-medallion-halo" aria-hidden="true" />
      <svg viewBox="0 0 240 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-gold`} x1="18%" y1="8%" x2="86%" y2="94%">
            <stop offset="0%" stopColor="#F4E4B0" />
            <stop offset="42%" stopColor="#E8CD83" />
            <stop offset="100%" stopColor="#9A6C28" />
          </linearGradient>
          <linearGradient id={`${uid}-petal`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#E8CD83" />
            <stop offset="42%" stopColor="#C9A04B" />
            <stop offset="100%" stopColor="#7A5418" />
          </linearGradient>
          <radialGradient id={`${uid}-disk`} cx="32%" cy="26%" r="72%">
            <stop offset="0%" stopColor="#F8EBD7" />
            <stop offset="45%" stopColor="#E0C06A" />
            <stop offset="100%" stopColor="#8A5C1C" />
          </radialGradient>
          <radialGradient id={`${uid}-mandala`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7A1824" stopOpacity="0.62" />
            <stop offset="70%" stopColor="#4A0B12" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#240309" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="120" cy="120" r="118" fill={`url(#${uid}-mandala)`} />
        <circle cx="120" cy="120" r="108" fill="none" stroke="#C9A04B" strokeWidth="0.5" opacity="0.22" />
        <circle cx="120" cy="120" r="98" fill="none" stroke="#C9A04B" strokeWidth="0.7" opacity="0.28" />

        {Array.from({ length: 8 }, (_, i) => {
          const deg = (i / 8) * 360 - 90
          const rad = (deg * Math.PI) / 180
          const x = 120 + Math.cos(rad) * 62
          const y = 120 + Math.sin(rad) * 62
          return (
            <g key={`outer-${i}`} transform={`rotate(${deg + 90} ${x} ${y})`}>
              <ellipse
                cx={x}
                cy={y}
                rx="24"
                ry="42"
                fill={`url(#${uid}-petal)`}
                stroke="#F4E4B0"
                strokeWidth="0.7"
              />
              <path
                d={`M${x} ${y + 18} Q${x - 6} ${y - 6} ${x} ${y - 38}`}
                fill="none"
                stroke="#8C5F20"
                strokeWidth="0.7"
                opacity="0.45"
              />
            </g>
          )
        })}

        {Array.from({ length: 8 }, (_, i) => {
          const deg = (i / 8) * 360 - 90 + 22.5
          const rad = (deg * Math.PI) / 180
          const x = 120 + Math.cos(rad) * 52
          const y = 120 + Math.sin(rad) * 52
          return (
            <ellipse
              key={`inner-${i}`}
              cx={x}
              cy={y}
              rx="16"
              ry="30"
              fill={`url(#${uid}-gold)`}
              opacity="0.94"
              transform={`rotate(${deg + 90} ${x} ${y})`}
            />
          )
        })}

        <circle cx="120" cy="120" r="48" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="3.4" />
        <circle cx="120" cy="120" r="43" fill="none" stroke="#F8EBD7" strokeWidth="1.15" opacity="0.85" />

        {Array.from({ length: 20 }, (_, i) => {
          const a = (i / 20) * Math.PI * 2
          return (
            <circle
              key={`bead-${i}`}
              cx={120 + Math.cos(a) * 45.5}
              cy={120 + Math.sin(a) * 45.5}
              r="1.7"
              fill="#F4E4B0"
            />
          )
        })}

        <circle
          cx="120"
          cy="120"
          r="38"
          fill={`url(#${uid}-disk)`}
          stroke="#F8EBD7"
          strokeWidth="1.8"
        />
        <circle cx="120" cy="120" r="33" fill="none" stroke="#6B1520" strokeWidth="0.8" opacity="0.28" />

        <text
          x="120"
          y="132"
          textAnchor="middle"
          fontFamily='Georgia, "Noto Serif", serif'
          fontSize="44"
          fontWeight="700"
          fill="#3A080E"
        >
          ॐ
        </text>
      </svg>
    </motion.div>
  )
}
