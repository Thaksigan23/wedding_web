import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'

const DOOR_MS = 1.2
const EASE_OUT = [0.16, 1, 0.3, 1]

function makeBokeh(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${4 + ((i * 17) % 92)}%`,
    top: `${5 + ((i * 23) % 88)}%`,
    size: 4 + (i % 7) * 3,
    delay: (i % 9) * 0.35,
    duration: 6 + (i % 5) * 1.2,
    opacity: 0.12 + (i % 5) * 0.05,
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
 * Starting cover — matched to the gold-on-maroon Om invitation reference.
 */
export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [opening, setOpening] = useState(false)
  const bokeh = useMemo(() => makeBokeh(reduced ? 0 : 26), [reduced])
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
      reduced ? 60 : Math.round(DOOR_MS * 1000 * 0.5),
    )
  }, [opening, onOpen, reduced])

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 42%, #6b1520 0%, #4a0e14 45%, #2a070c 100%)',
          }}
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
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
        >
          {/* Edge vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 35%, rgba(15,2,4,0.55) 100%)',
            }}
          />

          {/* Thin gold frame */}
          <div
            className="pointer-events-none absolute inset-5 border border-[#d4b05c]/50 sm:inset-7 md:inset-9"
            aria-hidden="true"
          />

          {/* Soft floating petal / bokeh orbs */}
          {!reduced && (
            <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
              {bokeh.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    background:
                      'radial-gradient(circle, rgba(255,230,235,0.85) 0%, rgba(255,200,210,0.15) 55%, transparent 70%)',
                    opacity: p.opacity,
                  }}
                  animate={{
                    y: [0, -14, 0],
                    x: [0, (p.id % 2 === 0 ? 8 : -8), 0],
                    opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
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

          <CornerDecor />

          {/* Center stack */}
          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center px-8 text-center"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={
              opening
                ? { opacity: 0, scale: 0.97, y: -12 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: opening ? 0.4 : 0.75, ease: EASE_OUT }}
          >
            <div className="space-y-1 text-[#e4c86a]">
              <p className="font-tamil text-[clamp(1.05rem,0.95rem+0.45vw,1.25rem)] leading-[1.75] tracking-wide">
                || ஸ்ரீ கணபதயே நம: ||
              </p>
              <p className="font-tamil text-[0.88rem] leading-[1.75] text-[#e4c86a]/90 sm:text-[0.95rem]">
                பிள்ளையார் துணை
              </p>
              <p className="font-tamil text-[0.88rem] leading-[1.75] text-[#e4c86a]/85 sm:text-[0.95rem]">
                முருகன் துணை
              </p>
              <p className="font-tamil text-[0.82rem] leading-[1.75] text-[#e4c86a]/75 sm:text-[0.9rem]">
                குடும்பத்தினருடன் இணைந்து
              </p>
            </div>

            <div className="my-8 sm:my-9">
              <OmMedallion pulse={!reduced && !opening} />
            </div>

            <p
              className="font-display font-light leading-none tracking-[0.12em] text-[#e8cf7a]"
              style={{ fontSize: 'clamp(2.4rem, 1.7rem + 2.6vw, 3.4rem)' }}
            >
              {initials.bride}
              <span className="mx-3 inline-block text-[0.38em] align-middle opacity-90" aria-hidden="true">
                ❖
              </span>
              {initials.groom}
            </p>

            <p className="mt-4 font-display text-[1rem] tracking-[0.36em] text-[#e4c86a] tabular-nums sm:text-[1.1rem]">
              {dateLabel}
            </p>

            <motion.div
              className="mt-9 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full border border-[#d4b05c]/75 bg-transparent px-8 py-2.5"
              animate={
                reduced || opening
                  ? undefined
                  : {
                      boxShadow: [
                        '0 0 0 rgba(212,176,92,0)',
                        '0 0 18px rgba(212,176,92,0.28)',
                        '0 0 0 rgba(212,176,92,0)',
                      ],
                    }
              }
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <SparkleIcon className="h-3.5 w-3.5 shrink-0 text-[#e4c86a]" />
              <span className="font-tamil text-[1rem] text-[#e4c86a]">அழைப்பிதழை திற</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CornerDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden="true">
      {/* Top-left lotus + lamp */}
      <CornerLotus
        className="absolute -top-2 -left-2 h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52"
        lamp
      />
      {/* Top-right */}
      <CornerLotus
        className="absolute -top-2 -right-2 h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52"
        lamp
        mirror
      />
      {/* Bottom-left */}
      <CornerLotus
        className="absolute -bottom-4 -left-4 h-40 w-40 sm:h-52 sm:w-52 md:h-60 md:w-60"
      />
      {/* Bottom-right */}
      <CornerLotus
        className="absolute -bottom-4 -right-4 h-40 w-40 sm:h-52 sm:w-52 md:h-60 md:w-60"
        mirror
        accent
      />
    </div>
  )
}

function CornerLotus({ className = '', lamp = false, mirror = false, accent = false }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/images/icon-lotus.jpg"
        alt=""
        className={`h-full w-full rounded-full object-cover shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
          mirror ? 'scale-x-[-1]' : ''
        }`}
        style={{
          maskImage:
            'radial-gradient(circle at 50% 50%, #000 42%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, #000 42%, transparent 72%)',
          opacity: 0.92,
        }}
        draggable={false}
      />
      {lamp && (
        <img
          src="/images/icon-lantern.jpg"
          alt=""
          className="absolute top-[12%] left-1/2 h-[38%] w-[38%] -translate-x-1/2 rounded-full object-cover shadow-md ring-1 ring-[#d4b05c]/50"
          draggable={false}
        />
      )}
      {accent && (
        <img
          src="/images/icon-lotus.jpg"
          alt=""
          className="absolute right-[18%] bottom-[22%] h-[28%] w-[28%] rounded-full object-cover opacity-80 ring-1 ring-white/30"
          draggable={false}
        />
      )}
    </div>
  )
}

function OmMedallion({ pulse = false }) {
  return (
    <motion.div
      className="relative flex h-[168px] w-[168px] items-center justify-center sm:h-[200px] sm:w-[200px]"
      animate={pulse ? { scale: [1, 1.025, 1] } : undefined}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.35))',
      }}
    >
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="goldRay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5e09a" />
            <stop offset="50%" stopColor="#d4b05c" />
            <stop offset="100%" stopColor="#a88435" />
          </linearGradient>
          <radialGradient id="goldDisk" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#f8e9b0" />
            <stop offset="55%" stopColor="#d4b05c" />
            <stop offset="100%" stopColor="#8a6a28" />
          </radialGradient>
        </defs>

        {/* Outer sunburst petals */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2 - Math.PI / 2
          const x = 110 + Math.cos(a) * 88
          const y = 110 + Math.sin(a) * 88
          const rot = (a * 180) / Math.PI + 90
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="5.5"
              ry="18"
              fill="url(#goldRay)"
              opacity={0.9}
              transform={`rotate(${rot} ${x} ${y})`}
            />
          )
        })}

        <circle cx="110" cy="110" r="72" fill="none" stroke="url(#goldRay)" strokeWidth="3" />
        <circle cx="110" cy="110" r="64" fill="none" stroke="#e4c86a" strokeWidth="1.2" opacity="0.75" />

        {/* Dot ring */}
        {Array.from({ length: 28 }, (_, i) => {
          const a = (i / 28) * Math.PI * 2
          return (
            <circle
              key={`dot-${i}`}
              cx={110 + Math.cos(a) * 56}
              cy={110 + Math.sin(a) * 56}
              r="2"
              fill="#e4c86a"
            />
          )
        })}

        <circle cx="110" cy="110" r="48" fill="url(#goldDisk)" stroke="#f5e09a" strokeWidth="2" />
      </svg>

      <span
        className="relative z-[1] select-none leading-none text-[#4a0e14]"
        style={{
          fontFamily: 'Georgia, "Noto Serif", serif',
          fontSize: 'clamp(3.2rem, 2.4rem + 2.5vw, 4.25rem)',
          fontWeight: 600,
        }}
        aria-hidden="true"
      >
        ॐ
      </span>
    </motion.div>
  )
}

function SparkleIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.2 6.3L19.5 12l-6.3 1.2L12 22l-1.2-8.8L4.5 12l6.3-3.7L12 2z" />
      <path d="M19 4l.5 2.2L21.5 7l-2 0.5L19 9.5l-.5-2L16.5 7l2-.5L19 4z" opacity="0.85" />
    </svg>
  )
}
