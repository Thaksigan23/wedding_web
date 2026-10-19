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
          className="fixed inset-0 z-50 flex min-h-dvh cursor-pointer flex-col items-center justify-center overflow-x-hidden overflow-y-auto max-[760px]:justify-start max-[760px]:py-8"
          style={{
            background:
              'radial-gradient(ellipse 68% 82% at 50% 44%, #4d090c 0%, #390508 54%, #210306 100%)',
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

          {/* Fine double frame and central ornamental axis */}
          <div className="pointer-events-none absolute inset-[14px] border border-[#d4b05c]/45 sm:inset-[26px] md:inset-[30px]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-[19px] border border-[#d4b05c]/20 sm:inset-[31px] md:inset-[35px]" aria-hidden="true" />
          <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-[#d4b05c]/55 via-[#d4b05c]/15 to-[#d4b05c]/50" aria-hidden="true" />
          <FrameCorners />
          <div className="pointer-events-none absolute bottom-[3.2%] left-[19%] right-[19%] h-px bg-gradient-to-r from-transparent via-[#d4b05c]/80 to-transparent" aria-hidden="true" />

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
            <div className="space-y-0.5 text-[#e4c86a]">
              <OrnamentDivider />
              <p className="mt-5 font-tamil text-[clamp(1.05rem,0.95rem+0.45vw,1.25rem)] leading-[1.75] tracking-wide">
                || ஸ்ரீ கணபதயே நம: ||
              </p>
              <p className="font-tamil text-[0.88rem] leading-[1.75] text-[#e4c86a]/90 sm:text-[0.95rem]">
                பிள்ளையார் துணை
              </p>
              <OrnamentDivider small />
              <p className="mt-3 font-tamil text-[0.82rem] leading-[1.75] text-ivory/90 sm:text-[0.9rem]">
                {wedding.togetherWith.ta}
              </p>
            </div>

            <div className="my-7 sm:my-8">
              <OmMedallion pulse={!reduced && !opening} />
            </div>

            <p
              className="font-display font-light leading-none tracking-[0.12em] text-[#e8cf7a]"
              style={{ fontSize: 'clamp(2.4rem, 1.7rem + 2.6vw, 3.4rem)' }}
            >
              {initials.bride}
              <span className="mx-3 inline-block text-[0.38em] align-middle opacity-90" aria-hidden="true">❖</span>
              {initials.groom}
            </p>

            <p className="mt-4 font-display text-[1rem] tracking-[0.36em] text-[#e4c86a] tabular-nums sm:text-[1.1rem]">
              {dateLabel}
            </p>

            <OrnamentDivider />
            <motion.div
              className="mt-6 inline-flex min-h-[58px] min-w-[260px] items-center justify-center gap-3 rounded-full border border-[#e3bd61] bg-[#320508]/65 px-8 py-2.5 shadow-[inset_0_0_0_3px_rgba(212,176,92,0.12),0_0_22px_rgba(0,0,0,0.3)]"
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
              <LotusIcon className="h-4 w-4 shrink-0 text-[#e4c86a]" />
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
      <FloralCorner className="absolute inset-0" />
      <img src="/images/hanging-lamp.png" alt="" className="absolute left-[2%] top-0 hidden h-[250px] w-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:block md:h-[300px]" draggable={false} />
      <img src="/images/hanging-lamp.png" alt="" className="absolute right-[2%] top-0 hidden h-[250px] w-auto scale-x-[-1] drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:block md:h-[300px]" draggable={false} />
    </div>
  )
}

function FrameCorners() {
  return <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
    {['left-4 top-4', 'right-4 top-4 scale-x-[-1]', 'left-4 bottom-4 scale-y-[-1]', 'right-4 bottom-4 scale-[-1]'].map((pos) => <svg key={pos} viewBox="0 0 92 92" className={`absolute h-16 w-16 text-[#d4b05c]/80 sm:h-20 sm:w-20 ${pos}`} fill="none"><path d="M4 88V20Q4 4 20 4h68M8 61V22Q8 8 22 8h39M12 39V24Q12 12 24 12h15" stroke="currentColor" strokeWidth="1.2"/><path d="M13 20q9-2 9-11m-8 17q12-2 12-14m-2 17q10-2 11-12" stroke="currentColor" strokeWidth=".8"/><path d="M5 33l8-8 4 9-8 7z" stroke="currentColor" strokeWidth=".8"/></svg>)}
  </div>
}

function FloralCorner({ className = '' }) {
  return <div className={`pointer-events-none ${className}`} aria-hidden="true" style={{
    backgroundImage: 'linear-gradient(rgba(35, 2, 7, .34), rgba(35, 2, 7, .34)), url(/images/invite-mandap.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'saturate(.9) brightness(.74) sepia(.18)',
    opacity: .62,
    maskImage: 'radial-gradient(ellipse 44% 39% at 50% 48%, transparent 55%, black 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 44% 39% at 50% 48%, transparent 55%, black 100%)',
  }} />
}

function OrnamentDivider({ small = false }) {
  return <div className={`flex w-60 items-center justify-center gap-2 text-[#d9ad53]/80 ${small ? 'my-2' : 'my-4'}`} aria-hidden="true"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-current"/><LotusIcon className={small ? 'h-3 w-3' : 'h-4 w-4'}/><span className="h-px flex-1 bg-gradient-to-l from-transparent to-current"/></div>
}

function LotusIcon({ className = '' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M12 3c-2.3 2.4-3.5 4.6-3.5 6.6 0 1.6 1.3 2.8 3.5 3.3 2.2-.5 3.5-1.7 3.5-3.3C15.5 7.6 14.3 5.4 12 3ZM5 8c-.4 3.2.4 5.3 2.3 6.4 1.1.6 2.3.7 3.6.3C9 11.8 7 9.6 5 8Zm14 0c-2 1.6-4 3.8-5.9 6.7 1.3.4 2.5.3 3.6-.3C18.6 13.3 19.4 11.2 19 8ZM3 14c2 4.4 5 6.6 9 6.6s7-2.2 9-6.6c-2.4 1.6-5.4 2.4-9 2.4S5.4 15.6 3 14Z"/></svg>
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

