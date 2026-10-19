import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'

const DOOR_MS = 1.45
const EASE_DOOR = [0.22, 1, 0.36, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

const PETAL_COLORS = ['#a84d55', '#8b1520', '#c9a24a', '#d4b05c', '#c47a7a', '#7a1c28']

function makePetals(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + ((i * 17) % 84)}%`,
    delay: (i % 12) * 0.05,
    duration: 1.6 + (i % 5) * 0.25,
    size: 10 + (i % 6) * 3,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    rotate: (i % 2 === 0 ? 1 : -1) * (40 + (i % 8) * 20),
    drift: (i % 2 === 0 ? 1 : -1) * (40 + (i % 7) * 18),
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
 * Premium sealed-envelope welcome — matches formal maroon invitation open UI.
 */
export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [opening, setOpening] = useState(false)
  const petals = useMemo(() => makePetals(reduced ? 0 : 24), [reduced])
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
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#5a1018]"
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
              : { opacity: 0, transition: { delay: DOOR_MS * 0.55, duration: 0.45 } }
          }
        >
          {/* Double gold frame */}
          <div
            className="pointer-events-none absolute inset-3 rounded-[2px] border border-gold/55 sm:inset-5 md:inset-7"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-[14px] rounded-[2px] border border-gold/30 sm:inset-[22px] md:inset-[30px]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(ellipse at 50% 40%, rgba(212,176,92,0.14) 0%, transparent 55%)',
            }}
          />

          {/* Soft swing panels behind content */}
          <div
            className="absolute inset-0 z-[2] flex"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
          >
            <motion.div
              className="relative h-full w-1/2 origin-left bg-[#5a1018]"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow:
                  'inset -1px 0 0 color-mix(in srgb, var(--color-gold) 35%, transparent)',
              }}
              initial={false}
              animate={
                opening && !reduced
                  ? { rotateY: -102, opacity: 0.9 }
                  : { rotateY: 0, opacity: 1 }
              }
              exit={reduced ? { opacity: 0 } : { rotateY: -110, x: '-8%' }}
              transition={doorTransition}
            />
            <motion.div
              className="relative h-full w-1/2 origin-right bg-[#5a1018]"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow:
                  'inset 1px 0 0 color-mix(in srgb, var(--color-gold) 35%, transparent)',
              }}
              initial={false}
              animate={
                opening && !reduced
                  ? { rotateY: 102, opacity: 0.9 }
                  : { rotateY: 0, opacity: 1 }
              }
              exit={reduced ? { opacity: 0 } : { rotateY: 110, x: '8%' }}
              transition={doorTransition}
            />
          </div>

          {!reduced && (
            <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
              {petals.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute top-[-8%] rounded-[40%_60%_55%_45%]"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size * 1.25,
                    background: `radial-gradient(ellipse at 30% 30%, #f7f0ea, ${p.color})`,
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={
                    opening
                      ? {
                          y: ['0vh', '110vh'],
                          x: [0, p.drift],
                          opacity: [0, 1, 0],
                          rotate: [0, p.rotate],
                        }
                      : { opacity: 0 }
                  }
                  transition={
                    opening
                      ? { duration: p.duration, delay: p.delay, ease: 'easeIn' }
                      : { duration: 0 }
                  }
                />
              ))}
            </div>
          )}

          {/* Center invite card content */}
          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center px-8 text-center sm:px-10"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={
              opening
                ? { opacity: 0, y: -16, scale: 0.97 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{ duration: opening ? 0.5 : 0.75, delay: opening ? 0 : 0.08, ease: EASE_OUT }}
          >
            <p
              className="font-display text-[clamp(0.95rem,0.85rem+0.4vw,1.15rem)] tracking-[0.08em] text-gold"
              lang="hi"
            >
              ॥ श्री गणेशाय नमः ॥
            </p>
            <p className="mt-1.5 font-tamil text-xs text-gold/55">
              {wedding.invocation.pillaiyar.ta}
            </p>

            <p className="mt-7 font-sans text-[0.62rem] font-medium tracking-[0.32em] text-ivory/80 uppercase sm:text-[0.68rem]">
              {lang === 'ta'
                ? wedding.togetherWith.ta
                : 'Together with our families'}
            </p>

            <div className="relative mt-8 mb-2 flex items-center justify-center">
              <FloralWreath className="absolute h-[220px] w-[220px] text-[#8a3a42] opacity-70 sm:h-[250px] sm:w-[250px]" />
              <SealedEnvelope
                pulse={!reduced && !opening}
                className="relative z-[1]"
              />
            </div>

            <p className="mt-6 font-display text-[clamp(2.4rem,1.8rem+2.5vw,3.5rem)] font-light leading-none tracking-[0.06em] text-gold">
              <span>{initials.bride}</span>
              <span className="mx-3 inline-block text-[0.45em] align-middle text-gold/90" aria-hidden="true">
                ✦
              </span>
              <span>{initials.groom}</span>
            </p>

            <p className="mt-4 font-sans text-[0.85rem] tracking-[0.28em] text-gold/90 tabular-nums sm:text-[0.95rem]">
              {dateLabel}
            </p>

            <motion.div
              className="mt-9 inline-flex min-h-[50px] min-w-[220px] items-center justify-center rounded-full px-10 py-3 sm:min-w-[260px]"
              style={{
                background:
                  'linear-gradient(180deg, #e8d08a 0%, #d4b05c 45%, #b8923a 100%)',
                boxShadow:
                  '0 6px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35)',
              }}
              animate={
                reduced || opening
                  ? undefined
                  : {
                      boxShadow: [
                        '0 6px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35)',
                        '0 8px 32px rgba(212,176,92,0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
                        '0 6px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35)',
                      ],
                    }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="font-sans text-[0.72rem] font-semibold tracking-[0.22em] text-[#3d0a12] uppercase">
                {lang === 'ta' ? 'அழைப்பிதழைத் திற' : 'Open Invitation'}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SealedEnvelope({ className = '', pulse = false }) {
  return (
    <motion.div
      className={`relative h-[108px] w-[148px] sm:h-[120px] sm:w-[164px] ${className}`}
      animate={pulse ? { y: [0, -3, 0] } : undefined}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Envelope body */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[4px] border border-gold/25"
        style={{
          background: `
            linear-gradient(145deg, #7a1c28 0%, #5a1018 50%, #3d0a12 100%)
          `,
          boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
        }}
      >
        {/* Diamond pattern */}
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 46%, rgba(212,176,92,0.55) 49%, rgba(212,176,92,0.55) 51%, transparent 54%),
              linear-gradient(-45deg, transparent 46%, rgba(212,176,92,0.55) 49%, rgba(212,176,92,0.55) 51%, transparent 54%)
            `,
            backgroundSize: '18px 18px',
          }}
          aria-hidden="true"
        />
        {/* Flap suggestion */}
        <div
          className="absolute inset-x-0 top-0 h-[42%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(212,176,92,0.12) 0%, transparent 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Om seal */}
      <div
        className="absolute top-1/2 left-1/2 z-[2] flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-[64px] sm:w-[64px]"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #f0d98a 0%, #d4b05c 42%, #a88435 78%, #7a6428 100%)',
          boxShadow:
            '0 4px 14px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(90,50,10,0.35)',
        }}
      >
        <span
          className="select-none font-display text-[1.65rem] leading-none text-[#3d0a12] sm:text-[1.85rem]"
          aria-hidden="true"
        >
          ॐ
        </span>
      </div>
    </motion.div>
  )
}

function FloralWreath({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.35"
      />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const x = 100 + Math.cos(a) * 78
        const y = 100 + Math.sin(a) * 78
        const rot = (a * 180) / Math.PI + 90
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <ellipse
              cx="0"
              cy="-6"
              rx="3.2"
              ry="7"
              fill="currentColor"
              opacity={0.55}
            />
            <ellipse
              cx="4"
              cy="-2"
              rx="2.4"
              ry="5"
              fill="currentColor"
              opacity={0.4}
            />
            <ellipse
              cx="-4"
              cy="-2"
              rx="2.4"
              ry="5"
              fill="currentColor"
              opacity={0.4}
            />
          </g>
        )
      })}
    </svg>
  )
}
