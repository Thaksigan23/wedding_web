import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'

const DOOR_MS = 1.35
const EASE_DOOR = [0.22, 1, 0.36, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

const PETAL_COLORS = ['#a84d55', '#8b1520', '#c47a7a', '#6e1a26', '#d4a0a5']

function makePetals(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${6 + ((i * 13) % 88)}%`,
    top: `${8 + ((i * 19) % 78)}%`,
    delay: (i % 10) * 0.08,
    duration: 5 + (i % 6) * 0.7,
    size: 8 + (i % 5) * 4,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    rotate: (i % 2 === 0 ? 1 : -1) * (20 + (i % 8) * 15),
    drift: (i % 2 === 0 ? 1 : -1) * (12 + (i % 5) * 8),
  }))
}

function coupleInitials() {
  const letter = (name) => {
    const cleaned = String(name || '')
      .replace(/[\[\]]/g, '')
      .trim()
    return cleaned.charAt(0).toUpperCase() || '·'
  }
  return {
    bride: letter(wedding.bride.name.en),
    groom: letter(wedding.groom.name.en),
  }
}

function formatInviteDate(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  return `${Number(m[3])} . ${m[2]} . ${m[1]}`
}

/**
 * Formal maroon starting page — Om medallion, florals, open CTA.
 */
export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [opening, setOpening] = useState(false)
  const petals = useMemo(() => makePetals(reduced ? 0 : 18), [reduced])
  const cascade = useMemo(() => makePetals(reduced ? 0 : 22), [reduced])
  const initials = useMemo(() => coupleInitials(), [])
  const dateLabel = useMemo(
    () => formatInviteDate(wedding.muhurtham.datetime),
    [],
  )

  const handleOpen = useCallback(() => {
    if (opening) return
    setOpening(true)
    window.setTimeout(
      () => onOpen(),
      reduced ? 80 : Math.round(DOOR_MS * 1000 * 0.55),
    )
  }, [opening, onOpen, reduced])

  const doorTransition = reduced
    ? { duration: 0.01 }
    : { duration: DOOR_MS, ease: EASE_DOOR }

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#4a0e14]"
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleOpen()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={lang === 'ta' ? 'அழைப்பிதழைத் திறக்க தட்டவும்' : 'Open invitation'}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.3 } }
              : { opacity: 0, transition: { delay: DOOR_MS * 0.5, duration: 0.4 } }
          }
        >
          {/* Soft vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(110,26,38,0.5) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(20,3,6,0.55) 100%)',
            }}
          />

          {/* Gold frame */}
          <div
            className="pointer-events-none absolute inset-4 border border-gold/45 sm:inset-6 md:inset-8"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[18px] border border-gold/20 sm:inset-[26px] md:inset-[34px]"
            aria-hidden="true"
          />

          {/* Floating ambient petals */}
          {!reduced && (
            <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
              {petals.map((p) => (
                <motion.span
                  key={`a-${p.id}`}
                  className="absolute rounded-[45%_55%_50%_50%] opacity-40 blur-[0.5px]"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size * 1.3,
                    background: `radial-gradient(ellipse at 30% 30%, #f0cfc4, ${p.color})`,
                  }}
                  animate={{
                    y: [0, p.drift, 0],
                    x: [0, p.drift * 0.4, 0],
                    rotate: [0, p.rotate * 0.3, 0],
                    opacity: [0.15, 0.4, 0.15],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Corner florals + hanging lamps */}
          <CornerDecor />

          {/* Door panels for open swing */}
          <div
            className="absolute inset-0 z-[2] flex"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
          >
            <motion.div
              className="h-full w-1/2 origin-left bg-[#4a0e14]/95"
              style={{ transformStyle: 'preserve-3d' }}
              initial={false}
              animate={
                opening && !reduced
                  ? { rotateY: -105, opacity: 0.85 }
                  : { rotateY: 0, opacity: 0 }
              }
              transition={doorTransition}
            />
            <motion.div
              className="h-full w-1/2 origin-right bg-[#4a0e14]/95"
              style={{ transformStyle: 'preserve-3d' }}
              initial={false}
              animate={
                opening && !reduced
                  ? { rotateY: 105, opacity: 0.85 }
                  : { rotateY: 0, opacity: 0 }
              }
              transition={doorTransition}
            />
          </div>

          {/* Cascade petals on open */}
          {opening && !reduced && (
            <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
              {cascade.map((p) => (
                <motion.span
                  key={`c-${p.id}`}
                  className="absolute top-[-6%] rounded-[40%_60%_55%_45%]"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size * 1.25,
                    background: `radial-gradient(ellipse at 30% 30%, #f7f0ea, ${p.color})`,
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: '115vh',
                    x: [0, p.drift],
                    opacity: [0, 1, 0],
                    rotate: p.rotate,
                  }}
                  transition={{ duration: 1.4 + (p.id % 4) * 0.15, delay: p.delay * 0.4, ease: 'easeIn' }}
                />
              ))}
            </div>
          )}

          {/* Center content */}
          <motion.div
            className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center sm:px-10"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={
              opening
                ? { opacity: 0, y: -18, scale: 0.97 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{ duration: opening ? 0.45 : 0.8, delay: opening ? 0 : 0.1, ease: EASE_OUT }}
          >
            <GoldDiamond className="mb-5 h-5 w-5 text-gold sm:mb-6" />

            <div className="space-y-1.5 text-gold">
              <p className="font-tamil text-[clamp(0.95rem,0.85rem+0.4vw,1.15rem)] leading-[1.7]">
                || ஸ்ரீ கணபதயே நம: ||
              </p>
              <p className="font-tamil text-[0.8rem] leading-[1.7] text-gold/85 sm:text-[0.9rem]">
                {wedding.invocation.pillaiyar.ta}
              </p>
              <p className="font-tamil text-[0.8rem] leading-[1.7] text-gold/75 sm:text-[0.88rem]">
                {wedding.invocation.murugan.ta}
              </p>
              <p className="font-tamil text-[0.78rem] leading-[1.7] text-gold/65 sm:text-[0.85rem]">
                குடும்பத்தினருடன் இணைந்து
              </p>
            </div>

            <div className="relative my-7 sm:my-8">
              <OmMedallion pulse={!reduced && !opening} />
            </div>

            <p className="font-display text-[clamp(2.2rem,1.6rem+2.2vw,3.25rem)] font-light leading-none tracking-[0.08em] text-gold">
              <span>{initials.bride}</span>
              <span className="mx-3 inline-block text-[0.4em] align-middle" aria-hidden="true">
                ✥
              </span>
              <span>{initials.groom}</span>
            </p>

            <p className="mt-4 font-sans text-[0.9rem] tracking-[0.32em] text-gold tabular-nums sm:text-base">
              {dateLabel}
            </p>

            <motion.div
              className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border border-gold/70 bg-transparent px-7 py-2.5 sm:mt-9 sm:px-9"
              animate={
                reduced || opening
                  ? undefined
                  : {
                      borderColor: [
                        'rgba(212,176,92,0.55)',
                        'rgba(212,176,92,0.95)',
                        'rgba(212,176,92,0.55)',
                      ],
                    }
              }
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LotusIcon className="h-4 w-4 text-gold" />
              <span className="font-tamil text-[0.95rem] text-gold sm:text-base">
                அழைப்பிதழை திற
              </span>
            </motion.div>

            {lang !== 'ta' && (
              <p className="mt-2.5 font-sans text-[0.62rem] tracking-[0.28em] text-gold/50 uppercase">
                Open Invitation
              </p>
            )}

            <LotusIcon className="mt-7 h-5 w-5 text-gold/70 sm:mt-8" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CornerDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden="true">
      {/* Top lamps */}
      <img
        src="/images/icon-lantern.jpg"
        alt=""
        className="absolute top-8 left-6 h-14 w-14 rounded-full object-cover opacity-90 shadow-lg ring-1 ring-gold/35 sm:top-10 sm:left-10 sm:h-16 sm:w-16 md:left-14"
        style={{ mixBlendMode: 'screen' }}
        draggable={false}
      />
      <img
        src="/images/icon-lantern.jpg"
        alt=""
        className="absolute top-8 right-6 h-14 w-14 rounded-full object-cover opacity-90 shadow-lg ring-1 ring-gold/35 sm:top-10 sm:right-10 sm:h-16 sm:w-16 md:right-14"
        style={{ mixBlendMode: 'screen' }}
        draggable={false}
      />

      {/* Top floral hints */}
      <img
        src="/images/icon-lotus.jpg"
        alt=""
        className="absolute top-16 left-2 h-20 w-20 -rotate-12 object-contain opacity-35 blur-[0.5px] sm:left-4 sm:h-28 sm:w-28"
        draggable={false}
      />
      <img
        src="/images/icon-lotus.jpg"
        alt=""
        className="absolute top-16 right-2 h-20 w-20 rotate-12 object-contain opacity-35 blur-[0.5px] sm:right-4 sm:h-28 sm:w-28"
        draggable={false}
      />

      {/* Bottom florals */}
      <img
        src="/images/icon-lotus.jpg"
        alt=""
        className="absolute bottom-4 left-0 h-28 w-28 -rotate-6 object-contain opacity-45 sm:bottom-6 sm:h-36 sm:w-36 md:h-44 md:w-44"
        draggable={false}
      />
      <img
        src="/images/icon-lotus.jpg"
        alt=""
        className="absolute bottom-4 right-0 h-28 w-28 rotate-6 object-contain opacity-45 sm:bottom-6 sm:h-36 sm:w-36 md:h-44 md:w-44"
        draggable={false}
      />
      <img
        src="/images/icon-rings.jpg"
        alt=""
        className="absolute bottom-8 left-16 h-16 w-16 rounded-full object-cover opacity-40 sm:left-24 sm:h-20 sm:w-20"
        style={{ mixBlendMode: 'luminosity' }}
        draggable={false}
      />
      <img
        src="/images/icon-rings.jpg"
        alt=""
        className="absolute bottom-8 right-16 h-16 w-16 rounded-full object-cover opacity-40 sm:right-24 sm:h-20 sm:w-20"
        style={{ mixBlendMode: 'luminosity' }}
        draggable={false}
      />
    </div>
  )
}

