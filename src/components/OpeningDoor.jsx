import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'
import { FloralLanternHeader } from './motifs/FloralLanternHeader'

const DOOR_MS = 1.45
const EASE_DOOR = [0.22, 1, 0.36, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

const PETAL_COLORS = ['#e8a8a0', '#c47a7a', '#f0cfc4', '#d4a5a5', '#c9a24a', '#f5d0c8']

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
    // Let door + petal motion start, then unmount via parent
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
          {/* Warm glow behind the seam */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(201,162,74,0.28) 0%, transparent 52%)',
            }}
          />

          {/* Light spill when doors open */}
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
                    'radial-gradient(ellipse at 50% 50%, rgba(250,246,242,0.55) 0%, rgba(201,162,74,0.2) 35%, transparent 70%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Twin doors — 3D swing */}
          <div
            className="absolute inset-0 z-[2] flex"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
          >
            <motion.div
              className="relative h-full w-1/2 origin-left bg-maroon"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow:
                  'inset -2px 0 0 color-mix(in srgb, var(--color-gold) 50%, transparent), inset -40px 0 60px rgba(0,0,0,0.2)',
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
                  'inset 2px 0 0 color-mix(in srgb, var(--color-gold) 50%, transparent), inset 40px 0 60px rgba(0,0,0,0.2)',
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

          {/* Flowing petals */}
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
                    background: `radial-gradient(ellipse at 30% 30%, #fff8f5, ${p.color})`,
                    boxShadow: '0 2px 6px rgba(107,21,32,0.15)',
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
                          opacity: [0.15, 0.45, 0.15],
                          rotate: [0, p.rotate * 0.2, 0],
                          scale: 0.85,
                        }
                  }
                  transition={
                    opening
                      ? {
                          duration: p.duration,
                          delay: p.delay,
                          ease: 'easeIn',
                        }
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

          {/* Center content */}
          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={
              opening
                ? { opacity: 0, y: -20, scale: 0.96 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{ duration: opening ? 0.55 : 0.7, delay: opening ? 0 : 0.1, ease: EASE_OUT }}
          >
            <FloralLanternHeader className="mb-4 w-full" variant="plain" />

            <motion.img
              src="/images/icon-lantern.jpg"
              alt=""
              width={72}
              height={72}
              className="mb-5 h-16 w-16 rounded-full object-cover shadow-lg ring-2 ring-gold/50"
              draggable={false}
              animate={
                reduced || opening
                  ? undefined
                  : { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }
              }
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            <p className="font-script text-[clamp(2rem,1.5rem+2vw,2.85rem)] text-gold">
              {lang === 'ta' ? 'வரவேற்கிறோம்' : 'Welcome'}
            </p>

            <motion.div
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border border-gold/55 bg-maroon/40 px-7 py-2.5 backdrop-blur-sm"
              animate={
                reduced || opening
                  ? undefined
                  : { scale: [1, 1.03, 1], boxShadow: ['0 0 0 rgba(201,162,74,0)', '0 0 24px rgba(201,162,74,0.35)', '0 0 0 rgba(201,162,74,0)'] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="font-sans text-[0.7rem] tracking-[0.26em] text-ivory uppercase">
                {lang === 'ta' ? 'திறக்க தொடவும்' : 'Tap to open'}
              </span>
            </motion.div>

            {lang !== 'ta' && (
              <p className="mt-3 font-tamil text-[0.95rem] leading-[1.7] text-gold/85">
                திறக்க தொடவும்
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DoorPanelDecor({ side }) {
  return (
    <div className="pointer-events-none absolute inset-y-[10%] opacity-80" aria-hidden="true">
      <div
        className="absolute inset-y-0 w-px bg-gold/35"
        style={{ [side === 'left' ? 'right' : 'left']: '22%' }}
      />
      <div
        className="absolute inset-y-[6%] w-px bg-gold/18"
        style={{ [side === 'left' ? 'right' : 'left']: '34%' }}
      />
      <div
        className="absolute top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border border-gold/25"
        style={{ [side === 'left' ? 'right' : 'left']: '18%' }}
      />
    </div>
  )
}
