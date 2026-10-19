import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'
import { Kolam } from './motifs/Kolam'

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

/**
 * Temple doors that swing open on tap, with flowing flower petals.
 */
export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [opening, setOpening] = useState(false)
  const petals = useMemo(() => makePetals(reduced ? 0 : 28), [reduced])

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
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-maroon-deep"
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleOpen()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={lang === 'ta' ? 'அழைப்பிதழைத் திறக்க தட்டவும்' : 'Tap to open the invitation'}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.3 } }
              : { opacity: 0, transition: { delay: DOOR_MS * 0.55, duration: 0.45 } }
          }
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 42%, rgba(212,176,92,0.22) 0%, transparent 48%)',
            }}
          />

          <AnimatePresence>
            {opening && !reduced && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-[1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 50%, rgba(247,240,234,0.4) 0%, rgba(212,176,92,0.18) 35%, transparent 70%)',
                }}
              />
            )}
          </AnimatePresence>

          <div
            className="absolute inset-0 z-[2] flex"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
          >
            <motion.div
              className="relative h-full w-1/2 origin-left bg-maroon"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow:
                  'inset -1px 0 0 color-mix(in srgb, var(--color-gold) 40%, transparent), inset -36px 0 50px rgba(0,0,0,0.22)',
              }}
              initial={false}
              animate={
                opening && !reduced
                  ? { rotateY: -102, opacity: 0.92 }
                  : { rotateY: 0, opacity: 1 }
              }
              exit={reduced ? { opacity: 0 } : { rotateY: -110, x: '-8%' }}
              transition={doorTransition}
            >
              <DoorPanelDecor side="left" />
            </motion.div>

            <motion.div
              className="relative h-full w-1/2 origin-right bg-maroon"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow:
                  'inset 1px 0 0 color-mix(in srgb, var(--color-gold) 40%, transparent), inset 36px 0 50px rgba(0,0,0,0.22)',
              }}
              initial={false}
              animate={
                opening && !reduced
                  ? { rotateY: 102, opacity: 0.92 }
                  : { rotateY: 0, opacity: 1 }
              }
              exit={reduced ? { opacity: 0 } : { rotateY: 110, x: '8%' }}
              transition={doorTransition}
            >
              <DoorPanelDecor side="right" />
            </motion.div>
          </div>

          {!reduced && (
            <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
              {petals.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute top-[-8%] rounded-[40%_60%_55%_45%] opacity-90"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size * 1.25,
                    background: `radial-gradient(ellipse at 30% 30%, #f7f0ea, ${p.color})`,
                    boxShadow: '0 2px 6px rgba(94,18,28,0.2)',
                  }}
                  initial={{ y: 0, x: 0, opacity: 0, rotate: 0, scale: 0.6 }}
                  animate={
                    opening
                      ? {
                          y: ['0vh', '110vh'],
                          x: [0, p.drift, p.drift * 1.4],
                          opacity: [0, 1, 1, 0],
                          rotate: [0, p.rotate, p.rotate * 1.6],
                          scale: [0.7, 1, 0.85],
                        }
                      : {
                          y: [0, 12, 0],
                          x: [0, p.drift * 0.15, 0],
                          opacity: [0.12, 0.4, 0.12],
                          rotate: [0, p.rotate * 0.2, 0],
                          scale: 0.85,
                        }
                  }
                  transition={
                    opening
                      ? { duration: p.duration, delay: p.delay, ease: 'easeIn' }
                      : {
                          duration: 4 + (p.id % 4),
                          delay: p.delay * 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                  }
                />
              ))}
            </div>
          )}

          <motion.div
            className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={
              opening
                ? { opacity: 0, y: -20, scale: 0.96 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{ duration: opening ? 0.55 : 0.7, delay: opening ? 0 : 0.1, ease: EASE_OUT }}
          >
            <div className="mb-8 text-gold/80" aria-hidden="true">
              <Kolam className="mx-auto h-8 w-44 md:h-9 md:w-52" animate={!reduced && !opening} />
            </div>

            <motion.div
              className="relative mb-7"
              animate={
                reduced || opening
                  ? undefined
                  : { y: [0, -4, 0] }
              }
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="pointer-events-none absolute inset-[-18%] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(212,176,92,0.35) 0%, transparent 68%)',
                }}
                aria-hidden="true"
              />
              <img
                src="/images/icon-lantern.jpg"
                alt=""
                width={80}
                height={80}
                className="relative h-20 w-20 rounded-full object-cover shadow-[0_8px_28px_rgba(0,0,0,0.35)] ring-1 ring-gold/55"
                draggable={false}
              />
            </motion.div>

            <p
              className={`${
                lang === 'ta'
                  ? 'font-tamil text-[clamp(1.75rem,1.4rem+1.4vw,2.35rem)] leading-[1.65]'
                  : 'font-script text-[clamp(2.4rem,1.7rem+2.4vw,3.25rem)] leading-[1.15]'
              } text-gold`}
            >
              {lang === 'ta' ? 'வரவேற்கிறோம்' : 'Welcome'}
            </p>

            <p className="mt-2 font-sans text-[0.65rem] tracking-[0.28em] text-ivory/45 uppercase">
              {lang === 'ta' ? 'அழைப்பிதழ்' : 'Invitation'}
            </p>

            <motion.div
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full border border-gold/50 bg-maroon-deep/40 px-8 py-2.5"
              animate={
                reduced || opening
                  ? undefined
                  : {
                      boxShadow: [
                        '0 0 0 rgba(212,176,92,0)',
                        '0 0 22px rgba(212,176,92,0.32)',
                        '0 0 0 rgba(212,176,92,0)',
                      ],
                    }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className={`text-ivory ${
                  lang === 'ta'
                    ? 'font-tamil text-sm tracking-normal'
                    : 'font-sans text-[0.7rem] tracking-[0.26em] uppercase'
                }`}
              >
                {lang === 'ta' ? 'திறக்க தொடவும்' : 'Tap to open'}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Quiet panel lines only — no mid-door circles that clash with center content */
function DoorPanelDecor({ side }) {
  return (
    <div className="pointer-events-none absolute inset-y-[12%] opacity-70" aria-hidden="true">
      <div
        className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent"
        style={{ [side === 'left' ? 'right' : 'left']: '18%' }}
      />
      <div
        className="absolute inset-y-[10%] w-px bg-gradient-to-b from-transparent via-gold/14 to-transparent"
        style={{ [side === 'left' ? 'right' : 'left']: '30%' }}
      />
    </div>
  )
}