function OmMedallion({ pulse = false }) {
  return (
    <motion.div
      className="relative flex h-[150px] w-[150px] items-center justify-center sm:h-[180px] sm:w-[180px]"
      animate={pulse ? { scale: [1, 1.03, 1] } : undefined}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-gold" aria-hidden="true">
        <defs>
          <radialGradient id="omGlow" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f0d98a" />
            <stop offset="45%" stopColor="#d4b05c" />
            <stop offset="100%" stopColor="#8a6a28" />
          </radialGradient>
        </defs>
        {/* Outer petals */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          const x = 100 + Math.cos(a) * 78
          const y = 100 + Math.sin(a) * 78
          const rot = (a * 180) / Math.PI + 90
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="7"
              ry="16"
              fill="url(#omGlow)"
              opacity="0.85"
              transform={`rotate(${rot} ${x} ${y})`}
            />
          )
        })}
        <circle cx="100" cy="100" r="62" fill="none" stroke="url(#omGlow)" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="54" fill="none" stroke="#d4b05c" strokeWidth="1" opacity="0.7" />
        <circle cx="100" cy="100" r="48" fill="#3d0a12" stroke="url(#omGlow)" strokeWidth="3" />
        {/* Inner ring dots */}
        {Array.from({ length: 20 }, (_, i) => {
          const a = (i / 20) * Math.PI * 2
          return (
            <circle
              key={`d-${i}`}
              cx={100 + Math.cos(a) * 42}
              cy={100 + Math.sin(a) * 42}
              r="1.6"
              fill="#d4b05c"
              opacity="0.8"
            />
          )
        })}
      </svg>
      <span
        className="relative z-[1] select-none font-display text-[3.25rem] leading-none text-gold sm:text-[3.85rem]"
        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
        aria-hidden="true"
      >
        ॐ
      </span>
    </motion.div>
  )
}

function GoldDiamond({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" opacity="0.9" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  )
}

function LotusIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 20c-1.5-2.5-4-4-4-7 0-2 1.5-3.5 4-4.5 2.5 1 4 2.5 4 4.5 0 3-2.5 4.5-4 7z" opacity="0.95" />
      <path d="M12 8.5C10 6 7 5 5.5 5.5c.5 2.5 2.5 4.5 6.5 6 4-1.5 6-3.5 6.5-6C17 5 14 6 12 8.5z" opacity="0.75" />
      <path d="M7 14c-2.5.5-4 2-4.5 4 2.2.3 4.5-.5 6.5-2.5C7.5 14.5 7 14 7 14z" opacity="0.7" />
      <path d="M17 14c2.5.5 4 2 4.5 4-2.2.3-4.5-.5-6.5-2.5 1.5-1 2-1.5 2-1.5z" opacity="0.7" />
    </svg>
  )
}
